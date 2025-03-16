import { describe, test, expect, beforeEach, mock } from "bun:test";
import { OrderUtils } from "../../src/utils/OrderUtils";
import { Order } from "../../src/index";
import { NostrEvent } from "@nostr-dev-kit/ndk";

// Mock data for tests
const mockOrder: Order = {
    kind: 16,
    tags: [
        ["p", "merchant123pubkey"],
        ["subject", "Test Order"],
        ["type", "1"],
        ["order", "order_id_abcdefghijklmnopqrstuvwxyz"],
        ["amount", "15000"],
        ["item", "30402:merchant123pubkey:product456", "2"],
        ["shipping", "standard"],
        ["address", "123 Test St, Test City, Test Country"],
        ["phone", "+1234567890"],
        ["email", "test@example.com"]
    ],
    content: "Test order content"
};

const mockShippingEvent: NostrEvent = {
    kind: 16,
    pubkey: "merchant123pubkey",
    created_at: 1677721600,
    tags: [
        ["p", "customer456pubkey"],
        ["subject", "Order Shipment Update"],
        ["type", "4"],
        ["order", "order_id_abcdefghijklmnopqrstuvwxyz"],
        ["status", "shipped"],
        ["tracking", "TN123456789"],
        ["carrier", "FedEx"],
        ["eta", "1678012800"]
    ],
    content: "Your order has been shipped!",
    id: "shipping_event_id_123",
    sig: "signature123"
};

const mockStatusEvent: NostrEvent = {
    kind: 16,
    pubkey: "merchant123pubkey",
    created_at: 1677735600,
    tags: [
        ["p", "customer456pubkey"],
        ["subject", "Order Status Update"],
        ["type", "3"],
        ["order", "order_id_abcdefghijklmnopqrstuvwxyz"],
        ["status", "processing"],
        ["payment", "lightning", "invoice123"]
    ],
    content: "Your order is being processed!",
    id: "status_event_id_123",
    sig: "signature456"
};

const mockPaymentEvent: NostrEvent = {
    kind: 17,
    pubkey: "merchant123pubkey",
    created_at: 1677749600,
    tags: [
        ["p", "customer456pubkey"],
        ["subject", "Payment Receipt"],
        ["order", "order_id_abcdefghijklmnopqrstuvwxyz"],
        ["amount", "15000"],
        ["payment", "lightning", "invoice123", "hash456"]
    ],
    content: "Payment received!",
    id: "payment_event_id_123",
    sig: "signature789"
};

