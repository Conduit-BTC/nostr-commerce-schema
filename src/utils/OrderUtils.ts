import { NostrEvent } from "@nostr-dev-kit/ndk";
import { Order } from "../schemas";
import { v4 as uuidv4 } from 'uuid';

export const OrderUtils = {
    generateOrderId: (): string => {
        return `order_id_${uuidv4().replace(/-/g, '')}`;
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
    },

    /**
 * Gets the order status text from an event
 */
    getOrderStatusText: (event: NostrEvent): string => {
        const statusTag = event.tags.find(tag => tag[0] === 'status');
        return statusTag && statusTag[1] ? statusTag[1] : 'unknown';
    },

    /**
     * Gets the payment method from an event
     */
    getPaymentMethod: (event: NostrEvent): { type: string, value: string } | null => {
        const paymentTag = event.tags.find(tag => tag[0] === 'payment');
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
    formatOrderTime: (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    },

    /**
     * Gets shipping tracking info from a shipping update event
     */
    getTrackingInfo: (event: NostrEvent): {
        tracking?: string,
        carrier?: string,
        eta?: Date
    } => {
        const trackingInfo: { tracking?: string, carrier?: string, eta?: Date } = {};

        const trackingTag = event.tags.find(tag => tag[0] === 'tracking');
        if (trackingTag && trackingTag[1]) {
            trackingInfo.tracking = trackingTag[1];
        }

        const carrierTag = event.tags.find(tag => tag[0] === 'carrier');
        if (carrierTag && carrierTag[1]) {
            trackingInfo.carrier = carrierTag[1];
        }

        const etaTag = event.tags.find(tag => tag[0] === 'eta');
        if (etaTag && etaTag[1]) {
            const etaTimestamp = parseInt(etaTag[1], 10);
            if (!isNaN(etaTimestamp)) {
                trackingInfo.eta = new Date(etaTimestamp * 1000);
            }
        }

        return trackingInfo;
    },

    /**
     * Formats satoshi amount with commas and unit
     */
    formatSats: (sats: string | null): string => {
        if (!sats) return '0 sats';
        const numSats = parseInt(sats, 10);
        if (isNaN(numSats)) return '0 sats';

        return `${numSats.toLocaleString()} sats`;
    },

    /**
     * Gets a human-readable summary of the order
     */
    getOrderSummary: (event: NostrEvent): string => {
        try {
            // For orders
            if (event.tags.find(tag => tag[0] === 'type' && tag[1] === '1')) {
                const items = event.tags.filter(tag => tag[0] === 'item');
                return `Order with ${items.length} item${items.length !== 1 ? 's' : ''}`;
            }

            // For payment requests
            if (event.tags.find(tag => tag[0] === 'type' && tag[1] === '2')) {
                const amount = OrderUtils.getOrderAmount(event as unknown as Order);
                return `Payment request for ${OrderUtils.formatSats(amount)}`;
            }

            // For status updates
            if (event.tags.find(tag => tag[0] === 'type' && tag[1] === '3')) {
                const status = OrderUtils.getOrderStatusText(event);
                return `Status updated to: ${status}`;
            }

            // For shipping updates
            if (event.tags.find(tag => tag[0] === 'type' && tag[1] === '4')) {
                const status = OrderUtils.getOrderStatusText(event);
                return `Shipping status: ${status}`;
            }

            // For receipts
            if (event.kind === 17) {
                const amount = OrderUtils.getOrderAmount(event as unknown as Order);
                return `Payment receipt for ${OrderUtils.formatSats(amount)}`;
            }

            return 'Order notification';
        } catch (err) {
            console.error('Error generating order summary:', err);
            return 'Order notification';
        }
    }
};
