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
    console.log(
      `local='${connection.localAddress}:${connection.localPort}' remote='${connection.remoteAddress}:${connection.remotePort}' client connected`
    );
    await db
      .insert(schema.client)
      .values({
        address: connection.remoteAddress || "undefined",
        port: String(connection.remotePort),
      })
      .onConflictDoUpdate({
        target: [schema.client.address, schema.client.port],
        set: { last_heartbeat: sql`(CURRENT_TIMESTAMP)` },
      });
  } catch (error) {
    console.error(
      "Error while recording client connected",
      error,
      `${connection.remoteAddress}:${connection.remotePort}`
    );
  }
}
