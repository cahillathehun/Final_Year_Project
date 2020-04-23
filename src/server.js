
//dependencies
const uuid = require("uuid/v1")
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

server.listen(PORT, function() {
  console.log("server started on port %d", PORT);
});

async function joinRoom(socket, room) {
  // connect the client to the room
  await socket.join(room);
  console.log(socket.id, "joined", room);

};


function checkRooms(socket, roomArray) {
// auto-matchmaking logic

  if(!roomArray || !roomArray.length){
    //if there is no room with space create a new one
    const room = uuid();
    r_list.push(room);
    free_rooms.push(room);
    joinRoom(socket, room);
    return(null);

  } else {
    // if there is a room with a space, try to connect the client to it
    const room = free_rooms[0];
    console.log(socket.id, "wants to join", room);
    // connect client to rooms
    joinRoom(socket, room);
    free_rooms.pop(room);
    // room is now full so start the game
    return(room);
  }
}



//websocket handling
var r_list = [];
var free_rooms = [];   //list of rooms with only one client in it, used for auto matchmaking
io.on("connection", function(socket) {
    console.log("connection made");
    socket.on("newClient", function(){
    });

    socket.on("autoMatch", function(){
      // start the auto-matchmaking for the client
      var game_start_state = checkRooms(socket, free_rooms);

      socket.emit("clearScreen","cls");
      if (game_start_state){
        console.log("told room", game_start_state, "to start their game!")
        io.to(game_start_state).emit("startGame", game_start_state);
      }
    });

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });

    socket.on("getRooms", function() {
      // collates list of rooms and sends them to the client for displaying
      console.log("Sending list of rooms to client!");

      var display_rooms = [];
      var rooms = io.sockets.adapter.rooms;
      var r_name;
      var r_length;
      for(i=0; i<r_list.length; i++){
        r = r_list[i];
        // check if room in our room list exists anymore
        if(r in rooms){
          // if it does, add to list of display rooms
          r_length = rooms[r]["length"];
          var display_room = [ r, r_length];
          display_rooms.push(display_room);
        } else {
          // if it doesn't remove from our rooms list so that it doesnt get displayed
          r_list.splice(i,1);
        }
      }
      // emit the list of rooms to client for display
      socket.emit("giveRooms", display_rooms);
    });

    socket.on("modelExits", (models) => {
      // receive list of exiting models
      // console.log("exits occured: ", models[0]["object"]);
      // console.log("exits occured: ", models.length);

      let socket_and_room = Object.keys(socket.rooms);
      let room = socket_and_room[1];
      socket.to(room).emit("modelEntries", models);
    });

    socket.on("chatMessage", function(msg) {
      let socket_and_room = Object.keys(socket.rooms);
      let room = socket_and_room[1];
      io.to(room).emit("chatMessage", msg);
    })

    io.clients((error, clients) => {
      if(error) throw error;
      console.log("clients: ", clients);
    });
});
