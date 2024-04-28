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

const ITEMS_PER_PAGE = 12;
export async function fetchFilteredConfigs(query: string, currentPage: number) {
  try {
    const currentOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const result = db
      .select()
      .from(schema.config)
      .where(
        or(
          like(schema.config.key, `%${query}%`),
          like(schema.config.value, `%${query}%`)
        )
      )
      .orderBy(schema.config.key)
      .limit(ITEMS_PER_PAGE)
      .offset(currentOffset);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Filtered Configs.");
  }
}

export async function fetchConfigsPages(query: string) {
  try {
    const result = await db
      .select({ count: sql<number>`cast(count(${schema.config.key}) as int)` })
      .from(schema.config)
      .where(
        or(
          like(schema.config.key, `%${query}%`),
          like(schema.config.value, `%${query}%`)
        )
      );

    const totalPages = Math.ceil(result[0].count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Configs Pages.");
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
