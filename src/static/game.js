var socket = io();
// var ioHook = require("ioHook"); //cant just call this in a file being server by html as it is client side

socket.on("message", function(data) {
    console.log(data);
});

//get canvas(env) from html
const environment = document.getElementById("environment");
const context = environment.getContext("2d");
//x and y offset from edge of page
const rect = environment.getBoundingClientRect();

var mouseCoords = {
    x:0,
    y:0
}

environment.addEventListener("mousemove", event => {
    mouseCoords.x = event.clientX - rect.left;
    //console.log(mouseCoords.x);
    mouseCoords.y = event.clientY - rect.top;
    //console.log(mouseCoords.y);
})

socket.emit("newClient");
setInterval(function() {
    socket.emit("mousemove", mouseCoords);
}, 1000/60);





/*
//Dont think im going to use this
ioHook.on("mousemove", event => {
    mouseCoords.x = event[1]
    mouseCoords.y = event[2]
    console.log(event);
});

ioHook.start(true);
*/