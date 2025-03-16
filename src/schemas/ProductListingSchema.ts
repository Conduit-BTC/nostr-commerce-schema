import { z } from "zod";
import { addressableFormat, iso4217Currency, iso8601Duration } from "./commonSchemas";
import { geohash } from "./commonSchemas";

// ===============================
// Product Listing (Kind: 30402)
// ===============================

// Required Tags
const ProductIdTagSchema = z.tuple([z.literal("d"), z.string()]);
const ProductTitleTagSchema = z.tuple([z.literal("title"), z.string()]);

// Price tag with optional frequency
const ProductPriceTagSchema = z.union([
    // Three-element array, sans-frequency
    z.tuple([
        z.literal("price"),
        z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
        iso4217Currency,
    ]),
    // Three-element array, with frequency
    z.tuple([
        z.literal("price"),
        z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"),
        iso4217Currency,
        iso8601Duration.optional()
    ])
]);

// Optional Tags
const ProductTypeTagSchema = z.tuple([
    z.literal("type"),
    z.enum(["simple", "variable", "variation"]),
    z.enum(["digital", "physical"])
]);

const ProductVisibilityTagSchema = z.tuple([
    z.literal("visibility"),
    z.enum(["hidden", "on-sale", "pre-order"])
]);

const ProductStockTagSchema = z.tuple([
    z.literal("stock"),
    z.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number")]);

const ProductSummaryTagSchema = z.tuple([
    z.literal("summary"),
    z.string()
]);

const ProductSpecTagSchema = z.tuple([
    z.literal("spec"),
    z.string(), // key
    z.string() // value
]);

const ProductImageTagSchema = z.tuple([
    z.literal("image"),
    z.string().url(), // URL
    z.string().optional(), // Optional dimensions
    z.string().regex(/^\d+(\.\d+)?$/, "Must be a string-wrapped number").optional() // Optional sorting order
]);

const ProductWeightTagSchema = z.tuple([
    z.literal("weight"),
    z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number"), // value
    z.string() // unit
]);

const ProductDimensionsTagSchema = z.tuple([
    z.literal("dim"),
    z.string().regex(/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/, "Must be in format LxWxH"), // dimensions
    z.string() // unit
]);

const ProductLocationTagSchema = z.tuple([
    z.literal("location"),
    z.string()
]);

const ProductGeohashTagSchema = z.tuple([
    z.literal("g"),
    geohash
]);

const ProductCategoryTagSchema = z.tuple([
    z.literal("t"),
    z.string()
]);

const ProductReferenceTagSchema = z.tuple([
    z.literal("a"),
    addressableFormat.refine(
        val => val.startsWith("30402:") || val.startsWith("30405:"),
        {
            message: "Product reference must start with 30402: or 30405:"
        }
    )
]);

const ProductShippingOptionTagSchema = z.tuple([
    z.literal("shipping_option"),
    addressableFormat.refine(
        val => val.startsWith("30406:") || val.startsWith("30405:"),
        {
            message: "Shipping option reference must start with 30406: or 30405:"
        }
    ),
    z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid decimal number").optional() // Optional extra cost
]);

// Complete Product Listing Schema
export const ProductListingSchema = z.object({
    kind: z.literal(30402),
    created_at: z.number().int().positive(),
    content: z.string(),
    tags: z.array(
        z.union([
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
            // Verify required tags are present
            return tags.some(tag => tag[0] === "d") &&
                tags.some(tag => tag[0] === "title") &&
                tags.some(tag => tag[0] === "price");
        },
        {
            message: "Missing required tags: d, title, price"
        }
    )
});
