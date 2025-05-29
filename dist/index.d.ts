import { z } from 'zod';
import NDK, { NostrEvent, NDKEvent } from '@nostr-dev-kit/ndk';

declare const GeneralCommunicationSchema: z.ZodObject<{
    kind: z.ZodLiteral<14>;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"p">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"subject">, z.ZodString], null>]>, "many">, (["p", string] | ["subject", string])[], (["p", string] | ["subject", string])[]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: 14;
    tags: (["p", string] | ["subject", string])[];
    content: string;
}, {
    kind: 14;
    tags: (["p", string] | ["subject", string])[];
    content: string;
}>;

declare const OrderSchema: z.ZodObject<{
    kind: z.ZodLiteral<16>;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"p">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"subject">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"type">, z.ZodLiteral<"1">], null>, z.ZodTuple<[z.ZodLiteral<"order">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"amount">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"item">, z.ZodEffects<z.ZodString, string, string>, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"shipping">, z.ZodEffects<z.ZodString, string, string>], null>, z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"address">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"phone">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"email">, z.ZodString], null>]>]>, "many">, (["p", string] | ["subject", string] | ["address", string] | ["phone", string] | ["email", string] | ["type", "1"] | ["order", string] | ["amount", string] | ["item", string, string] | ["shipping", string])[], (["p", string] | ["subject", string] | ["address", string] | ["phone", string] | ["email", string] | ["type", "1"] | ["order", string] | ["amount", string] | ["item", string, string] | ["shipping", string])[]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["address", string] | ["phone", string] | ["email", string] | ["type", "1"] | ["order", string] | ["amount", string] | ["item", string, string] | ["shipping", string])[];
    content: string;
}, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["address", string] | ["phone", string] | ["email", string] | ["type", "1"] | ["order", string] | ["amount", string] | ["item", string, string] | ["shipping", string])[];
    content: string;
}>;

declare const OrderStatusUpdateSchema: z.ZodObject<{
    kind: z.ZodLiteral<16>;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"p">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"subject">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"type">, z.ZodLiteral<"3">], null>, z.ZodTuple<[z.ZodLiteral<"order">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"status">, z.ZodEnum<["pending", "confirmed", "processing", "completed", "cancelled"]>], null>]>, "many">, (["p", string] | ["subject", string] | ["order", string] | ["type", "3"] | ["status", "pending" | "confirmed" | "processing" | "completed" | "cancelled"])[], (["p", string] | ["subject", string] | ["order", string] | ["type", "3"] | ["status", "pending" | "confirmed" | "processing" | "completed" | "cancelled"])[]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["type", "3"] | ["status", "pending" | "confirmed" | "processing" | "completed" | "cancelled"])[];
    content: string;
}, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["type", "3"] | ["status", "pending" | "confirmed" | "processing" | "completed" | "cancelled"])[];
    content: string;
}>;

declare const PaymentRequestSchema: z.ZodObject<{
    kind: z.ZodLiteral<16>;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"p">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"subject">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"type">, z.ZodLiteral<"2">], null>, z.ZodTuple<[z.ZodLiteral<"order">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"amount">, z.ZodString], null>, z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"payment">, z.ZodLiteral<"lightning">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"payment">, z.ZodLiteral<"bitcoin">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"payment">, z.ZodLiteral<"ecash">, z.ZodString], null>]>]>, "many">, (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", "lightning", string] | ["payment", "bitcoin", string] | ["payment", "ecash", string] | ["type", "2"])[], (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", "lightning", string] | ["payment", "bitcoin", string] | ["payment", "ecash", string] | ["type", "2"])[]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", "lightning", string] | ["payment", "bitcoin", string] | ["payment", "ecash", string] | ["type", "2"])[];
    content: string;
}, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", "lightning", string] | ["payment", "bitcoin", string] | ["payment", "ecash", string] | ["type", "2"])[];
    content: string;
}>;

