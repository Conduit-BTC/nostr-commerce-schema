// src/schemas/DirectMessage.ts
import { z as z2 } from "zod";

// src/schemas/commonSchemas.ts
import { z } from "zod";
var addressableFormat = z.string().regex(
  /^\d+:[0-9a-f]{64}:[a-zA-Z0-9_-]+$/,
  "Must be in format kind:pubkey:d-identifier"
);
var hexString = z.string().regex(/^[0-9a-f]{64}$/, "Must be a 64-character hex string");
var iso4217Currency = z.string().regex(/^[A-Z]{3}$/, "Must be an ISO 4217 currency code");
var iso3166Country = z.string().regex(/^[A-Z]{2}$/, {
  message: "Must be an ISO 3166-1 Alpha-2 country code"
});
var iso3166Region = z.string().regex(/^[A-Z]{2}-[A-Z0-9]{1,3}$/, {
  message: "Must be an ISO 3166-2 region code"
});
var iso8601Duration = z.enum(["H", "D", "W", "M", "Y"]);
var geohash = z.string().regex(/^[0-9a-z]{1,12}$/, "Must be a valid geohash");

// src/schemas/DirectMessage.ts
var CommunicationPubkeyTagSchema = z2.tuple([z2.literal("p"), hexString]);
var CommunicationSubjectTagSchema = z2.tuple([z2.literal("subject"), z2.string()]);
var GeneralCommunicationSchema = z2.object({
  kind: z2.literal(14),
  tags: z2.array(
    z2.union([
      // Required tags
      CommunicationPubkeyTagSchema,
      // Optional tags
      CommunicationSubjectTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "p");
    },
    {
      message: "Missing required tag: p"
    }
  ),
  content: z2.string()
});

// src/schemas/OrderSchema.ts
import { z as z3 } from "zod";
var ItemTagSchema = z3.tuple([
  z3.literal("item"),
  addressableFormat.refine((val) => val.startsWith("30402:"), {
    message: "Item reference must start with 30402:"
  }),
  z3.string().regex(/^[1-9]\d*$/, {
    message: "Must be a string containing a positive integer"
  })
  // Quantity
]);
var ShippingTagSchema = z3.tuple([
  z3.literal("shipping"),
  addressableFormat.refine((val) => val.startsWith("30406:"), {
    message: "Shipping reference must start with 30406:"
  })
]);
var ContactTagSchema = z3.union([
  z3.tuple([z3.literal("address"), z3.string()]),
  z3.tuple([z3.literal("phone"), z3.string()]),
  z3.tuple([z3.literal("email"), z3.string().email()])
]);
var OrderSchema = z3.object({
  kind: z3.literal(16),
  tags: z3.array(
    z3.union([
      // Required tags
      z3.tuple([z3.literal("p"), hexString]),
      // Merchant's public key
      z3.tuple([z3.literal("subject"), z3.string()]),
      // Human-friendly subject line for order information
      z3.tuple([z3.literal("type"), z3.literal("1")]),
      // Order Creation = type 1
      z3.tuple([z3.literal("order"), z3.string()]),
      // Unique order identifier
      z3.tuple([
        z3.literal("amount"),
        z3.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number")
      ]),
      ItemTagSchema,
      // Optional tags
      ShippingTagSchema,
      ContactTagSchema
    ])
  ).refine(
    (tags) => {
      const hasRequiredTags = tags.some((tag) => tag[0] === "p") && tags.some((tag) => tag[0] === "subject") && tags.some((tag) => tag[0] === "type" && tag[1] === "1") && tags.some((tag) => tag[0] === "order") && tags.some((tag) => tag[0] === "amount") && tags.some((tag) => tag[0] === "item");
      return hasRequiredTags;
    },
    {
      message: "Missing required tags: p, subject, type (1), order, amount, item"
    }
  ),
  content: z3.string()
});

// src/schemas/OrderStatusUpdateSchema.ts
import { z as z4 } from "zod";
var StatusUpdatePubkeyTagSchema = z4.tuple([z4.literal("p"), hexString]);
var StatusUpdateSubjectTagSchema = z4.tuple([z4.literal("subject"), z4.string()]);
var StatusUpdateTypeTagSchema = z4.tuple([z4.literal("type"), z4.literal("3")]);
var StatusUpdateOrderTagSchema = z4.tuple([z4.literal("order"), z4.string()]);
var StatusUpdateStatusTagSchema = z4.tuple([
  z4.literal("status"),
  z4.enum(["pending", "confirmed", "processing", "completed", "cancelled"])
]);
var OrderStatusUpdateSchema = z4.object({
  kind: z4.literal(16),
  tags: z4.array(
    z4.union([
      // Required tags
      StatusUpdatePubkeyTagSchema,
      StatusUpdateSubjectTagSchema,
      StatusUpdateTypeTagSchema,
      StatusUpdateOrderTagSchema,
      StatusUpdateStatusTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "p") && tags.some((tag) => tag[0] === "subject") && tags.some((tag) => tag[0] === "type" && tag[1] === "3") && tags.some((tag) => tag[0] === "order") && tags.some((tag) => tag[0] === "status");
    },
    {
      message: "Missing required tags: p, subject, type (3), order, status"
    }
  ),
  content: z4.string()
});

