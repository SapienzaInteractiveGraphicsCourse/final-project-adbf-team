import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from './js/cannon-es.js'
import { CharacterController } from './js/CharacterController.js';



var meshes_character, Character;

//loading (wait for all resources to be loaded)
var loadingScreen = {
    scene : new THREE.Scene(),
    camera : new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1.0, 1000.0 ),
};

var RESOURCES_LOADED = false;
var loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = function(){ //This function will be called when all loading is completed.
    RESOURCES_LOADED = true;
    console.log("All resources loaded!");
}; 



/*-------------------------------------------TEST ENVIRONMENT-----------------------------------------------*/
//const skyColor = new THREE.Color(0xadd8e6); // Clear blue color
//SCENE
const scene = new THREE.Scene();

//scene.background = skyColor;

//GRID USED FOR TESTING
// Define grid parameters
//const gridSize = 20; // Size of the grid
//const gridSpacing = 1; // Spacing between grid lines
//const numLines = Math.floor(gridSize / gridSpacing) * 2 + 1; // Number of grid lines
//
//// Create grid material
//const gridMaterial = new THREE.LineBasicMaterial({ color: 0x999999 });
//
//// Create grid geometry
//const gridGeometry = new THREE.BufferGeometry();
//const positions = [];
//for (let i = -gridSize; i <= gridSize; i += gridSpacing) {
//// Horizontal lines
//positions.push(-gridSize, 0, i);
//positions.push(gridSize, 0, i);
//
//// Vertical lines
//positions.push(i, 0, -gridSize);
//positions.push(i, 0, gridSize);
//}
//gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//
//// Create grid mesh
//const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
//
//// Position the grid in your scene
//// You can adjust these coordinates based on your desired positions
//grid.position.set(0, -1, 0); // Set to the center of your scene
//scene.add(grid);

//function createLabel(text, position) {
//    const loader = new THREE.FontLoader();
//    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//    const textGeometry = new THREE.TextGeometry(text, {
//        font: font,
//        size: 0.2, // Adjust text size as needed
//        height: 0.02, // Adjust text height as needed
//    });
//    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
//    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
//    textMesh.position.copy(position);
//    scene.add(textMesh);
//    });
//}
//
//// Add labels at each intersection of the grid
//for (let x = -gridSize; x <= gridSize; x += gridSpacing) {
//    for (let z = -gridSize; z <= gridSize; z += gridSpacing) {
//    const labelPosition = new THREE.Vector3(x, -1, z); // Adjust Y position as needed
//    createLabel(`(${x}, ${z})`, labelPosition);
//    }
//}
////


//////////////////////////////////////////

//CANNON WORLD 
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
})

const timestep = 1/60

//camera

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight,
0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( document.documentElement.clientWidth, document.documentElement.clientHeight );
document.body.appendChild( renderer.domElement );

// SKYBOX

const skyboxLoader = new THREE.CubeTextureLoader();
skyboxLoader.setPath( 'skyText/' );

const textureCube = skyboxLoader.load([
  'right.png', 'left.png', // RIGHT, LEFT
  'up.png', 'down.png', // UP, DOWN
  'front.png', 'back.png'  //FRONT, BACK
]);

scene.background = textureCube;

// STAGE (Solid Plane with Soft Color)
//const stageSize = 15; 
//const stageGeometry = new THREE.BoxGeometry(stageSize, stageSize);
//const stageMaterial = new THREE.MeshStandardMaterial({
//color: 0xf0e68c, 
//roughness: 0.5,
//metalness: 0.2,
//});
//const stage = new THREE.Mesh(stageGeometry, stageMaterial);
//stage.rotation.x = -Math.PI / 2; // Rotate the stage to make it horizontal
////scene.add(stage);
//
/////stage cannon
//const stageMaterialCannon = new CANNON.Material();
//const stageBody = new CANNON.Body({
//mass: 0,
//shape: new CANNON.Box(new CANNON.Vec3(20, 1, 20)),
//position: new CANNON.Vec3(0, -2.4, 0),
//material: stageMaterialCannon,
//});
//world.addBody(stageBody);

/*------------------------------------------END TEST ENVIRONMENT-----------------------------------------------*/

//MODELS
let selectedCharacter = '';

//CHOOSE PLAYER
function loadCharacter(characterType) {
    // Clear existing characters or perform any cleanup if needed
    //selectedCharacter = characterType;
    // Load the selected character
    if (characterType === 'girl') {
        selectedCharacter = 'girl';
      _LoadModels('./models/girl/scene.gltf', 0.5, -5, -0.5, -12);
      
    } else {
        selectedCharacter = 'firefighter';
      _LoadModels('./models/firefighter/scene.gltf', 0.2, -5, -0.5, -12);
      
    }
  }
///------------------------------------------------------
  
var value;
  // Event listeners for character selection
  window.onload = function() {
    // Get the value from localStorage
    value = localStorage.getItem('myValue');
    if (value == 'girl') loadCharacter('girl');
    else loadCharacter('firefighter');
  }
    
    export { selectedCharacter };
  //document.getElementById('selectFirefighter').addEventListener('click', function () {
    //loadCharacter('firefighter');
  //});

  //Demo: mette sempre pompiere
  //_LoadModels('./models/firefighter/scene.gltf', 0.2, -5, -1.2, -12);
  //selectedCharacter = 'firefighter';
  //selectedCharacter = 'girl';
  //_LoadModels('./models/girl/scene.gltf', 0.5, -5, -1.2, -12);
  
////_LoadModels('./models/spaceboy/scene.gltf',3,0,1,0);

//StopWatch
const timerElement = document.createElement('div');
timerElement.id = 'timer-container';
timerElement.textContent = 'Start the timer by moving!';
document.body.appendChild(timerElement);

let startTime;
let timerInterval;
let elapsedTime = 0; // Initialize elapsedTime to 0

// Function to start the stopwatch
function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 100);
}

// Function to update the timer display
function updateTimer() {
    if (!finish) {
        const currentTime = new Date().getTime();
        elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
        timerElement.textContent = `Current time: ${elapsedTime.toFixed(2)} seconds`;
    } else {
        clearInterval(timerInterval); // Stop the timer
        congratulate(elapsedTime); // Display congratulations message
    }
}

