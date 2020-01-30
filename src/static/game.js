var socket = io();
socket.emit("newClient");

//stats tracking, displays in top right corner
var stats = new Stats();
stats.showPanel(0, 1, 2, 3);
document.body.appendChild(stats.dom);

//device orientation tracking

function handleOrientation(event) {
  var x = event.beta;
  var y = event.gamma;

  console.log(x);
  console.log(y);
}
window.addEventListener("deviceorientation", handleOrientation, true);


//mouse movement tracking
var clientX = 0;
var clientY = 0;
window.addEventListener("mousemove", event => {
    clientX = event.x;
    clientY = event.y;
    console.log( `x: ${clientX} | y: ${clientY}`);
});


//setting up three.js scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xC5C5C3 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Load Light
var ambientLight = new THREE.AmbientLight( 0xcccccc );
scene.add( ambientLight );

var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 0, 1, 1 ).normalize();
scene.add( directionalLight );

// //create geometry
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

//setup model loader
const lodr = new THREE.GLTFLoader();
lodr.load("/static/assets/models/Parrot.glb", function(gltf) {
  var obj = gltf.scene;
  gltf.scene.scale.set(2,2,2);
  gltf.scene.position.x = 0;
  gltf.scene.position.y = 0;
  gltf.scene.position.y = 0;
  scene.add(gltf.scene);
}, undefined, function(err) {
  console.error(err);
});


camera.position.x = -50;
camera.position.y = 50;
camera.position.z = 200;


function animate() {
  stats.begin();

  renderer.render( scene, camera );
  // cube.rotation.x += 0.1;
  // cube.rotation.y += 0.1;

  requestAnimationFrame( animate );

  stats.end();

}
animate();
