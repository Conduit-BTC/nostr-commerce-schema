
type ShippingTag = ['shipping', `30406:${string}:${string}`]; // ["shipping_option", "<30406|30405>:<pubkey>:<d-tag>", "<extra-cost>"] - Shipping options or collection, MAY appear multiple times
type TypeTag = ['type', string]; // ["type", "simple" | "variable" | "variation"]

type OptionalTag = string[] | ShippingTag | TypeTag;

export type NostrProduct = {
    kind: 30402,
    tags: [
        ['d', string], // ["d", "<product identifier>"]
        ['title', string], // ["title", "<product title>"]
        ['price', string, string], // ["price", "<amount>", "<currency>", "<optional frequency>"]
        ...([OptionalTag] | OptionalTag[]) // Additional optional tags (zero or more)
    ],
    content: string // Note to the Merchant
}
