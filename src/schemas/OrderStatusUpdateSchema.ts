import { z } from "zod";
import { hexString } from "./commonSchemas";

// ===============================
// Order Status Updates (NIP-17, Kind: 16, type: 3)
// ===============================

const StatusUpdatePubkeyTagSchema = z.tuple([z.literal("p"), hexString]);
const StatusUpdateSubjectTagSchema = z.tuple([z.literal("subject"), z.string()]);
const StatusUpdateTypeTagSchema = z.tuple([z.literal("type"), z.literal("3")]);
const StatusUpdateOrderTagSchema = z.tuple([z.literal("order"), z.string()]);
const StatusUpdateStatusTagSchema = z.tuple([
    z.literal("status"),
    z.enum(["pending", "confirmed", "processing", "completed", "cancelled"])
]);

// Complete Order Status Update Schema
export const OrderStatusUpdateSchema = z.object({
    kind: z.literal(16),
    tags: z.array(
        z.union([
            // Required tags
            StatusUpdatePubkeyTagSchema,
            StatusUpdateSubjectTagSchema,
            StatusUpdateTypeTagSchema,
            StatusUpdateOrderTagSchema,
            StatusUpdateStatusTagSchema
        ])
    ).refine(
        (tags) => {
            // Verify required tags are present
            return tags.some(tag => tag[0] === "p") &&
                tags.some(tag => tag[0] === "subject") &&
                tags.some(tag => tag[0] === "type" && tag[1] === "3") &&
                tags.some(tag => tag[0] === "order") &&
                tags.some(tag => tag[0] === "status");
        },
        {
            message: "Missing required tags: p, subject, type (3), order, status"
        }
    ),
    content: z.string()
});
