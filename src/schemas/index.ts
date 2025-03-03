import { z } from "zod";
import { GeneralCommunicationSchema } from "./DirectMessage";
import { OrderSchema } from "./OrderSchema";
import { OrderStatusUpdateSchema } from "./OrderStatusUpdateSchema";
import { PaymentRequestSchema } from "./PaymentRequestSchema";
import { ProductCollectionSchema } from "./ProductCollectionSchema";
import { ProductListingSchema } from "./ProductListingSchema";
import { PaymentReceiptSchema } from "./Receipt";
import { ProductReviewSchema } from "./Review";
import { ShippingOptionSchema } from "./ShippingOptionSchema";
import { ShippingUpdateSchema } from "./ShippingUpdateSchema";

// Helper types for TypeScript
export type ProductListing = z.infer<typeof ProductListingSchema>;
export type ProductCollection = z.infer<typeof ProductCollectionSchema>;
export type ShippingOption = z.infer<typeof ShippingOptionSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;
export type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>;
export type ShippingUpdate = z.infer<typeof ShippingUpdateSchema>;
export type GeneralCommunication = z.infer<typeof GeneralCommunicationSchema>;
export type PaymentReceipt = z.infer<typeof PaymentReceiptSchema>;
export type ProductReview = z.infer<typeof ProductReviewSchema>;

// Validation functions
export const validateProductListing = (data: unknown) => {
    return ProductListingSchema.safeParse(data);
};

export const validateProductCollection = (data: unknown) => {
    return ProductCollectionSchema.safeParse(data);
};

export const validateShippingOption = (data: unknown) => {
    return ShippingOptionSchema.safeParse(data);
};

export const validateOrder = (data: unknown) => {
    return OrderSchema.safeParse(data);
};

export const validatePaymentRequest = (data: unknown) => {
    return PaymentRequestSchema.safeParse(data);
};

export const validateOrderStatusUpdate = (data: unknown) => {
    return OrderStatusUpdateSchema.safeParse(data);
};

export const validateShippingUpdate = (data: unknown) => {
    return ShippingUpdateSchema.safeParse(data);
};

export const validateGeneralCommunication = (data: unknown) => {
    return GeneralCommunicationSchema.safeParse(data);
};

export const validatePaymentReceipt = (data: unknown) => {
    return PaymentReceiptSchema.safeParse(data);
};

export const validateProductReview = (data: unknown) => {
    return ProductReviewSchema.safeParse(data);
};
