var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');
var PORT = 3000;
app.listen(PORT);

var clientCount = 0;
io.on('connection', function (socket) {
    clientCount ++;
    socket.nickname = 'user'+ clientCount;

    io.emit('enter', socket.nickname + ' comes in');
    socket.on('msg', function (data) {
        io.emit('msg',socket.nickname+' say : '+ data)
    });
    socket.on('disconnect',function () {
        io.emit('leave',socket.nickname + ' left')
    })
});
