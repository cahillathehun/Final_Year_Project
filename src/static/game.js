var socket = io();
let container;
let camera;
let controls;
let renderer;
let scene;


/*

/// DEV REQUIREMENTS ///

STATS TRACKING mainly just used for testing to show fps, latency and mem usage


*/
const DEV = false;





// SOCKET STUFF //

socket.emit("newPlayer");   // tells server a new player has joined

socket.emit("getRooms");    //tells the server it wants a list of the rooms

/*
socket.io funcs that listening for emits
listed in order in which they usually occur
*/

socket.on("giveRooms", function(rooms) {
  // calls createRoomsList when client hears "giveRoom" msg from server
  createRoomsList(rooms);
});

socket.on("clearScreen", function(rooms) {
  // calls functions to clear the screen and setup for rendering the models when client hear "clearScreen" emit from server
  clearMain("main");
  createStyle();
  createChat("main");
  createTimer("timer");
});

socket.on("startGame", function(rid) {
  // starts running the game when it hears the "startGame" emit from the server
  console.log("starting game in room: ", rid);
  init();
});

socket.on("chatMessage", function(msg){
  console.log("chat msg received: ", msg, " time to display on screen");
  writeChat(msg);
});

socket.on("modelEntries", function(entries) {
  // func that tells the client to start rendering new models as they have crossed into their environment
  console.log(entries.length, " models ENTERING environment!");
  // console.log(entries);
  addMods(entries);
})

/*
some funcs that emit socket.io events
*/

function autoMatch(){
  // function for auto matchmaking
  console.log("auto matchmaking player");
  socket.emit("autoMatch");
}

function chatMsg(){
  // func for sending chat msgs to opponent

  // following three lines prevent the page from being reloaded after submitting
  var form = document.getElementById("myForm");
  function handleForm(event) { event.preventDefault(); }
  form.addEventListener("submit", handleForm);

  var input_field = document.getElementById("chat_bar");
  var msg = input_field.value;
  socket.emit("chatMessage", msg);
  input_field.value = "";   // reset the chat bar so it's blank again
}

/*

// HTML & CSS //

html is re-written on the web page to avoid any problems with routing and matchmaking with
sockets as a new socketID is given to a client when they load a completely new html page

*/

function createStyle () {
  // func for writing css to head of play.html
  var css = document.createElement("style");
  css.type = "text/css";
  var text = "body { margin: 0; } canvas {  width: 100%; height: 100%; } form {  background: #000; padding: 0px; position: fixed; bottom: 0; width: 100%; height: 20px; } form input {	border: 0; padding: 0px; width: 90%; margin-right: 0.05%; height: 100%; } form button { background: rgb(140, 225, 255); padding: 0px; width: 9%; height: 100%; border: none; } #messages { list-style-type: none; margin: 0; padding: 0; } #messages li { padding: 5px 10px; } #messages li:nth-child(odd) { background: #eee; }";
  var css_text = document.createTextNode(text);
  css.appendChild(css_text);
  document.getElementsByTagName("head")[0].appendChild(css);
}

function createRoomsList(rooms) {
  // strings used for string building below for writing into the div html element
  // TODO make list of rooms look nicer

  var name_string = "Room name: ";
  var space_string = " ";
  var players_string = "Players: ";
  var btn = document.createElement("button");
  btn.setAttribute("onclick", "join()");
  btn.setAttribute("class", "buttonJoin");
  btn.innerHTML = "Join Room";
  for(i=0; i<rooms.length; i++){
    var graph = document.createElement("p");      // create paragraph element

    var rName = rooms[i][0];                      // get the room name
    var noPlayers = rooms[i][1];                  // get number of players in the room

    var roomAndPlayers = name_string.concat(rName, space_string, players_string, noPlayers, space_string);  // concatenate all the strings

    // below adds the text to the div element
    var node = document.createTextNode(roomAndPlayers);
    graph.appendChild(node);
    graph.appendChild(btn);
    var element = document.getElementById("list_div");
    element.appendChild(graph);
  }
}

