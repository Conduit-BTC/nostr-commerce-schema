import { z } from "zod";
import { addressableFormat, hexString } from "./commonSchemas";

// ===============================
// Order (NIP-17, Kind: 16, type: 1) - Improved from provided schema
// ===============================

// Item Tag Schema
const ItemTagSchema = z.tuple([
    z.literal("item"),
    addressableFormat.refine(val => val.startsWith("30402:"), {
        message: "Item reference must start with 30402:"
    }),
    z.string().regex(/^[1-9]\d*$/, {
        message: "Must be a string containing a positive integer",
    }) // Quantity
]);

// Shipping Tag Schema
const ShippingTagSchema = z.tuple([
    z.literal("shipping"),
    addressableFormat.refine(val => val.startsWith("30406:"), {
        message: "Shipping reference must start with 30406:"
    })
]);

// Optional Contact Tags Schema
const ContactTagSchema = z.union([
    z.tuple([z.literal("address"), z.string()]),
    z.tuple([z.literal("phone"), z.string()]),
    z.tuple([z.literal("email"), z.string().email()])
]);

// Complete Order Message Schema (Updated with proper type and amount)
export const OrderSchema = z.object({
    kind: z.literal(16),
    tags: z.array(
        z.union([
            // Required tags
            z.tuple([z.literal("p"), hexString]), // Merchant's public key
            z.tuple([z.literal("subject"), z.string()]), // Human-friendly subject line for order information
            z.tuple([z.literal("type"), z.literal("1")]), // Order Creation = type 1
            z.tuple([z.literal("order"), z.string()]), // Unique order identifier
            z.tuple([
                z.literal("amount"),
                z.string().regex(/^\d+$/, "Must be an integer")
            ]),
            ItemTagSchema,

            // Optional tags
            ShippingTagSchema,
            ContactTagSchema
        ])
    ).refine(
        (tags) => {
            // Verify required tags are present
            const hasRequiredTags =
                tags.some(tag => tag[0] === "p") &&
                tags.some(tag => tag[0] === "subject") &&
                tags.some(tag => tag[0] === "type" && tag[1] === "1") &&
                tags.some(tag => tag[0] === "order") &&
                tags.some(tag => tag[0] === "amount") &&
                tags.some(tag => tag[0] === "item");
            return hasRequiredTags;
        },
        {
            message: "Missing required tags: p, subject, type (1), order, amount, item"
        }
    ),
    content: z.string()
});
