import { z } from "zod";
import { hexString } from "./commonSchemas";

// ===============================
// Direct Message - General Communication (NIP-17, Kind: 14)
// ===============================

const CommunicationPubkeyTagSchema = z.tuple([z.literal("p"), hexString]);
const CommunicationSubjectTagSchema = z.tuple([z.literal("subject"), z.string()]);

// Complete General Communication Schema
export const GeneralCommunicationSchema = z.object({
    kind: z.literal(14),
    tags: z.array(
        z.union([
            // Required tags
            CommunicationPubkeyTagSchema,

            // Optional tags
            CommunicationSubjectTagSchema
        ])
    ).refine(
        (tags) => {
            // Verify required tags are present
            return tags.some(tag => tag[0] === "p");
        },
        {
            message: "Missing required tag: p"
        }
    ),
    content: z.string()
});
