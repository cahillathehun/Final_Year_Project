var socket = io();
let container;
let camera;
let controls;
let renderer;
let scene;



var roomList = []


function autoMatch(){
  // function for auto matchmaking
  console.log("auto matchmaking player");
  socket.emit("autoMatch");
}

function createStyle () {
  var css = document.createElement("style");
  css.type = "text/css";
  var text = "body { margin: 0; } canvas {  width: 100%; height: 100%; } form {  background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; } form input {	border: 0; padding: 10px; width: 90%; margin-right: 5%; } form button { background: rgb(140, 225, 255); padding: 10px; width: 9%; border: none; } #messages { list-style-type: none; margin: 0; padding: 0; } #messages li { padding: 5px 10px; } #messages li:nth-child(odd) { background: #eee; }";
  var css_text = document.createTextNode(text);
  css.appendChild(css_text);
  document.getElementsByTagName("head")[0].appendChild(css);
}

function createRoomsList(rooms) {
  roomList = rooms;
  // strings used for string building below for writing into the div html element

  var name_string = "Room name: ";
  var space_string = " ";
  var players_string = "Players: "

  for(i=0; i<rooms.length; i++){
    var graph = document.createElement("p");      // create paragraph element
    var rName = rooms[i][0];                   // get the room name
    var noPlayers = rooms[i][1]["sockets"];    // get number of players in the room
    console.log("players: ", noPlayers);
    var roomAndPlayers = name_string.concat(rName, space_string, players_string, noPlayers);  // concatenate all the strings
    // below adds the text to the div element
    var node = document.createTextNode(roomAndPlayers);
    graph.appendChild(node);
    var element = document.getElementById("list_div");
    element.appendChild(graph);
  }
}

function createChat(elementID){
  // func for creating chat box on screen

  var div = document.getElementById(elementID);
  div.innerHTML = '<ul id="messages"></ul>';
  div.innerHTML = '<form action="">';
  div.innerHTML = '<input id="m" autocomplete="off"/>';
  div.innerHTML = '<button>Send</button>';
  div.innerHTML = '</form>';
}

function clearMain(elementID) {
  // func for clearing romm list off screen
  var div = document.getElementById(elementID);

  while(div.firstChild) {
    div.removeChild(div.firstChild);
  }

}

socket.emit("getRooms");    //tells the server it wants a list of the rooms

socket.on("giveRooms", function(rooms) {
  // calls createRoomsList when client hears "giveRoom" msg from server
  createRoomsList(rooms);
});


socket.on("clearScreen", function(rooms) {
  clearMain("main");
  createStyle();
  createChat("main");
});



socket.on("startGame", function(rid) {
  console.log("starting game in room: ", rid);
  // TODO: create startGame Function
  // startGame();
  //start loop
  init();
});















const mixers = []
const clock = new THREE.Clock();


//stats tracking, displays in top right corner
var stats = new Stats();
stats.showPanel(0, 1, 2, 3);
document.body.appendChild(stats.dom);

function getRandomNum(min, max){
  // get rand no between min and max
  return Math.random() * (max - min) + min;
}

//device orientation tracking
var accelX;
var accelY;
function handleOrientation(event) {
  // func for handling mobile device orientation
  var accelX = event.beta;
  var accelY = event.gamma;

  console.log(`accelerometer x: ${accelX} | accelerometer y: ${accelX}`);
}
window.addEventListener("deviceorientation", handleOrientation, true);


//mouse movement tracking
var clientX;
var clientY;
function mousemove(event){
  // function for tracking mouse movement on screen (x,y) coords
  clientX = event.x;
  clientY = event.y;

  console.log( `mouse x: ${clientX} | mouse y: ${clientY}`);
}
window.addEventListener("mousemove", mousemove, true);

//resizing func
function onWindowResize() {
  // TODO: fix this, doesnt work at all and gives warning/error msg
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);





//init camera
function createCamera() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );

  camera.position.x = -50;
  camera.position.y = 50;
  camera.position.z = 1200;
}

//init lights
function createLights() {
  const ambientLight = new THREE.AmbientLight( 0xcccccc );
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0, 1, 1 ).normalize();

  scene.add( directionalLight );
}

//init renderer
function createRenderer() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor( 0xC5C5C3 );
  document.body.appendChild( renderer.domElement );
}

var models = []; // lists of models to be rendered
function loadMods() {
  const lodr = new THREE.GLTFLoader();

  const onLoad =(gltf, pos) => {
    var obj = gltf.scene.children[0];
    obj.position.copy(pos);

    const animation = gltf.animations[0];

    const mixer = new THREE.AnimationMixer(obj);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();
    models.push(obj);
    scene.add(obj);
  };

  const onProgress = () => {};

  const onError = (errorMsg) => {console.error(errorMsg);};

  var z = 0;
  for(i=0;i<100;i++){
    lodr.load("/static/assets/models/Parrot.glb", gltf => onLoad(gltf, new THREE.Vector3(getRandomNum(-300, 300),getRandomNum(-300, 300),getRandomNum(-200, 300))), onProgress, onError);
  }
}


//func for updating animations
function update() {
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }

  if(models.length > 0){
    for(const model of models){
      // movement loop, just a placeholder for now
      model.rotateX(getRandomNum(-0.05, 0.05));
      model.rotateY(getRandomNum(-0.05, 0.05));
      model.rotateZ(getRandomNum(-0.05, 0.05));
      model.translateZ(3);
    }
  }
}

//func for rendering mods
function render() {
  renderer.render( scene, camera );
}

//setting up three.js scene
function init() {
  container = document.querySelector('#scene-container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xC5C5C4);

  createCamera();
  createLights();
  loadMods();
  createRenderer();

  renderer.setAnimationLoop ( () => {
    // rendering and animation loop
    stats.begin();
    update();
    render();
    stats.end();
  });
}