declare const ProductCollectionSchema: z.ZodObject<{
    kind: z.ZodLiteral<30405>;
    created_at: z.ZodNumber;
    content: z.ZodString;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"d">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"title">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"a">, z.ZodEffects<z.ZodString, string, string>], null>, z.ZodTuple<[z.ZodLiteral<"image">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"summary">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"location">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"g">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"shipping_option">, z.ZodEffects<z.ZodString, string, string>], null>]>, "many">, (["d", string] | ["title", string] | ["a", string] | ["image", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string])[], (["d", string] | ["title", string] | ["a", string] | ["image", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string])[]>;
}, "strip", z.ZodTypeAny, {
    kind: 30405;
    tags: (["d", string] | ["title", string] | ["a", string] | ["image", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string])[];
    content: string;
    created_at: number;
}, {
    kind: 30405;
    tags: (["d", string] | ["title", string] | ["a", string] | ["image", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string])[];
    content: string;
    created_at: number;
}>;

declare const ProductListingSchema: z.ZodObject<{
    kind: z.ZodLiteral<30402>;
    created_at: z.ZodNumber;
    content: z.ZodString;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"d">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"title">, z.ZodString], null>, z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"price">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"price">, z.ZodString, z.ZodString, z.ZodOptional<z.ZodEnum<["H", "D", "W", "M", "Y"]>>], null>]>, z.ZodTuple<[z.ZodLiteral<"type">, z.ZodEnum<["simple", "variable", "variation"]>, z.ZodEnum<["digital", "physical"]>], null>, z.ZodTuple<[z.ZodLiteral<"visibility">, z.ZodEnum<["hidden", "on-sale", "pre-order"]>], null>, z.ZodTuple<[z.ZodLiteral<"stock">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"summary">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"spec">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"image">, z.ZodString, z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodString>], null>, z.ZodTuple<[z.ZodLiteral<"weight">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"dim">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"location">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"g">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"t">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"a">, z.ZodEffects<z.ZodString, string, string>], null>, z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"shipping_option">, z.ZodEffects<z.ZodString, string, string>], null>, z.ZodTuple<[z.ZodLiteral<"shipping_option">, z.ZodEffects<z.ZodString, string, string>, z.ZodString], null>]>]>, "many">, (["d", string] | ["title", string] | ["a", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string] | ["price", string, string] | ["price", string, string, "H" | "D" | "W" | "M" | "Y" | undefined] | ["shipping_option", string, string] | ["type", "simple" | "variable" | "variation", "digital" | "physical"] | ["visibility", "hidden" | "on-sale" | "pre-order"] | ["stock", string] | ["spec", string, string] | ["image", string, string | undefined, string | undefined] | ["weight", string, string] | ["dim", string, string] | ["t", string])[], (["d", string] | ["title", string] | ["a", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string] | ["price", string, string] | ["price", string, string, "H" | "D" | "W" | "M" | "Y" | undefined] | ["shipping_option", string, string] | ["type", "simple" | "variable" | "variation", "digital" | "physical"] | ["visibility", "hidden" | "on-sale" | "pre-order"] | ["stock", string] | ["spec", string, string] | ["image", string, string | undefined, string | undefined] | ["weight", string, string] | ["dim", string, string] | ["t", string])[]>;
}, "strip", z.ZodTypeAny, {
    kind: 30402;
    tags: (["d", string] | ["title", string] | ["a", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string] | ["price", string, string] | ["price", string, string, "H" | "D" | "W" | "M" | "Y" | undefined] | ["shipping_option", string, string] | ["type", "simple" | "variable" | "variation", "digital" | "physical"] | ["visibility", "hidden" | "on-sale" | "pre-order"] | ["stock", string] | ["spec", string, string] | ["image", string, string | undefined, string | undefined] | ["weight", string, string] | ["dim", string, string] | ["t", string])[];
    content: string;
    created_at: number;
}, {
    kind: 30402;
    tags: (["d", string] | ["title", string] | ["a", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string] | ["price", string, string] | ["price", string, string, "H" | "D" | "W" | "M" | "Y" | undefined] | ["shipping_option", string, string] | ["type", "simple" | "variable" | "variation", "digital" | "physical"] | ["visibility", "hidden" | "on-sale" | "pre-order"] | ["stock", string] | ["spec", string, string] | ["image", string, string | undefined, string | undefined] | ["weight", string, string] | ["dim", string, string] | ["t", string])[];
    content: string;
    created_at: number;
}>;

