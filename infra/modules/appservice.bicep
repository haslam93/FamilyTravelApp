// ─── Azure App Service ──────────────────────────────────────────────────────
// Linux App Service Plan (B1) + Node 20 Web App for the Next.js application.
// Includes: user-assigned managed identity, all app settings, startup command.

param location string
param environmentName string
param resourceToken string
param skuName string = 'B1'
param customAppName string = ''
param managedIdentityId string
param managedIdentityClientId string
param managedIdentityName string
param postgresHost string
param postgresDatabaseName string

param storageAccountName string
param storageContainerName string

// ─── Resource Names ─────────────────────────────────────────────────────────

var appServicePlanName = 'azasp${resourceToken}'
var appServiceName = empty(customAppName) ? 'azapp${resourceToken}' : customAppName

// ─── App Service Plan (Linux) ───────────────────────────────────────────────

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  tags: {
    environment: environmentName
    project: 'family-travel-app'
  }
  kind: 'linux'
  sku: {
    name: skuName
  }
  properties: {
    reserved: true // Required for Linux
  }
}

// ─── Web App (Node 20 LTS) ─────────────────────────────────────────────────

resource appService 'Microsoft.Web/sites@2023-12-01' = {
  name: appServiceName
  location: location
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'web'
    project: 'family-travel-app'
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityId}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      alwaysOn: true
      appCommandLine: 'node server.js'
      appSettings: [
        {
          name: 'AZURE_STORAGE_ACCOUNT_NAME'
          value: storageAccountName
        }
        {
          name: 'AZURE_STORAGE_CONTAINER_NAME'
          value: storageContainerName
        }
        {
          name: 'AZURE_CLIENT_ID'
          value: managedIdentityClientId
        }
        {
          name: 'AZURE_POSTGRES_USE_MANAGED_IDENTITY'
          value: 'true'
        }
        {
          name: 'AZURE_POSTGRES_HOST'
          value: postgresHost
        }
        {
          name: 'AZURE_POSTGRES_DATABASE'
          value: postgresDatabaseName
        }
        {
          name: 'AZURE_POSTGRES_PRINCIPAL_NAME'
          value: managedIdentityName
        }
        {
          name: 'AZURE_POSTGRES_SCHEMA'
          value: 'public'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
        {
          name: 'ENABLE_ORYX_BUILD'
          value: 'false'
        }
      ]
    }
  }
}

output appServiceName string = appService.name
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output appServicePlanName string = appServicePlan.name
