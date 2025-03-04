import { Order } from "../schemas";
import { v4 as uuidv4 } from 'uuid';

export const OrderUtils = {
    generateOrderId: (merchantPubkey: string): string => {
        return `${uuidv4().replace(/-/g, '')}`;
    },

    getOrderId: (order: Order): string | null => {
        const orderTag = order.tags.find(tag => tag[0] === 'order');
        return orderTag && orderTag[1] ? orderTag[1] : null;
    },

    getOrderAmount: (order: Order): string | null => {
        const amountTag = order.tags.find(tag => tag[0] === 'amount');
        return amountTag && amountTag[1] ? amountTag[1] : null;
    },

    getOrderItems: (order: Order): Array<{
        productRef: string; // From the "a" tag; "30402:<pubkey>:<d-tag>"
        quantity: number;
    }> => {
        return order.tags
            .filter(tag => tag[0] === 'item')
            .map(tag => ({
                productRef: tag[1],
                quantity: parseInt(tag[2], 10)
            }));
    },

    getProductIdFromOrderItem: (orderItem: {
        productRef: string;
        quantity: number;
    }): string => {
        return orderItem.productRef.split(':')[2];
    },

    getPubkeyFromOrderItem: (orderItem: {
        productRef: string;
        quantity: number;
    }): string => {
        return orderItem.productRef.split(':')[1];
    },

    getOrderShipping: (order: Order): string | null => {
        const shippingTag = order.tags.find(tag => tag[0] === 'shipping');
        return shippingTag && shippingTag[1] ? shippingTag[1] : null;
    },

    getOrderContactDetails: (order: Order): {
        address?: string;
        phone?: string;
        email?: string;
    } => {
        const details: {
            address?: string;
            phone?: string;
            email?: string;
        } = {};

        const addressTag = order.tags.find(tag => tag[0] === 'address');
        if (addressTag && addressTag[1]) {
            details.address = addressTag[1];
        }

        const phoneTag = order.tags.find(tag => tag[0] === 'phone');
        if (phoneTag && phoneTag[1]) {
            details.phone = phoneTag[1];
        }

        const emailTag = order.tags.find(tag => tag[0] === 'email');
        if (emailTag && emailTag[1]) {
            details.email = emailTag[1];
        }

        return details;
    },

    getMerchantPubkey: (order: Order): string | null => {
        const pTag = order.tags.find(tag => tag[0] === 'p');
        return pTag && pTag[1] ? pTag[1] : null;
    },

    getOrderSubject: (order: Order): string | null => {
        const subjectTag = order.tags.find(tag => tag[0] === 'subject');
        return subjectTag && subjectTag[1] ? subjectTag[1] : null;
    },

    getOrderType: (order: Order): string | null => {
        const typeTag = order.tags.find(tag => tag[0] === 'type');
        return typeTag && typeTag[1] ? typeTag[1] : null;
    },

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
    }): string[][] => {
        const tags: string[][] = [];

        // Required tags
        tags.push(['p', data.merchantPubkey]);
        tags.push(['subject', data.subject]);
        tags.push(['type', '1']);  // Type 1 for order creation
        tags.push(['order', data.orderId]);
        tags.push(['amount', data.amount]);

        // Item tags
        data.items.forEach(item => {
            tags.push(['item', item.productRef, item.quantity.toString()]);
        });

        // Optional tags
        if (data.shipping) {
            tags.push(['shipping', data.shipping]);
        }

        if (data.contactDetails) {
            if (data.contactDetails.address) {
                tags.push(['address', data.contactDetails.address]);
            }
            if (data.contactDetails.phone) {
                tags.push(['phone', data.contactDetails.phone]);
            }
            if (data.contactDetails.email) {
                tags.push(['email', data.contactDetails.email]);
            }
        }

        return tags;
    }
};