declare const PaymentReceiptSchema: z.ZodObject<{
    kind: z.ZodLiteral<17>;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"p">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"subject">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"order">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"payment">, z.ZodString, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"amount">, z.ZodString], null>]>, "many">, (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", string, string, string])[], (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", string, string, string])[]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: 17;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", string, string, string])[];
    content: string;
}, {
    kind: 17;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", string, string, string])[];
    content: string;
}>;

declare const ProductReviewSchema: z.ZodObject<{
    kind: z.ZodLiteral<31555>;
    created_at: z.ZodNumber;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"d">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"rating">, z.ZodString, z.ZodLiteral<"thumb">], null>, z.ZodTuple<[z.ZodLiteral<"rating">, z.ZodString, z.ZodString], null>]>, "many">, (["d", string] | ["rating", string, "thumb"] | ["rating", string, string])[], (["d", string] | ["rating", string, "thumb"] | ["rating", string, string])[]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: 31555;
    tags: (["d", string] | ["rating", string, "thumb"] | ["rating", string, string])[];
    content: string;
    created_at: number;
}, {
    kind: 31555;
    tags: (["d", string] | ["rating", string, "thumb"] | ["rating", string, string])[];
    content: string;
    created_at: number;
}>;

declare const ShippingOptionSchema: z.ZodObject<{
    kind: z.ZodLiteral<30406>;
    created_at: z.ZodNumber;
    content: z.ZodString;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"d">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"title">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"price">, z.ZodString, z.ZodString], null>, z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"country">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"country">, z.ZodString, z.ZodArray<z.ZodString, "many">], null>]>, z.ZodTuple<[z.ZodLiteral<"service">, z.ZodEnum<["standard", "express", "overnight", "pickup"]>], null>, z.ZodTuple<[z.ZodLiteral<"carrier">, z.ZodString], null>, z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"region">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"region">, z.ZodString, z.ZodArray<z.ZodString, "many">], null>]>, z.ZodTuple<[z.ZodLiteral<"duration">, z.ZodString, z.ZodString, z.ZodEnum<["H", "D", "W", "M", "Y"]>], null>, z.ZodTuple<[z.ZodLiteral<"location">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"g">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"weight-min">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"weight-max">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"dim-min">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"dim-max">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"price-weight">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"price-volume">, z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"price-distance">, z.ZodString, z.ZodString], null>]>, "many">, (["d", string] | ["title", string] | ["location", string] | ["g", string] | ["price", string, string] | ["country", string] | ["country", string, string[]] | ["region", string] | ["region", string, string[]] | ["service", "standard" | "express" | "overnight" | "pickup"] | ["carrier", string] | ["duration", string, string, "H" | "D" | "W" | "M" | "Y"] | ["weight-min", string, string] | ["weight-max", string, string] | ["dim-min", string, string] | ["dim-max", string, string] | ["price-weight", string, string] | ["price-volume", string, string] | ["price-distance", string, string])[], (["d", string] | ["title", string] | ["location", string] | ["g", string] | ["price", string, string] | ["country", string] | ["country", string, string[]] | ["region", string] | ["region", string, string[]] | ["service", "standard" | "express" | "overnight" | "pickup"] | ["carrier", string] | ["duration", string, string, "H" | "D" | "W" | "M" | "Y"] | ["weight-min", string, string] | ["weight-max", string, string] | ["dim-min", string, string] | ["dim-max", string, string] | ["price-weight", string, string] | ["price-volume", string, string] | ["price-distance", string, string])[]>;
}, "strip", z.ZodTypeAny, {
    kind: 30406;
    tags: (["d", string] | ["title", string] | ["location", string] | ["g", string] | ["price", string, string] | ["country", string] | ["country", string, string[]] | ["region", string] | ["region", string, string[]] | ["service", "standard" | "express" | "overnight" | "pickup"] | ["carrier", string] | ["duration", string, string, "H" | "D" | "W" | "M" | "Y"] | ["weight-min", string, string] | ["weight-max", string, string] | ["dim-min", string, string] | ["dim-max", string, string] | ["price-weight", string, string] | ["price-volume", string, string] | ["price-distance", string, string])[];
    content: string;
    created_at: number;
}, {
    kind: 30406;
    tags: (["d", string] | ["title", string] | ["location", string] | ["g", string] | ["price", string, string] | ["country", string] | ["country", string, string[]] | ["region", string] | ["region", string, string[]] | ["service", "standard" | "express" | "overnight" | "pickup"] | ["carrier", string] | ["duration", string, string, "H" | "D" | "W" | "M" | "Y"] | ["weight-min", string, string] | ["weight-max", string, string] | ["dim-min", string, string] | ["dim-max", string, string] | ["price-weight", string, string] | ["price-volume", string, string] | ["price-distance", string, string])[];
    content: string;
    created_at: number;
}>;

