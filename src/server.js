
//dependencies
const uuid = require("uuid/v1");
const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const clone = require("clone-deep");
var app = express();
var server = http.Server(app);
var io = socketIO(server);

//set port to port 80
const PORT = 80;

app.set("port", (process.env.PORT || PORT));

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

const startGame = (roomid) => {
  socket.to(roomid).emit("startGame", "start the game");
  console.log("game starting in room: ", roomid);
}

const checkRooms = (socket, roomArray) => {
// auto-matchmaking logic

  if(!roomArray || !roomArray.length){
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
    // connect client to rooms
    joinRoom(socket, room);
    // room is now full so start the game
    startGame(room.id);
    freeRooms.pop(room.id)
  }
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

    socket.on("autoMatch", function(){
      console.log("a new player wants to play a game!");

      checkRooms(socket, freeRooms);
    });

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });

    socket.on("getRooms", function() {
      console.log("Sending list of rooms to client!");
      // TODO: the following code actually changes the "sockets" key in the room object to an int
      // instead of chaning the reference to the object

      // TODO: write own stringify function
      // below line uses json-stringify-safe to strnigify the object for cloning
      // this takes too long at the moment
      let copy = clone(rooms);
      var entries = Object.entries(copy);

      for(i=0; i<entries.length; i++){
        // iterates through rooms{} and converts socket objects to number of sockets connected to rooms
        // did this because socketio doesnt allow you to emit self references of sockets & message was too big to be sent
        entries[i][1]["sockets"] = entries[i][1]["sockets"].length;
        }
      console.log("ROOMS: ", rooms);
      console.log("ENTREIS: ", entries);
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