// Function to end stopwatch (CONSOLE.LOG DA SOSTITUIRE)
function congratulate(elapsedTime) {
    console.log(`Congrats, you've won the game in ${elapsedTime.toFixed(2)} seconds!`);
}

// Listen for key button to start
document.addEventListener('keydown', function(event) {
    if (event.key === 'w' || event.key === 'W' || event.key === 's'|| event.key === 'S'|| event.key === 'A'|| event.key === 'a'|| event.key === 'D'
      || event.key === 'd'|| event.key === ' ' || event.shiftKey) {
        if (!timerInterval) {
            startTimer();
        }
    }
});
//////////////

//Checkpoint
//keydown event listener
window.addEventListener('keydown', onKeyPress);

// Define the onKeyPress function to handle key presses
function onKeyPress(event) {
  // Check if the pressed key is 'L'
  if (event.key === 'l') {
    // Update the character's position wrt checkpoints
    if(firstCheckpoint && !secondCheckpoint){
        const newPosition = new THREE.Vector3(-0.05, 3.1, -8.4);
        character_body.position.copy(newPosition);
        meshes_character.rotation.set(0, Math.PI/2, 0);
    }
    else if(secondCheckpoint){
        const newPosition = new THREE.Vector3(4.95, 9.59, -1.6);
        character_body.position.copy(newPosition);
        meshes_character.rotation.set(0, Math.PI, 0);
        }
    else{
    const newPosition = new THREE.Vector3(-5, -1.2, -12);
    
    character_body.position.copy(newPosition);
    meshes_character.rotation.set(0, 0, 0);
    //character_body.rotation.copy(newRotation);
    }
  }
}
//Check Borders
var out = false;
function checkBorders(){
    const characterPosition = character_body.position;
if (
    characterPosition.x <= -16 &&
    characterPosition.y <= -1     
    )
{
    out = true;
    //console.log("CIAO");
}
else if(
    characterPosition.x >= 7 &&
    characterPosition.y <= -1
    )
{
    out = true;
    //console.log("CIAO");
}
else if(
    characterPosition.z <= -15.5 &&
    characterPosition.y <= -1
    )
{
    out = true;
    //console.log("CIAO");
}
else if(
    characterPosition.z >= 7 &&
    characterPosition.y <= -1
    )
{
    out = true;
    //console.log("CIAO");
}

if(out){
    out = false;
    if(firstCheckpoint && !secondCheckpoint){
        const newPosition = new THREE.Vector3(-0.05, 3.1, -8.4);
        character_body.position.copy(newPosition);
        meshes_character.rotation.set(0, Math.PI/2, 0);
    }
    else if(secondCheckpoint){
        const newPosition = new THREE.Vector3(4.95, 9.59, -1.6);
        character_body.position.copy(newPosition);
        meshes_character.rotation.set(0, Math.PI, 0);
        }
    else{
    const newPosition = new THREE.Vector3(-5, -1.2, -12);
    
    character_body.position.copy(newPosition);
    meshes_character.rotation.set(0, 0, 0);
    //character_body.rotation.copy(newRotation);
    }
}
}

///
//First Checkpoint
// Define the region boundaries (box) using coordinates
const minX = -1.16; // 
const maxX = 1.1;  // 
const minY = 2.5;  // 
const maxY = 3.5;  // 
const minZ = -9.525; // 
const maxZ = -7.3;  // 

// Create a variable to track whether the character is inside the region
var firstCheckpoint = false;
//var geometry = new THREE.BoxGeometry(maxX - minX, maxY - minY, maxZ - minZ);
//var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
//var regionBox = new THREE.Mesh(geometry, material);
//
//// Position the region box based on your region boundaries
//regionBox.position.set(-0.05,3.5,-8.37);
//
//// Add the region box to your scene
//scene.add(regionBox);

// Check for character's position relative to the region in your update/render loop
function checkFirstCheckpoint() {
    const characterPosition = character_body.position;

    // Check if character's position is inside the region
    if (
        characterPosition.x >= minX &&
        characterPosition.x <= maxX &&
        characterPosition.y >= minY &&
        characterPosition.y <= maxY &&
        characterPosition.z >= minZ &&
        characterPosition.z <= maxZ
    ) {
        // Character is inside the region
        firstCheckpoint = true;
    }
}
///////////////////

//Second Checkpoint
// Define the region boundaries (box) using coordinates
const min2X = 4; // 
const max2X = 6;  // 
const min2Y = 8.7;  // 
const max2Y = 12;  // 
const min2Z = -3; // 
const max2Z = -0.8;  // 

// Create a variable to track whether the character is inside the region
var secondCheckpoint = false;
//var geometry = new THREE.BoxGeometry(max2X - min2X, max2Y - min2Y, max2Z - min2Z);
//var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
//var regionBox = new THREE.Mesh(geometry, material);
//
//// Position the region box based on your region boundaries
//regionBox.position.set(5,10,-2);
//
//// Add the region box to your scene
//scene.add(regionBox);

// Check for character's position relative to the region in your update/render loop
function checkSecondCheckpoint() {
    const characterPosition = character_body.position;
    // Check if character's position is inside the region
    if (
        characterPosition.x >= min2X &&
        characterPosition.x <= max2X &&
        characterPosition.y >= min2Y &&
        characterPosition.y <= max2Y &&
        characterPosition.z >= min2Z &&
        characterPosition.z <= max2Z
    ) {
        // Character is inside the region
        secondCheckpoint = true;
    }
}

//Movement on Book

//function isOnBook() {
    //const characterPosition = character_body.position;

    // Check if character's position is inside the book's region

    //if (
    //    characterPosition.x >= book.position_x - 1 &&
    //    characterPosition.x <= book.position_x + 1 &&
    //    characterPosition.y >= book.position_y - 0.5 &&
    //    characterPosition.y <= book.position_y + 0.5 &&
    //    characterPosition.z >= book.position_z - 2 &&
    //    characterPosition.z <= book.position_z + 2
    //) { 
        // Trasla personaggio sull'asse Z come il Libro
    //}
//}

//Finish!
// Define the region boundaries (box) using coordinates
const min_finX = 10; // 
const max_finX = 12;  // 
const min_finY = 18;  // 
const max_finY = 20;  // 
const min_finZ = -14; // 
const max_finZ = -12;  // 

