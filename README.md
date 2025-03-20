# Nostr Commerce Schema

## Zod Schemas and TypeScript Types for use with the [GammaMarkets Market Spec](https://github.com/GammaMarkets/market-spec)

### How to Use

1. Clone the repo.
2. `cd nostr-commerce-schema`
3. Install dependencies using your preferred package manager:
   - `npm install`
   - `yarn install`
   - `bun install`
   - etc...
4. Build the project using your preferred package manager:
   - `npm run build`
   - `yarn run build`
   - `bun run build`
   - etc...
5. Run the `link` command using your preferred package manager:
   - `npm link`
   - `yarn link`
   - `bun link`
   - etc...
6. Navigate to your project directory.
7. Run `<package_manager> link nostr-commerce-schema`, replacing `<package_manager>` with `npm`, `yarn`, or `bun`.
8. Import
   [types](https://github.com/Conduit-BTC/nostr-commerce-schema/blob/eabf91057596ed12f3087fac36d5b622d1fc8ff7/src/schemas/index.ts#L14-L23)
   or
   [validation functions](https://github.com/Conduit-BTC/nostr-commerce-schema/blob/eabf91057596ed12f3087fac36d5b622d1fc8ff7/src/schemas/index.ts#L26-L64)
   wherever Marketplace events **exist** in your project.

That's it!