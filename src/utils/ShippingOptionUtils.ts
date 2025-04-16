import { ProductListing, ShippingOption } from "@/schemas";

export const ShippingOptionUtils = {
    getShippingOptionId: (event: ShippingOption): string | null => {
        const idTag = event.tags.find(tag => tag[0] === 'd');
        return idTag && idTag[1] ? idTag[1] : null;
    },

    getShippingOptionTitle: (event: ShippingOption): string | null => {
        const titleTag = event.tags.find(tag => tag[0] === 'title');
        return titleTag && titleTag[1] ? titleTag[1] : null;
    },

    getShippingOptionCountries: (event: ShippingOption): string[] => {
        const countryTag = event.tags.find(tag => tag[0] === 'country');
        return Array.isArray(countryTag) && countryTag.length > 1
            ? (countryTag as string[]).slice(1)
            : [];
    },

    getShippingOptionPriceAmount: (event: ShippingOption): string | null => {
        const priceTag = event.tags.find(tag => tag[0] === 'price');
        return priceTag && priceTag[1] ? priceTag[1] : null;
    },

    getShippingOptionPriceCurrency: (event: ShippingOption): string | null => {
        const priceTag = event.tags.find(tag => tag[0] === 'price');
        return priceTag && priceTag[2] ? priceTag[2] : null;
    },

    getShippingOptionService: (event: ShippingOption): string | null => {
        const serviceTag = event.tags.find(tag => tag[0] === 'service');
        return serviceTag && serviceTag[1] ? serviceTag[1] : null;
    }
}