// Create a variable to track whether the character is inside the region
var finish = false;
//var geometry = new THREE.BoxGeometry(max_finX - min_finX, max_finY - min_finY, max_finZ - min_finZ);
//var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
//var regionBox = new THREE.Mesh(geometry, material);
//
//// Position the region box based on your region boundaries
//regionBox.position.set(11,18,-13);
//
//// Add the region box to your scene
//scene.add(regionBox);

// Check for character's position relative to the region in your update/render loop
function checkFinish() {
    const characterPosition = character_body.position;
    // Check if character's position is inside the region
    if (
        characterPosition.x >= min_finX &&
        characterPosition.x <= max_finX &&
        characterPosition.y >= min_finY &&
        characterPosition.y <= max_finY &&
        characterPosition.z >= min_finZ &&
        characterPosition.z <= max_finZ
    ) {
        // Character is inside the region
        finish = true;
    }
}
/////////

var check, map, box, tree, clock, truck, chair, coach, can, 
fridge, table, train, tv, woodTv, vCab, barrel, 
camera_obj, guitar, skate, pan, plane, final_check, magic_cube,
bowling_pin, orange, wood, hat, book, stone, stone2, flag;

//MAP AND BUILDINGS
const loader = new GLTFLoader();
loader.load( 'models/scene1/lowpoly_city.glb', function ( gltf ) {
map = gltf.scene;
map.position.set(0,0,0);
scene.add( map );
}, undefined, function ( error ) {
console.error( error );
} );
const mapShape = new CANNON.Box(new CANNON.Vec3(20,1,20));
const mapMaterial = new CANNON.Material();
const mapBody = new CANNON.Body({
    mass: 0,
    shape: mapShape,
    position: new CANNON.Vec3(0,-2.4,0),
    material: mapMaterial,
});
world.addBody(mapBody);

//RedBuilding
const building_redShape = new CANNON.Box(new CANNON.Vec3(1.85,3.2,1.7));
const building_redMaterial = new CANNON.Material();
const building_redBody = new CANNON.Body({
    mass: 0,
    shape: building_redShape,
    material: building_redMaterial,
});
const building_redPosition = new CANNON.Vec3(-0.05,0,0.7);
building_redBody.position.copy(building_redPosition);
world.addBody(building_redBody);

//OrangeBuilding
const building_orangeShape = new CANNON.Box(new CANNON.Vec3(1.1,3,1.25));
const building_orangeMaterial = new CANNON.Material();
const building_orangeBody = new CANNON.Body({
    mass: 0,
    shape: building_orangeShape,
    material: building_orangeMaterial,
});
const building_orangePosition = new CANNON.Vec3(-0.05,0,-8.6);
building_orangeBody.position.copy(building_orangePosition);
world.addBody(building_orangeBody);

//BlueBuilding
const building_blueShape = new CANNON.Box(new CANNON.Vec3(1.35,1.1,1.8));
const building_blueMaterial = new CANNON.Material();
const building_blueBody = new CANNON.Body({
    mass: 0,
    shape: building_blueShape,
    material: building_blueMaterial,
});
const building_bluePosition = new CANNON.Vec3(-10.7,0,-9.15);
building_blueBody.position.copy(building_bluePosition);
world.addBody(building_blueBody);

//PinkBuilding
const building_pinkShape = new CANNON.Box(new CANNON.Vec3(2.16,3.0,1.54));
const building_pinkMaterial = new CANNON.Material();
const building_pinkBody = new CANNON.Body({
    mass: 0,
    shape: building_pinkShape,
    material: building_pinkMaterial,
});
const building_pinkPosition = new CANNON.Vec3(-9.38,0,0.2);
building_pinkBody.position.copy(building_pinkPosition);
world.addBody(building_pinkBody);

//Other objects from "Map"

/*--------------------------*/

//OBJECTS

//TestCube
//const cubeSize = 1; // Adjust the size as needed
//const cubeShape = new CANNON.Box(new CANNON.Vec3(cubeSize * 0.5, cubeSize * 0.5, cubeSize * 0.5));
//const cubeMaterial = new CANNON.Material();
//const cubeBody = new CANNON.Body({
//mass: 0, // Set mass to 0 to make it static
//shape: cubeShape,
//material: cubeMaterial,
//});
//const cubePosition = new CANNON.Vec3(3, 0, 0); // Adjust the Y offset as needed
//cubeBody.position.copy(cubePosition);
//world.addBody(cubeBody);
//const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
//const cubeMaterialThree = new THREE.MeshStandardMaterial({
//color: 0x000000, // Set the color to black
//roughness: 0.5,
//metalness: 0.2,
//});
//
//const cubeThree = new THREE.Mesh(cubeGeometry, cubeMaterialThree);
//cubeThree.position.copy(cubePosition); // Adjust the Y offset as needed
//scene.add(cubeThree);
////////////////////////////////


//Box
const loaderBox = new GLTFLoader();
loaderBox.load('models/obstacles/cardboard_box.glb', function(gltf){
    box = gltf.scene;
    //box.scale.set(1,1,1);
    box.position.set(-39,-0.4,23);
    //box.rotation.y = Math.PI/180;
    scene.add(box);

// Compute the bounding box dimensions of the loaded model
const boundingBox = new THREE.Box3().setFromObject(box);
const dimensions = boundingBox.getSize(new THREE.Vector3());
    
// Create a Cannon.js box shape based on the bounding box dimensions
const boxShape = new CANNON.Box(new CANNON.Vec3(dimensions.x * 0.45, dimensions.y*0.2, dimensions.z * 0.45));
    
// Create a Cannon.js body and attach the box shape
const boxBody = new CANNON.Body({
mass: 0, // Set mass to 0 to make it static
shape: boxShape,
});

// Set the position of the Cannon.js body to match the Three.js model
boxBody.position = new CANNON.Vec3(-4.6,-1,-6.4);

// Add the body to the Cannon.js world
world.addBody(boxBody);
});

