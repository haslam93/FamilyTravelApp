// ─── TripIt API Client ──────────────────────────────────────────────────────
// OAuth 1.0a client for syncing itinerary data from TripIt.
// Docs: https://tripit.github.io/api/doc/v1/

import crypto from "crypto";

const TRIPIT_API_BASE = "https://api.tripit.com/v1";

interface TripItConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

function getConfig(): TripItConfig {
  return {
    apiKey: process.env.TRIPIT_API_KEY || "",
    apiSecret: process.env.TRIPIT_API_SECRET || "",
    accessToken: process.env.TRIPIT_ACCESS_TOKEN || "",
    accessTokenSecret: process.env.TRIPIT_ACCESS_TOKEN_SECRET || "",
  };
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

function generateSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  config: TripItConfig
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join("&");

  const baseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams),
  ].join("&");

  const signingKey = `${percentEncode(config.apiSecret)}&${percentEncode(
    config.accessTokenSecret
  )}`;

  return crypto
    .createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");
}

function buildAuthHeader(
  method: string,
  url: string,
  config: TripItConfig
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: config.apiKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: generateTimestamp(),
    oauth_token: config.accessToken,
    oauth_version: "1.0",
  };

  const signature = generateSignature(method, url, oauthParams, config);
  oauthParams.oauth_signature = signature;

  const authHeader = Object.keys(oauthParams)
    .map((key) => `${percentEncode(key)}="${percentEncode(oauthParams[key])}"`)
    .join(", ");

  return `OAuth ${authHeader}`;
}

export async function tripItRequest(
  endpoint: string,
  method: string = "GET"
): Promise<Record<string, unknown>> {
  const config = getConfig();
  const url = `${TRIPIT_API_BASE}${endpoint}/format/json`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: buildAuthHeader(method, url, config),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error(`TripIt API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function listTrips(): Promise<Record<string, unknown>> {
  return tripItRequest("/list/trip");
}

export async function getTrip(tripId: string): Promise<Record<string, unknown>> {
  return tripItRequest(`/get/trip/id/${tripId}`);
}