function createChat(elementID){
  // func for creating chat box on screen
  // TODO make chat bar look nicer
  // TODO: make functioning chatw
  var div = document.getElementById(elementID);

  div.innerHTML = '<ul id="messages"></ul> <form id="myForm" action=""> <input style="float:left" placeholder="..."  id="chat_bar" autocomplete="off"/> <button style="float:right" onclick="chatMsg(messages)">Send</button> </form>';
}


function writeChat(msg){
  // function to write chat msg to screen(html)
  // TODO: finish writing chat feature
  console.log(msg);
  return;
}

function clearMain(elementID) {
  // func for clearing room list off screen
  var div = document.getElementById(elementID);

  while(div.firstChild) {
    div.removeChild(div.firstChild);
  }

}


function createTimer(elementID){
  var div = document.getElementById(elementID);
  var game_length = 60;
  div.innerHTML = '<p id="number" style="font-size: 60px">' + game_length.toString() + '</p>';
}
function scoreDisp(score) {
  // TODO: write function that displays score to each player

  return false;
}

/*

// EVENT LISTENERS //

*/

var accel_x;
var accel_y;
function handleOrientation(event) {
  // func for handling mobile device orientation
  var accel_x = event.beta;
  var accel_y = event.gamma;

  console.log(`accelerometer x: ${accel_x} | accelerometer y: ${accel_y}`);
}
window.addEventListener("deviceorientation", handleOrientation, true);


var client_x;
var client_y;
function mousemove(event){
  // function for tracking mouse movement on screen (x,y) coords
  client_x = event.x;
  client_y = event.y;

  console.log( `mouse x: ${client_x} | mouse y: ${client_y}`);
}
window.addEventListener("mousemove", mousemove, true);

function onWindowResize() {
  //window resizing func
  // TODO: Fix, "cant read clientWidth of null"
  camera.aspect = container.clientWidth / container.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);


/*

// GLTF & THREE.JS STUFF //

GLTF loader is used to loader .glb models from:
  /src/static/assets/models/

three.js is used for the rendering and is loaded by:
  /src/static/play.html
from:
  /src/static/scripts/three.js
it used to be loaded from the official three.js link but was changed
as loading it locally is faster and more reliable

*/

const mixers = []
const clock = new THREE.Clock();
var frustum = new THREE.Frustum();

function createCamera() {
  //init camera
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );

  camera.position.x = -50;
  camera.position.y = 50;
  camera.position.z = 1200;
  camera.updateMatrix();
  camera.updateMatrixWorld();
  frustum.setFromProjectionMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );

}

function createLights() {
  //init lights
  const ambient_light = new THREE.AmbientLight( 0xcccccc );
  scene.add(ambient_light);

  const directiona_light = new THREE.DirectionalLight( 0xffffff );
  directiona_light.position.set( 0, 1, 1 ).normalize();

  scene.add( directiona_light );
}

function createRenderer() {
  //init renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor( 0xC5C5C3 );
  document.body.appendChild( renderer.domElement );

}

const onProgress = () => {};
function addMods(entries) {
  // func for loading the .glb models and adding to the three.js scene
  for(i=0; i<entries.length; i++){
    // iterate through entries array and add to scene in the right place
    entry = entries[i];
  }
}

var models = []; // lists of models to be rendered
function onLoad(gltf, pos, rot) {
  // func adds models to scene & models array and also adds animation to mixer array
  var obj = gltf.scene.children[0];
  obj.position.copy(pos);
  if(rot != false){
    obj.rotateX(rot._x);
    obj.rotateY(rot._y);
    obj.rotateZ(rot._z);
  }
  const animation = gltf.animations[0];

  const mixer = new THREE.AnimationMixer(obj);
  mixers.push(mixer);

  const action = mixer.clipAction(animation);
  action.play();
  models.push(obj);
  scene.add(obj);
}

