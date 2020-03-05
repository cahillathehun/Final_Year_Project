
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

//each of the app.get funcs below server the html to the client
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/play", function(req, res) {
    res.sendFile(path.join(__dirname, "/static/play.html"));
});

app.get("/matchmake", function(req, res) {
    res.sendFile(path.join(__dirname, "/static/matchmake.html"));
});

app.get("/settings", function(req, res) {
    res.sendFile(path.join(__dirname, "/static/settings.html"));
});

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "/static/about.html"));
});

const joinRoom = (socket, room) => {
  // connect the client to the room
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
    freeRooms.push(room);   // push this newly created room into freeRooms so that it can be found by checkRooms()
    joinRoom(socket, room);

  } else {
    // if there is a room with a space, try to connect the client to it
    const room = freeRooms[0];
    console.log(socket.id, "wants to join", room.id);
    joinRoom(socket, room);
    freeRooms.pop(room.id)
  }
}

const getRooms = (socket, rooms) => {
  socket.emit("getRooms", rooms);
  console.log("sent");
}

server.listen(PORT, function() {
  console.log("server started on port %d", PORT);
});

//websocket handling
var clients = {}      //list of all clients
var rooms = {};       //list of all rooms, a room is defined in checkRooms()
var freeRooms = [];   //list of rooms with only one client in it, used for auto matchmaking
var roomNo = 0;       //not yet used
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
    });
    socket.on("getRooms", function() {
      console.log("Sending list of rooms!");
      // console.log(rooms);
      const entries = Object.entries(rooms);
      for(i=0; i<entries.length; i++){
        // iterates through rooms{} and changes the socket objects to number of sockets connected to rooms
        // did this because socketio doesnt allow you to emit self references of sockets
        var r = entries[i];
        r[1]["sockets"] = r[1]["sockets"].length;
        }
        // console.log(entries);
      socket.emit("giveRooms", entries);
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