// src/schemas/PaymentRequestSchema.ts
import { z as z5 } from "zod";
var PaymentRequestPubkeyTagSchema = z5.tuple([z5.literal("p"), hexString]);
var PaymentRequestSubjectTagSchema = z5.tuple([z5.literal("subject"), z5.string()]);
var PaymentRequestTypeTagSchema = z5.tuple([z5.literal("type"), z5.literal("2")]);
var PaymentRequestOrderTagSchema = z5.tuple([z5.literal("order"), z5.string()]);
var PaymentRequestAmountTagSchema = z5.tuple([
  z5.literal("amount"),
  z5.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number")
]);
var PaymentMethodLightningTagSchema = z5.tuple([
  z5.literal("payment"),
  z5.literal("lightning"),
  z5.string()
  // bolt11-invoice or lud16
]);
var PaymentMethodBitcoinTagSchema = z5.tuple([
  z5.literal("payment"),
  z5.literal("bitcoin"),
  z5.string()
  // btc-address
]);
var PaymentMethodEcashTagSchema = z5.tuple([
  z5.literal("payment"),
  z5.literal("ecash"),
  z5.string()
  // cashu-req
]);
var PaymentMethodTagSchema = z5.union([
  PaymentMethodLightningTagSchema,
  PaymentMethodBitcoinTagSchema,
  PaymentMethodEcashTagSchema
]);
var PaymentRequestSchema = z5.object({
  kind: z5.literal(16),
  tags: z5.array(
    z5.union([
      // Required tags
      PaymentRequestPubkeyTagSchema,
      PaymentRequestSubjectTagSchema,
      PaymentRequestTypeTagSchema,
      PaymentRequestOrderTagSchema,
      PaymentRequestAmountTagSchema,
      // Optional tags
      PaymentMethodTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "p") && tags.some((tag) => tag[0] === "subject") && tags.some((tag) => tag[0] === "type" && tag[1] === "2") && tags.some((tag) => tag[0] === "order") && tags.some((tag) => tag[0] === "amount");
    },
    {
      message: "Missing required tags: p, subject, type (2), order, amount"
    }
  ),
  content: z5.string()
});

// src/schemas/ProductCollectionSchema.ts
import { z as z6 } from "zod";
var CollectionIdTagSchema = z6.tuple([z6.literal("d"), z6.string()]);
var CollectionTitleTagSchema = z6.tuple([z6.literal("title"), z6.string()]);
var CollectionProductReferenceTagSchema = z6.tuple([
  z6.literal("a"),
  addressableFormat.refine((val) => val.startsWith("30402:"), {
    message: "Product reference must start with 30402:"
  })
]);
var CollectionImageTagSchema = z6.tuple([
  z6.literal("image"),
  z6.string().url()
]);
var CollectionSummaryTagSchema = z6.tuple([
  z6.literal("summary"),
  z6.string()
]);
var CollectionLocationTagSchema = z6.tuple([
  z6.literal("location"),
  z6.string()
]);
var CollectionGeohashTagSchema = z6.tuple([
  z6.literal("g"),
  geohash
]);
var CollectionShippingOptionTagSchema = z6.tuple([
  z6.literal("shipping_option"),
  addressableFormat.refine((val) => val.startsWith("30406:"), {
    message: "Shipping option reference must start with 30406:"
  })
]);
var ProductCollectionSchema = z6.object({
  kind: z6.literal(30405),
  created_at: z6.number().int().positive(),
  content: z6.string(),
  tags: z6.array(
    z6.union([
      // Required tags
      CollectionIdTagSchema,
      CollectionTitleTagSchema,
      CollectionProductReferenceTagSchema,
      // Optional tags
      CollectionImageTagSchema,
      CollectionSummaryTagSchema,
      CollectionLocationTagSchema,
      CollectionGeohashTagSchema,
      CollectionShippingOptionTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "d") && tags.some((tag) => tag[0] === "title") && tags.some((tag) => tag[0] === "a" && tag[1].startsWith("30402:"));
    },
    {
      message: "Missing required tags: d, title, and product reference (a)"
    }
  )
});

