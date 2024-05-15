## Getting Started

```bash

# to run development server
bun --bun dev

# to run production server (run build before start to ensure latest code is used)
bun --bun build
bun --bun start
```

## DB Management

### Updating Schema

-   generate schema changes by running `bunx drizzle-kit generate:sqlite --schema lib/schema/*`
-   migrate the schema changes by runnning `bun --bun run migrate-db`

### Seeding the DB

-   update `scripts/seed.ts`
-   run `bun --bun run seed-db`

If you're making breaking changes, you'll have to either figure it out manually or start from scratch. run `bun --bun run clean-db` and rerun the commands above (generate -> migrate -> seed)
