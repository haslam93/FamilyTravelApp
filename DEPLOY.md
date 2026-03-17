---
title: Azure Deployment Guide
description: Step-by-step instructions for deploying the Family Travel Companion App to Azure using azd or az cli
author: Family Travel Companion App
ms.date: 2025-07-22
ms.topic: how-to
---

# Azure Deployment Guide

This guide covers provisioning Azure infrastructure and deploying the Family Travel
Companion App using either **Azure Developer CLI (`azd`)** or **Azure CLI (`az`)**.

## Architecture

The app deploys to these Azure resources:

* **App Service** (Linux, Node 20, B1 SKU) — hosts the Next.js application
* **PostgreSQL Flexible Server** (Burstable B1ms, v16) — stores all trip data
* **Storage Account** (Blob) — stores travel documents (passports, tickets, etc.)
* **User-Assigned Managed Identity** — connects all services without passwords

All Bicep files live under `infra/` and deploy at subscription scope so the
resource group is created automatically.

## Prerequisites

* An Azure subscription
* [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) (`az`) v2.50+
* [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd) (`azd`) v1.5+ *(for the azd workflow)*
* Node.js 20+ and npm
* Git

## Option A — Deploy with Azure Developer CLI (azd)

This is the recommended approach. `azd` handles provisioning and deployment
in a single command.

### Step 1 — Log in

```bash
azd auth login
```

### Step 2 — Initialize environment

```bash
azd init
```

When prompted, enter your environment name (e.g., `prod`, `staging`, `dev`).
This name is used for resource naming and tagging.

### Step 3 — Configure the resource group name

By default the resource group is named `rg-{environmentName}`. To customize it:

```bash
azd env set AZURE_RESOURCE_GROUP_NAME "my-custom-rg-name"
```

Then update `infra/main.parameters.json` to use this variable, or pass it directly
when running `azd provision`.

### Step 4 — Set the PostgreSQL admin password

```bash
azd env set POSTGRES_ADMIN_PASSWORD "<your-secure-password>"
```

The password must be at least 8 characters with uppercase, lowercase, and a number.

### Step 5 — Provision and deploy

```bash
azd up
```

This command:

1. Creates the resource group
2. Deploys all Bicep modules (identity, PostgreSQL, storage, App Service)
3. Builds and deploys the Next.js app
4. Runs Prisma migrations

### Step 6 — Verify

```bash
azd show
```

Open the URL printed for the `web` service to confirm the app is running.

## Option B — Deploy with Azure CLI (az)

Use this if you prefer manual control or do not have `azd` installed.

### Step 1 — Log in and set subscription

```bash
az login
az account set --subscription "<your-subscription-id>"
```

### Step 2 — Deploy infrastructure

Replace the placeholder values below. The `--location` flag sets the Azure
region, and `resourceGroupName` lets you name the resource group.

```bash
az deployment sub create \
  --name "family-travel-deploy" \
  --location "eastus" \
  --template-file infra/main.bicep \
  --parameters \
    environmentName="prod" \
    location="eastus" \
    resourceGroupName="my-custom-rg-name" \
    postgresAdminPassword="<your-secure-password>"
```

#### Optional parameters

| Parameter             | Default          | Description                      |
|-----------------------|------------------|----------------------------------|
| `resourceGroupName`   | `rg-prod`        | Name of the resource group       |
| `postgresAdminLogin`  | `pgadmin`        | PostgreSQL admin username        |
| `postgresDatabaseName`| `family_travel`  | Database name                    |
| `postgresSkuName`     | `Standard_B1ms`  | PostgreSQL SKU                   |
| `postgresSkuTier`     | `Burstable`      | PostgreSQL tier                  |
| `postgresStorageSizeGB`| `32`            | PostgreSQL storage (GB)          |
| `appServiceSkuName`   | `B1`             | App Service Plan SKU             |

### Step 3 — Get deployment outputs

```bash
az deployment sub show \
  --name "family-travel-deploy" \
  --query "properties.outputs" \
  --output table
```

Save the `AZURE_WEBAPP_NAME` and `AZURE_RESOURCE_GROUP` values for the next steps.

### Step 4 — Build and deploy the app

```bash
# Build locally
npm ci
npx prisma generate
npm run build

# Package standalone output
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp -r prisma .next/standalone/prisma

# Create zip and deploy
cd .next/standalone
tar -cf ../../deploy.zip --format=zip .
cd ../..

az webapp deploy \
  --resource-group "<AZURE_RESOURCE_GROUP>" \
  --name "<AZURE_WEBAPP_NAME>" \
  --src-path deploy.zip \
  --type zip \
  --clean true
```

> **Important**: Do NOT use `azure/webapps-deploy` or set `WEBSITE_RUN_FROM_PACKAGE=1`.
> The App Service Bicep template already disables Oryx (`ENABLE_ORYX_BUILD=false`,
> `SCM_DO_BUILD_DURING_DEPLOYMENT=false`) and sets the startup command to
> `node server.js`.

### Step 5 — Run Prisma migrations

```bash
# Get the DATABASE_URL from App Service settings
DB_URL=$(az webapp config appsettings list \
  --name "<AZURE_WEBAPP_NAME>" \
  --resource-group "<AZURE_RESOURCE_GROUP>" \
  --query "[?name=='DATABASE_URL'].value" -o tsv)

DATABASE_URL="$DB_URL" npx prisma migrate deploy
```

