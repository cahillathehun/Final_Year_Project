
//dependencies

const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
var app = express();
var server = http.Server(app);
var io = socketIO(server);

const PORT = 3000;

app.set("port", PORT); //set port to 3000 for now

app.use("/static", express.static(__dirname + "/static")); //for routing


app.get("/", function(req, res) {
  //sends html file stored in 'index.html' when endpoint is hit
  res.sendFile("index.html", {root: path.join(__dirname, "./static")});
});

server.listen(PORT, function() {
  console.log("server started on port %d", PORT);
});

//websocket handler
io.on("connection", function(socket) {
});

//used for testing, emits a "yo" every 1000ms
setInterval(function() {
io.sockets.emit("msg", "yo");
}, 1000);