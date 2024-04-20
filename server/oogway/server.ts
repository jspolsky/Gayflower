import * as http from "http";
import * as net from "net";
import next from "next";

import { tcpHandler } from "./tcpHandler";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const httpPort = 3000;
const tcpPort = 3001;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port: httpPort });
const httpHandler = app.getRequestHandler();

const setupHttpServer = () => {
  const httpServer = http.createServer(httpHandler);
  httpServer
    .once("error", (err: Error) => {
      console.error(err);
      process.exit(1);
    })
    .listen(httpPort, () => {
      console.log(`> HTTP server Ready on http://${hostname}:${httpPort}`);
    });
};

const setupTcpServer = () => {
  const tcpServer = net.createServer(tcpHandler);
  tcpServer
    .once("error", (err: Error) => {
      console.error(err);
    })
    .listen(tcpPort, () => {
      console.log(`> TCP server Ready on http://${hostname}:${tcpPort}`);
    });
};

app.prepare().then(() => {
  setupHttpServer();
  setupTcpServer();
});
