import { v4 as uuidv4 } from "uuid";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { ProductListingSchema } from "@/schemas/ProductListingSchema";

export const ProductListingMocks = {
  async generateEventsArray(number: number) {
    const results = [];

    for (let i = 0; i < number; i++) {
      const id = `product_id_${uuidv4().replace(/-/g, "")}`;
      const created_at = Math.floor(Date.now() / 1000);

      const priceTag: any[] = [
        "price",
        productListingTemplate.price.amount,
        productListingTemplate.price.currency,
      ];

      const imageTags = productListingTemplate.images.map((img) => {
        const tag: [string, string, ...string[]] = ["image", img.url];
        if (img.dimensions) tag.push(img.dimensions);
        if (img.order !== undefined) tag.push(img.order.toString());
        return tag;
      });

      const privkey = staticPrivateKeys[i % staticPrivateKeys.length];
      const signer = new NDKPrivateKeySigner(privkey);

      const event = new NDKEvent();
      event.kind = 30402;
      event.created_at = created_at;
      event.content = "";

      // Temporarily assign empty tags to allow signing
      event.tags = [["d", id]];

      await event.sign(signer);
      const pubkey = (await signer.user()).pubkey;

      const dynamicShippingOption = [
        "shipping_option",
        `30406:${pubkey}:d-${id}`,
        "5.00",
      ];

      const tags = [
        ["d", id],
        ["title", productListingTemplate.title],
        priceTag,
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
        ...imageTags,
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
        dynamicShippingOption,
      ];

      event.tags = tags;

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
  getEventsArray() {
    return staticEvents;
  },
};

const productListingTemplate = {
  title: "Synthdragon Sunglasses",
  price: { amount: "49.49", currency: "USD" },
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
};

const staticPrivateKeys = [
  "nsec1rd3g9m92vfhmwez7e979veql4hyrjf36kyhtqs3q83g30y9etjsq3z0dfh",
  "a7b78835cbb13b25cb442cf6e40ad33a020c96dff671700e8b5e7d94fac68d08",
  "dfb6d9013a454df96a307ec57c128c1dea068b3858fd95f2441694c5fdb34daa",
  "c5b4ec464b188828b1327d8ff17e90292392245f7d6fba62029eaf427748ed03",
];

const staticEvents = [
  {
    kind: 30402,
    created_at: 1746687996,
    content: "",
    tags: [
      ["d", "product_id_a37746aa416041a4a9221741b10ca5ec"],
      ["title", "Synthdragon Sunglasses"],
      ["price", "49.49", "USD"],
      ["type", "simple", "physical"],
      ["visibility", "on-sale"],
      ["stock", "50"],
      ["summary", "A great product to use as an example."],
      ["spec", "material", "Moondust, Starglass, polyester"],
      ["spec", "warranty", "200 years"],
      ["image", "https://example.com/image1.jpg", "800x600", "0"],
      ["image", "https://example.com/image2.jpg", "800x600", "1"],
      ["weight", "1.2", "kg"],
      ["dim", "10.0x20.0x30.0", "cm"],
      ["t", "example"],
      ["t", "mock"],
      [
        "shipping_option",
        "30406:5f73cd4ae6a9d8f98c0dc23fc1d48d38e52f4a9fd7981ea4af99d938ea20c689:d-product_id_a37746aa416041a4a9221741b10ca5ec",
        "5.00",
      ],
    ],
  },
  {
    kind: 30402,
    created_at: 1746687996,
    content: "",
    tags: [
      ["d", "product_id_2d4e2caea9dd4ac1860220f27d939d30"],
      ["title", "Synthdragon Sunglasses"],
      ["price", "49.49", "USD"],
      ["type", "simple", "physical"],
      ["visibility", "on-sale"],
      ["stock", "50"],
      ["summary", "A great product to use as an example."],
      ["spec", "material", "Moondust, Starglass, polyester"],
      ["spec", "warranty", "200 years"],
      ["image", "https://example.com/image1.jpg", "800x600", "0"],
      ["image", "https://example.com/image2.jpg", "800x600", "1"],
      ["weight", "1.2", "kg"],
      ["dim", "10.0x20.0x30.0", "cm"],
      ["t", "example"],
      ["t", "mock"],
      [
        "shipping_option",
        "30406:c5311fa79cdbb669ab9bf98f7dcb3cc468988143e68b0781904bdf5718d67fdc:d-product_id_2d4e2caea9dd4ac1860220f27d939d30",
        "5.00",
      ],
    ],
  },
  {
    kind: 30402,
    created_at: 1746687996,
    content: "",
    tags: [
      ["d", "product_id_92b21c695786413785b3397fd2c6263d"],
      ["title", "Synthdragon Sunglasses"],
      ["price", "49.49", "USD"],
      ["type", "simple", "physical"],
      ["visibility", "on-sale"],
      ["stock", "50"],
      ["summary", "A great product to use as an example."],
      ["spec", "material", "Moondust, Starglass, polyester"],
      ["spec", "warranty", "200 years"],
      ["image", "https://example.com/image1.jpg", "800x600", "0"],
      ["image", "https://example.com/image2.jpg", "800x600", "1"],
      ["weight", "1.2", "kg"],
      ["dim", "10.0x20.0x30.0", "cm"],
      ["t", "example"],
      ["t", "mock"],
      [
        "shipping_option",
        "30406:524ccadf867d9e0abc357bc4e272bb212a5441601eaedec9b72e260a0fe0d0c4:d-product_id_92b21c695786413785b3397fd2c6263d",
        "5.00",
      ],
    ],
  },
  {
    kind: 30402,
    created_at: 1746687996,
    content: "",
    tags: [
      ["d", "product_id_6cefb7d302474d33963d82138c854e45"],
      ["title", "Synthdragon Sunglasses"],
      ["price", "49.49", "USD"],
      ["type", "simple", "physical"],
      ["visibility", "on-sale"],
      ["stock", "50"],
      ["summary", "A great product to use as an example."],
      ["spec", "material", "Moondust, Starglass, polyester"],
      ["spec", "warranty", "200 years"],
      ["image", "https://example.com/image1.jpg", "800x600", "0"],
      ["image", "https://example.com/image2.jpg", "800x600", "1"],
      ["weight", "1.2", "kg"],
      ["dim", "10.0x20.0x30.0", "cm"],
      ["t", "example"],
      ["t", "mock"],
      [
        "shipping_option",
        "30406:aa66156a055f18f31e9409ddc2db1c43120cc62cc57b080f6ceb0920517a5fde:d-product_id_6cefb7d302474d33963d82138c854e45",
        "5.00",
      ],
    ],
  },
  {
    kind: 30402,
    created_at: 1746687996,
    content: "",
    tags: [
      ["d", "product_id_1bfc2c99e3ef47eca38bb426414d6b0d"],
      ["title", "Synthdragon Sunglasses"],
      ["price", "49.49", "USD"],
      ["type", "simple", "physical"],
      ["visibility", "on-sale"],
      ["stock", "50"],
      ["summary", "A great product to use as an example."],
      ["spec", "material", "Moondust, Starglass, polyester"],
      ["spec", "warranty", "200 years"],
      ["image", "https://example.com/image1.jpg", "800x600", "0"],
      ["image", "https://example.com/image2.jpg", "800x600", "1"],
      ["weight", "1.2", "kg"],
      ["dim", "10.0x20.0x30.0", "cm"],
      ["t", "example"],
      ["t", "mock"],
      [
        "shipping_option",
        "30406:5f73cd4ae6a9d8f98c0dc23fc1d48d38e52f4a9fd7981ea4af99d938ea20c689:d-product_id_1bfc2c99e3ef47eca38bb426414d6b0d",
        "5.00",
      ],
    ],
  },
];
