import { Socket } from "net";
import { db } from "../db";
import * as schema from "../schema/connection-log";

export async function fetchConnectionLog(): Promise<schema.ConnectionLog[]> {
  try {
    const result = db.select().from(schema.connection_log);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch connection logs");
  }
}

export function recordConnectionLog(
  connection: Socket,
  handler_type: string,
  handler_details: string
) {
  console.log(
    `local='${connection.localAddress}:${connection.localPort}' remote='${connection.remoteAddress}:${connection.remotePort}' received ${handler_type} - ${handler_details}`
  );

  db.insert(schema.connection_log)
    .values({
      address: connection.remoteAddress || "undefined",
      port: String(connection.remotePort),
      handler_type,
      handler_details,
    })
    .catch(console.error);
}