// src/schemas/ProductListingSchema.ts
import { z as z7 } from "zod";
var ProductIdTagSchema = z7.tuple([z7.literal("d"), z7.string()]);
var ProductTitleTagSchema = z7.tuple([z7.literal("title"), z7.string()]);
var ProductPriceTagSchema = z7.union([
  // Three-element array, sans-frequency
  z7.tuple([
    z7.literal("price"),
    z7.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
    iso4217Currency
  ]),
  // Three-element array, with frequency
  z7.tuple([
    z7.literal("price"),
    z7.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
    iso4217Currency,
    iso8601Duration.optional()
  ])
]);
var ProductTypeTagSchema = z7.tuple([
  z7.literal("type"),
  z7.enum(["simple", "variable", "variation"]),
  z7.enum(["digital", "physical"])
]);
var ProductVisibilityTagSchema = z7.tuple([
  z7.literal("visibility"),
  z7.enum(["hidden", "on-sale", "pre-order"])
]);
var ProductStockTagSchema = z7.tuple([
  z7.literal("stock"),
  z7.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number")
]);
var ProductSummaryTagSchema = z7.tuple([
  z7.literal("summary"),
  z7.string()
]);
var ProductSpecTagSchema = z7.tuple([
  z7.literal("spec"),
  z7.string(),
  // key
  z7.string()
  // value
]);
var ProductImageTagSchema = z7.union([
  z7.tuple([
    z7.literal("image"),
    z7.string().url()
  ]),
  z7.tuple([
    z7.literal("image"),
    z7.string().url(),
    z7.string()
  ]),
  z7.tuple([
    z7.literal("image"),
    z7.string().url(),
    z7.string(),
    z7.string().regex(/^\d+$/, "Must be an integer string (order)")
  ])
]);
var ProductWeightTagSchema = z7.tuple([
  z7.literal("weight"),
  z7.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
  // value
  z7.string()
  // unit
]);
var ProductDimensionsTagSchema = z7.tuple([
  z7.literal("dim"),
  z7.string().regex(/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/, "Must be in format LxWxH"),
  // dimensions
  z7.string()
  // unit
]);
var ProductLocationTagSchema = z7.tuple([
  z7.literal("location"),
  z7.string()
]);
var ProductGeohashTagSchema = z7.tuple([
  z7.literal("g"),
  geohash
]);
var ProductCategoryTagSchema = z7.tuple([
  z7.literal("t"),
  z7.string()
]);
var ProductReferenceTagSchema = z7.tuple([
  z7.literal("a"),
  addressableFormat.refine(
    (val) => val.startsWith("30402:") || val.startsWith("30405:"),
    {
      message: "Product reference must start with 30402: or 30405:"
    }
  )
]);
var ProductShippingOptionTagSchema = z7.union([
  z7.tuple([
    z7.literal("shipping_option"),
    addressableFormat.refine(
      (val) => val.startsWith("30406:") || val.startsWith("30405:"),
      { message: "Shipping option reference must start with 30406: or 30405:" }
    )
  ]),
  z7.tuple([
    z7.literal("shipping_option"),
    addressableFormat.refine(
      (val) => val.startsWith("30406:") || val.startsWith("30405:"),
      { message: "Shipping option reference must start with 30406: or 30405:" }
    ),
    z7.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number")
  ])
]);
var ProductListingSchema = z7.object({
  kind: z7.literal(30402),
  created_at: z7.number().int().positive(),
  content: z7.string(),
  tags: z7.array(
    z7.union([
      // Required tags
      ProductIdTagSchema,
      ProductTitleTagSchema,
      ProductPriceTagSchema,
      // Optional tags
      ProductTypeTagSchema,
      ProductVisibilityTagSchema,
      ProductStockTagSchema,
      ProductSummaryTagSchema,
      ProductSpecTagSchema,
      ProductImageTagSchema,
      ProductWeightTagSchema,
      ProductDimensionsTagSchema,
      ProductLocationTagSchema,
      ProductGeohashTagSchema,
      ProductCategoryTagSchema,
      ProductReferenceTagSchema,
      ProductShippingOptionTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "d") && tags.some((tag) => tag[0] === "title") && tags.some((tag) => tag[0] === "price");
    },
    {
      message: "Missing required tags: d, title, price"
    }
  )
});

// src/schemas/Receipt.ts
import { z as z8 } from "zod";
var PaymentReceiptPubkeyTagSchema = z8.tuple([z8.literal("p"), hexString]);
var PaymentReceiptSubjectTagSchema = z8.tuple([z8.literal("subject"), z8.string()]);
var PaymentReceiptOrderTagSchema = z8.tuple([z8.literal("order"), z8.string()]);
var PaymentReceiptAmountTagSchema = z8.tuple([
  z8.literal("amount"),
  z8.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number")
]);
var PaymentReceiptGenericPaymentTagSchema = z8.tuple([
  z8.literal("payment"),
  z8.string(),
  // medium
  z8.string(),
  // medium-reference
  z8.string()
  // proof
]);
var PaymentReceiptSchema = z8.object({
  kind: z8.literal(17),
  tags: z8.array(
    z8.union([
      // Required tags
      PaymentReceiptPubkeyTagSchema,
      PaymentReceiptSubjectTagSchema,
      PaymentReceiptOrderTagSchema,
      PaymentReceiptGenericPaymentTagSchema,
      PaymentReceiptAmountTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "p") && tags.some((tag) => tag[0] === "subject") && tags.some((tag) => tag[0] === "order") && tags.some((tag) => tag[0] === "payment") && tags.some((tag) => tag[0] === "amount");
    },
    {
      message: "Missing required tags: p, subject, order, payment, amount"
    }
  ),
  content: z8.string()
});

// src/schemas/Review.ts
import { z as z9 } from "zod";
var ReviewReferenceTagSchema = z9.tuple([
  z9.literal("d"),
  z9.string().regex(
    /^a:30402:[0-9a-f]{64}:[a-zA-Z0-9_-]+$/,
    "Must be in format a:30402:pubkey:d-identifier"
  )
]);
var ReviewPrimaryRatingTagSchema = z9.tuple([
  z9.literal("rating"),
  z9.string().regex(/^[01](\.\d+)?$/, "Must be a number between 0 and 1"),
  z9.literal("thumb")
]);
var ReviewCategoryRatingTagSchema = z9.tuple([
  z9.literal("rating"),
  z9.string().regex(/^[01](\.\d+)?$/, "Must be a number between 0 and 1"),
  z9.string()
  // category name
]);
var ProductReviewSchema = z9.object({
  kind: z9.literal(31555),
  created_at: z9.number().int().positive(),
  tags: z9.array(
    z9.union([
      // Required tags
      ReviewReferenceTagSchema,
      ReviewPrimaryRatingTagSchema,
      // Optional tags
      ReviewCategoryRatingTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "d") && tags.some((tag) => tag[0] === "rating" && tag[2] === "thumb");
    },
    {
      message: "Missing required tags: d (product reference), rating with thumb category"
    }
  ),
  content: z9.string()
});

