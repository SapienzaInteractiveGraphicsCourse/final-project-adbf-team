import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;

document.body.appendChild( renderer.domElement );
document.body.addEventListener( 'keydown', onKeyDown, false );

//const geometry = new THREE.BoxGeometry( 1, 1, 1);
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 5;
camera.position.y = 10;
camera.position.x = -10;
camera.lookAt(new THREE.Vector3(0,0,0));

var check;

const loader = new GLTFLoader();
loader.load( 'models/scene1/town.glb', function ( gltf ) {
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

const loaderCheck = new GLTFLoader();
loaderCheck.load('models/checkpoint/diorama.glb', function(gltf){
    check= gltf.scene;
    //check.scale.set(5,5,5);
    check.position.set(0,40,-5);
    //check.rotation.y = Math.PI/180;
    scene.add(check);
})

const light = new THREE.HemisphereLight( 0xf6f6f6, 1 );
//light.position.set( 0, 1, 0 );
//light.castShadow = true;
scene.add( light );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function onKeyDown(){
	switch( event.keyCode ) {
	   case 83: // up
	   camera.position.y -= 5;
	   break;
	   case 87: // down
	   camera.position.y += 5;
	   break;
	   case 65: // A
	   camera.position.x += 5;
	   break;
	   case 68: // D
	   camera.position.x -= 5;
	   break;
	   case 81: // Q
	   camera.position.z += 5;
	   break;
	   case 69: // E
	   camera.position.z -= 5;
	   break;
	}
}

animate();