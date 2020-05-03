// $.getScript ( "socketio.js", function() {
//   var socket = io.connect(localhost:80);
// });

var socket = io();

socket.emit("getRooms");    //tells the server it wants a list of the rooms
var roomList = []

function autoMatch(){
  // function for auto matchmaking
  console.log("auto matchmaking player");
  socket.emit("autoMatch");
}

socket.on("giveRooms", function(rooms) {
  // listens for the "giveRoom" message from the server
  roomList = rooms;
  // strings used for string building below for writing into the div html element
  var name_string = "Room name: ";
  var space_string = " ";
  var players_string = "Players: "


  for(i=0; i<roomList.length; i++){
    var graph = document.createElement("p");      // create paragraph element
    var rName = roomList[i][0];                   // get the room name
    var noPlayers = roomList[0][1]["sockets"];    // get number of players in the room
    console.log("players: ", noPlayers);
    var roomAndPlayers = name_string.concat(rName, space_string, players_string, noPlayers);  // concatenate all the strings
    // below adds the text to the div element
    var node = document.createTextNode(roomAndPlayers);
    graph.appendChild(node);
    var element = document.getElementById("div1");
    element.appendChild(graph);
  }
});