describe("OrderUtils", () => {
    beforeEach(() => {
        mock.restore();
    });

    describe("generateOrderId", () => {
        test("should generate a valid order ID", () => {
            const orderId = OrderUtils.generateOrderId();
            expect(orderId).toBeString();
            expect(orderId).toStartWith("order_id_");
            expect(orderId.length).toBeGreaterThan(10);
            expect(orderId).not.toContain("-"); // Should not have hyphens as they are removed
        });

        test("should generate unique order IDs", () => {
            const orderIds = new Set();
            for (let i = 0; i < 100; i++) {
                orderIds.add(OrderUtils.generateOrderId());
            }
            expect(orderIds.size).toBe(100);
        });
    });

    describe("getOrderId", () => {
        test("should extract order ID from tags", () => {
            const orderId = OrderUtils.getOrderId(mockOrder);
            expect(orderId).toBe("order_id_abcdefghijklmnopqrstuvwxyz");
        });

        test("should return null if no order tag", () => {
            const orderWithoutId: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(tag => tag[0] !== "order")
            };
            const orderId = OrderUtils.getOrderId(orderWithoutId);
            expect(orderId).toBeNull();
        });

        test("should return null if order tag has no value", () => {
            const orderWithEmptyId: Order = {
                ...mockOrder,
                tags: [...mockOrder.tags.filter(tag => tag[0] !== "order"), ["order", ""]]
            };
            const orderId = OrderUtils.getOrderId(orderWithEmptyId);
            expect(orderId).toBeNull();
        });
    });

    describe("getOrderAmount", () => {
        test("should extract amount from tags", () => {
            const amount = OrderUtils.getOrderAmount(mockOrder);
            expect(amount).toBe("15000");
        });

        test("should return null if no amount tag", () => {
            const orderWithoutAmount: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(tag => tag[0] !== "amount")
            };
            const amount = OrderUtils.getOrderAmount(orderWithoutAmount);
            expect(amount).toBeNull();
        });

        test("should return null if amount tag has no value", () => {
            const orderWithEmptyAmount: Order = {
                ...mockOrder,
                tags: [...mockOrder.tags.filter(tag => tag[0] !== "amount"), ["amount", ""]]
            };
            const amount = OrderUtils.getOrderAmount(orderWithEmptyAmount);
            expect(amount).toBeNull();
        });
    });

    describe("getOrderItems", () => {
        test("should extract all item tags", () => {
            const items = OrderUtils.getOrderItems(mockOrder);
            expect(items).toHaveLength(1);
            expect(items[0]).toEqual({
                productRef: "30402:merchant123pubkey:product456",
                quantity: 2
            });
        });

        test("should handle multiple items", () => {
            const orderWithMultipleItems: Order = {
                ...mockOrder,
                tags: [
                    ...mockOrder.tags,
                    ["item", "30402:merchant123pubkey:product789", "1"],
                    ["item", "30402:merchant123pubkey:product101", "3"]
                ]
            };
            const items = OrderUtils.getOrderItems(orderWithMultipleItems);
            expect(items).toHaveLength(3);
            expect(items[0].productRef).toBe("30402:merchant123pubkey:product456");
            expect(items[0].quantity).toBe(2);
            expect(items[1].productRef).toBe("30402:merchant123pubkey:product789");
            expect(items[1].quantity).toBe(1);
            expect(items[2].productRef).toBe("30402:merchant123pubkey:product101");
            expect(items[2].quantity).toBe(3);
        });

        test("should return empty array if no item tags", () => {
            const orderWithoutItems: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(tag => tag[0] !== "item")
            };
            const items = OrderUtils.getOrderItems(orderWithoutItems);
            expect(items).toHaveLength(0);
        });
    });

    describe("getProductIdFromOrderItem", () => {
        test("should extract product ID from product reference", () => {
            const orderItem = {
                productRef: "30402:merchant123pubkey:product456",
                quantity: 2
            };
            const productId = OrderUtils.getProductIdFromOrderItem(orderItem);
            expect(productId).toBe("product456");
        });
    });

    describe("getPubkeyFromOrderItem", () => {
        test("should extract pubkey from product reference", () => {
            const orderItem = {
                productRef: "30402:merchant123pubkey:product456",
                quantity: 2
            };
            const pubkey = OrderUtils.getPubkeyFromOrderItem(orderItem);
            expect(pubkey).toBe("merchant123pubkey");
        });
    });

    describe("getOrderShipping", () => {
        test("should extract shipping from tags", () => {
            const shipping = OrderUtils.getOrderShipping(mockOrder);
            expect(shipping).toBe("standard");
        });

        test("should return null if no shipping tag", () => {
            const orderWithoutShipping: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(tag => tag[0] !== "shipping")
            };
            const shipping = OrderUtils.getOrderShipping(orderWithoutShipping);
            expect(shipping).toBeNull();
        });

        test("should return null if shipping tag has no value", () => {
            const orderWithEmptyShipping: Order = {
                ...mockOrder,
                tags: [...mockOrder.tags.filter(tag => tag[0] !== "shipping"), ["shipping", ""]]
            };
            const shipping = OrderUtils.getOrderShipping(orderWithEmptyShipping);
            expect(shipping).toBeNull();
        });
    });

    describe("getOrderContactDetails", () => {
        test("should extract all contact details", () => {
            const contactDetails = OrderUtils.getOrderContactDetails(mockOrder);
            expect(contactDetails).toEqual({
                address: "123 Test St, Test City, Test Country",
                phone: "+1234567890",
                email: "test@example.com"
            });
        });

        test("should handle missing contact details", () => {
            const orderWithPartialDetails: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(tag => tag[0] !== "phone" && tag[0] !== "email")
            };
            const contactDetails = OrderUtils.getOrderContactDetails(orderWithPartialDetails);
            expect(contactDetails).toEqual({
                address: "123 Test St, Test City, Test Country"
            });
            expect(contactDetails.phone).toBeUndefined();
            expect(contactDetails.email).toBeUndefined();
        });

        test("should return empty object if no contact details", () => {
            const orderWithNoDetails: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(
                    tag => tag[0] !== "address" && tag[0] !== "phone" && tag[0] !== "email"
                )
            };
            const contactDetails = OrderUtils.getOrderContactDetails(orderWithNoDetails);
            expect(contactDetails).toEqual({});
        });
    });

    describe("getMerchantPubkey", () => {
        test("should extract merchant pubkey from p tag", () => {
            const merchantPubkey = OrderUtils.getMerchantPubkey(mockOrder);
            expect(merchantPubkey).toBe("merchant123pubkey");
        });

        test("should return null if no p tag", () => {
            const orderWithoutMerchant: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(tag => tag[0] !== "p")
            };
            const merchantPubkey = OrderUtils.getMerchantPubkey(orderWithoutMerchant);
            expect(merchantPubkey).toBeNull();
        });

        test("should return null if p tag has no value", () => {
            const orderWithEmptyMerchant: Order = {
                ...mockOrder,
                tags: [...mockOrder.tags.filter(tag => tag[0] !== "p"), ["p", ""]]
            };
            const merchantPubkey = OrderUtils.getMerchantPubkey(orderWithEmptyMerchant);
            expect(merchantPubkey).toBeNull();
        });
    });

    describe("getOrderSubject", () => {
        test("should extract subject from tags", () => {
            const subject = OrderUtils.getOrderSubject(mockOrder);
            expect(subject).toBe("Test Order");
        });

        test("should return null if no subject tag", () => {
            const orderWithoutSubject: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(tag => tag[0] !== "subject")
            };
            const subject = OrderUtils.getOrderSubject(orderWithoutSubject);
            expect(subject).toBeNull();
        });

        test("should return null if subject tag has no value", () => {
            const orderWithEmptySubject: Order = {
                ...mockOrder,
                tags: [...mockOrder.tags.filter(tag => tag[0] !== "subject"), ["subject", ""]]
            };
            const subject = OrderUtils.getOrderSubject(orderWithEmptySubject);
            expect(subject).toBeNull();
        });
    });

    describe("getOrderType", () => {
        test("should extract type from tags", () => {
            const type = OrderUtils.getOrderType(mockOrder);
            expect(type).toBe("1");
        });

        test("should return null if no type tag", () => {
            const orderWithoutType: Order = {
                ...mockOrder,
                tags: mockOrder.tags.filter(tag => tag[0] !== "type")
            };
            const type = OrderUtils.getOrderType(orderWithoutType);
            expect(type).toBeNull();
        });

        test("should return null if type tag has no value", () => {
            const orderWithEmptyType: Order = {
                ...mockOrder,
                // @ts-expect-error Test invalid data
                tags: [...mockOrder.tags.filter(tag => tag[0] !== "type"), ["type", ""]]
            };
            const type = OrderUtils.getOrderType(orderWithEmptyType);
            expect(type).toBeNull();
        });
    });

    describe("createOrderTags", () => {
        test("should create tags with required fields", () => {
            const orderData = {
                merchantPubkey: "merchant123pubkey",
                subject: "Test Order",
                orderId: "order_id_abcdefghijklmnopqrstuvwxyz",
                amount: "15000",
                items: [
                    {
                        productRef: "30402:merchant123pubkey:product456",
                        quantity: 2
                    }
                ]
            };

            const tags = OrderUtils.createOrderTags(orderData);

            // Check required tags
            expect(tags).toContainEqual(["p", "merchant123pubkey"]);
            expect(tags).toContainEqual(["subject", "Test Order"]);
            expect(tags).toContainEqual(["type", "1"]);
            expect(tags).toContainEqual(["order", "order_id_abcdefghijklmnopqrstuvwxyz"]);
            expect(tags).toContainEqual(["amount", "15000"]);
            expect(tags).toContainEqual(["item", "30402:merchant123pubkey:product456", "2"]);

            // Check no optional tags
            expect(tags.find(tag => tag[0] === "shipping")).toBeUndefined();
            expect(tags.find(tag => tag[0] === "address")).toBeUndefined();
            expect(tags.find(tag => tag[0] === "phone")).toBeUndefined();
            expect(tags.find(tag => tag[0] === "email")).toBeUndefined();
        });

        test("should include shipping when provided", () => {
            const orderData = {
                merchantPubkey: "merchant123pubkey",
                subject: "Test Order",
                orderId: "order_id_abcdefghijklmnopqrstuvwxyz",
                amount: "15000",
                items: [
                    {
                        productRef: "30402:merchant123pubkey:product456",
                        quantity: 2
                    }
                ],
                shipping: "express"
            };

            const tags = OrderUtils.createOrderTags(orderData);
            expect(tags).toContainEqual(["shipping", "express"]);
        });

        test("should include contact details when provided", () => {
            const orderData = {
                merchantPubkey: "merchant123pubkey",
                subject: "Test Order",
                orderId: "order_id_abcdefghijklmnopqrstuvwxyz",
                amount: "15000",
                items: [
                    {
                        productRef: "30402:merchant123pubkey:product456",
                        quantity: 2
                    }
                ],
                contactDetails: {
                    address: "123 Test St, Test City",
                    phone: "+1234567890",
                    email: "test@example.com"
                }
            };

            const tags = OrderUtils.createOrderTags(orderData);
            expect(tags).toContainEqual(["address", "123 Test St, Test City"]);
            expect(tags).toContainEqual(["phone", "+1234567890"]);
            expect(tags).toContainEqual(["email", "test@example.com"]);
        });

        test("should handle multiple items", () => {
            const orderData = {
                merchantPubkey: "merchant123pubkey",
                subject: "Test Order",
                orderId: "order_id_abcdefghijklmnopqrstuvwxyz",
                amount: "15000",
                items: [
                    {
                        productRef: "30402:merchant123pubkey:product456",
                        quantity: 2
                    },
                    {
                        productRef: "30402:merchant123pubkey:product789",
                        quantity: 1
                    }
                ]
            };

            const tags = OrderUtils.createOrderTags(orderData);
            expect(tags).toContainEqual(["item", "30402:merchant123pubkey:product456", "2"]);
            expect(tags).toContainEqual(["item", "30402:merchant123pubkey:product789", "1"]);
        });

        test("should include partial contact details when provided", () => {
            const orderData = {
                merchantPubkey: "merchant123pubkey",
                subject: "Test Order",
                orderId: "order_id_abcdefghijklmnopqrstuvwxyz",
                amount: "15000",
                items: [
                    {
                        productRef: "30402:merchant123pubkey:product456",
                        quantity: 2
                    }
                ],
                contactDetails: {
                    address: "123 Test St, Test City"
                    // No phone or email
                }
            };

            const tags = OrderUtils.createOrderTags(orderData);
            expect(tags).toContainEqual(["address", "123 Test St, Test City"]);
            expect(tags.find(tag => tag[0] === "phone")).toBeUndefined();
            expect(tags.find(tag => tag[0] === "email")).toBeUndefined();
        });
    });

    describe("getOrderStatusText", () => {
        test("should extract status from status event", () => {
            const status = OrderUtils.getOrderStatusText(mockStatusEvent);
            expect(status).toBe("processing");
        });

        test("should extract status from shipping event", () => {
            const status = OrderUtils.getOrderStatusText(mockShippingEvent);
            expect(status).toBe("shipped");
        });

        test("should return 'unknown' if no status tag", () => {
            const eventWithoutStatus = {
                ...mockStatusEvent,
                tags: mockStatusEvent.tags.filter(tag => tag[0] !== "status")
            };
            const status = OrderUtils.getOrderStatusText(eventWithoutStatus);
            expect(status).toBe("unknown");
        });

        test("should return 'unknown' if status tag has no value", () => {
            const eventWithEmptyStatus = {
                ...mockStatusEvent,
                tags: [...mockStatusEvent.tags.filter(tag => tag[0] !== "status"), ["status", ""]]
            };
            const status = OrderUtils.getOrderStatusText(eventWithEmptyStatus);
            expect(status).toBe("unknown");
        });
    });

    describe("getPaymentMethod", () => {
        test("should extract payment method from event", () => {
            const paymentMethod = OrderUtils.getPaymentMethod(mockStatusEvent);
            expect(paymentMethod).toEqual({
                type: "lightning",
                value: "invoice123"
            });
        });

        test("should return null if no payment tag", () => {
            const eventWithoutPayment = {
                ...mockStatusEvent,
                tags: mockStatusEvent.tags.filter(tag => tag[0] !== "payment")
            };
            const paymentMethod = OrderUtils.getPaymentMethod(eventWithoutPayment);
            expect(paymentMethod).toBeNull();
        });

        test("should return null if payment tag is incomplete", () => {
            const eventWithIncompletePayment = {
                ...mockStatusEvent,
                tags: [...mockStatusEvent.tags.filter(tag => tag[0] !== "payment"), ["payment", "lightning"]]
            };
            const paymentMethod = OrderUtils.getPaymentMethod(eventWithIncompletePayment);
            expect(paymentMethod).toBeNull();
        });
    });

    describe("formatOrderTime", () => {
        test("should format timestamp to locale string", () => {
            // Mock Date.toLocaleString to ensure consistent output
            const originalToLocaleString = Date.prototype.toLocaleString;
            Date.prototype.toLocaleString = function () {
                return "March 2, 2023, 12:00:00 PM";
            };

            const formattedTime = OrderUtils.formatOrderTime(1677721600);
            expect(formattedTime).toBe("March 2, 2023, 12:00:00 PM");

            // Restore original method
            Date.prototype.toLocaleString = originalToLocaleString;
        });
    });

    describe("getTrackingInfo", () => {
        test("should extract tracking info from shipping event", () => {
            const trackingInfo = OrderUtils.getTrackingInfo(mockShippingEvent);
            expect(trackingInfo).toEqual({
                tracking: "TN123456789",
                carrier: "FedEx",
                eta: new Date(1678012800 * 1000)
            });
        });

        test("should handle partial tracking info", () => {
            const eventWithPartialTracking = {
                ...mockShippingEvent,
                tags: mockShippingEvent.tags.filter(tag => tag[0] !== "eta" && tag[0] !== "carrier")
            };
            const trackingInfo = OrderUtils.getTrackingInfo(eventWithPartialTracking);
            expect(trackingInfo).toEqual({
                tracking: "TN123456789"
            });
            expect(trackingInfo.carrier).toBeUndefined();
            expect(trackingInfo.eta).toBeUndefined();
        });

        test("should return empty object if no tracking info", () => {
            const eventWithNoTracking = {
                ...mockShippingEvent,
                tags: mockShippingEvent.tags.filter(
                    tag => tag[0] !== "tracking" && tag[0] !== "carrier" && tag[0] !== "eta"
                )
            };
            const trackingInfo = OrderUtils.getTrackingInfo(eventWithNoTracking);
            expect(trackingInfo).toEqual({});
        });

        test("should handle invalid eta timestamp", () => {
            const eventWithInvalidEta = {
                ...mockShippingEvent,
                tags: [
                    ...mockShippingEvent.tags.filter(tag => tag[0] !== "eta"),
                    ["eta", "not-a-number"]
                ]
            };
            const trackingInfo = OrderUtils.getTrackingInfo(eventWithInvalidEta);
            expect(trackingInfo).toEqual({
                tracking: "TN123456789",
                carrier: "FedEx"
            });
            expect(trackingInfo.eta).toBeUndefined();
        });
    });

    describe("formatSats", () => {
        test("should format valid satoshi amounts", () => {
            expect(OrderUtils.formatSats("1000")).toBe("1,000 sats");
            expect(OrderUtils.formatSats("1234567")).toBe("1,234,567 sats");
            expect(OrderUtils.formatSats("0")).toBe("0 sats");
        });

        test("should handle null input", () => {
            expect(OrderUtils.formatSats(null)).toBe("0 sats");
        });

        test("should handle non-numeric strings", () => {
            expect(OrderUtils.formatSats("not-a-number")).toBe("0 sats");
        });
    });

    describe("getOrderSummary", () => {
        test("should generate summary for order creation (type 1)", () => {
            const summary = OrderUtils.getOrderSummary(mockOrder as unknown as NostrEvent);
            expect(summary).toBe("Order with 1 item");
        });

        test("should generate summary for payment request (type 2)", () => {
            const paymentRequestEvent: NostrEvent = {
                ...mockStatusEvent,
                tags: [
                    ...mockStatusEvent.tags.filter(tag => tag[0] !== "type"),
                    ["type", "2"],
                    ["amount", "15000"]
                ]
            };
            const summary = OrderUtils.getOrderSummary(paymentRequestEvent);
            expect(summary).toBe("Payment request for 15,000 sats");
        });

        test("should generate summary for status update (type 3)", () => {
            const summary = OrderUtils.getOrderSummary(mockStatusEvent);
            expect(summary).toBe("Status updated to: processing");
        });

        test("should generate summary for shipping update (type 4)", () => {
            const summary = OrderUtils.getOrderSummary(mockShippingEvent);
            expect(summary).toBe("Shipping status: shipped");
        });

        test("should generate summary for payment receipt (kind 17)", () => {
            const summary = OrderUtils.getOrderSummary(mockPaymentEvent);
            expect(summary).toBe("Payment receipt for 15,000 sats");
        });

        test("should handle unknown event types", () => {
            const unknownEvent: NostrEvent = {
                ...mockStatusEvent,
                tags: mockStatusEvent.tags.filter(tag => tag[0] !== "type")
            };
            const summary = OrderUtils.getOrderSummary(unknownEvent);
            expect(summary).toBe("Order notification");
        });

        test("should handle errors gracefully", () => {
            // Create an event that will cause an error in the summary logic
            const eventThatCausesError: any = {
                tags: [["type", "1"]] // Minimal event that will pass the first check but cause errors later
            };
            const summary = OrderUtils.getOrderSummary(eventThatCausesError);
            console.log("Summary:", summary);
            expect(summary).toBe("Order with 0 items");
        });

        test("should handle multiple items in order", () => {
            const orderWithMultipleItems: NostrEvent = {
                ...mockOrder,
                tags: [
                    ...mockOrder.tags,
                    ["item", "30402:merchant123pubkey:product789", "1"],
                    ["item", "30402:merchant123pubkey:product101", "3"]
                ]
            } as unknown as NostrEvent;
            const summary = OrderUtils.getOrderSummary(orderWithMultipleItems);
            expect(summary).toBe("Order with 3 items");
        });
    });
});