// src/schemas/ShippingOptionSchema.ts
import { z as z10 } from "zod";
var ShippingIdTagSchema = z10.tuple([z10.literal("d"), z10.string()]);
var ShippingTitleTagSchema = z10.tuple([z10.literal("title"), z10.string()]);
var ShippingPriceTagSchema = z10.tuple([
  z10.literal("price"),
  z10.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
  iso4217Currency
]);
var ShippingCountryTagSchema = z10.union([
  z10.tuple([z10.literal("country"), iso3166Country]),
  z10.tuple([z10.literal("country"), iso3166Country, z10.array(iso3166Country)])
]);
var ShippingServiceTagSchema = z10.tuple([
  z10.literal("service"),
  z10.enum(["standard", "express", "overnight", "pickup"])
]);
var ShippingCarrierTagSchema = z10.tuple([
  z10.literal("carrier"),
  z10.string()
]);
var ShippingRegionTagSchema = z10.union([
  z10.tuple([z10.literal("region"), iso3166Region]),
  z10.tuple([z10.literal("region"), iso3166Region, z10.array(iso3166Region)])
]);
var ShippingDurationTagSchema = z10.tuple([
  z10.literal("duration"),
  z10.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number"),
  // min
  z10.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number"),
  // max
  iso8601Duration
  // unit
]);
var ShippingLocationTagSchema = z10.tuple([
  z10.literal("location"),
  z10.string()
]);
var ShippingGeohashTagSchema = z10.tuple([
  z10.literal("g"),
  geohash
]);
var ShippingWeightMinTagSchema = z10.tuple([
  z10.literal("weight-min"),
  z10.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
  z10.string()
  // unit
]);
var ShippingWeightMaxTagSchema = z10.tuple([
  z10.literal("weight-max"),
  z10.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
  z10.string()
  // unit
]);
var ShippingDimMinTagSchema = z10.tuple([
  z10.literal("dim-min"),
  z10.string().regex(/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/, "Must be in format LxWxH"),
  z10.string()
  // unit
]);
var ShippingDimMaxTagSchema = z10.tuple([
  z10.literal("dim-max"),
  z10.string().regex(/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/, "Must be in format LxWxH"),
  z10.string()
  // unit
]);
var ShippingPriceWeightTagSchema = z10.tuple([
  z10.literal("price-weight"),
  z10.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
  z10.string()
  // unit
]);
var ShippingPriceVolumeTagSchema = z10.tuple([
  z10.literal("price-volume"),
  z10.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
  z10.string()
  // unit
]);
var ShippingPriceDistanceTagSchema = z10.tuple([
  z10.literal("price-distance"),
  z10.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
  z10.string()
  // unit
]);
var ShippingOptionSchema = z10.object({
  kind: z10.literal(30406),
  created_at: z10.number().int().positive(),
  content: z10.string(),
  tags: z10.array(
    z10.union([
      // Required tags
      ShippingIdTagSchema,
      ShippingTitleTagSchema,
      ShippingPriceTagSchema,
      ShippingCountryTagSchema,
      ShippingServiceTagSchema,
      // Optional tags
      ShippingCarrierTagSchema,
      ShippingRegionTagSchema,
      ShippingDurationTagSchema,
      ShippingLocationTagSchema,
      ShippingGeohashTagSchema,
      ShippingWeightMinTagSchema,
      ShippingWeightMaxTagSchema,
      ShippingDimMinTagSchema,
      ShippingDimMaxTagSchema,
      ShippingPriceWeightTagSchema,
      ShippingPriceVolumeTagSchema,
      ShippingPriceDistanceTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "d") && tags.some((tag) => tag[0] === "title") && tags.some((tag) => tag[0] === "price") && tags.some((tag) => tag[0] === "country") && tags.some((tag) => tag[0] === "service");
    },
    {
      message: "Missing required tags: d, title, price, country, service"
    }
  )
});

