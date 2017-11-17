var ws = require("nodejs-websocket");
var PORT = 3000;
var clientCount = 0;
var server = ws.createServer(function (conn) {
    console.log("New connection");
    clientCount ++;
    conn.nickname = 'user'+ clientCount;
    broadcast({
        type: 'enter',
        msg: conn.nickname + ' comes in'
    });
    conn.on("text", function (str) {
        console.log("Received "+str);
        broadcast({
            type: 'normal',
            msg: conn.nickname + ':' +str,
        })
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
        broadcast({
            type: 'leave',
            msg: conn.nickname + ' left'
        })
    });
    conn.on("error", function (err) {
        console.log("handel err");
        console.log(err)
    })
}).listen(PORT);
console.log("websocket server listening on port "+ PORT);

function broadcast(data) {
    data = JSON.stringify(data);
    server.connections.forEach(function (connection) {
        connection.sendText(data)
    })
}