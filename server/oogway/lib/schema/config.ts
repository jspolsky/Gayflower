import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const config = sqliteTable("config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type NewConfig = typeof config.$inferInsert;
export type Config = typeof config.$inferSelect;

export interface KnownConfig<T> {
  key: string;
  defaultValue: T;
}

export const PUMP_TIME_IN_SECONDS_CONFIG: KnownConfig<number> = {
  key: "PUMP_TIME_IN_SECONDS",
  defaultValue: 90,
};

export const ALL_KNOWN_CONFIGS = [PUMP_TIME_IN_SECONDS_CONFIG];
