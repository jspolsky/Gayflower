import { Socket } from "net";
import { db } from "./lib/db";
import * as schema from "./lib/schema";
import { eq } from "drizzle-orm";
import {
  PUMP_TIME_IN_SECONDS_CONFIG,
  getConfigValueOrDefault,
} from "./lib/configs/constants";

var connectedclients: Socket[] = [];

const getPumpTimeInSeconds = async () => {
  return await getConfigValueOrDefault(PUMP_TIME_IN_SECONDS_CONFIG);
};

var toggle = false;
const okToPump = (swipe: string) => {
  // UNDONE - look up if the swipe code is valid and entitled to a pump
  // UNDONE - for debugging now it just alternates between true and false

  toggle = !toggle;
  return toggle;
};

export function tcpHandler(connection: Socket) {
  console.log(`client connected remote port ${connection.remotePort}`);
  connectedclients.push(connection);

  connection.on("error", errorHandlerFor(connection));

  connection.on("data", dataHandlerFor(connection));

  connection.on("end", endHandlerFor(connection));

  connection.write("100 READY hello, client!\r\n");
}

function errorHandlerFor(connection: Socket) {
  return (err: Error) => {
    console.log("caught exception:");
    console.log(err.stack);
    if (err.message === "read ECONNRESET") {
      const ix = connectedclients.indexOf(connection);
      if (ix >= 0) connectedclients.splice(ix, 1);
    }
  };
}

function dataHandlerFor(connection: Socket) {
  return (data: Buffer) => {
    console.log(data.toString());
    const requestArray = data
      .toString()
      .replace(/\r?\n|\r/g, "")
      .split(/\s/);
    if (requestArray.length > 0) {
      if (requestArray[0] === "HELO") {
        connection.write("100 INFO why hello to you too!\r\n");
      } else if (requestArray[0] === "SWIP" && requestArray.length > 1) {
        if (okToPump(requestArray[1])) {
          getPumpTimeInSeconds().then((pumpTimeValue) => {
            connection.write(`200 OK ${pumpTimeValue}\r\n`);

            // tell ALL the connected clients that they can turn on the water
            // one of them has got to be connected to a pump!
            var i = 0;
            while (i < connectedclients.length) {
              connectedclients[i].write(`PUMP ${pumpTimeValue}\r\n`);
              i++;
            }
          });
        } else {
          connection.write("401 Unauthorized\r\n");
        }
      } else {
        connection.write(`400 Message not understood. Try SWIP\r\n`);
      }
    }
  };
}

function endHandlerFor(connection: Socket) {
  return () => {
    console.log("client disconnected");
    const ix = connectedclients.indexOf(connection);
    if (ix >= 0) connectedclients.splice(ix, 1);
  };
}
