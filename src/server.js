
//dependencies

const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
var app = express();
var server = http.Server(app);
var io = socketIO(server);


const PORT = 80;

app.set("port", (process.env.PORT || PORT)); //set port to port 80

app.use("/static", express.static(__dirname + "/static"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/play", function(req, res) {
    res.sendFile(path.join(__dirname, "/static/play.html"));
});


app.get("/settings", function(req, res) {
    res.sendFile(path.join(__dirname, "/static/settings.html"));
});

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "/static/about.html"));
});


server.listen(PORT, function() {
  console.log("server started on port %d", PORT);
});

//websocket handling
var clients = {}
io.on("connection", function(socket) {
    console.log("connection made");
    socket.on("newClient", function(){
        console.log("new connection");
    });
    socket.on("newPlayer", function(){
        console.log("a new player wants to play a game!");
    });
    io.clients((error, clients) => {
      if(error) throw error;
      console.log(clients);
    });
});


//
// setInterval(function() {
//     io.sockets.emit("state", clients);
// }, 100/60);
