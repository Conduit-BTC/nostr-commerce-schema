import { z } from "zod";
import { hexString } from "./commonSchemas";

// ===============================
// Shipping Updates (NIP-17, Kind: 16, type: 4)
// ===============================

const ShippingUpdatePubkeyTagSchema = z.tuple([z.literal("p"), hexString]);
const ShippingUpdateSubjectTagSchema = z.tuple([z.literal("subject"), z.string()]);
const ShippingUpdateTypeTagSchema = z.tuple([z.literal("type"), z.literal("4")]);
const ShippingUpdateOrderTagSchema = z.tuple([z.literal("order"), z.string()]);
const ShippingUpdateStatusTagSchema = z.tuple([
    z.literal("status"),
    z.enum(["processing", "shipped", "delivered", "exception"])
]);

// Optional tracking info
const ShippingUpdateTrackingTagSchema = z.tuple([
    z.literal("tracking"),
    z.string()
]);
const ShippingUpdateCarrierTagSchema = z.tuple([
    z.literal("carrier"),
    z.string()
]);
const ShippingUpdateEtaTagSchema = z.tuple([
    z.literal("eta"),
    z.string().regex(/^\d+$/, "Must be a unix timestamp")
]);

// Complete Shipping Update Schema
export const ShippingUpdateSchema = z.object({
    kind: z.literal(16),
    tags: z.array(
        z.union([
            // Required tags
            ShippingUpdatePubkeyTagSchema,
            ShippingUpdateSubjectTagSchema,
            ShippingUpdateTypeTagSchema,
            ShippingUpdateOrderTagSchema,
            ShippingUpdateStatusTagSchema,

            // Optional tags
            ShippingUpdateTrackingTagSchema,
            ShippingUpdateCarrierTagSchema,
            ShippingUpdateEtaTagSchema
        ])
    ).refine(
        (tags) => {
            // Verify required tags are present
            return tags.some(tag => tag[0] === "p") &&
                tags.some(tag => tag[0] === "subject") &&
                tags.some(tag => tag[0] === "type" && tag[1] === "4") &&
                tags.some(tag => tag[0] === "order") &&
                tags.some(tag => tag[0] === "status");
        },
        {
            message: "Missing required tags: p, subject, type (4), order, status"
        }
    ),
    content: z.string()
});