// src/schemas/ShippingUpdateSchema.ts
import { z as z11 } from "zod";
var ShippingUpdatePubkeyTagSchema = z11.tuple([z11.literal("p"), hexString]);
var ShippingUpdateSubjectTagSchema = z11.tuple([z11.literal("subject"), z11.string()]);
var ShippingUpdateTypeTagSchema = z11.tuple([z11.literal("type"), z11.literal("4")]);
var ShippingUpdateOrderTagSchema = z11.tuple([z11.literal("order"), z11.string()]);
var ShippingUpdateStatusTagSchema = z11.tuple([
  z11.literal("status"),
  z11.enum(["processing", "shipped", "delivered", "exception"])
]);
var ShippingUpdateTrackingTagSchema = z11.tuple([
  z11.literal("tracking"),
  z11.string()
]);
var ShippingUpdateCarrierTagSchema = z11.tuple([
  z11.literal("carrier"),
  z11.string()
]);
var ShippingUpdateEtaTagSchema = z11.tuple([
  z11.literal("eta"),
  z11.string().regex(/^\d+$/, "Must be a unix timestamp")
]);
var ShippingUpdateSchema = z11.object({
  kind: z11.literal(16),
  tags: z11.array(
    z11.union([
      // Required tags
      ShippingUpdatePubkeyTagSchema,
      ShippingUpdateSubjectTagSchema,
      ShippingUpdateTypeTagSchema,
      ShippingUpdateOrderTagSchema,
      ShippingUpdateStatusTagSchema,
      // Optional tags
      ShippingUpdateTrackingTagSchema,
      ShippingUpdateCarrierTagSchema,
      ShippingUpdateEtaTagSchema
    ])
  ).refine(
    (tags) => {
      return tags.some((tag) => tag[0] === "p") && tags.some((tag) => tag[0] === "subject") && tags.some((tag) => tag[0] === "type" && tag[1] === "4") && tags.some((tag) => tag[0] === "order") && tags.some((tag) => tag[0] === "status");
    },
    {
      message: "Missing required tags: p, subject, type (4), order, status"
    }
  ),
  content: z11.string()
});

// src/schemas/index.ts
var validateProductListing = (data) => {
  return ProductListingSchema.safeParse(data);
};
var validateProductCollection = (data) => {
  return ProductCollectionSchema.safeParse(data);
};
var validateShippingOption = (data) => {
  return ShippingOptionSchema.safeParse(data);
};
var validateOrder = (data) => {
  return OrderSchema.safeParse(data);
};
var validatePaymentRequest = (data) => {
  return PaymentRequestSchema.safeParse(data);
};
var validateOrderStatusUpdate = (data) => {
  return OrderStatusUpdateSchema.safeParse(data);
};
var validateShippingUpdate = (data) => {
  return ShippingUpdateSchema.safeParse(data);
};
var validateGeneralCommunication = (data) => {
  return GeneralCommunicationSchema.safeParse(data);
};
var validatePaymentReceipt = (data) => {
  return PaymentReceiptSchema.safeParse(data);
};
var validateProductReview = (data) => {
  return ProductReviewSchema.safeParse(data);
};

// src/utils/ProductListingUtils.ts
import { v4 as uuidv4 } from "uuid";
var ProductListingUtils = {
  generateProductId: () => {
    return `product_id_${uuidv4().replace(/-/g, "")}`;
  },
  getProductId: (event) => {
    const idTag = event.tags.find((tag) => tag[0] === "d");
    return idTag && idTag[1] ? idTag[1] : null;
  },
  getProductTitle: (event) => {
    const titleTag = event.tags.find((tag) => tag[0] === "title");
    return titleTag && titleTag[1] ? titleTag[1] : null;
  },
  getProductPrice: (event) => {
    const priceTag = event.tags.find((tag) => tag[0] === "price");
    if (!priceTag || !priceTag[1] || !priceTag[2]) return null;
    return {
      amount: priceTag[1],
      currency: priceTag[2],
      frequency: priceTag[3]
    };
  },
  getProductImages: (event) => {
    return event.tags.filter((tag) => tag[0] === "image").map((tag) => ({
      url: tag[1],
      dimensions: tag.length >= 3 ? tag[2] : void 0,
      order: tag.length >= 4 ? parseInt(tag[3], 10) : void 0
    })).sort((a, b) => {
      if (a.order !== void 0 && b.order !== void 0) {
        return a.order - b.order;
      }
      if (a.order !== void 0) return -1;
      if (b.order !== void 0) return 1;
      return 0;
    });
  },
  getProductType: (event) => {
    const typeTag = event.tags.find((tag) => tag[0] === "type");
    if (!typeTag) return {};
    return {
      type: typeTag[1],
      physicalType: typeTag[2]
    };
  },
  getProductVisibility: (event) => {
    const visibilityTag = event.tags.find((tag) => tag[0] === "visibility");
    return visibilityTag && visibilityTag[1] ? visibilityTag[1] : null;
  },
  getProductStock: (event) => {
    const stockTag = event.tags.find((tag) => tag[0] === "stock");
    return stockTag && stockTag[1] ? parseInt(stockTag[1], 10) : null;
  },
  getProductSummary: (event) => {
    const summaryTag = event.tags.find((tag) => tag[0] === "summary");
    return summaryTag && summaryTag[1] ? summaryTag[1] : null;
  },
  getProductSpecs: (event) => {
    return event.tags.filter((tag) => tag[0] === "spec" && tag[1] && tag[2]).reduce((specs, tag) => {
      specs[tag[1]] = tag[2];
      return specs;
    }, {});
  },
  getProductWeight: (event) => {
    const weightTag = event.tags.find((tag) => tag[0] === "weight");
    if (!weightTag || !weightTag[1] || !weightTag[2]) return null;
    return {
      value: weightTag[1],
      unit: weightTag[2]
    };
  },
  getProductDimensions: (event) => {
    const dimTag = event.tags.find((tag) => tag[0] === "dim");
    if (!dimTag || !dimTag[1] || !dimTag[2]) return null;
    return {
      dimensions: dimTag[1],
      unit: dimTag[2]
    };
  },
  getProductCategories: (event) => {
    return event.tags.filter((tag) => tag[0] === "t").map((tag) => tag[1]);
  },
  getProductShippingOptions: (event) => {
    return event.tags.filter((tag) => tag[0] === "shipping_option").map(
      (tag) => tag.length > 2 ? { reference: tag[1] } : { reference: tag[1], extraCost: tag[2] }
    );
  },
  createProductTags: (data) => {
    const tags = [];
    tags.push(["d", data.id]);
    tags.push(["title", data.title]);
    tags.push([
      "price",
      data.price.amount,
      data.price.currency,
      ...data.price.frequency ? [data.price.frequency] : []
    ]);
    if (data.type) {
      tags.push(["type", data.type.type, data.type.physicalType]);
    }
    if (data.visibility) {
      tags.push(["visibility", data.visibility]);
    }
    if (data.stock !== void 0) {
      tags.push(["stock", data.stock.toString()]);
    }
    if (data.summary) {
      tags.push(["summary", data.summary]);
    }
    if (data.specs) {
      Object.entries(data.specs).forEach(([key, value]) => {
        tags.push(["spec", key, value]);
      });
    }
    if (data.images) {
      data.images.forEach((image) => {
        const imageTag = ["image", image.url];
        if (image.dimensions) imageTag.push(image.dimensions);
        if (image.order !== void 0) imageTag.push(image.order.toString());
        tags.push(imageTag.slice(0, 4));
      });
    }
    if (data.weight) {
      tags.push(["weight", data.weight.value, data.weight.unit]);
    }
    if (data.dimensions) {
      tags.push(["dim", data.dimensions.dimensions, data.dimensions.unit]);
    }
    if (data.categories) {
      data.categories.forEach((category) => {
        tags.push(["t", category]);
      });
    }
    if (data.shippingOptions) {
      data.shippingOptions.forEach((option) => {
        const optionsTag = ["shipping_option", option.reference];
        if (option.extraCost) optionsTag.push(option.extraCost);
        tags.push(optionsTag);
      });
    }
    return tags;
  }
};

