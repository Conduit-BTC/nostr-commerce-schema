import { v4 as uuidv4 } from "uuid";
import { NDKEvent, NDKPrivateKeySigner, NDKSigner } from "@nostr-dev-kit/ndk";
import { ProductListingSchema } from "@/schemas/ProductListingSchema";

// Template for cloning non-unique values
const productTemplate = {
  title: "Synthdragon Sunglasses",
  price: { amount: "49.49", currency: "USD", frequency: "P1M" },
  type: { type: "simple", physicalType: "physical" },
  visibility: "on-sale",
  stock: 50,
  summary: "A great product to use as an example.",
  specs: { material: "Moondust, Starglass, polyester", warranty: "200 years" },
  images: [
    { url: "https://example.com/image1.jpg", dimensions: "800x600", order: 0 },
    { url: "https://example.com/image2.jpg", dimensions: "800x600", order: 1 },
  ],
  weight: { value: "1.2", unit: "kg" },
  dimensions: { dimensions: "10.0x20.0x30.0", unit: "cm" },
  categories: ["example", "mock"],
  shippingOptions: [{ reference: "30406:abc123def4567890", extraCost: "5.00" }],
};

const staticPrivateKeys = [
  "nsec1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpl2sx",
  "nsec1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq7az27",
  "nsec1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkzqx0",
];

export const ProductListingMocks = {
  async get(number: number) {
    const results = [];

    for (let i = 0; i < number; i++) {
      const id = `product_id_${uuidv4().replace(/-/g, "")}`;
      const created_at = Math.floor(Date.now() / 1000);
      const tags = [
        ["d", id],
        ["title", productTemplate.title],
        [
          "price",
          productTemplate.price.amount,
          productTemplate.price.currency,
          productTemplate.price.frequency,
        ],
        ["type", productTemplate.type.type, productTemplate.type.physicalType],
        ["visibility", productTemplate.visibility],
        ["stock", productTemplate.stock.toString()],
        ["summary", productTemplate.summary],
        ...Object.entries(productTemplate.specs).map(([k, v]) => [
          "spec",
          k,
          v,
        ]),
        ...productTemplate.images.map((img) => [
          "image",
          img.url,
          img.dimensions,
          img.order.toString(),
        ]),
        ["weight", productTemplate.weight.value, productTemplate.weight.unit],
        [
          "dim",
          productTemplate.dimensions.dimensions,
          productTemplate.dimensions.unit,
        ],
        ...productTemplate.categories.map((cat) => ["t", cat]),
        ...productTemplate.shippingOptions.map((opt) => [
          "shipping_option",
          opt.reference,
          opt.extraCost,
        ]),
      ];

      const event = new NDKEvent();
      event.kind = 30402;
      event.created_at = created_at;
      event.content = "";
      event.tags = tags;

      const privkey = staticPrivateKeys[i % staticPrivateKeys.length];
      const signer = new NDKPrivateKeySigner(privkey);
      await event.sign(signer);

      // Validate with schema (optional, for development only)
      const parsed = ProductListingSchema.safeParse({
        kind: event.kind,
        created_at: event.created_at,
        content: event.content,
        tags: event.tags,
      });

      if (!parsed.success) {
        console.error("Validation failed:", parsed.error);
        continue;
      }

      results.push(parsed.data);
    }

    return results;
  },
};