### Step 6 — Verify

```bash
az webapp browse \
  --resource-group "<AZURE_RESOURCE_GROUP>" \
  --name "<AZURE_WEBAPP_NAME>"
```

## CI/CD via GitHub Actions

The repository includes a GitHub Actions workflow at
`.github/workflows/deploy.yml` that automatically provisions infrastructure
and deploys on every push to `main`.

### Required GitHub configuration

Set these as **repository variables** (Settings > Secrets and variables > Actions > Variables):

| Variable                | Description                                          |
|-------------------------|------------------------------------------------------|
| `AZURE_CLIENT_ID`       | Client ID of the Entra ID (AAD) app registration     |
| `AZURE_TENANT_ID`       | Your Azure tenant ID                                 |
| `AZURE_SUBSCRIPTION_ID` | Your Azure subscription ID                           |
| `AZURE_LOCATION`        | Azure region (e.g., `swedencentral`)                 |
| `AZURE_RESOURCE_GROUP`  | Resource group name (e.g., `rg-familytravelapp`)     |
| `AZURE_WEBAPP_NAME`     | App Service name (e.g., `hammadtravel`)              |
| `AZURE_ENV_NAME`        | Environment name for Bicep (e.g., `familytravelapp`) |

Set this as a **repository secret**:

| Secret                    | Description                    |
|---------------------------|--------------------------------|
| `POSTGRES_ADMIN_PASSWORD` | PostgreSQL administrator password |

### Setting up OIDC federated credentials

To allow GitHub Actions to authenticate without storing secrets:

1. Create an Entra ID app registration
2. Add a federated credential for your repository:

   ```bash
   az ad app federated-credential create \
     --id "<app-object-id>" \
     --parameters '{
       "name": "github-deploy",
       "issuer": "https://token.actions.githubusercontent.com",
       "subject": "repo:<owner>/<repo>:environment:production",
       "audiences": ["api://AzureADTokenExchange"]
     }'
   ```

3. Grant the app registration **Contributor** and **User Access Administrator**
   roles on the subscription:

   ```bash
   az role assignment create \
     --assignee "<app-client-id>" \
     --role "Contributor" \
     --scope "/subscriptions/<subscription-id>"

   az role assignment create \
     --assignee "<app-client-id>" \
     --role "User Access Administrator" \
     --scope "/subscriptions/<subscription-id>"
   ```

### Manual infrastructure deployment via workflow

You can trigger an infrastructure-only deployment from the Actions tab using
**workflow_dispatch**. Select "Deploy infrastructure changes = true" and
optionally provide a custom resource group name.

## Additional app settings

After deployment, configure these optional app settings in the Azure Portal or
via CLI. These are API keys for third-party integrations:

```bash
az webapp config appsettings set \
  --resource-group "<AZURE_RESOURCE_GROUP>" \
  --name "<AZURE_WEBAPP_NAME>" \
  --settings \
    PIN_HASH="<sha256-hash-of-your-pin>" \
    TRIPIT_API_KEY="<key>" \
    TRIPIT_API_SECRET="<secret>" \
    TRIPIT_ACCESS_TOKEN="<token>" \
    TRIPIT_ACCESS_TOKEN_SECRET="<token-secret>" \
    AIRLABS_API_KEY="<key>" \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="<key>" \
    GOOGLE_CLIENT_ID="<id>" \
    GOOGLE_CLIENT_SECRET="<secret>" \
    GOOGLE_REDIRECT_URI="https://<your-app>.azurewebsites.net/api/auth/google/callback" \
    NEXT_PUBLIC_APP_URL="https://<your-app>.azurewebsites.net"
```

## Seed data

To populate the database with sample trip data after the first deployment:

```bash
DATABASE_URL="$DB_URL" npx prisma db seed
```

## Troubleshooting

### Check app logs

```bash
az webapp log tail \
  --resource-group "<AZURE_RESOURCE_GROUP>" \
  --name "<AZURE_WEBAPP_NAME>"
```

### Check deployment status

```bash
az deployment sub show \
  --name "family-travel-deploy" \
  --query "properties.provisioningState"
```

### Common issues

* **OIDC login fails**: Verify the federated credential subject matches your
  repo and environment name exactly.
* **Database connection fails**: Ensure the AllowAzureServices firewall rule
  exists on the PostgreSQL server and the connection string is correct.
* **Storage access denied**: The managed identity needs time to propagate after
  role assignment. Wait 5 minutes and retry.
* **PostgreSQL server stopped**: The server may auto-stop to save costs. Start
  it before deploying: `az postgres flexible-server start --resource-group <RG> --name <SERVER>`.
* **Oryx compresses node_modules**: This is prevented by the Bicep template
  setting `ENABLE_ORYX_BUILD=false`. Do NOT remove this setting.
* **WEBSITE_RUN_FROM_PACKAGE breaks deployment**: Do NOT set this. The app
  must be deployed to wwwroot directly for `node server.js` to work.
* **Files not found after deploy**: Ensure the zip was created from inside
  the `.next/standalone` directory so files are at the root, not nested.
