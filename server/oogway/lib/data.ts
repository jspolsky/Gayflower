import { like, sql, or, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "./db";
import * as schema from "./schema";

export async function fetchTurtles() {
  noStore();
  try {
    const result = db.select().from(schema.turtles);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Turtles.");
  }
}
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

export async function fetchTurtleById(id: string) {
  noStore();
  try {
    const result = await db
      .select()
      .from(schema.turtles)
      .where(eq(schema.turtles.id, id));

    const turtle = result[0];

    return turtle;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Turtle by ID.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredTurtles(query: string, currentPage: number) {
  noStore();
  try {
    const currentOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const result = db
      .select()
      .from(schema.turtles)
      .where(
        or(
          like(schema.turtles.id, `%${query}%`),
          like(schema.turtles.name, `%${query}%`)
        )
      )
      .orderBy(schema.turtles.id)
      .limit(ITEMS_PER_PAGE)
      .offset(currentOffset);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Filtered Turtles.");
  }
}

export async function fetchTurtlesPages(query: string) {
  noStore();
  try {
    const result = await db
      .select({ count: sql<number>`cast(count(${schema.turtles.id}) as int)` })
      .from(schema.turtles)
      .where(
        or(
          like(schema.turtles.id, `%${query}%`),
          like(schema.turtles.name, `%${query}%`)
        )
      );

    const totalPages = Math.ceil(result[0].count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Turtles Pages.");
  }
}
