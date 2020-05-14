var socket = io();
let container;
let camera;
let controls;
let renderer;
let scene;
/*
player_num = 0 if not in a room
player_num = 1 if first to join room
player_num = 2 if second to join room

set by clearScreen
*/
var player_num = 0;

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

socket.on("clearScreen", function(n) {
  // calls functions to clear the screen and setup for rendering the models when client hear "clearScreen" emit from server
  clearMain("main");
  createStyle();
  createChat("main");
  dispChatOverlay();

  player_num = n;
  console.log("you are player: ", player_num);
});

socket.on("startGame", function(rid) {
  // starts running the game when it hears the "startGame" emit from the server
  console.log("starting game in room: ", rid);
  init();
});

socket.on("chatMessage", function(msg){
  writeChat(msg);
});

socket.on("modelEntries", function(entries) {
  // tells client to start rendering new models that crossed into their env
  console.log(entries.length, " models ENTERING environment!");
  addEntryMods(entries);
})

/*
some funcs that emit socket.io events
*/

function autoMatch(){
  // auto matchmaking
  console.log("auto matchmaking player");
  socket.emit("autoMatch");
}

function createRoom(){
  // create own room
  socket.emit("createRoom");
}

function sendChat(){
  // sends chat msgs

  // following three lines prevent the page from being reloaded after submitting
  var form = document.getElementById("myForm");
  function handleForm(event) { event.preventDefault(); }
  form.addEventListener("submit", handleForm);

  var input_field = document.getElementById("chat_bar");
  var msg = input_field.value;
  socket.emit("chatMessage", msg);
  input_field.value = "";   // reset the chat bar so it's blank again
}

function clientJoinRoom() {
  // join specific existing room with space
  var rName = event.target.id;
  socket.emit("clientJoin", rName);
}

/*

// HTML & CSS //

html is re-written on the web page to avoid any problems with routing and matchmaking with
sockets as a new socketID is given to a client when they navigate to a new html page

*/

function createStyle () {
  // writes css to head of play.html
  var css = document.createElement("style");
  css.type = "text/css";
  var text = "body { margin: 0; } canvas {  width: 100%; height: 100%; } form {  background: #000; padding: 0px; position: fixed; bottom: 0; width: 100%; height: 20px; } form input {	border: 0; padding: 0px; width: 90%; margin-right: 0.05%; height: 100%; } form button { background: rgb(140, 225, 255); padding: 0px; width: 9%; height: 100%; border: none; } #messages { list-style-type: none; margin: 0; padding: 0; } #messages li { padding: 5px 10px; } #messages li:nth-child(odd) { background: #eee; }";
  var css_text = document.createTextNode(text);
  css.appendChild(css_text);
  document.getElementsByTagName("head")[0].appendChild(css);
}

function createRoomsList(rooms) {
  // write lists of rooms gotten from server to html

  // TODO make list of rooms look nicer (give names & colours?)

  // string building
  var name_string = "Room name: ";
  var space_string = " ";
  var players_string = "Players: ";


  for(i=0; i<rooms.length; i++){

    var rName = rooms[i][0];                      // get the room name
    var noPlayers = rooms[i][1];                  // get number of players in the room


    var graph = document.createElement("p");      // create paragraph element
    var roomAndPlayers = name_string.concat(rName, space_string, players_string, noPlayers, space_string);  // concatenate all the strings

    // below adds the text to the div element
    var node = document.createTextNode(roomAndPlayers);
    graph.appendChild(node);

    if(noPlayers == 1){
      // make join buttons for rooms with 1 player in it
      var btn = document.createElement("button");
      btn.setAttribute("onclick", "clientJoinRoom()");
      btn.setAttribute("class", "button buttonJoin");
      btn.setAttribute("id", rName);
      btn.innerHTML = "Join Room";
      graph.appendChild(btn);
    }

    var element = document.getElementById("list_div");
    element.appendChild(graph);
  }
}

