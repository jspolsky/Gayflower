## Getting Started

```bash

# to run development server
bun --bun dev
```

## DB Management

### Updating Schema

- generate schema changes by running `bunx drizzle-kit generate:sqlite --schema lib/schema.ts`
- migrate the schema changes by runnning `bun run scripts/migrate.ts`

### Seeding the DB

- update `scripts/seed.ts`
- run `bun run scripts/seed.ts`

If you're making breaking changes, you'll have to either figure it out manually or start from scratch (delete `./drizzle` and `mydb.sqlite` and then rerun the commands above)
