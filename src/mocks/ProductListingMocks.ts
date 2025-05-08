import { v4 as uuidv4 } from "uuid";
import { NDKEvent, NDKPrivateKeySigner, NDKSigner } from "@nostr-dev-kit/ndk";
import { ProductListingSchema } from "@/schemas/ProductListingSchema";

export const ProductListingMocks = {
  async generateArray(number: number) {
    const results = [];

    for (let i = 0; i < number; i++) {
      const id = `product_id_${uuidv4().replace(/-/g, "")}`;
      const created_at = Math.floor(Date.now() / 1000);
      const tags = [
        ["d", id],
        ["title", productListingTemplate.title],
        [
          "price",
          productListingTemplate.price.amount,
          productListingTemplate.price.currency,
          productListingTemplate.price.frequency,
        ],
        [
          "type",
          productListingTemplate.type.type,
          productListingTemplate.type.physicalType,
        ],
        ["visibility", productListingTemplate.visibility],
        ["stock", productListingTemplate.stock.toString()],
        ["summary", productListingTemplate.summary],
        ...Object.entries(productListingTemplate.specs).map(([k, v]) => [
          "spec",
          k,
          v,
        ]),
        ...productListingTemplate.images.map((img) => [
          "image",
          img.url,
          img.dimensions,
          img.order.toString(),
        ]),
        [
          "weight",
          productListingTemplate.weight.value,
          productListingTemplate.weight.unit,
        ],
        [
          "dim",
          productListingTemplate.dimensions.dimensions,
          productListingTemplate.dimensions.unit,
        ],
        ...productListingTemplate.categories.map((cat) => ["t", cat]),
        ...productListingTemplate.shippingOptions.map((opt) => [
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
  getTemplate() {
    return productListingTemplate;
  },
  getPrivateKeys() {
    return staticPrivateKeys;
  },
};

// Template for cloning non-unique values
const productListingTemplate = {
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
  "nsec1rd3g9m92vfhmwez7e979veql4hyrjf36kyhtqs3q83g30y9etjsq3z0dfh",
  "a7b78835cbb13b25cb442cf6e40ad33a020c96dff671700e8b5e7d94fac68d08",
  "dfb6d9013a454df96a307ec57c128c1dea068b3858fd95f2441694c5fdb34daa",
  "c5b4ec464b188828b1327d8ff17e90292392245f7d6fba62029eaf427748ed03",
];
