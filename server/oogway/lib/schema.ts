import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const turtles = sqliteTable("turtles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export type Turtle = typeof turtles.$inferSelect;

export const configs = sqliteTable("configs", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Config = typeof configs.$inferSelect;
