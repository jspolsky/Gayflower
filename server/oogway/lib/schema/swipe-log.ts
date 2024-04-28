import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { client } from "./client";
import { turtle } from "./turtle";

export const swipe_log = sqliteTable(
  "swipe_log",
  {
    timestamp: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
    address: text("address")
      .notNull()
      .references(() => client.address),
    port: text("port")
      .notNull()
      .references(() => client.port),
    swipe_id: text("swipe_id").references(() => turtle.id),
    is_allowed: integer("is_allowed", { mode: "boolean" }),
    reason: text("reason"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.timestamp, table.address, table.port, table.swipe_id],
    }),
  })
);

export type SwipeLog = typeof swipe_log.$inferSelect;
export type NewSwipeLog = typeof swipe_log.$inferInsert;
