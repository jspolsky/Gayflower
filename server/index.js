const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const net = require('net');
var connectedclients = [];


const getPumpTimeInSeconds = () => { 

    // UNDONE - should be configurable from web UI
    return 90; 

}

var toggle = false;
const okToPump = (swipe) => {

    // UNDONE - look up if the swipe code is valid and entitled to a pump
    // UNDONE - for debugging now it just alternates between true and false

    toggle = !toggle;
    return toggle;

}

var tcpserver = net.createServer( (connection) => {

    console.log(`client connected remote port ${connection.remotePort}`);
    connectedclients.push(connection);

    connection.on("error", (err) => {
      console.log("caught exception:");
      console.log(err.stack);
      if (err.message === "read ECONNRESET") {
        const ix = connectedclients.indexOf(connection);
        if (ix >= 0) connectedclients.splice(ix, 1);
      }
    });

    connection.on('data', (data) => {
        const requestArray = data.toString().replace(/\r?\n|\r/g,"").split(/\s/);
        if (requestArray.length > 0)
        {
            if (requestArray[0] === 'HELO') {
                connection.write('100 INFO why hello to you too!\r\n');
            }
            else if (requestArray[0] === 'SWIP' && requestArray.length > 1) {
                
                if (okToPump(requestArray[1]))
                {
                    connection.write(`200 OK ${getPumpTimeInSeconds()}\r\n`);

                    // tell ALL the connected clients that they can turn on the water
                    // one of them has got ot be connected to a pump!
                    var i = 0;
                    while (i < connectedclients.length)
                    {
                        connectedclients[i].write(`PUMP ${getPumpTimeInSeconds()}\r\n`);
                        i++;
                    }
                
                }
                else
                {
                    connection.write('401 Unauthorized\r\n');
                }
            }
            else {
                connection.write(`400 Message not understood. Try SWIP\r\n`)
            }
        }
    })

    connection.on('end', () => {
        console.log('client disconnected');
        const ix = connectedclients.indexOf(connection);
        if (ix >= 0) 
            connectedclients.splice(ix, 1);
    });

    connection.write('100 READY hello, client!\r\n');
});

tcpserver.listen(3001, () => {
    console.log('server is listening');
});

app.get('/', (req, res) => {

    const connectionCount = connectedclients.length;

    res.send(`<h1>Future Turtles Gayflower</h1>
            <p>${connectionCount} clients connected</p>`);

});

server.listen(80, () => {
  console.log('listening on localhost:80');
});
