import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const turtles = sqliteTable("turtles", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

export const configs = sqliteTable("configs", {
  key: text("key").primaryKey(),
  value: text("value"),
});
