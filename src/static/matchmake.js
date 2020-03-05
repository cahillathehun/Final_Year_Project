var socket = io();

socket.emit("getRooms");    //tells the server it wants a list of the rooms
var roomList = []
socket.on("giveRooms", function(rooms) {
  // listens for the "giveRoom" message from the server
  roomList = rooms;
  console.log("yo")

  console.log("Rooms: ", roomList);
  for(i=0; i<roomList.length; i++){
    var graph = document.createElement("p");
    var node = document.createTextNode(roomList[i]);
    graph.appendChild(node);
    var element = document.getElementById("div1");
    element.appendChild(graph);
  }
});
