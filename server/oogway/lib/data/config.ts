import { like, sql, or, eq } from "drizzle-orm";
import { db } from "../db";
import * as schema from "../schema/config";

export async function fetchConfigs() {
  try {
    const result = db.select().from(schema.config);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Configs.");
  }
}

export async function fetchConfigByKey(key: string) {
  try {
    const result = await db
      .select()
      .from(schema.config)
      .where(eq(schema.config.key, key));

    const config = result[0];

    return config;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to fetch Config by key='${key}'`);
  }
}

export async function getConfigValueOrDefault<T>(
  knownConfig: schema.KnownConfig<T>
) {
  try {
    const result = await db
      .select()
      .from(schema.config)
      .where(eq(schema.config.key, knownConfig.key));

    const value = result[0].value;

    return value as T;
  } catch (error) {
    console.error(
      `Failed to get ${knownConfig.key} and will use default value`,
      error
    );
    return knownConfig.defaultValue;
  }
}
