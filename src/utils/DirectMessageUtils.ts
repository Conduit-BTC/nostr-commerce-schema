import NDK, { NDKUser, NostrEvent } from '@nostr-dev-kit/ndk';

/**
 * Decrypts a NIP-17 direct message using the double decryption pattern
 *
 * @param ndk The NDK instance to use for decryption. MUST have a valid signer
 * @param event The encrypted Nostr event
 * @returns The decrypted event or null if decryption fails
 */
export const decryptNip17Message = async (ndk: NDK, event: NostrEvent): Promise<NostrEvent | null> => {
    try {
        // Get the NDK instance and signer
        const signer = ndk.signer;

        if (!signer) {
            console.error("No signer available for decryption");
            return null;
        }

        // First decrypt the outer envelope (seal)
        const seal = await signer.decrypt(new NDKUser({ pubkey: event.pubkey }), event.content);
        const sealJson = JSON.parse(seal);

        // Then decrypt the inner content (rumor)
        const rumor = await signer.decrypt(new NDKUser({ pubkey: sealJson.pubkey }), sealJson.content);
        const rumorJson = JSON.parse(rumor);

        // Return the fully decrypted event
        return rumorJson;
    } catch (error) {
        console.error("[nostr-commerce-schema |> DirectMessageUtils |> decryptNip17Message]: Failed to decrypt NIP-17 message:", error);
        return null;
    }
};
