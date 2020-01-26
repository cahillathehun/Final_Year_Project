var socket = io();

socket.on("message", function(data) {
    console.log(data);
});





window.addEventListener("mousemove", event => {
    console.log( `x: ${event.x} | y: ${event.y}`)
})

socket.emit("newClient");
