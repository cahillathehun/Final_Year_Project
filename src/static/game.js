var socket = io();
var ioHook = require("ioHook");

socket.on("message", function(data) {
    console.log(data);
});

var mouseCoords = {
    x:0
    y:0
}

ioHook.on("mousemove", event => {
    mouseCoords.x = event[1]
    mouseCoords.y = event[2]
    console.log(event);
});

ioHook.start(true);

socket.emit("newClient");
setInterval(function() {
    socket.emit("mousemove", event);
}, 1000/60);