//Truck
const loaderTruck = new GLTFLoader();
loaderTruck.load('models/obstacles/dumptruck.glb', function(gltf){
    truck= gltf.scene;
    truck.scale.set(0.6,0.6,0.6);
    truck.position.set(-5,-0.8,-4);
    //truck.rotation.y = Math.PI/180;
    scene.add(truck);

    const boundingBox = new THREE.Box3().setFromObject(truck);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const truckShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.5, dimensions.y*0.5, dimensions.z*0.5));

    const truckBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: truckShape,
    });
    
    truckBody.position = new CANNON.Vec3(-5,-0.8,-4.5);
    world.addBody(truckBody);

});

//Clock
const loaderClock = new GLTFLoader();
loaderClock.load('models/obstacles/clock_radio.glb', function(gltf){
    clock= gltf.scene;
    clock.scale.set(0.5,0.5,0.5);
    clock.position.set(-4,0.8,-2);
    clock.rotation.y = Math.PI/10;
    scene.add(clock);

    const boundingBox = new THREE.Box3().setFromObject(clock);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const clockShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.45, dimensions.y*0.45, dimensions.z*0.45));

    const clockBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: clockShape,
    });
    
    clockBody.position = new CANNON.Vec3(-4,0.9,-2);
    world.addBody(clockBody);
});

//Chair
const loaderChair = new GLTFLoader();
loaderChair.load('models/obstacles/green_armchair.glb', function(gltf){
    chair= gltf.scene;
    chair.scale.set(0.25,0.25,0.25);
    chair.position.set(-3,1.6,0);
    chair.rotation.x = 25;
    chair.rotation.y = 10.2;
    scene.add(chair);

    const boundingBox = new THREE.Box3().setFromObject(chair);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const chairShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.25, dimensions.y*0.3, dimensions.z*0.25));

    const chairBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: chairShape,
    });

    chairBody.position = new CANNON.Vec3(-3,1.6,0);

    world.addBody(chairBody);
});

//Coach
const loaderCoach = new GLTFLoader();
loaderCoach.load('models/obstacles/gwr_coach.glb', function(gltf){
    coach= gltf.scene;
    coach.scale.set(0.4,0.4,0.4);
    coach.position.set(-2,3,-5);
    coach.rotation.y = 11.5;
    scene.add(coach);

    const boundingBox = new THREE.Box3().setFromObject(coach);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const coachShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.8, dimensions.y*0.5, dimensions.z*0.05));

    const coachBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: coachShape,
    });

    coachBody.position = new CANNON.Vec3(-2,3.5,-5);

    const rotationQuaternion = new CANNON.Quaternion();
    const eulerY = 11.5; // No rotation around the Z-axis
    rotationQuaternion.setFromEuler(0, eulerY, 0);
    coachBody.quaternion.copy(rotationQuaternion);

    world.addBody(coachBody);

    ////Create a Three.js mesh with the desired color
    //const coachColor = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Set your desired color
    //const coachMesh = new THREE.Mesh(new THREE.BoxGeometry(dimensions.x*0.8, dimensions.y*0.5, dimensions.z*0.05), coachColor); // Adjust the geometry to match the shape//
    //// Position and rotate the Three.js mesh to match the Cannon.js coach
    //coachMesh.position.copy(coachBody.position);
    //coachMesh.quaternion.copy(coachBody.quaternion);//
    //// Add the Three.js mesh to your Three.js scene for visualization
    //scene.add(coachMesh);
});

//Fridge
const loaderFridge = new GLTFLoader();
loaderFridge.load('models/obstacles/stylized_fridge.glb', function(gltf){
    fridge= gltf.scene;
    fridge.scale.set(0.4,0.4,0.4);
    fridge.position.set(3,3.0,-7);
    fridge.rotation.x = -Math.PI /2;
    fridge.rotation.y = Math.PI;
    scene.add(fridge);

    const boundingBox = new THREE.Box3().setFromObject(fridge);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const fridgeShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.35, dimensions.y*0.6, dimensions.z*0.5));

    const fridgeMaterial = new CANNON.Material();

    const fridgeBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: fridgeShape,
        material: fridgeMaterial,
    });

    fridgeBody.position = new CANNON.Vec3(3,2.68,-7.9);

    const rotationQuaternion = new CANNON.Quaternion();
    //const eulerX = 30.0;
    //const eulerY = 15.5;
    const eulerX = 0;
    const eulerY = Math.PI;
    rotationQuaternion.setFromEuler(eulerX, eulerY, 0);
    fridgeBody.quaternion.copy(rotationQuaternion);

    world.addBody(fridgeBody);
});

//Table
const loaderTable = new GLTFLoader();
loaderTable.load('models/obstacles/table.glb', function(gltf){
    table= gltf.scene;
    table.scale.set(1.5,1.5,1.5);
    table.position.set(2.5,4,-4.8);
    scene.add(table);

    const boundingBox = new THREE.Box3().setFromObject(table);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const tableShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.5, dimensions.y*0.5, dimensions.z*0.5));

    const tableBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: tableShape,
    });

    tableBody.position = new CANNON.Vec3(2.5,3.8,-4.8);

    world.addBody(tableBody);  
});

//Tv
const loaderTv = new GLTFLoader();
loaderTv.load('models/obstacles/tv_sony.glb', function(gltf){
    tv= gltf.scene;
    tv.scale.set(2,2,2);
    tv.position.set(3,4.8,-3);
    //tv.rotation.x = 5.8;
    tv.rotation.y = 16;
    scene.add(tv);

    const boundingBox = new THREE.Box3().setFromObject(table);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const tvShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.7, dimensions.y*0.5, dimensions.z*0.7));

    const tvBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: tvShape,
    });

    tvBody.position = new CANNON.Vec3(3.2,4.88,-3.0);
    const rotationQuaternion = new CANNON.Quaternion();
    //const eulerX = 5.8;
    const eulerY = 16;
    rotationQuaternion.setFromEuler(0, eulerY, 0);
    tvBody.quaternion.copy(rotationQuaternion);

    world.addBody(tvBody);
});

