import { Socket } from "net";
import { db } from "../db";
import * as schema from "../schema/client";
import { sql } from "drizzle-orm";

export async function fetchClients(): Promise<schema.Client[]> {
  try {
    const result = db.select().from(schema.client);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch clients.");
  }
}

export async function recordClientConnected(connection: Socket) {
  try {
    const addressInfo = connection.address();
    if ("address" in addressInfo) {
      await db
        .insert(schema.client)
        .values({
          address: addressInfo.address,
          port: String(addressInfo.port),
        })
        .onConflictDoUpdate({
          target: [schema.client.address, schema.client.port],
          set: { last_heartbeat: sql`(CURRENT_TIMESTAMP)` },
        });
    }
  } catch (error) {
    console.error(
      "Error while recording client connected",
      error,
      connection.address
    );
  }
}
