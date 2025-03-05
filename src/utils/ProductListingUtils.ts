import { ProductListing } from "../schemas";
import { v4 as uuidv4 } from 'uuid';

export const ProductListingUtils = {
    generateProductId: (): string => {
        return `product_id_${uuidv4().replace(/-/g, '')}`;
    },

    getProductId: (event: ProductListing): string | null => {
        const idTag = event.tags.find(tag => tag[0] === 'd');
        return idTag && idTag[1] ? idTag[1] : null;
    },

    getProductTitle: (event: ProductListing): string | null => {
        const titleTag = event.tags.find(tag => tag[0] === 'title');
        return titleTag && titleTag[1] ? titleTag[1] : null;
    },

    getProductPrice: (event: ProductListing): {
        amount: string;
        currency: string;
        frequency?: string
    } | null => {
        const priceTag = event.tags.find(tag => tag[0] === 'price');
        if (!priceTag || !priceTag[1] || !priceTag[2]) return null;

        return {
            amount: priceTag[1],
            currency: priceTag[2],
            frequency: priceTag[3]
        };
    },

    getProductImages: (event: ProductListing): Array<{
        url: string;
        dimensions?: string;
        order?: number;
    }> => {
        return event.tags
            .filter(tag => tag[0] === 'image')
            .map(tag => ({
                url: tag[1],
                dimensions: tag[2],
                order: tag[3] ? parseInt(tag[3], 10) : undefined
            }))
            .sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) {
                    return a.order - b.order;
                }
                if (a.order !== undefined) return -1;
                if (b.order !== undefined) return 1;
                return 0;
            });
    },

    getProductType: (event: ProductListing): {
        type?: 'simple' | 'variable' | 'variation';
        physicalType?: 'digital' | 'physical'
    } => {
        const typeTag = event.tags.find(tag => tag[0] === 'type');
        if (!typeTag) return {};

        return {
            type: typeTag[1] as 'simple' | 'variable' | 'variation',
            physicalType: typeTag[2] as 'digital' | 'physical'
        };
    },

    getProductVisibility: (event: ProductListing): 'hidden' | 'on-sale' | 'pre-order' | null => {
        const visibilityTag = event.tags.find(tag => tag[0] === 'visibility');
        return visibilityTag && visibilityTag[1] ? visibilityTag[1] as 'hidden' | 'on-sale' | 'pre-order' : null;
    },

    getProductStock: (event: ProductListing): number | null => {
        const stockTag = event.tags.find(tag => tag[0] === 'stock');
        return stockTag && stockTag[1] ? parseInt(stockTag[1], 10) : null;
    },

    getProductSummary: (event: ProductListing): string | null => {
        const summaryTag = event.tags.find(tag => tag[0] === 'summary');
        return summaryTag && summaryTag[1] ? summaryTag[1] : null;
    },

    getProductSpecs: (event: ProductListing): Record<string, string> => {
        return event.tags
            .filter(tag => tag[0] === 'spec' && tag[1] && tag[2])
            .reduce((specs, tag) => {
                specs[tag[1] as string] = tag[2] as string;
                return specs;
            }, {} as Record<string, string>);
    },

    getProductWeight: (event: ProductListing): { value: string; unit: string } | null => {
        const weightTag = event.tags.find(tag => tag[0] === 'weight');
        if (!weightTag || !weightTag[1] || !weightTag[2]) return null;

        return {
            value: weightTag[1],
            unit: weightTag[2]
        };
    },

    getProductDimensions: (event: ProductListing): { dimensions: string; unit: string } | null => {
        const dimTag = event.tags.find(tag => tag[0] === 'dim');
        if (!dimTag || !dimTag[1] || !dimTag[2]) return null;

        return {
            dimensions: dimTag[1],
            unit: dimTag[2]
        };
    },

    getProductCategories: (event: ProductListing): string[] => {
        return event.tags
            .filter(tag => tag[0] === 't')
            .map(tag => tag[1]);
    },

    createProductTags: (data: {
        id: string;
        title: string;
        price: { amount: string; currency: string; frequency?: string };
        type?: { type: 'simple' | 'variable' | 'variation'; physicalType: 'digital' | 'physical' };
        visibility?: 'hidden' | 'on-sale' | 'pre-order';
        stock?: number;
        summary?: string;
        specs?: Record<string, string>;
        images?: Array<{ url: string; dimensions?: string; order?: number }>;
        weight?: { value: string; unit: string };
        dimensions?: { dimensions: string; unit: string };
        categories?: string[];
    }): string[][] => {
        const tags: string[][] = [];

        // Required tags
        tags.push(['d', data.id]);
        tags.push(['title', data.title]);
        tags.push([
            'price',
            data.price.amount,
            data.price.currency,
            ...(data.price.frequency ? [data.price.frequency] : [])
        ]);

        // Optional tags
        if (data.type) {
            tags.push(['type', data.type.type, data.type.physicalType]);
        }

        if (data.visibility) {
            tags.push(['visibility', data.visibility]);
        }

        if (data.stock !== undefined) {
            tags.push(['stock', data.stock.toString()]);
        }

        if (data.summary) {
            tags.push(['summary', data.summary]);
        }

        // Specs
        if (data.specs) {
            Object.entries(data.specs).forEach(([key, value]) => {
                tags.push(['spec', key, value]);
            });
        }

        // Images
        if (data.images) {
            data.images.forEach(image => {
                const imageTag = ['image', image.url];
                if (image.dimensions) imageTag.push(image.dimensions);
                if (image.order !== undefined) imageTag.push(image.order.toString());
                tags.push(imageTag);
            });
        }

        // Weight
        if (data.weight) {
            tags.push(['weight', data.weight.value, data.weight.unit]);
        }

        // Dimensions
        if (data.dimensions) {
            tags.push(['dim', data.dimensions.dimensions, data.dimensions.unit]);
        }

        // Categories
        if (data.categories) {
            data.categories.forEach(category => {
                tags.push(['t', category]);
            });
        }

        return tags;
    }
};