// src/utils/OrderUtils.ts
import { v4 as uuidv42 } from "uuid";
var OrderUtils = {
  generateOrderId: () => {
    return `order_id_${uuidv42().replace(/-/g, "")}`;
  },
  getOrderId: (order) => {
    const orderTag = order.tags.find((tag) => tag[0] === "order");
    return orderTag && orderTag[1] ? orderTag[1] : null;
  },
  getOrderAmount: (order) => {
    const amountTag = order.tags.find((tag) => tag[0] === "amount");
    return amountTag && amountTag[1] ? amountTag[1] : null;
  },
  getOrderItems: (order) => {
    return order.tags.filter((tag) => tag[0] === "item").map((tag) => ({
      productRef: tag[1],
      quantity: parseInt(tag[2], 10)
    }));
  },
  getProductIdFromOrderItem: (orderItem) => {
    return orderItem.productRef.split(":")[2];
  },
  getPubkeyFromOrderItem: (orderItem) => {
    return orderItem.productRef.split(":")[1];
  },
  getOrderShipping: (order) => {
    const shippingTag = order.tags.find((tag) => tag[0] === "shipping");
    return shippingTag && shippingTag[1] ? shippingTag[1] : null;
  },
  getOrderContactDetails: (order) => {
    const details = {};
    const addressTag = order.tags.find((tag) => tag[0] === "address");
    if (addressTag && addressTag[1]) {
      details.address = addressTag[1];
    }
    const phoneTag = order.tags.find((tag) => tag[0] === "phone");
    if (phoneTag && phoneTag[1]) {
      details.phone = phoneTag[1];
    }
    const emailTag = order.tags.find((tag) => tag[0] === "email");
    if (emailTag && emailTag[1]) {
      details.email = emailTag[1];
    }
    return details;
  },
  getMerchantPubkey: (order) => {
    const pTag = order.tags.find((tag) => tag[0] === "p");
    return pTag && pTag[1] ? pTag[1] : null;
  },
  getOrderSubject: (order) => {
    const subjectTag = order.tags.find((tag) => tag[0] === "subject");
    return subjectTag && subjectTag[1] ? subjectTag[1] : null;
  },
  getOrderType: (order) => {
    const typeTag = order.tags.find((tag) => tag[0] === "type");
    return typeTag && typeTag[1] ? typeTag[1] : null;
  },
  createOrderTags: (data) => {
    const tags = [];
    tags.push(["p", data.merchantPubkey]);
    tags.push(["subject", data.subject]);
    tags.push(["type", "1"]);
    tags.push(["order", data.orderId]);
    tags.push(["amount", data.amount]);
    data.items.forEach((item) => {
      tags.push(["item", item.productRef, item.quantity.toString()]);
    });
    if (data.shipping) {
      tags.push(["shipping", data.shipping]);
    }
    if (data.contactDetails) {
      if (data.contactDetails.address) {
        tags.push(["address", data.contactDetails.address]);
      }
      if (data.contactDetails.phone) {
        tags.push(["phone", data.contactDetails.phone]);
      }
      if (data.contactDetails.email) {
        tags.push(["email", data.contactDetails.email]);
      }
    }
    return tags;
  },
  /**
  * Gets the order status text from an event
  */
  getOrderStatusText: (event) => {
    const statusTag = event.tags.find((tag) => tag[0] === "status");
    return statusTag && statusTag[1] ? statusTag[1] : "unknown";
  },
  /**
   * Gets the payment method from an event
   */
  getPaymentMethod: (event) => {
    const paymentTag = event.tags.find((tag) => tag[0] === "payment");
    if (paymentTag && paymentTag[1] && paymentTag[2]) {
      return {
        type: paymentTag[1],
        value: paymentTag[2]
      };
    }
    return null;
  },
  /**
   * Formats a timestamp into a human-readable date
   */
  formatOrderTime: (timestamp) => {
    const date = new Date(timestamp * 1e3);
    return date.toLocaleString();
  },
  /**
   * Gets shipping tracking info from a shipping update event
   */
  getTrackingInfo: (event) => {
    const trackingInfo = {};
    const trackingTag = event.tags.find((tag) => tag[0] === "tracking");
    if (trackingTag && trackingTag[1]) {
      trackingInfo.tracking = trackingTag[1];
    }
    const carrierTag = event.tags.find((tag) => tag[0] === "carrier");
    if (carrierTag && carrierTag[1]) {
      trackingInfo.carrier = carrierTag[1];
    }
    const etaTag = event.tags.find((tag) => tag[0] === "eta");
    if (etaTag && etaTag[1]) {
      const etaTimestamp = parseInt(etaTag[1], 10);
      if (!isNaN(etaTimestamp)) {
        trackingInfo.eta = new Date(etaTimestamp * 1e3);
      }
    }
    return trackingInfo;
  },
  /**
   * Formats satoshi amount with commas and unit
   */
  formatSats: (sats) => {
    if (!sats) return "0 sats";
    const numSats = parseInt(sats, 10);
    if (isNaN(numSats)) return "0 sats";
    return `${numSats.toLocaleString()} sats`;
  },
  /**
   * Gets a human-readable summary of the order
   */
  getOrderSummary: (event) => {
    try {
      if (event.tags.find((tag) => tag[0] === "type" && tag[1] === "1")) {
        const items = event.tags.filter((tag) => tag[0] === "item");
        return `Order with ${items.length} item${items.length !== 1 ? "s" : ""}`;
      }
      if (event.tags.find((tag) => tag[0] === "type" && tag[1] === "2")) {
        const amount = OrderUtils.getOrderAmount(event);
        return `Payment request for ${OrderUtils.formatSats(amount)}`;
      }
      if (event.tags.find((tag) => tag[0] === "type" && tag[1] === "3")) {
        const status = OrderUtils.getOrderStatusText(event);
        return `Status updated to: ${status}`;
      }
      if (event.tags.find((tag) => tag[0] === "type" && tag[1] === "4")) {
        const status = OrderUtils.getOrderStatusText(event);
        return `Shipping status: ${status}`;
      }
      if (event.kind === 17) {
        const amount = OrderUtils.getOrderAmount(event);
        return `Payment receipt for ${OrderUtils.formatSats(amount)}`;
      }
      return "Order notification";
    } catch (err) {
      console.error("Error generating order summary:", err);
      return "Order notification";
    }
  },
  parseAddressString(address) {
    let parsed = {};
    try {
      const json = JSON.parse(address);
      parsed = typeof json === "object" && json !== null ? json : {};
    } catch {
    }
    return {
      name: parsed.name ?? null,
      street1: parsed.street1 ?? null,
      street2: parsed.street2 ?? null,
      city: parsed.city ?? null,
      state: parsed.state ?? null,
      country: parsed.country ?? null,
      zip: parsed.zip ?? null,
      note: parsed.note ?? null
    };
  }
};

