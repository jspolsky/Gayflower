import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const turtle = sqliteTable("turtle", {
  id: text("id").primaryKey(),
  name: text("name").notNull().default("unassigned"),
  enabled: integer("enabled", { mode: "boolean" }).default(false),
  created_at: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
});

export type Turtle = typeof turtle.$inferSelect;
export type NewTurtle = typeof turtle.$inferInsert;
