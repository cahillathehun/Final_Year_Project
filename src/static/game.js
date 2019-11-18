var socket = io();

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