// src/utils/DirectMessageUtils.ts
import { NDKUser } from "@nostr-dev-kit/ndk";
var decryptNip17Message = async (ndk, event) => {
  try {
    const signer = ndk.signer;
    if (!signer) {
      console.error("No signer available for decryption");
      return null;
    }
    const seal = await signer.decrypt(new NDKUser({ pubkey: event.pubkey }), event.content);
    const sealJson = JSON.parse(seal);
    const rumor = await signer.decrypt(new NDKUser({ pubkey: sealJson.pubkey }), sealJson.content);
    const rumorJson = JSON.parse(rumor);
    return rumorJson;
  } catch (error) {
    console.error("[nostr-commerce-schema |> DirectMessageUtils |> decryptNip17Message]: Failed to decrypt NIP-17 message:", error);
    return null;
  }
};

// src/utils/ShippingOptionUtils.ts
var ShippingOptionUtils = {
  getShippingOptionId: (event) => {
    const idTag = event.tags.find((tag) => tag[0] === "d");
    return idTag && idTag[1] ? idTag[1] : null;
  },
  getShippingOptionTitle: (event) => {
    const titleTag = event.tags.find((tag) => tag[0] === "title");
    return titleTag && titleTag[1] ? titleTag[1] : null;
  },
  getShippingOptionCountries: (event) => {
    const countryTag = event.tags.find((tag) => tag[0] === "country");
    return Array.isArray(countryTag) && countryTag.length > 1 ? countryTag.slice(1) : [];
  },
  getShippingOptionPriceAmount: (event) => {
    const priceTag = event.tags.find((tag) => tag[0] === "price");
    return priceTag && priceTag[1] ? priceTag[1] : null;
  },
  getShippingOptionPriceCurrency: (event) => {
    const priceTag = event.tags.find((tag) => tag[0] === "price");
    return priceTag && priceTag[2] ? priceTag[2] : null;
  },
  getShippingOptionService: (event) => {
    const serviceTag = event.tags.find((tag) => tag[0] === "service");
    return serviceTag && serviceTag[1] ? serviceTag[1] : null;
  },
  fetchShippingOptionEvent: async (id, pubkey, ndk) => {
    try {
      return await new Promise((resolve, _) => {
        const subscription = ndk.subscribe({
          kinds: [30406],
          authors: [pubkey],
          "#d": [id],
          limit: 1
        });
        subscription.on("event", (event) => {
          resolve(event);
          subscription.stop();
        });
        setTimeout(() => {
          resolve(null);
          subscription.stop();
        }, 5e3);
      });
    } catch (error) {
      console.error("Failed to fetch referenced event:", error);
      return null;
    }
  }
};

