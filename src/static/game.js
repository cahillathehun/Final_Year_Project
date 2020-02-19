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

function getRandomNum(min, max){
  return Math.random() * (max - min) + min;
}

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
    // console.log(models);
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
  camera.position.z = 800;
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
async function loadMods() {
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
  for(i=0;i<50;i++){
    lodr.load("/static/assets/models/Parrot.glb", gltf => onLoad(gltf, new THREE.Vector3(getRandomNum(-300, 300),getRandomNum(-300, 300),getRandomNum(-200, 300))), onProgress, onError);
  }
  console.log(models);


}


//func for updating animations
function update() {
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }
  if(models.length > 0){
    var bird = models[0];
    bird.translateZ(2);
    bird.rotateY(.05);

  }


}

//func for rendering mods
function render() {
  renderer.render( scene, camera );

}

//start loop
init();
