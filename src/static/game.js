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
  document.getElementById("chatoverlay").style.display = "block";

  player_num = n;
  console.log("you are player: ", player_num);
});

socket.on("startGame", function(rid) {
  // starts running the game when it hears the "startGame" emit from the server
  console.log("starting game in room: ", rid);
  init();
});

socket.on("chatMessage", function(msg){
  // TODO: create checks to prevent code injection
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
  // tell server you want to create your own room
  socket.emit("createRoom");
}

function sendChat(){
  // sends chat msgs
  // TODO: do some checking of the string to make sure no html can be run/ protect against code injections

  // following three lines prevent the page from being reloaded after sending chat as that usually happens with forms
  var form = document.getElementById("myForm");
  function handleForm(event) { event.preventDefault(); }
  form.addEventListener("submit", handleForm);

  var input_field = document.getElementById("chat_bar");
  var msg = input_field.value;
  socket.emit("chatMessage", msg);
  input_field.value = "";   // reset the chat bar so it's blank again
}

function clientJoinRoom() {
  // join specific existing room
  var r_name = event.target.id;
  socket.emit("clientJoin", r_name);
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

    var r_name = rooms[i][0];                      // get the room name
    var no_players = rooms[i][1];                  // get number of players in the room


    var graph = document.createElement("p");      // create paragraph element
    var roomAndPlayers = name_string.concat(r_name, space_string, players_string, no_players, space_string);  // concatenate all the strings

    // below adds the text to the div element
    var node = document.createTextNode(roomAndPlayers);
    graph.appendChild(node);

    if(no_players == 1){
      // make join buttons for rooms with 1 player in it
      var btn = document.createElement("button");
      btn.setAttribute("onclick", "clientJoinRoom()");
      btn.setAttribute("class", "button buttonJoin");
      btn.setAttribute("id", r_name);
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

function writeChat(msg){
  // function to write chat msg to screen(html)
  // NOTE: do this using overlay
// TODO: create checks to prevent against code injections
  var chat_text = document.getElementById("chattext");
  chat_text.innerHTML = msg;
}

function writeTimer(time){
  // func for writing amount of time left at top of screen

  var timer_text = document.getElementById("timertext");
  timer_text.innerHTML = time;
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

/*
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
*/

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

const mixers = []     //array of animations for each model
const clock = new THREE.Clock();
var frustum = new THREE.Frustum();

function createCamera() {
  //init camera
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );

  camera.position.x = -50;
  camera.position.y = 50;
  camera.position.z = 1150;
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

  obj.position.copy(pos);

  // TODO: fix this so it doesn't completely fucking break with the new boids alg

  // color changing depending on player
  if(type == "init"){
    obj.name = player_num;
    obj.userData.velocity = new THREE.Vector3(0,0,0);   // add velocity property to boids
  } else {
    obj.userData.velocity = new THREE.Vector3(0,0,0);   // add velocity property to boids

    // calc entry's velocity & new pos
    var vec1 = calcFlockCenter(obj);
    obj.userData.velocity.add(vec1);

    var vec2 = repulseFromOthers(obj);
    obj.userData.velocity.add(vec2);

    var vec3 = matchVelocity(obj);
    obj.userData.velocity.add(vec3);

    var new_pos = new THREE.Vector3();
    new_pos.add(obj.position);
    new_pos.add(obj.userData.velocity);
    obj.lookAt(new_pos);
    obj.position.add(obj.userData.velocity);

    // give entry a player name tag
    obj.name = player;
  }

  if(obj.name == 1){
    obj.material.color.set(0x000099);
  } else {
    obj.material.color.set(0x990000);
  }


  if(rot != false){
    // check if a certain rotation needs to be set
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
  console.log("LODR: ", models);
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
  const init_mods_amt = 20;
  const initModsError = (errorMsg) => {console.error("init mods ERR: ", errorMsg);};
  const glb = "/static/assets/models/Parrot.glb";
  for(i=0; i<init_mods_amt; i++){
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
    if(z < 0){
      // attempt to fix dissapearing bird problem
      z+=5;
    } else {
      z-=5;
    }

// just keep same rotation, nearly ripped hair out trying to figure outwhich angle they should enter at. :/
    var rots = entry_mods[i].rotation;

    var entry_no = entry_mods[i].p_no;

    addMods(glb, x, y, z, rots, entry_no, entryModsError, "add");
  }
}

const center_neighbour_dist = 90;
function calcFlockCenter(boid){
  var flock_center = new THREE.Vector3();
  for(var b=0; b<models.length; b++){
    var center_dist = models[b].position.distanceTo(boid.position);
    if(center_dist < center_neighbour_dist){
      if(models[b] != boid){ flock_center.add(models[b].position) }
    }
  }
  flock_center.divideScalar(models.length - 1);

  flock_center.sub(boid.position);
  flock_center.divideScalar(800);

  return flock_center;
  console.log("center calc done.");
}

const min_dist = 60;
function repulseFromOthers(birdie){
  var repulse = new THREE.Vector3();

  for(var other=0; other<models.length; other++){

    if(models[other] != birdie){

      var distance = models[other].position.distanceTo(birdie.position);
      if(distance < min_dist){
        var difference = new THREE.Vector3();
        difference.subVectors(models[other].position, birdie.position);
        difference.divideScalar(60);    // the higher the number the smaller the distance repulsed but smoother transition
        repulse.sub(difference);
      }
    }
  }
  return repulse;
}

const velo_num = 12;
const vel_neighbour_dist = 120;
function matchVelocity(bird){
  var perceived_velocity = new THREE.Vector3();
  for(var iter=0; iter<models.length; iter++){
    var vel_dist = models[iter].position.distanceTo(bird.position);
    if(vel_dist < vel_neighbour_dist){
      if(models[iter] != bird){ perceived_velocity.add(models[iter].userData.velocity); }
    }
  }
  perceived_velocity.divideScalar(models.length - 1);
  var diff = new THREE.Vector3();
  diff.subVectors(perceived_velocity, bird.userData.velocity);
  diff.divideScalar(velo_num);
  return diff;
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
      // console.log("user data: ", models[i].userData);
      /*
      PSUEDOCODE
      FOR EACH BOID b
  			v1 = rule1(b)
  			v2 = rule2(b)
  			v3 = rule3(b)

  			b.velocity = b.velocity + v1 + v2 + v3
  			b.position = b.position + b.velocity
		  END
      */
      var v1 = calcFlockCenter(models[i]);
      models[i].userData.velocity.add(v1);

      var v2 = repulseFromOthers(models[i]);
      models[i].userData.velocity.add(v2);

      var v3 = matchVelocity(models[i]);
      models[i].userData.velocity.add(v3);

      var new_pos = new THREE.Vector3();
      new_pos.add(models[i].position);
      new_pos.add(models[i].userData.velocity);
      var line = new THREE.Line3(models[i].position, new_pos);
      var look_point = new THREE.Vector3();
      line.getCenter(look_point)
      // console.log(vel);
      // console.log(models[i].rotation);
      models[i].lookAt(look_point);
      models[i].position.add(models[i].userData.velocity);

      if( ! (frustum.intersectsObject(models[i])) ){
        // TODO: this logic has to be updated to allow some leeway for models that have just been rendered. right now objects are being deleted from models[] when they shouldnt be, resulting in birds permanently disappearing over time.
        const info = {
          position: {},
          rotation: {},
          p_no: 0,
          velo: {}
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


function endGame() {
  // TODO: implement end game
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
  /// TODO: can put score calculations in here
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
  var game_length = 60;   // game length in seconds


  if(DEV == true){
    var stats = new Stats();
    stats.showPanel(0, 1, 2, 3);
    document.body.appendChild(stats.dom);
    createCamera();
    createLights();
    initMods();
    createRenderer();
    document.getElementById("timeroverlay").style.display = "block";
    startTimer(game_length);    // starts a setInterval func for the timer


    // TODO: maybe think about splitting this up into init() and startGame()?

    renderer.setAnimationLoop ( () => {
      // rendering and animation loop
      stats.begin();
      update();
      render();
      stats.end();
    });


  } else {
    createCamera();
    createLights();
    initMods();
    createRenderer();
    document.getElementById("timeroverlay").style.display = "block";
    startTimer(game_length);      // starts a setInterval func for the timer

    // TODO: maybe think about splitting this up into init() and startGame()?

    renderer.setAnimationLoop ( () => {
      // rendering and animation loop

      update();
      render();

    });
  }
}
