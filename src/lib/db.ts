import { DefaultAzureCredential } from "@azure/identity";
import { PrismaClient, type Prisma } from "@prisma/client";

const POSTGRES_TOKEN_SCOPE = "https://ossrdbms-aad.database.windows.net/.default";
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

type GlobalPrismaState = {
  prisma: PrismaClient | undefined;
  prismaInitPromise: Promise<PrismaClient> | undefined;
  prismaRefreshPromise: Promise<void> | undefined;
  prismaRefreshTimer: NodeJS.Timeout | undefined;
};

const globalForPrisma = globalThis as unknown as GlobalPrismaState;

function isManagedIdentityDatabaseEnabled() {
  return process.env.AZURE_POSTGRES_USE_MANAGED_IDENTITY === "true";
}

function getPrismaLogLevels() {
  return process.env.NODE_ENV === "development"
    ? (["query", "error", "warn"] satisfies Prisma.LogLevel[])
    : (["error"] satisfies Prisma.LogLevel[]);
}

function getManagedIdentityDatabaseConfig() {
  const host = process.env.AZURE_POSTGRES_HOST;
  const database = process.env.AZURE_POSTGRES_DATABASE;
  const principalName = process.env.AZURE_POSTGRES_PRINCIPAL_NAME;
  const schema = process.env.AZURE_POSTGRES_SCHEMA || "public";

  if (!host || !database || !principalName) {
    throw new Error(
      "Managed identity database auth is enabled, but AZURE_POSTGRES_HOST, AZURE_POSTGRES_DATABASE, or AZURE_POSTGRES_PRINCIPAL_NAME is missing."
    );
  }

  return { host, database, principalName, schema };
}

async function getManagedIdentityAccessToken() {
  const credential = new DefaultAzureCredential(
    process.env.AZURE_CLIENT_ID
      ? { managedIdentityClientId: process.env.AZURE_CLIENT_ID }
      : undefined
  );
  const accessToken = await credential.getToken(POSTGRES_TOKEN_SCOPE);

  if (!accessToken?.token) {
    throw new Error("Failed to acquire a Microsoft Entra access token for Azure PostgreSQL.");
  }

  return accessToken;
}

function buildManagedIdentityDatabaseUrl(token: string) {
  const { host, database, principalName, schema } = getManagedIdentityDatabaseConfig();
  const params = new URLSearchParams({
    schema,
    sslmode: "require",
    connection_limit: "5",
    pool_timeout: "20",
  });

  return `postgresql://${encodeURIComponent(principalName)}:${encodeURIComponent(token)}@${host}:5432/${database}?${params.toString()}`;
}

function createPrismaClient(datasourceUrl?: string) {
  return new PrismaClient({
    log: getPrismaLogLevels(),
    ...(datasourceUrl
      ? {
          datasources: {
            db: {
              url: datasourceUrl,
            },
          },
        }
      : {}),
  });
}

function scheduleManagedIdentityRefresh(expiresOnTimestamp?: number) {
  if (!expiresOnTimestamp) {
    return;
  }

  if (globalForPrisma.prismaRefreshTimer) {
    clearTimeout(globalForPrisma.prismaRefreshTimer);
  }

  const refreshDelay = Math.max(
    expiresOnTimestamp - Date.now() - TOKEN_REFRESH_BUFFER_MS,
    60 * 1000
  );

  globalForPrisma.prismaRefreshTimer = setTimeout(() => {
    void refreshManagedIdentityPrismaClient();
  }, refreshDelay);

  globalForPrisma.prismaRefreshTimer.unref?.();
}

async function initializeManagedIdentityPrismaClient() {
  const accessToken = await getManagedIdentityAccessToken();
  const prismaClient = createPrismaClient(buildManagedIdentityDatabaseUrl(accessToken.token));
  await prismaClient.$connect();
  scheduleManagedIdentityRefresh(accessToken.expiresOnTimestamp);
  return prismaClient;
}

async function refreshManagedIdentityPrismaClient() {
  if (!isManagedIdentityDatabaseEnabled()) {
    return;
  }

  if (!globalForPrisma.prismaRefreshPromise) {
    globalForPrisma.prismaRefreshPromise = (async () => {
      const nextClient = await initializeManagedIdentityPrismaClient();
      const previousClient = globalForPrisma.prisma;
      globalForPrisma.prisma = nextClient;
      if (previousClient) {
        await previousClient.$disconnect();
      }
    })().finally(() => {
      globalForPrisma.prismaRefreshPromise = undefined;
    });
  }

  await globalForPrisma.prismaRefreshPromise;
}

async function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (!globalForPrisma.prismaInitPromise) {
    globalForPrisma.prismaInitPromise = (async () => {
      if (!isManagedIdentityDatabaseEnabled()) {
        const prismaClient = createPrismaClient();
        if (process.env.NODE_ENV !== "production") {
          globalForPrisma.prisma = prismaClient;
        }
        return prismaClient;
      }

      const prismaClient = await initializeManagedIdentityPrismaClient();
      globalForPrisma.prisma = prismaClient;
      return prismaClient;
    })();
  }

  return globalForPrisma.prismaInitPromise;
}

const initialPrismaClient = await getPrismaClient();

export const prisma = new Proxy(initialPrismaClient, {
  get(_target, prop) {
    const client = globalForPrisma.prisma ?? initialPrismaClient;
    const value = Reflect.get(client as object, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
}) as PrismaClient;
