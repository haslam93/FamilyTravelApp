// ─── User-Assigned Managed Identity ─────────────────────────────────────────
// Used by App Service, PostgreSQL, and Blob Storage for passwordless auth.

param location string
param environmentName string
param resourceToken string

var identityName = 'azid${resourceToken}'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
  tags: {
    environment: environmentName
    project: 'family-travel-app'
  }
}

output identityId string = managedIdentity.id
output principalId string = managedIdentity.properties.principalId
output clientId string = managedIdentity.properties.clientId
output identityName string = managedIdentity.name
