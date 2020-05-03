import autoMatch from "../../src/static/game.js";
// import createStyle from "../../src/static/game";
// import createRoomsList from "../../src/static/game";
// import createChat from "../../src/static/game";
// import clearMain from "../../src/static/game";
// import handleOrientation from "../../src/static/game";
// import mousemove from "../../src/static/game";
// import onWindowResize from "../../src/static/game";
// import createCamera from "../../src/static/game";
// import createLights from "../../src/static/game";
// import createRenderer from "../../src/static/game";
// import loadMods from "../../src/static/game";
// import update from "../../src/static/game";
// import render from "../../src/static/game";
// import init from "../../src/static/game";

// script(src='/socket.io/socket.io.js')
// --------------------------------------------
// const expect = require("chai");
// const socket = require("socket.io");
// const io     = require('socket.io-client');
// var app = require('../../src/server');

// var socketUrl = 'http://localhost:80';

// var SocketTester = require('socket-tester');

// var options = {
//     transports: ['websocket'],
//     'force new connection': true,
//     'forceNew': true
//   };

// var socketTester = new SocketTester(io, socketUrl, options);
// // var room = 'lobby';


// const NODE_PORT = process.env.NODE_PORT || 80

// describe("Game test", () => {
//     describe("Check autoMatch test", () => {
//         it("should return a string confirming automatch", function(done) {

//             var client1 = {
//                 on: {
//                     'message': socketTester.shouldBeCalledNTimes(0)
//                     // for some reason, assert in socket-tester cannot assert
//                     // anything other than 0.
//                     // May have to change the testing structure... again...
//                 },
//                 emit: {
//                     'join room': 'room'
//                 }
//             };

//             var client2 = {
//                 emit: {
//                     // 'join room':room,
//                     'message': socketTester.emitNTimes(2)
//                 }
//             };

//             socketTester.run([client1, client2], done);


//         });

//         it("Operation should not be called", function(done) {

//             var client1 = {
//                 on: {
//                     'message': socketTester.shouldNotBeCalled()
//                 },
//                 emit: {
//                     'join room': 'room'
//                 }
//             };

//             var client2 = {
//                 emit: {
//                     'join room':'room',
//                     'message': 'test'
//                 }
//             };

//             socketTester.run([client1, client2], done);


//         });
// // copy from here
//         it("test template here(Will always pass)", function(done) {
//         // set the client actions on recieving <event 'message'>
//             var client1 = {
//                 on: {
//                     'message': socketTester.shouldNotBeCalled()
//                 },
//                 // what this should emit itself
//                 emit: {
//                     'join room': 'room'
//                 }
//             };
//             // second mock client
//             var client2 = {
//                 emit: {
//                     'join room':'room',
//                     'message': 'test'
//                 }
//             };

//             socketTester.run([client1, client2], done);


//         });
// //to here for test template




//     });

// });

// ----------------------------------------------------
