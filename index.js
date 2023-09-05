import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;

const controls = new OrbitControls( camera, renderer.domElement );

document.body.appendChild( renderer.domElement );

//const geometry = new THREE.BoxGeometry(3, 3, 3);
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 10;
camera.position.y = 2;
camera.position.x = -5;
//camera.lookAt(new THREE.Vector3(0,0,0));
controls.update();

const light = new THREE.HemisphereLight( 0xf6f6f6, 1 );
light.position.set( 0, 10, 0 );
//light.castShadow = true;
scene.add( light );

//const light2 = new THREE.AmbientLight( 0xffffff , 0.5 );
//light2.position.set(0,1,0);
//light2.castShadow = true; 
//scene.add( light2 );

var check, map, cab, box, tree, clock, truck, chair, coach, can, fridge, wardrobe, table, train, tv, woodTv, vCab, gCab, barrel, camera_obj, guitar;

const loader = new GLTFLoader();
loader.load( 'models/scene1/lowpoly_city.glb', function ( gltf ) {
	map = gltf.scene;
	map.position.set(0,0,0);
	scene.add( map );
}, undefined, function ( error ) {
	console.error( error );
} );

const loaderCheck = new GLTFLoader();
loaderCheck.load('models/checkpoint/diorama.glb', function(gltf){
    check= gltf.scene;
    check.scale.set(0.6,0.6,0.6);
    check.position.set(0,10,0);
    scene.add(check);
})

const loaderBox = new GLTFLoader();
loaderBox.load('models/obstacles/cardboard_box.glb', function(gltf){
    box= gltf.scene;
    //box.scale.set(1,1,1);
    box.position.set(-39,-0.5,23);
    //box.rotation.y = Math.PI/180;
    scene.add(box);
})

const loaderTree = new GLTFLoader();
loaderTree.load('models/obstacles/cartoon_fallen_tree.glb', function(gltf){
    tree= gltf.scene;
    tree.scale.set(0.005,0.005,0.005);
    tree.position.set(0.2,8.5,5);
    //tree.rotation.y = Math.PI/180;
    scene.add(tree);
})
const loaderClock = new GLTFLoader();
loaderClock.load('models/obstacles/clock_radio.glb', function(gltf){
    clock= gltf.scene;
    clock.scale.set(0.5,0.5,0.5);
    clock.position.set(-4,0.8,-2);
    clock.rotation.y = Math.PI/10;
    scene.add(clock);
})

const loaderTruck = new GLTFLoader();
loaderTruck.load('models/obstacles/dumptruck.glb', function(gltf){
    truck= gltf.scene;
    truck.scale.set(0.6,0.6,0.6);
    truck.position.set(-5,-0.8,-4);
    //truck.rotation.y = Math.PI/180;
    scene.add(truck);
})

const loaderChair = new GLTFLoader();
loaderChair.load('models/obstacles/green_armchair.glb', function(gltf){
    chair= gltf.scene;
    chair.scale.set(0.25,0.25,0.25);
    chair.position.set(-3,1.6,0);
	chair.rotation.x = 25;
    chair.rotation.y = 10.2;
    scene.add(chair);
})

const loaderCoach = new GLTFLoader();
loaderCoach.load('models/obstacles/gwr_coach.glb', function(gltf){
    coach= gltf.scene;
    coach.scale.set(0.4,0.4,0.4);
    coach.position.set(-2,3,-5);
    coach.rotation.y = 11.5;
    scene.add(coach);
})

const loaderCan = new GLTFLoader();
loaderCan.load('models/obstacles/living_garbage_can.glb', function(gltf){
    can= gltf.scene;
    can.scale.set(0.2,0.2,0.2);
    can.position.set(-1.2,7.6,1);
    can.rotation.x = 14;
    scene.add(can);
})

const loaderFridge = new GLTFLoader();
loaderFridge.load('models/obstacles/stylized_fridge.glb', function(gltf){
    fridge= gltf.scene;
    fridge.scale.set(0.4,0.4,0.4);
    fridge.position.set(3,3.2,-7);
	fridge.rotation.x = 30;
    fridge.rotation.y = 15.5;
    scene.add(fridge);
})

const loaderTable = new GLTFLoader();
loaderTable.load('models/obstacles/table.glb', function(gltf){
    table= gltf.scene;
    table.scale.set(1.5,1.5,1.5);
    table.position.set(2.5,4,-4.8);
    scene.add(table);
})

const loaderTrain = new GLTFLoader();
loaderTrain.load('models/obstacles/train_carriage.glb', function(gltf){
    train= gltf.scene;
    train.scale.set(0.015,0.015,0.015);
    train.position.set(5,7.5,2.4);
    train.rotation.x = -12;
    train.rotation.y = 18;
    scene.add(train);
})

const loaderTv = new GLTFLoader();
loaderTv.load('models/obstacles/tv_sony.glb', function(gltf){
    tv= gltf.scene;
    tv.scale.set(2,2,2);
    tv.position.set(3,4.5,-3);
    tv.rotation.x = 5.8;
    tv.rotation.y = 20;
    scene.add(tv);
})

const loaderWoodTv = new GLTFLoader();
loaderWoodTv.load('models/obstacles/tv_stand_wood.glb', function(gltf){
    woodTv= gltf.scene;
    //woodTv.scale.set(5,5,5);
    woodTv.position.set(-1.5,8,3.5);
    woodTv.rotation.x = 12;
    woodTv.rotation.y = 10;
    scene.add(woodTv);
})

const loaderVcabinet = new GLTFLoader();
loaderVcabinet.load('models/obstacles/vintage_cabinet.glb', function(gltf){
    vCab= gltf.scene;
    vCab.scale.set(1.5,1.5,1.5);
    vCab.position.set(2,5.8,-0.2);
    vCab.rotation.x = 5.5;
    vCab.rotation.y = 10;
    scene.add(vCab);
})


//////////////////////////////////////////////////////////

const loaderBarrel = new GLTFLoader();
loaderBarrel.load('models/obstacles/beer_barrel.glb', function(gltf){
    barrel= gltf.scene;
    barrel.scale.set(2.6,2.6,2.6);
    barrel.position.set(-3.5,11,0);
    barrel.rotation.y = 5;
    scene.add(barrel);
})

const loadercamera = new GLTFLoader();
loadercamera.load('models/obstacles/camera.glb', function(gltf){
    camera_obj= gltf.scene;
    camera_obj.scale.set(0.008,0.008,0.008);
    camera_obj.position.set(-6,11.6,-1);
    camera_obj.receiveShadow = true;
    
    scene.add(camera_obj);
})

const loaderguitar = new GLTFLoader();
loaderguitar.load('models/obstacles/acoustic_guitar.glb', function(gltf){
    guitar= gltf.scene;
    guitar.scale.set(4.5,4.5,4.5);
    guitar.position.set(-6,13.8,-4);
    guitar.rotation.y = 5;
    
    scene.add(guitar);
})


//controls.target = check;




function animate() {
	requestAnimationFrame( animate );
	//controls.target = new THREE.Vector3(0, 0, 0);
	controls.update();
	renderer.render( scene, camera );
}

animate();