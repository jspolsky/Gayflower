import * as net from 'net'

import { handler } from './tcp-handler'

const hostname = 'localhost'
const tcpPort = 3001

const tcpServer = net.createServer(handler)

tcpServer
    .once('error', (err: Error) => {
        console.error(err)
    })
    .listen(tcpPort, () => {
        console.log(`> TCP server Ready on http://${hostname}:${tcpPort}`)
    })