declare const ShippingUpdateSchema: z.ZodObject<{
    kind: z.ZodLiteral<16>;
    tags: z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodTuple<[z.ZodLiteral<"p">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"subject">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"type">, z.ZodLiteral<"4">], null>, z.ZodTuple<[z.ZodLiteral<"order">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"status">, z.ZodEnum<["processing", "shipped", "delivered", "exception"]>], null>, z.ZodTuple<[z.ZodLiteral<"tracking">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"carrier">, z.ZodString], null>, z.ZodTuple<[z.ZodLiteral<"eta">, z.ZodString], null>]>, "many">, (["p", string] | ["subject", string] | ["order", string] | ["carrier", string] | ["type", "4"] | ["status", "processing" | "shipped" | "delivered" | "exception"] | ["tracking", string] | ["eta", string])[], (["p", string] | ["subject", string] | ["order", string] | ["carrier", string] | ["type", "4"] | ["status", "processing" | "shipped" | "delivered" | "exception"] | ["tracking", string] | ["eta", string])[]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["carrier", string] | ["type", "4"] | ["status", "processing" | "shipped" | "delivered" | "exception"] | ["tracking", string] | ["eta", string])[];
    content: string;
}, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["carrier", string] | ["type", "4"] | ["status", "processing" | "shipped" | "delivered" | "exception"] | ["tracking", string] | ["eta", string])[];
    content: string;
}>;

