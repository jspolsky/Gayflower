import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { client } from "./client";

export const connection_log = sqliteTable("connection_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  timestamp: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  address: text("address")
    .notNull()
    .references(() => client.address),
  port: text("port")
    .notNull()
    .references(() => client.port),
  handler_type: text("handler_type"),
  handler_details: text("handler_details"),
});

export type ConnectionLog = typeof connection_log.$inferSelect;
