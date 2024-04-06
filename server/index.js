const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const secondsToPump = 90;           // this should be configurable from web UI

var net = require('net');
var connectedclients = [];
var okToSwipe = true;              // for debugging only. 1 means next swipe will be allowed

var tcpserver = net.createServer( (connection) => {

    console.log(`client connected remote port ${connection.remotePort}`);
    connectedclients.push(connection);

    connection.on('data', (data) => {
        const requestArray = data.toString().replace(/\r?\n|\r/g,"").split(/\s/);
        if (requestArray.length > 0)
        {
            if (requestArray[0] === 'HELO') {
                connection.write('100 INFO why hello to you too!\r\n');
            }
            else if (requestArray[0] === 'SWIP' && requestArray.length > 1) {
                
                // this is where we should be looking up if requestArray[1] is a valid
                // card ID

                if (okToSwipe)
                {
                    connection.write(`200 OK ${secondsToPump}\r\n`);

                    // tell ALL the connected clients that they can turn on the water
                    // one of them has got ot be connected to a pump!
                    var i = 0;
                    while (i < connectedclients.length)
                    {
                        connectedclients[i].write(`PUMP ${secondsToPump}\r\n`);
                        i++;
                    }
                
                }
                else
                {
                    connection.write('401 Unauthorized\r\n');
                }
                okToSwipe = !okToSwipe;
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

    var i = 0;
    while (i < connectionCount)
    {
        connectedclients[i].write('100 INFO random web request\r\n');
        i++;
    }


});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
