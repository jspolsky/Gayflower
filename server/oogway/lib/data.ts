import { db } from "./db";
import * as schema from "./schema";

export async function fetchTurtles() {
  try {
    const result = db.select().from(schema.turtles);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Turtles.");
  }
}
export async function fetchConfigs() {
  try {
    const result = db.select().from(schema.configs);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Configs.");
  }
}