//WoodTv
const loaderVcabinet = new GLTFLoader();
loaderVcabinet.load('models/obstacles/vintage_cabinet.glb', function(gltf){
    vCab= gltf.scene;
    vCab.scale.set(1.5,1.5,1.5);
    vCab.position.set(2,5.8,-0.2);
    //vCab.rotation.x = 5.8;
    vCab.rotation.y = 10;
    vCab.rotation.z=0.2;
    scene.add(vCab);

    const boundingBox = new THREE.Box3().setFromObject(vCab);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const VCabShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.5, dimensions.y*0.5, dimensions.z*0.08));

    const VCabBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: VCabShape,
    });

    VCabBody.position = new CANNON.Vec3(2,5.7,-0.2);
    const rotationQuaternion = new CANNON.Quaternion();
    const eulerZ = 0.2;
    const eulerY = 10;
    rotationQuaternion.setFromEuler(0, eulerY, eulerZ);
    VCabBody.quaternion.copy(rotationQuaternion);

    world.addBody(VCabBody);
});

//Can
const loaderCan = new GLTFLoader();
loaderCan.load('models/obstacles/living_garbage_can.glb', function(gltf){
    can= gltf.scene;
    can.scale.set(0.3,0.3,0.3);
    can.position.set(-2,6.7,2.45);
    can.rotation.x = 14;
    scene.add(can);

    const boundingBox = new THREE.Box3().setFromObject(can);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const canShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.5, dimensions.y*0.5, dimensions.z *0.5));

    const canBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: canShape,
    });

    canBody.position = new CANNON.Vec3(-2,6.2,2.0);
    const rotationQuaternion = new CANNON.Quaternion();
    const eulerX = 14;
    const eulerY = 0;
    rotationQuaternion.setFromEuler(eulerX, eulerY, 0);
    canBody.quaternion.copy(rotationQuaternion);

    world.addBody(canBody);

});

//WoodTvSmall
const loaderWoodTv = new GLTFLoader();
loaderWoodTv.load('models/obstacles/tv_stand_wood.glb', function(gltf){
    woodTv= gltf.scene;
    woodTv.scale.set(1.2,1.2,1.2);
    woodTv.position.set(-0.5,7.1,5.0);
    woodTv.rotation.x = -0.2;
    woodTv.rotation.y = 0.25;
    scene.add(woodTv);

    const boundingBox = new THREE.Box3().setFromObject(woodTv);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const woodTvShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.4, dimensions.y*0.5, dimensions.z*0.46));

    const woodTvBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: woodTvShape,
    });

    woodTvBody.position = new CANNON.Vec3(-0.5,6.8,4.95);
    const rotationQuaternion = new CANNON.Quaternion();
    const eulerX = -0.2;
    const eulerY = 0.25;
    rotationQuaternion.setFromEuler(eulerX, eulerY, 0);
    woodTvBody.quaternion.copy(rotationQuaternion);

    world.addBody(woodTvBody);
});

//TreeLog
const loaderTree = new GLTFLoader();
loaderTree.load('models/obstacles/cartoon_fallen_tree.glb', function(gltf){
    tree= gltf.scene;
    tree.scale.set(0.005,0.005,0.005);
    tree.position.set(0.2,8.3,6.8);
    //tree.rotation.y = Math.PI/180;
    scene.add(tree);

    const boundingBox = new THREE.Box3().setFromObject(can);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const treeShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.7, dimensions.y*0.1, dimensions.z*0.5));

    const treeBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: treeShape,
    });

    treeBody.position = new CANNON.Vec3(1.7,8.0,6.0);

    world.addBody(treeBody);
});

//Train
const loaderTrain = new GLTFLoader();
    loaderTrain.load('models/obstacles/train_carriage.glb', function(gltf){
        train = gltf.scene;
        train.scale.set(0.015,0.015,0.015);
        train.position.set(3.5,8.1,0.3);
        train.rotation.y = Math.PI/2 - Math.PI/8;
        scene.add(train);

        const boundingBox = new THREE.Box3().setFromObject(train);
        const dimensions = boundingBox.getSize(new THREE.Vector3());

        const trainShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.15, dimensions.y*0.5, dimensions.z*0.35));

        const trainBody = new CANNON.Body({
            mass: 0, // Set mass to 0 to make it static
            shape: trainShape,
        });

        trainBody.position = new CANNON.Vec3(2.5,8.35,2.5);
        const rotationQuaternion = new CANNON.Quaternion();
        const eulerY = 0 - Math.PI/10;
        rotationQuaternion.setFromEuler(0, eulerY, 0);
        trainBody.quaternion.copy(rotationQuaternion);

        world.addBody(trainBody);
    });

    //CheckPoint
    const loaderCheck = new GLTFLoader();
    loaderCheck.load('models/checkpoint/diorama.glb', function(gltf){
        check= gltf.scene;
        check.scale.set(0.6,0.6,0.6);
        check.position.set(5,9,-2);
        scene.add(check);
    
    const boundingBox = new THREE.Box3().setFromObject(check);
    const dimensions = boundingBox.getSize(new THREE.Vector3());
    const checkShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.4, dimensions.y*0.05, dimensions.z*0.4));
    const checkBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: checkShape,
    });
    checkBody.position = new CANNON.Vec3(5,8.9,-2);
    //const rotationQuaternion = new CANNON.Quaternion();
    //rotationQuaternion.setFromEuler(0, Math.PI, 0);
    //checkBody.quaternion.copy(rotationQuaternion);

    world.addBody(checkBody);

    //
    const barrierShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.4, dimensions.y*0.1, dimensions.z*0.4));
    const barrierBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: barrierShape,
    });
    barrierBody.position = new CANNON.Vec3(5,10.0,-3.5);
    const rotationQuaternion = new CANNON.Quaternion();
    const eulerX = Math.PI /2;
    rotationQuaternion.setFromEuler(eulerX, 0, 0);
    barrierBody.quaternion.copy(rotationQuaternion);

    world.addBody(barrierBody);
    //
    const barrier2Shape = new CANNON.Box(new CANNON.Vec3(0.3, 0.1, 0.3));
    const barrier2Body = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: barrier2Shape,
    });
    barrier2Body.position = new CANNON.Vec3(5,9.8,-2.3);
    const rotationQuaternion2 = new CANNON.Quaternion();
    const eulerX2 = Math.PI /2;
    rotationQuaternion2.setFromEuler(eulerX2, 0, 0);
    barrier2Body.quaternion.copy(rotationQuaternion2);

    world.addBody(barrier2Body);
    //
    const barrier3Shape = new CANNON.Box(new CANNON.Vec3(0.6, 0.1, 0.6));
    const barrier3Body = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: barrier3Shape,
    });
    barrier3Body.position = new CANNON.Vec3(5,9.3,-2);
    world.addBody(barrier3Body);
    //

    });

