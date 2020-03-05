var socket = io();

socket.emit("getRooms");

socket.on("giveRooms", function(rooms) {
  console.log(rooms.length);
  console.log("Rooms: ", rooms);
});