type ProductListing = z.infer<typeof ProductListingSchema>;
type ProductCollection = z.infer<typeof ProductCollectionSchema>;
type ShippingOption = z.infer<typeof ShippingOptionSchema>;
type Order = z.infer<typeof OrderSchema>;
type PaymentRequest = z.infer<typeof PaymentRequestSchema>;
type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>;
type ShippingUpdate = z.infer<typeof ShippingUpdateSchema>;
type GeneralCommunication = z.infer<typeof GeneralCommunicationSchema>;
type PaymentReceipt = z.infer<typeof PaymentReceiptSchema>;
type ProductReview = z.infer<typeof ProductReviewSchema>;
type OrderAddress = {
    name: string | null;
    street1: string | null;
    street2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zip: string | null;
    note: string | null;
};
declare const validateProductListing: (data: unknown) => z.SafeParseReturnType<{
    kind: 30402;
    tags: (["d", string] | ["title", string] | ["a", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string] | ["price", string, string] | ["price", string, string, "H" | "D" | "W" | "M" | "Y" | undefined] | ["shipping_option", string, string] | ["type", "simple" | "variable" | "variation", "digital" | "physical"] | ["visibility", "hidden" | "on-sale" | "pre-order"] | ["stock", string] | ["spec", string, string] | ["image", string, string | undefined, string | undefined] | ["weight", string, string] | ["dim", string, string] | ["t", string])[];
    content: string;
    created_at: number;
}, {
    kind: 30402;
    tags: (["d", string] | ["title", string] | ["a", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string] | ["price", string, string] | ["price", string, string, "H" | "D" | "W" | "M" | "Y" | undefined] | ["shipping_option", string, string] | ["type", "simple" | "variable" | "variation", "digital" | "physical"] | ["visibility", "hidden" | "on-sale" | "pre-order"] | ["stock", string] | ["spec", string, string] | ["image", string, string | undefined, string | undefined] | ["weight", string, string] | ["dim", string, string] | ["t", string])[];
    content: string;
    created_at: number;
}>;
declare const validateProductCollection: (data: unknown) => z.SafeParseReturnType<{
    kind: 30405;
    tags: (["d", string] | ["title", string] | ["a", string] | ["image", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string])[];
    content: string;
    created_at: number;
}, {
    kind: 30405;
    tags: (["d", string] | ["title", string] | ["a", string] | ["image", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string])[];
    content: string;
    created_at: number;
}>;
declare const validateShippingOption: (data: unknown) => z.SafeParseReturnType<{
    kind: 30406;
    tags: (["d", string] | ["title", string] | ["location", string] | ["g", string] | ["price", string, string] | ["country", string] | ["country", string, string[]] | ["region", string] | ["region", string, string[]] | ["service", "standard" | "express" | "overnight" | "pickup"] | ["carrier", string] | ["duration", string, string, "H" | "D" | "W" | "M" | "Y"] | ["weight-min", string, string] | ["weight-max", string, string] | ["dim-min", string, string] | ["dim-max", string, string] | ["price-weight", string, string] | ["price-volume", string, string] | ["price-distance", string, string])[];
    content: string;
    created_at: number;
}, {
    kind: 30406;
    tags: (["d", string] | ["title", string] | ["location", string] | ["g", string] | ["price", string, string] | ["country", string] | ["country", string, string[]] | ["region", string] | ["region", string, string[]] | ["service", "standard" | "express" | "overnight" | "pickup"] | ["carrier", string] | ["duration", string, string, "H" | "D" | "W" | "M" | "Y"] | ["weight-min", string, string] | ["weight-max", string, string] | ["dim-min", string, string] | ["dim-max", string, string] | ["price-weight", string, string] | ["price-volume", string, string] | ["price-distance", string, string])[];
    content: string;
    created_at: number;
}>;
declare const validateOrder: (data: unknown) => z.SafeParseReturnType<{
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["address", string] | ["phone", string] | ["email", string] | ["type", "1"] | ["order", string] | ["amount", string] | ["item", string, string] | ["shipping", string])[];
    content: string;
}, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["address", string] | ["phone", string] | ["email", string] | ["type", "1"] | ["order", string] | ["amount", string] | ["item", string, string] | ["shipping", string])[];
    content: string;
}>;
declare const validatePaymentRequest: (data: unknown) => z.SafeParseReturnType<{
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", "lightning", string] | ["payment", "bitcoin", string] | ["payment", "ecash", string] | ["type", "2"])[];
    content: string;
}, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", "lightning", string] | ["payment", "bitcoin", string] | ["payment", "ecash", string] | ["type", "2"])[];
    content: string;
}>;
declare const validateOrderStatusUpdate: (data: unknown) => z.SafeParseReturnType<{
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["type", "3"] | ["status", "pending" | "confirmed" | "processing" | "completed" | "cancelled"])[];
    content: string;
}, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["type", "3"] | ["status", "pending" | "confirmed" | "processing" | "completed" | "cancelled"])[];
    content: string;
}>;
declare const validateShippingUpdate: (data: unknown) => z.SafeParseReturnType<{
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["carrier", string] | ["type", "4"] | ["status", "processing" | "shipped" | "delivered" | "exception"] | ["tracking", string] | ["eta", string])[];
    content: string;
}, {
    kind: 16;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["carrier", string] | ["type", "4"] | ["status", "processing" | "shipped" | "delivered" | "exception"] | ["tracking", string] | ["eta", string])[];
    content: string;
}>;
declare const validateGeneralCommunication: (data: unknown) => z.SafeParseReturnType<{
    kind: 14;
    tags: (["p", string] | ["subject", string])[];
    content: string;
}, {
    kind: 14;
    tags: (["p", string] | ["subject", string])[];
    content: string;
}>;
declare const validatePaymentReceipt: (data: unknown) => z.SafeParseReturnType<{
    kind: 17;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", string, string, string])[];
    content: string;
}, {
    kind: 17;
    tags: (["p", string] | ["subject", string] | ["order", string] | ["amount", string] | ["payment", string, string, string])[];
    content: string;
}>;
declare const validateProductReview: (data: unknown) => z.SafeParseReturnType<{
    kind: 31555;
    tags: (["d", string] | ["rating", string, "thumb"] | ["rating", string, string])[];
    content: string;
    created_at: number;
}, {
    kind: 31555;
    tags: (["d", string] | ["rating", string, "thumb"] | ["rating", string, string])[];
    content: string;
    created_at: number;
}>;