//Barrel
    const loaderBarrel = new GLTFLoader();
    loaderBarrel.load('models/obstacles/beer_barrel.glb', function(gltf){
    barrel= gltf.scene;
    barrel.scale.set(2.6,2.6,2.6);
    barrel.position.set(1,9.5,-1);
    barrel.rotation.y = 10;
    scene.add(barrel);

    const boundingBox = new THREE.Box3().setFromObject(barrel);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const barrelShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.4, dimensions.y*0.4, dimensions.z*0.2));

    const barrelBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: barrelShape,
        color: 0x00ff00
    });

    barrelBody.position = new CANNON.Vec3(1.3,10,-1);

    const rotationQuaternion = new CANNON.Quaternion();
    const eulerY = 10;
    rotationQuaternion.setFromEuler(0, eulerY, 0);
    barrelBody.quaternion.copy(rotationQuaternion);

    world.addBody(barrelBody);
});

//Camera
    const loadercamera = new GLTFLoader();
    loadercamera.load('models/obstacles/camera.glb', function(gltf){
    camera_obj= gltf.scene;
    camera_obj.scale.set(0.008,0.008,0.008);
    camera_obj.position.set(-1,9.9,1);
    camera_obj.receiveShadow = true;
    
    scene.add(camera_obj);

    const boundingBox = new THREE.Box3().setFromObject(camera_obj);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const cameraShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.5, dimensions.y*0.6, dimensions.z*0.4));

    const cameraBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: cameraShape,
    });

    cameraBody.position = new CANNON.Vec3(-0.8,10.3,1.0);

    const rotationQuaternion = new CANNON.Quaternion();
    cameraBody.quaternion.copy(rotationQuaternion);

    world.addBody(cameraBody);
});

//Guitar
const loaderguitar = new GLTFLoader();
loaderguitar.load('models/obstacles/acoustic_guitar.glb', function(gltf){
    guitar= gltf.scene;
    guitar.scale.set(4.5,4.5,4.5);
    guitar.position.set(-3,11.8,1);
    guitar.rotation.y = 0;
    
    scene.add(guitar);

    const boundingBox = new THREE.Box3().setFromObject(guitar);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const guitarShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.3, dimensions.y*0.15, dimensions.z*0.2));

    const guitarBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: guitarShape,
    });

    guitarBody.position = new CANNON.Vec3(-3.3,11.5,2.2);

    const rotationQuaternion = new CANNON.Quaternion();
    guitarBody.quaternion.copy(rotationQuaternion);

    const g2Shape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.03, dimensions.y*0.15, dimensions.z*0.25));
    const g2Body = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: g2Shape,
    });
    g2Body.position = new CANNON.Vec3(-3.0,11.5,0);

    world.addBody(guitarBody);
    world.addBody(g2Body);
});

//Skate
const loaderskate = new GLTFLoader();
loaderskate.load('models/obstacles/skateboard.glb', function(gltf){
    skate= gltf.scene;
    skate.scale.set(4.5,4.5,4.5);
    skate.position.set(-5,12.4,0.5);
    skate.rotation.y = 70;
    
    scene.add(skate);

    const boundingBox = new THREE.Box3().setFromObject(skate);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const skateShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.55, dimensions.y*0.5, dimensions.z*0.08));

    const skateBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: skateShape,
    });

    skateBody.position = new CANNON.Vec3(-5.,12.1,0.7);

    const rotationQuaternion = new CANNON.Quaternion();
    const eulerY = 70; 
    rotationQuaternion.setFromEuler(0, eulerY, 0);
    skateBody.quaternion.copy(rotationQuaternion);

    world.addBody(skateBody);

});

//Pan
const loaderpan = new GLTFLoader();
loaderpan.load('models/obstacles/old_frying_pan.glb', function(gltf){
    pan= gltf.scene;
    pan.scale.set(0.008,0.008,0.008);
    pan.position.set(-6.8,13.8,-0.5);
    pan.rotation.y = 20;
    scene.add(pan);

    const boundingBox = new THREE.Box3().setFromObject(pan);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const panShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.2, dimensions.y*0.1, dimensions.z*0.2));

    const panBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: panShape,
    });

    panBody.position = new CANNON.Vec3(-7,13.3,-0.7);

    const pan2Shape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.02, dimensions.y*0.05, dimensions.z*0.15));
    const pan2Body = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: pan2Shape,
    });
    pan2Body.position = new CANNON.Vec3(-5.8,14.0,-2.1);

    const rotationQuaternion = new CANNON.Quaternion();
    const eulerX = 0.25; 
    const eulerY = -0.6; 
    const eulerZ = 0.15; 
    rotationQuaternion.setFromEuler(eulerX, eulerY, eulerZ);
    pan2Body.quaternion.copy(rotationQuaternion);

    world.addBody(panBody);
    world.addBody(pan2Body);
});

//Plane
const loaderplane = new GLTFLoader();
loaderplane.load('models/obstacles/gothabomber_stylised_plane.glb', function(gltf){
    plane= gltf.scene;
    plane.scale.set(0.02,0.02,0.02);
    plane.position.set(-7.3,13.2,-6);
    plane.rotation.y = 210;
    scene.add(plane);

    const boundingBox = new THREE.Box3().setFromObject(plane);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const planeShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.35, dimensions.y*0.3, dimensions.z*0.06));

    const planeBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: planeShape,
    });

    planeBody.position = new CANNON.Vec3(-7.4,13.6,-5.6);

    const rotationQuaternion = new CANNON.Quaternion();
    const eulerY = -0.50;
    rotationQuaternion.setFromEuler(0, eulerY, 0);
    planeBody.quaternion.copy(rotationQuaternion);

    const plane2Shape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.05, dimensions.y*0.05, dimensions.z*0.20));
    const plane2Body = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: plane2Shape,
    });
    plane2Body.position = new CANNON.Vec3(-7.2,14.8,-6.0);

    const rotationQuaternion2 = new CANNON.Quaternion();
    const euler2X = 0.38;
    const euler2Y = -0.50;
    rotationQuaternion2.setFromEuler(euler2X, euler2Y, 0);
    plane2Body.quaternion.copy(rotationQuaternion2);

    const planeBarrShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.05, dimensions.y*0.1, dimensions.z*0.05));
    const planeBarrBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: planeBarrShape,
    });
    planeBarrBody.position = new CANNON.Vec3(-8.5,14.0,-3.8);

    const rotationQuaternion3 = new CANNON.Quaternion();
    //const euler3Y = 0;
    //rotationQuaternion2.setFromEuler(0, euler3Y, 0);
    planeBarrBody.quaternion.copy(rotationQuaternion3);

    world.addBody(planeBody);
    world.addBody(plane2Body);
    world.addBody(planeBarrBody);

});

