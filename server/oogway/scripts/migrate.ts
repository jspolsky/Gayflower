import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database("mydb.sqlite");
const db = drizzle(sqlite);

try {
  const result = await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Successfully migrated DB");
} catch (error) {
  console.error("Error while migrating DB", error);
}
