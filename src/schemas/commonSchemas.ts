import { z } from "zod";

export const addressableFormat = z.string().regex(/^\d+:[0-9a-f]{64}:[a-zA-Z0-9_-]+$/,
    "Must be in format kind:pubkey:d-identifier");
export const hexString = z.string().regex(/^[0-9a-f]{64}$/, "Must be a 64-character hex string");
export const iso4217Currency = z.string().regex(/^[A-Z]{3}$/, "Must be an ISO 4217 currency code");
export const iso3166Country = z.string().regex(/^[A-Z]{2}$/, {
    message: "Must be an ISO 3166-1 Alpha-2 country code",
}); // Country code = ISO 3166-1 Alpha-2 (e.g., US, CA, DE)
export const iso3166Region = z.string().regex(/^[A-Z]{2}-[A-Z0-9]{1,3}$/, {
    message: "Must be an ISO 3166-2 region code",
}); // Region code = ISO 3166-2 (e.g., US-CA, DE-BE)
export const iso8601Duration = z.enum(["H", "D", "W", "M", "Y"]);
export const geohash = z.string().regex(/^[0-9a-z]{1,12}$/, "Must be a valid geohash");