//Cube
const loadermagic_cube = new GLTFLoader();
loadermagic_cube.load('models/obstacles/magic_cube.glb', function(gltf){
    magic_cube= gltf.scene;
    magic_cube.scale.set(8.5,8.5,8.5);
    magic_cube.position.set(-2,15,-4);
    scene.add(magic_cube);

    const boundingBox = new THREE.Box3().setFromObject(magic_cube);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const magic_cubeShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.5, dimensions.y*0.5, dimensions.z*0.5));

    const magic_cubeBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: magic_cubeShape,
    });

    magic_cubeBody.position = new CANNON.Vec3(-1.9,14.8,-3.9);

    const rotationQuaternion = new CANNON.Quaternion();
    magic_cubeBody.quaternion.copy(rotationQuaternion);

    world.addBody(magic_cubeBody);

});

//Bowling
const loaderbowling_pin = new GLTFLoader();
loaderbowling_pin.load('models/obstacles/bowling_pin.glb', function(gltf){
    bowling_pin= gltf.scene;
    bowling_pin.scale.set(10.5,10.5,10.5);
    bowling_pin.position.set(1,15.5,-4);
    bowling_pin.rotation.x = 90;
    bowling_pin.rotation.z = 180;
    scene.add(bowling_pin);

    const boundingBox = new THREE.Box3().setFromObject(bowling_pin);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const bowling_pinShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.50, dimensions.y*0.3, dimensions.z*0.20));

    const bowling_pinBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: bowling_pinShape,
    });

    bowling_pinBody.position = new CANNON.Vec3(2.2,15.7,-5);

    const rotationQuaternion = new CANNON.Quaternion();
    const eulerX = 0.30;
    const eulerY = 0.50; 
    rotationQuaternion.setFromEuler(eulerX, eulerY, 0);
    bowling_pinBody.quaternion.copy(rotationQuaternion);

    world.addBody(bowling_pinBody);

});

//Orange
const loaderorange = new GLTFLoader();
loaderorange.load('models/obstacles/orange_half.glb', function(gltf){
    orange= gltf.scene;
    orange.scale.set(1.2,1.2,1.2);
    orange.position.set(6.2,17,-6);
    scene.add(orange);

    const boundingBox = new THREE.Box3().setFromObject(orange);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const orangeShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.48, dimensions.y*0.3, dimensions.z*0.48));

    const orangeBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: orangeShape,
    });

    orangeBody.position = new CANNON.Vec3(6.2,16.5,-6);

    const rotationQuaternion = new CANNON.Quaternion();
    orangeBody.quaternion.copy(rotationQuaternion);

    world.addBody(orangeBody);

});

//Wood
const loaderwood = new GLTFLoader();
loaderwood.load('models/obstacles/wood.glb', function(gltf){
    wood= gltf.scene;
    wood.scale.set(7.2,7.2,7.2);
    wood.position.set(-6,15.4,-11);
    wood.rotation.y = 5;
    
    scene.add(wood);

    const boundingBox = new THREE.Box3().setFromObject(wood);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const woodShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.45, dimensions.y*0.5, dimensions.z*0.25));

    const woodBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: woodShape,
    });

    woodBody.position = new CANNON.Vec3(-6,15.3,-11);

    const rotationQuaternion = new CANNON.Quaternion();
    const eulerY = 0.30;
    rotationQuaternion.setFromEuler(0, eulerY, 0);
    woodBody.quaternion.copy(rotationQuaternion);

    world.addBody(woodBody);

});

//Hat
const loaderhat = new GLTFLoader();
loaderhat.load('models/obstacles/steampunk_hat.glb', function(gltf){
    hat= gltf.scene;
    hat.scale.set(6.2,6.2,6.2);
    hat.position.set(-2,16,-13);
    
    scene.add(hat);

    const boundingBox = new THREE.Box3().setFromObject(hat);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const hatShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.3, dimensions.y*0.5, dimensions.z*0.25));

    const hatBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: hatShape,
    });

    hatBody.position = new CANNON.Vec3(-2,15.8,-13);

    const rotationQuaternion = new CANNON.Quaternion();
    hatBody.quaternion.copy(rotationQuaternion);

    world.addBody(hatBody);

});

//Book
const loaderbook = new GLTFLoader();
loaderbook.load('models/obstacles/book.glb', function(gltf){
    book= gltf.scene;
    book.scale.set(100.2,100.2,100.2);
    book.position.set(2.5,17,-14);
    
    scene.add(book);

    const boundingBox = new THREE.Box3().setFromObject(book);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const bookShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.48, dimensions.y*0.5, dimensions.z*0.48));

    const bookBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: bookShape,
    });

    bookBody.position = new CANNON.Vec3(2.5,17,-14);

    const rotationQuaternion = new CANNON.Quaternion();
    bookBody.quaternion.copy(rotationQuaternion);

    world.addBody(bookBody);

    let moveDirection = 1; // 1 for right, -1 for left
    const moveSpeed = 0.015; // Adjust the speed of movement as needed
    let maxRightPosition = -10; // Adjust the right limit
    let maxLeftPosition = -18; // Adjust the left limit
     // Function to update the book's position and trigger animation
     function animateBook() {
        // Update the book's position based on the current direction
        book.translateZ(moveDirection * moveSpeed);
        bookBody.position.copy(book.position); 
   
        // Check if the book has reached its left or right limit and reverse the direction
        if (book.position.z >= maxRightPosition) {
            moveDirection = -1;
        } else if (book.position.z <= maxLeftPosition) {
            moveDirection = 1;
        }

        // isOnBook(); -- check if character is on book and moove it

        // Render the scene
        renderer.render(scene, camera);
   
        // Request the next frame
        requestAnimationFrame(animateBook);
    }
   
    // Start the animation loop
    animateBook();

});