// src/mocks/ProductListingMocks.ts
import { v4 as uuidv43 } from "uuid";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
var ProductListingMocks = {
  async generateEventsArray(number) {
    const results = [];
    for (let i = 0; i < number; i++) {
      const id = `product_id_${uuidv43().replace(/-/g, "")}`;
      const created_at = Math.floor(Date.now() / 1e3);
      const priceTag = [
        "price",
        productListingTemplate.price.amount,
        productListingTemplate.price.currency
      ];
      const imageTags = productListingTemplate.images.map((img) => {
        const tag = ["image", img.url];
        if (img.dimensions) tag.push(img.dimensions);
        if (img.order !== void 0) tag.push(img.order.toString());
        return tag;
      });
      const privkey = staticPrivateKeys[i % staticPrivateKeys.length];
      const signer = new NDKPrivateKeySigner(privkey);
      const event = new NDKEvent();
      event.kind = 30402;
      event.created_at = created_at;
      event.content = "";
      event.tags = [["d", id]];
      await event.sign(signer);
      const pubkey = (await signer.user()).pubkey;
      const dynamicShippingOption = [
        "shipping_option",
        `30406:${pubkey}:d-${id}`,
        "5.00"
      ];
      const tags = [
        ["d", id],
        ["title", productListingTemplate.title],
        priceTag,
        [
          "type",
          productListingTemplate.type.type,
          productListingTemplate.type.physicalType
        ],
        ["visibility", productListingTemplate.visibility],
        ["stock", productListingTemplate.stock.toString()],
        ["summary", productListingTemplate.summary],
        ...Object.entries(productListingTemplate.specs).map(([k, v]) => [
          "spec",
          k,
          v
        ]),
        ...imageTags,
        [
          "weight",
          productListingTemplate.weight.value,
          productListingTemplate.weight.unit
        ],
        [
          "dim",
          productListingTemplate.dimensions.dimensions,
          productListingTemplate.dimensions.unit
        ],
        ...productListingTemplate.categories.map((cat) => ["t", cat]),
        dynamicShippingOption
      ];
      event.tags = tags;
      const parsed = ProductListingSchema.safeParse({
        kind: event.kind,
        created_at: event.created_at,
        content: event.content,
        tags: event.tags
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
  }
};
var productListingTemplate = {
  title: "Synthdragon Sunglasses",
  price: { amount: "49.49", currency: "USD" },
  type: { type: "simple", physicalType: "physical" },
  visibility: "on-sale",
  stock: 50,
  summary: "A great product to use as an example.",
  specs: { material: "Moondust, Starglass, polyester", warranty: "200 years" },
  images: [
    { url: "https://example.com/image1.jpg", dimensions: "800x600", order: 0 },
    { url: "https://example.com/image2.jpg", dimensions: "800x600", order: 1 }
  ],
  weight: { value: "1.2", unit: "kg" },
  dimensions: { dimensions: "10.0x20.0x30.0", unit: "cm" },
  categories: ["example", "mock"]
};
var staticPrivateKeys = [
  "nsec1rd3g9m92vfhmwez7e979veql4hyrjf36kyhtqs3q83g30y9etjsq3z0dfh",
  "a7b78835cbb13b25cb442cf6e40ad33a020c96dff671700e8b5e7d94fac68d08",
  "dfb6d9013a454df96a307ec57c128c1dea068b3858fd95f2441694c5fdb34daa",
  "c5b4ec464b188828b1327d8ff17e90292392245f7d6fba62029eaf427748ed03"
];
var staticEvents = [
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
        "5.00"
      ]
    ]
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
        "5.00"
      ]
    ]
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
        "5.00"
      ]
    ]
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
        "5.00"
      ]
    ]
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
        "5.00"
      ]
    ]
  }
];
export {
  GeneralCommunicationSchema,
  OrderSchema,
  OrderStatusUpdateSchema,
  OrderUtils,
  PaymentReceiptSchema,
  PaymentRequestSchema,
  ProductCollectionSchema,
  ProductListingMocks,
  ProductListingSchema,
  ProductListingUtils,
  ProductReviewSchema,
  ShippingOptionSchema,
  ShippingOptionUtils,
  ShippingUpdateSchema,
  decryptNip17Message,
  validateGeneralCommunication,
  validateOrder,
  validateOrderStatusUpdate,
  validatePaymentReceipt,
  validatePaymentRequest,
  validateProductCollection,
  validateProductListing,
  validateProductReview,
  validateShippingOption,
  validateShippingUpdate
};