declare const ProductListingUtils: {
    generateProductId: () => string;
    getProductId: (event: ProductListing) => string | null;
    getProductTitle: (event: ProductListing) => string | null;
    getProductPrice: (event: ProductListing) => {
        amount: string;
        currency: string;
        frequency?: string;
    } | null;
    getProductImages: (event: ProductListing) => Array<{
        url: string;
        dimensions?: string;
        order?: number;
    }>;
    getProductType: (event: ProductListing) => {
        type?: "simple" | "variable" | "variation";
        physicalType?: "digital" | "physical";
    };
    getProductVisibility: (event: ProductListing) => "hidden" | "on-sale" | "pre-order" | null;
    getProductStock: (event: ProductListing) => number | null;
    getProductSummary: (event: ProductListing) => string | null;
    getProductSpecs: (event: ProductListing) => Record<string, string>;
    getProductWeight: (event: ProductListing) => {
        value: string;
        unit: string;
    } | null;
    getProductDimensions: (event: ProductListing) => {
        dimensions: string;
        unit: string;
    } | null;
    getProductCategories: (event: ProductListing) => string[];
    getProductShippingOptions: (event: ProductListing) => {
        reference: string;
        extraCost?: string;
    }[];
    createProductTags: (data: {
        id: string;
        title: string;
        price: {
            amount: string;
            currency: string;
            frequency?: string;
        };
        type?: {
            type: "simple" | "variable" | "variation";
            physicalType: "digital" | "physical";
        };
        visibility?: "hidden" | "on-sale" | "pre-order";
        stock?: number;
        summary?: string;
        specs?: Record<string, string>;
        images?: Array<{
            url: string;
            dimensions?: string;
            order?: number;
        }>;
        weight?: {
            value: string;
            unit: string;
        };
        dimensions?: {
            dimensions: string;
            unit: string;
        };
        categories?: string[];
        shippingOptions?: {
            reference: string;
            extraCost?: string;
        }[];
    }) => string[][];
};

declare const OrderUtils: {
    generateOrderId: () => string;
    getOrderId: (order: Order) => string | null;
    getOrderAmount: (order: Order) => string | null;
    getOrderItems: (order: Order) => Array<{
        productRef: string;
        quantity: number;
    }>;
    getProductIdFromOrderItem: (orderItem: {
        productRef: string;
        quantity: number;
    }) => string;
    getPubkeyFromOrderItem: (orderItem: {
        productRef: string;
        quantity: number;
    }) => string;
    getOrderShipping: (order: Order) => string | null;
    getOrderContactDetails: (order: Order) => {
        address?: string;
        phone?: string;
        email?: string;
    };
    getMerchantPubkey: (order: Order) => string | null;
    getOrderSubject: (order: Order) => string | null;
    getOrderType: (order: Order) => string | null;
    createOrderTags: (data: {
        merchantPubkey: string;
        subject: string;
        orderId: string;
        amount: string;
        items: Array<{
            productRef: string;
            quantity: number;
        }>;
        shipping?: string;
        contactDetails?: {
            address?: string;
            phone?: string;
            email?: string;
        };
    }) => string[][];
    /**
 * Gets the order status text from an event
 */
    getOrderStatusText: (event: NostrEvent) => string;
    /**
     * Gets the payment method from an event
     */
    getPaymentMethod: (event: NostrEvent) => {
        type: string;
        value: string;
    } | null;
    /**
     * Formats a timestamp into a human-readable date
     */
    formatOrderTime: (timestamp: number) => string;
    /**
     * Gets shipping tracking info from a shipping update event
     */
    getTrackingInfo: (event: NostrEvent) => {
        tracking?: string;
        carrier?: string;
        eta?: Date;
    };
    /**
     * Formats satoshi amount with commas and unit
     */
    formatSats: (sats: string | null) => string;
    /**
     * Gets a human-readable summary of the order
     */
    getOrderSummary: (event: NostrEvent) => string;
    parseAddressString(address: string): OrderAddress;
};