//Stone
const loaderstone = new GLTFLoader();
loaderstone.load('models/obstacles/stone.glb', function(gltf){
    stone= gltf.scene;
    stone.scale.set(0.008,0.008,0.008);
    stone.position.set(6,17.5,-15);
    
    scene.add(stone);

    const boundingBox = new THREE.Box3().setFromObject(stone);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const stoneShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.4, dimensions.y*0.3, dimensions.z*0.3));

    const stoneBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: stoneShape,
    });

    stoneBody.position = new CANNON.Vec3(5.6,18.2,-15);

    const rotationQuaternion = new CANNON.Quaternion();
    stoneBody.quaternion.copy(rotationQuaternion);

    world.addBody(stoneBody);

});

//Stone2
const loaderstone2 = new GLTFLoader();
loaderstone2.load('models/obstacles/stone.glb', function(gltf){
    stone2= gltf.scene;
    stone2.scale.set(0.008,0.008,0.008);
    stone2.position.set(9.5,17.0,-7.3);
    
    scene.add(stone2);

    const boundingBox = new THREE.Box3().setFromObject(stone2);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const stone2Shape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.5, dimensions.y*0.5, dimensions.z*0.4));

    const stone2Body = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: stone2Shape,
    });

    stone2Body.position = new CANNON.Vec3(9.0,17.3,-7.5);

    const rotationQuaternion = new CANNON.Quaternion();
    stone2Body.quaternion.copy(rotationQuaternion);

    world.addBody(stone2Body);

});

//FInish
const loaderfinal_check = new GLTFLoader();
loaderfinal_check.load('models/checkpoint/round_platform.glb', function(gltf){
    final_check= gltf.scene;
    final_check.scale.set(1,1,1);
    final_check.position.set(11,18,-13);
    final_check.rotation.y = 210;
    scene.add(final_check);

    const boundingBox = new THREE.Box3().setFromObject(final_check);
    const dimensions = boundingBox.getSize(new THREE.Vector3());

    const final_checkShape = new CANNON.Box(new CANNON.Vec3(dimensions.x*0.35, dimensions.y*0.5, dimensions.z*0.35));

    const final_checkBody = new CANNON.Body({
        mass: 0, // Set mass to 0 to make it static
        shape: final_checkShape,
    });

    final_checkBody.position = new CANNON.Vec3(11,18,-13);

    const rotationQuaternion = new CANNON.Quaternion();
    //const eulerY = 11.5; // No rotation around the Z-axis
    //rotationQuaternion.setFromEuler(0, 0, 0);
    final_checkBody.quaternion.copy(rotationQuaternion);

    world.addBody(final_checkBody);

});

//Final Flag
const loaderflag = new GLTFLoader();
loaderflag.load('models/checkpoint/checkered_racing_flag.glb', function(gltf){
    flag= gltf.scene;
   
    flag.scale.set(1,1,1);
    flag.position.set(11,19.8,-13);
    
    scene.add(flag);
   // Create a variable to store the rotation angle
   let rotationAngle = 0;

   // Function to update the rotation and trigger animation
   function animateFlag() {
       // Increase the rotation angle on each frame
       rotationAngle += 0.01; // You can adjust the speed of rotation here

       // Set the rotation of the flag
       flag.rotation.y = rotationAngle;

       // Render the scene
       renderer.render(scene, camera);

       // Request the next frame
       requestAnimationFrame(animateFlag);
   }

   // Start the animation loop
   animateFlag(); 
});

/////////BODY//////////////////

var character_body;
const character_bodyMaterial= new CANNON.Material();

character_body = new CANNON.Body({ 
    mass: 50,
    shape: new CANNON.Sphere(0.2),
    material:character_bodyMaterial,
    linearDamping : 0.99
});


function _LoadModels(path,scaleValue,position_x,position_y,position_z) {
    var loaderGLTF = new GLTFLoader(loadingManager);
    loaderGLTF.load(path, function(gltf){

            meshes_character = gltf.scene;

            meshes_character.position.set(position_x,position_y,position_z);
            meshes_character.scale.setScalar(scaleValue);
            meshes_character.rotation.set(0, 0, 0);
            scene.add(meshes_character);

            character_body.position.set(position_x,position_y,position_z);
            world.addBody(character_body);

            Character = new CharacterController({target:meshes_character , body:character_body});
            renderer.setAnimationLoop(animate);
            
    });
}

//TEST LIGHTS
var ambientlight = new THREE.AmbientLight(0x404040);
ambientlight.intensity = 2.5;
scene.add(ambientlight);

const spotlight= new THREE.SpotLight(0x404040,5);
spotlight.position.y= 30;
scene.add(spotlight);
///////////////////////////////////////////////////////

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
}

window.addEventListener('resize', onWindowResize);


function animate() {
    if (RESOURCES_LOADED == false) {
        requestAnimationFrame(animate);
        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }

    world.step(timestep);
    Character.update();
    

    checkBorders();

    var checkpoint = localStorage.getItem('myValue2');
    if (checkpoint == 'easy'){

    checkFirstCheckpoint();
    checkSecondCheckpoint();
    }


    checkFinish();
    

    
    // 3rd person camera

    camera.position.copy(Character._target.position);
    camera.rotation.copy(Character._target.rotation);

    // Move camera slightly behind the character
    const distanceBehind = 3;
    const heightAbove = 2;
    const offset = new THREE.Vector3(0, heightAbove, -distanceBehind);
    offset.applyQuaternion(Character._target.quaternion);
    camera.position.add(offset);

    // Look at the character's position
    camera.lookAt(Character._target.position);
    camera.lookAt(Character._target.position);


    renderer.render(scene, camera);

    

}

renderer.setAnimationLoop(animate)