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
    `Handling ${handler_type} - ${handler_details}`,
    connection.localAddress,
    connection.localPort,
    connection.remoteAddress,
    connection.remotePort
  );

  const addressInfo = connection.address();
  if ("address" in addressInfo) {
    db.insert(schema.connection_log)
      .values({
        address: addressInfo.address,
        port: String(addressInfo.port),
        handler_type,
        handler_details,
      })
      .catch(console.error);
  }
}