/**
 * Decrypts a NIP-17 direct message using the double decryption pattern
 *
 * @param ndk The NDK instance to use for decryption. MUST have a valid signer
 * @param event The encrypted Nostr event
 * @returns The decrypted event or null if decryption fails
 */
declare const decryptNip17Message: (ndk: NDK, event: NostrEvent) => Promise<NostrEvent | null>;

declare const ShippingOptionUtils: {
    getShippingOptionId: (event: ShippingOption) => string | null;
    getShippingOptionTitle: (event: ShippingOption) => string | null;
    getShippingOptionCountries: (event: ShippingOption) => string[];
    getShippingOptionPriceAmount: (event: ShippingOption) => string | null;
    getShippingOptionPriceCurrency: (event: ShippingOption) => string | null;
    getShippingOptionService: (event: ShippingOption) => string | null;
    fetchShippingOptionEvent: (id: string, pubkey: string, ndk: NDK) => Promise<NDKEvent | null>;
};

declare const ProductListingMocks: {
    generateEventsArray(number: number): Promise<{
        kind: 30402;
        tags: (["d", string] | ["title", string] | ["a", string] | ["summary", string] | ["location", string] | ["g", string] | ["shipping_option", string] | ["price", string, string] | ["price", string, string, "H" | "D" | "W" | "M" | "Y" | undefined] | ["shipping_option", string, string] | ["type", "simple" | "variable" | "variation", "digital" | "physical"] | ["visibility", "hidden" | "on-sale" | "pre-order"] | ["stock", string] | ["spec", string, string] | ["image", string, string | undefined, string | undefined] | ["weight", string, string] | ["dim", string, string] | ["t", string])[];
        content: string;
        created_at: number;
    }[]>;
    getTemplate(): {
        title: string;
        price: {
            amount: string;
            currency: string;
        };
        type: {
            type: string;
            physicalType: string;
        };
        visibility: string;
        stock: number;
        summary: string;
        specs: {
            material: string;
            warranty: string;
        };
        images: {
            url: string;
            dimensions: string;
            order: number;
        }[];
        weight: {
            value: string;
            unit: string;
        };
        dimensions: {
            dimensions: string;
            unit: string;
        };
        categories: string[];
    };
    getPrivateKeys(): string[];
    getEventsArray(): {
        kind: number;
        created_at: number;
        content: string;
        tags: string[][];
    }[];
};

export { type GeneralCommunication, GeneralCommunicationSchema, type Order, type OrderAddress, OrderSchema, type OrderStatusUpdate, OrderStatusUpdateSchema, OrderUtils, type PaymentReceipt, PaymentReceiptSchema, type PaymentRequest, PaymentRequestSchema, type ProductCollection, ProductCollectionSchema, type ProductListing, ProductListingMocks, ProductListingSchema, ProductListingUtils, type ProductReview, ProductReviewSchema, type ShippingOption, ShippingOptionSchema, ShippingOptionUtils, type ShippingUpdate, ShippingUpdateSchema, decryptNip17Message, validateGeneralCommunication, validateOrder, validateOrderStatusUpdate, validatePaymentReceipt, validatePaymentRequest, validateProductCollection, validateProductListing, validateProductReview, validateShippingOption, validateShippingUpdate };
