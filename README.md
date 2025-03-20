# Nostr Commerce Schema

## Zod Schemas and Typescript Types for use with the [GammaMarkets Market Spec](https://github.com/GammaMarkets/market-spec)

### How to Use

1. Clone the repo
2. `cd nostr-commerce-schema`
3. Run the `link` command with your package manager of choice

- `npm link`
- `yarn link`
- `bun link`
- etc...

4. Navigate to your project
5. Run `___ link nostr-commerce-schema`, replacing ___ with your package manager
   of choice
6. Import
   [types](https://github.com/Conduit-BTC/nostr-commerce-schema/blob/eabf91057596ed12f3087fac36d5b622d1fc8ff7/src/schemas/index.ts#L14-L23)
   or
   [validation functions](https://github.com/Conduit-BTC/nostr-commerce-schema/blob/eabf91057596ed12f3087fac36d5b622d1fc8ff7/src/schemas/index.ts#L26-L64)
   wherever Marketplace events exists in your project.

That's it!
