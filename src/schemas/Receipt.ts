import { z } from "zod";
import { hexString } from "./commonSchemas";

// ===============================
// Receipt (NIP-17, Kind: 17)
// ===============================

const PaymentReceiptPubkeyTagSchema = z.tuple([z.literal("p"), hexString]);
const PaymentReceiptSubjectTagSchema = z.tuple([z.literal("subject"), z.string()]);
const PaymentReceiptOrderTagSchema = z.tuple([z.literal("order"), z.string()]);
const PaymentReceiptAmountTagSchema = z.tuple([
    z.literal("amount"),
    z.string().regex(/^\d+$/, "Must be an integer")
]);

// Payment proof tags
const PaymentReceiptGenericPaymentTagSchema = z.tuple([
    z.literal("payment"),
    z.string(), // medium
    z.string(), // medium-reference
    z.string() // proof
]);

// Complete Payment Receipt Schema
export const PaymentReceiptSchema = z.object({
    kind: z.literal(17),
    tags: z.array(
        z.union([
            // Required tags
            PaymentReceiptPubkeyTagSchema,
            PaymentReceiptSubjectTagSchema,
            PaymentReceiptOrderTagSchema,
            PaymentReceiptGenericPaymentTagSchema,
            PaymentReceiptAmountTagSchema
        ])
    ).refine(
        (tags) => {
            // Verify required tags are present
            return tags.some(tag => tag[0] === "p") &&
                tags.some(tag => tag[0] === "subject") &&
                tags.some(tag => tag[0] === "order") &&
                tags.some(tag => tag[0] === "payment") &&
                tags.some(tag => tag[0] === "amount");
        },
        {
            message: "Missing required tags: p, subject, order, payment, amount"
        }
    ),
    content: z.string()
});
