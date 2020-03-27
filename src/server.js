
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
    return(false);

  } else {
    // if there is a room with a space, try to connect the client to it
    const room = freeRooms[0];
    console.log(socket.id, "wants to join", room.id);
    joinRoom(socket, room);
    // room is now full so start the game
    freeRooms.pop(room.id);
    return(room);
  }
}

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

    socket.on("autoMatch", function(){
      // console.log("a new player wants to play a game!");

      game_start_state = checkRooms(socket, freeRooms);
      // console.log("GSS: ");
      // console.log(game_start_state.id);
      socket.emit("clearScreen","cls");
      if (game_start_state){
        rs = io.sockets.adapter.rooms;
        console.log("ROOMS :", rs);
        // console.log("told room", game_start_state.id, "to start their game!")
        socket.to(game_start_state.id).emit("startGame", game_start_state.id);
      }
    });

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });

    socket.on("getRooms", function() {
      // console.log("Sending list of rooms to client!");
      // uses node package to clone "rooms" obj without ref to original so
      // it can be sent to client
      let copy = clone(rooms);
      console.log("ROOMS: ", rooms);
      console.log("sendable_rooms: ", copy);
      var entries = Object.entries(copy);

      for(i=0; i<entries.length; i++){
        // loop changes sockets to number of sockets in room
        entries[i][1]["sockets"] = entries[i][1]["sockets"].length;
        }
      // console.log("ROOMS: ", rooms);
      // console.log("ENTREIS: ", entries);
      socket.emit("giveRooms", entries);
      console.log(rooms);
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
