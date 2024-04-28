import { like, sql, or, eq } from "drizzle-orm";
import { db } from "../db";
import * as schema from "../schema/turtle";

export async function fetchTurtles() {
  try {
    const result = db.select().from(schema.turtle);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Turtles.");
  }
}

export async function fetchTurtleById(id: string): Promise<schema.Turtle> {
  const result = await db
    .select()
    .from(schema.turtle)
    .where(eq(schema.turtle.id, id));

  if (result[0]) return result[0];
  else throw new Error(`Turtle with id ${id} doesn't exist`);
}

const ITEMS_PER_PAGE = 100;
export async function fetchFilteredTurtles(query: string, currentPage: number) {
  try {
    const currentOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const result = db
      .select()
      .from(schema.turtle)
      .where(
        or(
          like(schema.turtle.id, `%${query}%`),
          like(schema.turtle.name, `%${query}%`)
        )
      )
      .orderBy(schema.turtle.id)
      .limit(ITEMS_PER_PAGE)
      .offset(currentOffset);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Filtered Turtles.");
  }
}

export async function fetchTurtlesPages(query: string) {
  try {
    const result = await db
      .select({ count: sql<number>`cast(count(${schema.turtle.id}) as int)` })
      .from(schema.turtle)
      .where(
        or(
          like(schema.turtle.id, `%${query}%`),
          like(schema.turtle.name, `%${query}%`)
        )
      );

    const totalPages = Math.ceil(result[0].count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Turtles Pages.");
  }
}
