import { z } from "zod";
import { hexString } from "./commonSchemas";

// ===============================
// Payment Request (NIP-17, Kind: 16, type: 2)
// ===============================

// Common tags for both manual and automatic processing
const PaymentRequestPubkeyTagSchema = z.tuple([z.literal("p"), hexString]);
const PaymentRequestSubjectTagSchema = z.tuple([z.literal("subject"), z.string()]);
const PaymentRequestTypeTagSchema = z.tuple([z.literal("type"), z.literal("2")]);
const PaymentRequestOrderTagSchema = z.tuple([z.literal("order"), z.string()]);
const PaymentRequestAmountTagSchema = z.tuple([
    z.literal("amount"),
    z.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number")
]);

// Payment method tags
const PaymentMethodLightningTagSchema = z.tuple([
    z.literal("payment"),
    z.literal("lightning"),
    z.string() // bolt11-invoice or lud16
]);
const PaymentMethodBitcoinTagSchema = z.tuple([
    z.literal("payment"),
    z.literal("bitcoin"),
    z.string() // btc-address
]);
const PaymentMethodEcashTagSchema = z.tuple([
    z.literal("payment"),
    z.literal("ecash"),
    z.string() // cashu-req
]);

// Combined payment method schema
const PaymentMethodTagSchema = z.union([
    PaymentMethodLightningTagSchema,
    PaymentMethodBitcoinTagSchema,
    PaymentMethodEcashTagSchema
]);

// Complete Payment Request Schema (covers both manual and automatic)
export const PaymentRequestSchema = z.object({
    kind: z.literal(16),
    tags: z.array(
        z.union([
            // Required tags
            PaymentRequestPubkeyTagSchema,
            PaymentRequestSubjectTagSchema,
            PaymentRequestTypeTagSchema,
            PaymentRequestOrderTagSchema,
            PaymentRequestAmountTagSchema,

            // Optional tags
            PaymentMethodTagSchema
        ])
    ).refine(
        (tags) => {
            // Verify required tags are present
            return tags.some(tag => tag[0] === "p") &&
                tags.some(tag => tag[0] === "subject") &&
                tags.some(tag => tag[0] === "type" && tag[1] === "2") &&
                tags.some(tag => tag[0] === "order") &&
                tags.some(tag => tag[0] === "amount");
        },
        {
            message: "Missing required tags: p, subject, type (2), order, amount"
        }
    ),
    content: z.string()
});
