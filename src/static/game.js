var socket = io();
let container;
let camera;
let controls;
let renderer;
let scene;

const mixers = []
const clock = new THREE.Clock();

socket.emit("newClient");

//stats tracking, displays in top right corner
var stats = new Stats();
stats.showPanel(0, 1, 2, 3);
document.body.appendChild(stats.dom);

//device orientation tracking
var accelX;
var accelY;
function handleOrientation(event) {
  var accelX = event.beta;
  var accelY = event.gamma;

  console.log(`accelerometer x: ${accelX} | accelerometer y: ${accelX}`);
}
window.addEventListener("deviceorientation", handleOrientation, true);


//mouse movement tracking
var clientX;
var clientY;
function mousemove(event){
  clientX = event.x;
  clientY = event.y;

  console.log( `mouse x: ${clientX} | mouse y: ${clientY}`);
}
window.addEventListener("mousemove", mousemove, true);

//resizing func
function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);


//setting up three.js scene
function init() {
  container = document.querySelector('#scene-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xC5C5C4);

  createCamera();
  //createControls();
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



//init camera
function createCamera() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

  camera.position.x = -50;
  camera.position.y = 50;
  camera.position.z = 200;
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

  const onLoad = (gltf, pos) => {
    var obj = gltf.scene.children[0];
    obj.position.copy(pos);

    const animation = gltf.animations[0];

    const mixer = new THREE.AnimationMixer(obj);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();
    console.log("obj printVVV")
    console.log(obj);
    console.log(typeof obj);
    models.push(obj);
    scene.add(obj);
  };

  const onProgress = () => {};

  const onError = (errorMsg) => {console.error(errorMsg);};

  startPos = new THREE.Vector3(0,0,0);
  lodr.load("/static/assets/models/Parrot.glb", gltf => onLoad(gltf, startPos), onProgress, onError);

  startPos1 = new THREE.Vector3(0,0,-50);
  lodr.load("/static/assets/models/Parrot.glb", gltf => onLoad(gltf, startPos1), onProgress, onError);
  console.log("startPos1 printVVV");
  console.log(startPos1);

}

//func for updating animations
function update() {
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }
}

//func for rendering mods
function render() {
  renderer.render( scene, camera );

}

//start loop
init();
