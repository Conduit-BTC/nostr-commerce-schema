
type ShippingTag = ['shipping', `30406:${string}:${string}`]; // Shipping method; follows addressable format of "30406:<pubkey>:<d-tag>"
type ShippingCollectionTag = ['shipping', `30405:${string}:${string}`]; // References to a product collection, in this case, shipping is inherited from the collection; follows addressable format of "30405:<pubkey>:<d-tag>"
type OptionalTag = string[] | ShippingTag | ShippingCollectionTag;

export type NostrProduct = {
    kind: 30402,
    tags: [
        ['d', string], // Medusa Product ID
        ['title', string],
        ['price', string, string], // ["price", <amount>, <currency>]
        ['type', string], // ["type", "simple" | "variable" | "variation"]
        ...([OptionalTag] | OptionalTag[]) // Additional optional tags (zero or more)
    ],
    content: string // Note to the Merchant
}
