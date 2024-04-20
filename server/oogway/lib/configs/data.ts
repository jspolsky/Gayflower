import { like, sql, or, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "../db";
import * as schema from "../schema";

export async function fetchConfigs() {
  noStore();
  try {
    const result = db.select().from(schema.configs);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Configs.");
  }
}

export async function fetchConfigByKey(key: string) {
  noStore();
  try {
    const result = await db
      .select()
      .from(schema.configs)
      .where(eq(schema.configs.key, key));

    const config = result[0];

    return config;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Config by key.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredConfigs(query: string, currentPage: number) {
  noStore();
  try {
    const currentOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const result = db
      .select()
      .from(schema.configs)
      .where(
        or(
          like(schema.configs.key, `%${query}%`),
          like(schema.configs.value, `%${query}%`)
        )
      )
      .orderBy(schema.configs.key)
      .limit(ITEMS_PER_PAGE)
      .offset(currentOffset);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Filtered Configs.");
  }
}

export async function fetchConfigsPages(query: string) {
  noStore();
  try {
    const result = await db
      .select({ count: sql<number>`cast(count(${schema.configs.key}) as int)` })
      .from(schema.configs)
      .where(
        or(
          like(schema.configs.key, `%${query}%`),
          like(schema.configs.value, `%${query}%`)
        )
      );

    const totalPages = Math.ceil(result[0].count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Configs Pages.");
  }
}
