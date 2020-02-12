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

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize);

// Implementing Touch event listener
private final float TOUCH_SCALE_FACTOR = 180.0f / 320;
private float previousX;
private float previousY;

@Overide
function onTouchEvent(MotionEvent e) {
   float x = e.getX();
   float y = e.getY();

   previousX = x;
   previousY = y;
   console.log( `touch x: ${x} | touch y: ${y}`);
   // return true;

}
window.addEventListener("touch", onTouchEvent, true);


//setting up three.js scene
function init() {
  container = document.querySelector('#scene-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xC5C5C3);

  createCamera();
  //createControls();
  createLights();
  loadMods();
  createRenderer();

  renderer.setAnimationLoop ( () => {
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


function loadMods() {
  const lodr = new THREE.GLTFLoader();

  const onLod = (gltf, pos) => {
    var obj = gltf.scene.children[0];
    obj.position.copy(pos);

    const animation = gltf.animations[0];

    const mixer = new THREE.AnimationMixer(obj);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    scene.add(obj);
  };

  const onProgress = () => {};

  const onError = (errorMsg) => {console.error(errorMsg);};

  var parrotPos = new THREE.Vector3(0,0,2.5);
  lodr.load("/static/assets/models/Parrot.glb", gltf => onLod(gltf, parrotPos), onProgress, onError);

}

function update() {
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }
}

function render() {
  renderer.render( scene, camera );

}




//
// function animate() {
//
//
//
//   // cube.rotation.x += 0.1;
//   // cube.rotation.y += 0.1;
//
//   // requestAnimationFrame( animate );
//
//
// }
// animate();

init();
