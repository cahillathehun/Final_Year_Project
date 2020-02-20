
//dependencies
const uuid = require("uuid/v1");
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

const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id, () => {
    socket.roomId = room.id;
    console.log(socket.id, "joined", room.id);
  });
};

const checkRooms = (socket, roomA) => {
  if(!roomA || !roomA.length){
    //if there is no room with space create a new one
    const room = {
      id: uuid(),
      sockets: []
    };
    rooms[room.id] = room;
    freeRooms.push(room);
    joinRoom(socket, room);

  } else {
    const room = freeRooms[0];
    console.log(socket.id, "wants to join", room.id);
    joinRoom(socket, room);
    freeRooms.pop(room.id)
  }
}

server.listen(PORT, function() {
  console.log("server started on port %d", PORT);
});

//websocket handling
var clients = {}
var rooms = {};
var freeRooms = [];
var roomNo = 0;
io.on("connection", function(socket) {
    console.log("connection made");
    socket.on("newClient", function(){
      console.log("new connection");
    });
    socket.on("newPlayer", function(){
      console.log("a new player wants to play a game!");
      checkRooms(socket, freeRooms);
    });
    socket.on("disconnect", function() {
      console.log("user disconnected");
    })
    io.clients((error, clients) => {
      if(error) throw error;
      console.log(clients);
    });
});




//
// setInterval(function() {
//     io.sockets.emit("state", clients);
// }, 100/60);
