import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const turtles = sqliteTable("turtles", {
  id: text("id").primaryKey(),
  name: text("name"),
});

export type Turtle = typeof turtles.$inferSelect;

export const configs = sqliteTable("configs", {
  key: text("key").primaryKey(),
  value: text("value"),
});

export type Config = typeof configs.$inferSelect;
