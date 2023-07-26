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
        const skyColor = new THREE.Color(0xadd8e6); // Clear blue color
        //SCENE
        const scene = new THREE.Scene();

        scene.background = skyColor;    

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


        // STAGE (Solid Plane with Soft Color)
        const stageSize = 35; 
        const stageGeometry = new THREE.BoxGeometry(stageSize, stageSize);
        const stageMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0e68c, 
        roughness: 0.5,
        metalness: 0.2,
        });
        const stage = new THREE.Mesh(stageGeometry, stageMaterial);
        stage.rotation.x = -Math.PI / 2; // Rotate the stage to make it horizontal
        scene.add(stage);

        ///stage cannon
        const stageMaterialCannon = new CANNON.Material();
        const stageBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(35, 1, 35)),
        position: new CANNON.Vec3(0, 0, 0),
        material: stageMaterialCannon,
        });
        world.addBody(stageBody);

/*------------------------------------------END TEST ENVIRONMENT-----------------------------------------------*/

        //MODELS
        //_LoadModels('./models/spaceboy/scene.gltf',3,0,1,0);
        //_LoadModels('./models/girl/scene.gltf',3,0,1,0);
        _LoadModels('./models/firefighter/scene.gltf', 1, 0, 1, 0);

        var character_body;
        const character_bodyMaterial= new CANNON.Material();
        ;
        
        character_body = new CANNON.Body({ 
            mass: 50, 
            shape: new CANNON.Sphere(0.0001),
            material:character_bodyMaterial,
            linearDamping : 0.99
        });

       
        function _LoadModels(path,scaleValue,position_x,position_y,position_z) {
            var loaderGLTF = new GLTFLoader(loadingManager);
            loaderGLTF.load(path, function(gltf){

                    meshes_character = gltf.scene;

                    meshes_character.position.set(position_x,position_y,position_z);
                    meshes_character.scale.setScalar(scaleValue);
                    meshes_character.rotation.set(0, Math.PI, 0);
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


        const stage_character_contact = new CANNON.ContactMaterial(
            stageMaterial,
            character_bodyMaterial,
            {
                friction:0.5,
                contactEquationStiffness:1e5
            }
        );
        world.addContactMaterial(stage_character_contact)


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
            
            // 3rd person camera

            camera.position.copy(Character._target.position);
            camera.rotation.copy(Character._target.rotation);
        
            // Move camera slightly behind the character
            const distanceBehind = 10;
            const heightAbove = 8;
            const offset = new THREE.Vector3(0, heightAbove, -distanceBehind);
            offset.applyQuaternion(Character._target.quaternion);
            camera.position.add(offset);

            // Look at the character's position
            camera.lookAt(Character._target.position);
            camera.lookAt(Character._target.position);


            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate)