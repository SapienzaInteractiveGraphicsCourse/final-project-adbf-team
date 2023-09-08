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

var check, map, cab, box, tree, clock, truck, chair, coach, can, 
fridge, wardrobe, table, train, tv, woodTv, vCab, gCab, barrel, 
camera_obj, guitar, skate, pan, plane, platform, final_check, magic_cube,
bowling_pin, orange, wood, hat, book, stone, stone2, flag;

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
    barrel.position.set(-2,11,3);
    barrel.rotation.y = 10;
    scene.add(barrel);
})

const loadercamera = new GLTFLoader();
loadercamera.load('models/obstacles/camera.glb', function(gltf){
    camera_obj= gltf.scene;
    camera_obj.scale.set(0.008,0.008,0.008);
    camera_obj.position.set(-4,11.6,4);
    camera_obj.receiveShadow = true;
    
    scene.add(camera_obj);
})

const loaderguitar = new GLTFLoader();
loaderguitar.load('models/obstacles/acoustic_guitar.glb', function(gltf){
    guitar= gltf.scene;
    guitar.scale.set(4.5,4.5,4.5);
    guitar.position.set(-6,13.8,4);
    guitar.rotation.y = 0;
    
    scene.add(guitar);
})

const loaderskate = new GLTFLoader();
loaderskate.load('models/obstacles/skateboard.glb', function(gltf){
    skate= gltf.scene;
    skate.scale.set(4.5,4.5,4.5);
    skate.position.set(-8,14.4,3.5);
    skate.rotation.y = 70;
    
    scene.add(skate);
})

const loaderpan = new GLTFLoader();
loaderpan.load('models/obstacles/old_frying_pan.glb', function(gltf){
    pan= gltf.scene;
    pan.scale.set(0.008,0.008,0.008);
    pan.position.set(-10.3,15.2,2.8);
    pan.rotation.y = 20;
    scene.add(pan);
})

const loaderplane = new GLTFLoader();
loaderplane.load('models/obstacles/gothabomber_stylised_plane.glb', function(gltf){
    plane= gltf.scene;
    plane.scale.set(0.02,0.02,0.02);
    plane.position.set(-10.3,15.2,-3);
    plane.rotation.y = 210;
    scene.add(plane);
})

const loaderplatform = new GLTFLoader();
loaderplatform.load('models/obstacles/platform_trolley.glb', function(gltf){
    platform= gltf.scene;
    platform.scale.set(0.02,0.02,0.02);
    platform.position.set(-12,17,-7);
    platform.rotation.y = 0;
    scene.add(platform);
})

const loadermagic_cube = new GLTFLoader();
loadermagic_cube.load('models/obstacles/magic_cube.glb', function(gltf){
    magic_cube= gltf.scene;
    magic_cube.scale.set(8.5,8.5,8.5);
    magic_cube.position.set(-5,17,-1);
    scene.add(magic_cube);
})

const loaderbowling_pin = new GLTFLoader();
loaderbowling_pin.load('models/obstacles/bowling_pin.glb', function(gltf){
    bowling_pin= gltf.scene;
    bowling_pin.scale.set(10.5,10.5,10.5);
    bowling_pin.position.set(-2,17.5,-1);
    bowling_pin.rotation.x = 90;
    bowling_pin.rotation.z = 180;

    scene.add(bowling_pin);
})

const loaderorange = new GLTFLoader();
loaderorange.load('models/obstacles/orange_half.glb', function(gltf){
    orange= gltf.scene;
    orange.scale.set(1.2,1.2,1.2);
    orange.position.set(3.2,19,-3);
    scene.add(orange);
})

const loaderwood = new GLTFLoader();
loaderwood.load('models/obstacles/wood.glb', function(gltf){
    wood= gltf.scene;
    wood.scale.set(7.2,7.2,7.2);
    wood.position.set(-9,17.8,-8);
    wood.rotation.y = 5;
    
    scene.add(wood);
})

const loaderhat = new GLTFLoader();
loaderhat.load('models/obstacles/steampunk_hat.glb', function(gltf){
    hat= gltf.scene;
    hat.scale.set(6.2,6.2,6.2);
    hat.position.set(-5,18,-10);
    
    scene.add(hat);
})

const loaderbook = new GLTFLoader();
loaderbook.load('models/obstacles/book.glb', function(gltf){
    book= gltf.scene;
    book.scale.set(100.2,100.2,100.2);
    book.position.set(-0.5,19,-11);
    
    scene.add(book);
})

const loaderstone = new GLTFLoader();
loaderstone.load('models/obstacles/stone.glb', function(gltf){
    stone= gltf.scene;
    stone.scale.set(0.008,0.008,0.008);
    stone.position.set(3,19.5,-12);
    
    scene.add(stone);
})

const loaderstone2 = new GLTFLoader();
loaderstone2.load('models/obstacles/stone.glb', function(gltf){
    stone2= gltf.scene;
    stone2.scale.set(0.008,0.008,0.008);
    stone2.position.set(6.5,19.5,-4.3);
    
    scene.add(stone2);
})


//controls.target = check;

const loaderfinal_check = new GLTFLoader();
loaderfinal_check.load('models/checkpoint/round_platform.glb', function(gltf){
    final_check= gltf.scene;
    final_check.scale.set(1,1,1);
    final_check.position.set(8,20,-10);
    final_check.rotation.y = 210;
    scene.add(final_check);
})

const loaderflag = new GLTFLoader();
loaderflag.load('models/checkpoint/checkered_racing_flag.glb', function(gltf){
    flag= gltf.scene;
   
    flag.scale.set(1,1,1);
    flag.position.set(8,23,-10);
    
    scene.add(flag);

    const animations = gltf.animations;
    if (animations && animations.length) {
    const mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(animations[0]).play();
    }
    
})





function animate() {
	requestAnimationFrame( animate );
	//controls.target = new THREE.Vector3(0, 0, 0);
	controls.update();
	renderer.render( scene, camera );
}

animate();