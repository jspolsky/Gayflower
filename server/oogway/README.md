## Getting Started

```bash

# to run development server
bun --bun dev
```

## DB Management

### Updating Schema

- generate schema changes by running `bunx drizzle-kit generate:sqlite --schema lib/schema.ts`
- migrate the schema changes by runnning `bun run lib/migrate.ts`

### Seeding the DB

- update `lib/seed.ts`
- run `bun run lib/seed.ts`
