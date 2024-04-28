import { Socket } from "net";
import * as schema from "../schema/swipe-log";
import { db } from "../db";

export async function fetchSwipeLogs() {
  try {
    const result = db.select().from(schema.swipe_log);

    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch swipe logs");
  }
}

export async function recordSwipeLog(
  connection: Socket,
  swipe_id: string,
  is_allowed: boolean,
  reason: string
) {
  try {
    const addressInfo = connection.address();
    if ("address" in addressInfo) {
      await db.insert(schema.swipe_log).values({
        address: addressInfo.address,
        port: String(addressInfo.port),
        swipe_id,
        is_allowed,
        reason,
      });
    }
  } catch (error) {
    console.error(
      `Error while recording swipe log from ${connection.address()} - swipId=${swipe_id} isAllowed=${is_allowed} - ${reason}`,
      error
    );
  }
}
