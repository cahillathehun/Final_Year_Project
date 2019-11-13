
//dependencies

const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
var app = express();
var server = http.Server(app);
var io = socketIO(server);

const PORT = 3000;

app.set("port", (process.env.PORT || PORT)); //set port to 3000 for now

app.use("/static", express.static(__dirname + "/static"));
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});


server.listen(PORT, function() {
  console.log("server started on port %d", PORT);
});

//websocket handling
var clients = {}
io.on("connection", function(socket) {
    console.log("connection made");
    socket.on("newClient", function(){
        console.log("new client");
        clients[socket.id] = {
        x:300,
        y:300
        };
    });
    socket.on("mousemove", function(data) {
    console.log(data); //logs the clients' mouse positions
    var client = clients[socket.id] || {};
    client.x = data.x;
    client.y = data.y;
    });
});
setInterval(function() {
    io.sockets.emit("state", clients);
}, 1000/60);

/*
//used for testing, emits a "yo" every 1000ms
setInterval(function() {
io.sockets.emit("message", "yo");
}, 1000);
*/
