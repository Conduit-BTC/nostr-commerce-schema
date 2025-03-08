import { zodToJsonSchema } from 'zod-to-json-schema';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GeneralCommunicationSchema } from '../schemas/DirectMessage';
import { OrderStatusUpdateSchema } from '../schemas/OrderStatusUpdateSchema';
import { PaymentReceiptSchema } from '../schemas/Receipt';
import { ProductReviewSchema } from '../schemas/Review';
import { OrderSchema } from '../schemas/OrderSchema';
import { PaymentRequestSchema } from '../schemas/PaymentRequestSchema';
import { ProductCollectionSchema } from '../schemas/ProductCollectionSchema';
import { ProductListingSchema } from '../schemas/ProductListingSchema';
import { ShippingOptionSchema } from '../schemas/ShippingOptionSchema';
import { ShippingUpdateSchema } from '../schemas/ShippingUpdateSchema';

const schemas = {
    // Main schemas
    GeneralCommunication: GeneralCommunicationSchema,
    OrderStatusUpdate: OrderStatusUpdateSchema,
    PaymentReceipt: PaymentReceiptSchema,
    ProductReview: ProductReviewSchema,
    Order: OrderSchema,
    PaymentRequest: PaymentRequestSchema,
    ProductCollection: ProductCollectionSchema,
    ProductListing: ProductListingSchema,
    ShippingOption: ShippingOptionSchema,
    ShippingUpdate: ShippingUpdateSchema,
  };
  

const outputDir = path.join(__dirname, '../../json-schemas');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

Object.entries(schemas).forEach(([name, schema]) => {
  const jsonSchema = zodToJsonSchema(schema, { name });
  const outputPath = path.join(outputDir, `${name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2));
});

console.log('JSON Schemas generated successfully!');