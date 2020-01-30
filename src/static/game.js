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
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//create geometry
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 7;

function animate() {
  stats.begin();

  renderer.render( scene, camera );
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;

  stats.end();

  requestAnimationFrame( animate );
  //cube.translateX(clientX);
  //console.log("animation req");
}
animate();