const lodr = new THREE.GLTFLoader();
function initMods() {
  // func for loading the initial set of .glb models & adding to three.js scene
  const init_mods_amt = 3;
  const onError = (errorMsg) => {console.error(errorMsg);};
  for(i=0; i<init_mods_amt; i++){
    // only using parrot model for now
    lodr.load("/static/assets/models/Parrot.glb", gltf => onLoad(gltf, new THREE.Vector3(getRandomNum(-300, 300),getRandomNum(-300, 300),getRandomNum(-200, 300)), false), onProgress, onError);
  }

}



function addMods(entry_mods) {
  // function for adding new models to the Scene
  // should only be called by socketio emit condition "modelEntries" (when a bird crosses a boundary)

  const onError = (errorMsg) => {console.error(errorMsg);};

  for(i=0; i<entry_mods.length;i++){
    // get positions and rotations and create new birdie
    console.log(entry_mods[i].position.x);
    var x = entry_mods[i].position.x;
    var y = entry_mods[i].position.y;
    var z = entry_mods[i].position.z;
    var rots = entry_mods[i].rotation;

    lodr.load("/static/assets/models/Parrot.glb", gltf => onLoad(gltf, new THREE.Vector3(x, y, z), rots), onProgress, onError);
  }
}

function update() {
  //func for updating animations
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }

  if(models.length > 0){
    var exits = [];


    for(i=0; i<models.length; i++){
      movement(models[i]);

      if( ! (frustum.intersectsObject(models[i])) ){
        // TODO: this logic has to be updated to allow some leeway for models that have just been rendered. right now objects are being deleted from models[] when they shouldnt be, resulting in birds permanently disappearing over time.
        const info = {
          position: {},
          rotation: {}
        };
        // console.log(models[i].position);
        info.position.x = (models[i].position.x * -1.0);
        info.position.y = (models[i].position.y * -1.0);
        info.position.z = (models[i].position.z * -1.0);
        info.rotation = models[i].rotation;

        exits.push(info);
        models.splice(i, 1);
        mixers.splice(i, 1);
      }

    }

    if(exits.length > 0){
      socket.emit("modelExits", exits);
      console.log(exits.length, "models EXITING environment!");
    }
  }
}


/*
GENERAL FUNCTIONS
*/

function render() {
  //func for rendering mods
  renderer.render( scene, camera );
}

function getRandomNum(min, max){
  return Math.random() * (max - min) + min;
}

function movement(model) {
  // function for updating movement in the environment
  // TODO: write the boid logic here
  model.rotateX(getRandomNum(-0.05, 0.05));
  model.rotateY(getRandomNum(-0.05, 0.05));
  model.rotateZ(getRandomNum(-0.05, 0.05));
  model.translateZ(5);
}

function endGame() {
  console.log("GAME OVER!");
}

var player_score = 0;
function scoreCalc(){
  // TODO: write function to calculate score for each player. should be based on how long each boid spends on each player's screen.
  player_score += models.length;
  scoreDisp(player_score);
}
//
// function timerCalc(){
//   // TODO: write timer function to time the game
//   timerDisp(time);
//   return false;
// }

/*
MAIN FUNCTION
*/
function init() {
  //setting up three.js scene
  container = document.querySelector('#scene-container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xC5C5C4);

  if(DEV == true){
    var stats = new Stats();
    stats.showPanel(0, 1, 2, 3);
    document.body.appendChild(stats.dom);
    createCamera();
    createLights();
    initMods();
    createRenderer();


    // TODO: maybe think about splitting this up into init() and startGame()?

    renderer.setAnimationLoop ( () => {
      // rendering and animation loop
      stats.begin();
      update();
      render();
      // scoreCalc();
      // timerCalc();
      stats.end();
    });


  } else {
    createCamera();
    createLights();
    initMods();
    createRenderer();

    // TODO: maybe think about splitting this up into init() and startGame()?

    renderer.setAnimationLoop ( () => {
      // rendering and animation loop

      update();
      render();
      // scoreCalc();
      // timerCalc();

    });
  }
}
