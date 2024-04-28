import { Socket } from "net";

import { getConfigValueOrDefault } from "./lib/data/config";
import { recordClientConnected } from "./lib/data/client";
import { PUMP_TIME_IN_SECONDS_CONFIG } from "./lib/schema/config";
import { fetchTurtleById } from "./lib/data/turtle";
import { recordConnectionLog } from "./lib/data/connection-log";
import { recordSwipeLog } from "./lib/data/swipe-log";

const connectedclients: Socket[] = [];

const handleSwipeRequest = async (connection: Socket, swipeId: string) => {
  const turtle = await fetchTurtleById(swipeId);
  const pumpTimeValue = await getConfigValueOrDefault(
    PUMP_TIME_IN_SECONDS_CONFIG
  );

  // record swipe
  if (turtle.enabled) {
    recordSwipeLog(connection, swipeId, true, "turtle has permission");
    connection.write(`200 OK ${pumpTimeValue}\r\n`);
    // tell ALL the connected clients that they can turn on the water
    // one of them has got to be connected to a pump!
    connectedclients.forEach((c) => c.write(`PUMP ${pumpTimeValue}\r\n`));
  } else {
    throw new Error(`Turtle does not have permission`);
  }
};

export function handler(connection: Socket) {
  console.log(`client connected remote port ${connection.remotePort}`);

  recordClientConnected(connection);

  connectedclients.push(connection);

  connection.on("error", errorHandlerFor(connection));

  connection.on("data", dataHandlerFor(connection));

  connection.on("end", endHandlerFor(connection));

  connection.write("100 READY hello, client!\r\n");
}

function errorHandlerFor(connection: Socket) {
  return (err: Error) => {
    recordConnectionLog(connection, "error", err.message);
    if (err.message === "read ECONNRESET") {
      const ix = connectedclients.indexOf(connection);
      if (ix >= 0) connectedclients.splice(ix, 1);
    }
  };
}

function dataHandlerFor(connection: Socket) {
  return (data: Buffer) => {
    recordConnectionLog(connection, "data", data.toString());
    const requestArray = data
      .toString()
      .replace(/\r?\n|\r/g, "")
      .split(/\s/);
    if (requestArray.length > 0) {
      if (requestArray[0] === "HELO") {
        connection.write("100 INFO why hello to you too!\r\n");
      } else if (requestArray[0] === "SWIP" && requestArray.length > 1) {
        const swipeId = requestArray[1];
        handleSwipeRequest(connection, swipeId).catch((error) => {
          recordSwipeLog(connection, swipeId, false, error.message);
          console.error(
            `Error handling swip request for ${swipeId} on ${connection.remoteAddress}:${connection.remotePort}`,
            error
          );
          connection.write("401 Unauthorized\r\n");
        });
      } else {
        connection.write(`400 Message not understood. Try SWIP\r\n`);
      }
    }
  };
}

function endHandlerFor(connection: Socket) {
  return () => {
    recordConnectionLog(connection, "end", "client disconnected");
    const ix = connectedclients.indexOf(connection);
    if (ix >= 0) connectedclients.splice(ix, 1);
  };
}