function createChat(elementID){
  // func for creating chat box on screen
  // TODO make chat bar look nicer
  // TODO: make functioning chatw
  var div = document.getElementById(elementID);

  div.innerHTML = '<ul id="messages"></ul> <form id="myForm" action=""> <input style="float:left" placeholder="..."  id="chat_bar" autocomplete="off"/> <button style="float:right" onclick="sendChat(messages)">Send</button> </form>';
}

function dispChatOverlay(){
  // func changes disp from none -> block
  document.getElementById("chatoverlay").style.display = "block";
}

function dispTimerOverlay(){
  // func changes disp from none -> block
  document.getElementById("timeroverlay").style.display = "block";
}

function writeChat(msg){
  // function to write chat msg to screen(html)
  // NOTE: do this using overlay

  var chat_text = document.getElementById("chattext");
  chat_text.innerHTML = msg;
  return;
}

function writeTimer(time){
  // func for writing amount of time left at top of screen

  var timer_text = document.getElementById("timertext");
  timer_text.innerHTML = time;
  return;
}

function clearMain(elementID){
  // func for clearing room list off screen
  var div = document.getElementById(elementID);

  while(div.firstChild) {
    div.removeChild(div.firstChild);
  }
}



function scoreDisp(score) {
  // TODO: write function that displays score to each player
  // NOTE: do this using overlay

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
  // TODO: figure out if we need this anymore?
  // function for tracking mouse movement on screen (x,y) coords
  client_x = event.x;
  client_y = event.y;

  // console.log( `mouse x: ${client_x} | mouse y: ${client_y}`);
}
// NOTE: not needed
// window.addEventListener("mousemove", mousemove, true);

