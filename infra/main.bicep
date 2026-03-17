// ─── Family Travel Companion App — Azure Infrastructure ─────────────────────
// Deploys: App Service (Linux/Node 20), PostgreSQL Flexible Server,
// Blob Storage, and User-Assigned Managed Identity.
// All services use Managed Identity — no passwords or connection strings.
//
// Scope: subscription-level deployment (creates its own resource group).

targetScope = 'subscription'

// ─── Parameters ─────────────────────────────────────────────────────────────

@minLength(1)
@maxLength(64)
@description('Name of the environment (e.g., dev, staging, prod). Used for resource naming.')
param environmentName string

@minLength(1)
@description('Primary Azure region for all resources.')
param location string

@description('Name of the resource group. Defaults to rg-{environmentName}.')
param resourceGroupName string = 'rg-${environmentName}'

@description('PostgreSQL administrator login username.')
param postgresAdminLogin string = 'pgadmin'

@secure()
@description('PostgreSQL administrator password. Must be at least 8 characters with uppercase, lowercase, and number.')
param postgresAdminPassword string

@description('PostgreSQL database name.')
param postgresDatabaseName string = 'family_travel'

@description('PostgreSQL SKU name.')
param postgresSkuName string = 'Standard_B1ms'

@description('PostgreSQL SKU tier.')
@allowed(['Burstable', 'GeneralPurpose', 'MemoryOptimized'])
param postgresSkuTier string = 'Burstable'

@description('PostgreSQL storage size in GB.')
param postgresStorageSizeGB int = 32

@description('App Service Plan SKU.')
param appServiceSkuName string = 'B1'

@description('Custom App Service name. If empty, auto-generated as azapp{token}.')
param appServiceName string = ''

@description('Microsoft Entra principal name to assign as PostgreSQL server admin for automation.')
param postgresEntraAdminPrincipalName string

@description('Microsoft Entra principal type for the PostgreSQL server admin.')
@allowed(['User', 'Group', 'ServicePrincipal'])
param postgresEntraAdminPrincipalType string = 'ServicePrincipal'

// ─── Resource Token ─────────────────────────────────────────────────────────
// Unique suffix for globally unique resource names.

var resourceToken = uniqueString(subscription().id, location, environmentName)

// ─── Resource Group ─────────────────────────────────────────────────────────

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: {
    'azd-env-name': environmentName
    project: 'family-travel-app'
  }
}

// ─── Managed Identity ───────────────────────────────────────────────────────

module identity 'modules/identity.bicep' = {
  name: 'identity'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
  }
}

// ─── PostgreSQL Flexible Server ─────────────────────────────────────────────

module postgres 'modules/postgres.bicep' = {
  name: 'postgres'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    administratorLogin: postgresAdminLogin
    administratorPassword: postgresAdminPassword
    databaseName: postgresDatabaseName
    skuName: postgresSkuName
    skuTier: postgresSkuTier
    storageSizeGB: postgresStorageSizeGB
    entraAdminPrincipalName: postgresEntraAdminPrincipalName
    entraAdminPrincipalType: postgresEntraAdminPrincipalType
    tenantId: subscription().tenantId
  }
}

// ─── Storage Account (Blob Storage for Documents) ───────────────────────────

module storage 'modules/storage.bicep' = {
  name: 'storage'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    managedIdentityPrincipalId: identity.outputs.principalId
  }
}

// ─── App Service ────────────────────────────────────────────────────────────

module appService 'modules/appservice.bicep' = {
  name: 'appservice'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    skuName: appServiceSkuName
    customAppName: appServiceName
    managedIdentityId: identity.outputs.identityId
    managedIdentityClientId: identity.outputs.clientId
    managedIdentityName: identity.outputs.identityName
    postgresHost: postgres.outputs.serverFqdn
    postgresDatabaseName: postgres.outputs.databaseName
    storageAccountName: storage.outputs.storageAccountName
    storageContainerName: storage.outputs.containerName
  }
}

// ─── Outputs ────────────────────────────────────────────────────────────────

output RESOURCE_GROUP_ID string = rg.id
output AZURE_RESOURCE_GROUP string = rg.name
output AZURE_WEBAPP_NAME string = appService.outputs.appServiceName
output AZURE_WEBAPP_URL string = appService.outputs.appServiceUrl
output AZURE_POSTGRES_HOST string = postgres.outputs.serverFqdn
output AZURE_POSTGRES_DATABASE string = postgres.outputs.databaseName
output AZURE_POSTGRES_ADMIN_LOGIN string = postgres.outputs.administratorLogin
output AZURE_STORAGE_ACCOUNT string = storage.outputs.storageAccountName
output AZURE_MANAGED_IDENTITY_CLIENT_ID string = identity.outputs.clientId
output AZURE_MANAGED_IDENTITY_NAME string = identity.outputs.identityName