function onWindowResize() {
  // window resizing func
  // TODO: Fix, "cant read clientWidth of null"
  // TODO: figure out if needed?
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

It used to be loaded from the official three.js link but was changed
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

  const directional_light = new THREE.DirectionalLight( 0xffffff );
  directional_light.position.set( 0, 1, 1 ).normalize();

  scene.add( directional_light );
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


var models = []; // lists of models to be rendered
function onLoad(gltf, pos, rot, player, type) {
  // func adds models to scene & models array and also adds animation to mixer array
  var obj = gltf.scene.children[0];

  // color changing depending on player
  if(type == "init"){
    obj.name = player_num;
  } else{
    obj.name = player;
  }

  if(obj.name == 1){
    obj.material.color.set(0x000099);
  } else {
    obj.material.color.set(0x990000);
  }

  obj.position.copy(pos);

  if(rot != false){
    // check if a certain rotation needs to be set
    obj.rotateX(rot._x);
    obj.rotateY(rot._y);
    obj.rotateZ(rot._z);
  }
  const animation = gltf.animations[0];

  const mixer = new THREE.AnimationMixer(obj);
  mixers.push(mixer);

  console.log(obj);
  const action = mixer.clipAction(animation);
  action.play();
  models.push(obj);
  scene.add(obj);
}



function addMods(mod_file, x, y, z, rotation, player, err, type){
// generic func for add models/objects

  lodr.load(mod_file, gltf => onLoad(gltf, new THREE.Vector3(x, y, z), rotation, player, type), onProgress, err);
  return;
}

const lodr = new THREE.GLTFLoader();
function initMods() {
  // func for loading the initial set of .glb models & adding to three.js scene
  const init_mods_amt = 3;
  const initModsError = (errorMsg) => {console.error("init mods ERR: ", errorMsg);};
  const glb = "/static/assets/models/Parrot.glb";
  for(i=0; i<init_mods_amt; i++){
    // only using parrot model for now
    var x = getRandomNum(-300, 300);
    var y = getRandomNum(-300, 300);
    var z = getRandomNum(-200, 300);
    addMods(glb, x, y, z, false, player_num, initModsError, "init");
  }
}



function addEntryMods(entry_mods) {
  // function for adding new models to the Scene
  // should only be called by socketio emit condition "modelEntries" (when a bird crosses a boundary)


  const entryModsError = (errorMsg) => {console.error("entry mods ERR: ", errorMsg);};
  const glb = "/static/assets/models/Parrot.glb";

// NOTE: tried tonnes of fucking ways to change angle at which birds enter to stop dissapearing birds but
// spawning closer towards origin seems to be most consitent.
// angle at which they need to enter depends so much on how they exit.
// Solution has side effect of making transition less seamless.
  for(i=0; i<entry_mods.length;i++){
    // get positions and rotations and create new birdie

    var x = entry_mods[i].position.x;
    if(x < 0){
      // attempt to fix dissapearing bird problem
      x+=5;
    } else {
      x-=5;
    }
    var y = entry_mods[i].position.y;
    if(y < 0){
      // attempt to fix dissapearing bird problem
      y+=5;
    } else {
      y-=5;
    }
    var z = entry_mods[i].position.z - 10;
    if(y < 0){
      // attempt to fix dissapearing bird problem
      y+=5;
    } else {
      y-=5;
    }

// just keep same rotation, nearly ripped hair out trying to figure outwhich angle they should enter at. :/
    var rots = entry_mods[i].rotation;

    var entry_no = entry_mods[i].p_no;

    addMods(glb, x, y, z, rots, entry_no, entryModsError, "add");

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
          rotation: {},
          p_no: 0
        };

        info.position.x = (models[i].position.x * -1.0);
        info.position.y = (models[i].position.y * -1.0);
        info.position.z = (models[i].position.z * -1.0);
        info.rotation = models[i].rotation;
        info.p_no = models[i].name;

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


// const y_axis_flip = new THREE.Vector3(0,1,0);
function movement(model) {
  // updates model position
  // TODO: write the boid logic here
  model.rotateX(getRandomNum(-0.03, 0.03));
  model.rotateY(getRandomNum(-0.03, 0.03));
  model.rotateZ(getRandomNum(-0.03, 0.03));
  model.translateZ(2.5);
  /*
  // NOTE: tried all different types of changing about the angles at which birds travel along z axis but couldnt get it to work smoothly or consistently.
  // birds would be redirected in the way i want from one direction and just be fucked off randomly when approaching from another angle.
  // TODO: learn more about quaternions. DONE!
  // NOTE: did some research on quaternions but still cant get this to work consistently
  // var curr_coords = model.getWorldPosition();
  // var rotation;
  // // console.log(curr_coords);
  // if( (Math.abs(curr_coords.z) + 5) > 800){
  //   // if going to go outside desired z coords change angle
  //   rotation = model.rotation._y;
  //   // model.setRotationFromAxisAngle(y_axis_flip, (180 + rotation));
  //   model.rotateY(180 + (rotation*2));
  //   model.translateZ(5);
  // }
  */

  // console.log(model.getWorldPosition());
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


/*
MAIN FUNCTION
*/

function startTimer(time){
  var t = setInterval(function() {
    time = time - 1;
    writeTimer(time);

    if(time < 1){
      clearInterval(t);
      endGame();
    }
  }, 1000);
}

function init() {
  //setting up three.js scene
  container = document.querySelector('#scene-container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xC5C5C4);
  var game_length = 60;


  if(DEV == true){
    var stats = new Stats();
    stats.showPanel(0, 1, 2, 3);
    document.body.appendChild(stats.dom);
    createCamera();
    createLights();
    initMods();
    createRenderer();
    dispTimerOverlay();
    startTimer(game_length);    // starts a setInterval func for the timer


    // TODO: maybe think about splitting this up into init() and startGame()?

    renderer.setAnimationLoop ( () => {
      // rendering and animation loop
      stats.begin();
      update();
      render();
      // scoreCalc();
      stats.end();
    });


  } else {
    createCamera();
    createLights();
    initMods();
    createRenderer();
    dispTimerOverlay();
    startTimer(game_length);      // starts a setInterval func for the timer

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
