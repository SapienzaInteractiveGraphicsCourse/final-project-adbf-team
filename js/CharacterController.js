import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';
import { CharacterFSM } from './CharacterFSM.js';
// Logic.js
import * as CannonPhysics from '../test_character.js'; // Import the Cannon.js objects

const desiredPosition = new THREE.Vector3(-5, -0.5, -12);

export class CharacterController {
    constructor(params) {
        this._Init(params);
        this._canJump = true; // Allow jumping initially
        this._jumping = false;
        this._lastJumpTime = 0; // Track the time of the last jump
    }

    _Init(params) {
        this._target = params.target;
        this._body = params.body;
        this._decceleration = new THREE.Vector3(-0.5, -0.005, -0.3);
        this._acceleration = new THREE.Vector3(0.07, 0.001, 0.02);
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._jumpVelocity = 15;
        //this._canJump=true;
        //this._jumping = false;
        this._stateMachine = new CharacterFSM(this._target);
        this._stateMachine.setState('idle');
        this._input = new CharacterControllerInput();
    }

    update(){
        this._stateMachine.update(this._input);

        const velocity = this._velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this._decceleration.x,
            velocity.y * this._decceleration.y,
            velocity.z * this._decceleration.z
        );
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));
        velocity.add(frameDecceleration);

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = this._acceleration.clone();
        if (this._input._keys.forward) {
            if (this._input._keys.shift) {
                velocity.z += acc.z * 8;
            }
            else {
                velocity.z += acc.z*2 ;
            }
        }
        if (this._input._keys.backward) {
            if (this._input._keys.shift) {
                velocity.z -= acc.z * 10;
            }
            else {
                velocity.z -= acc.z * 5;
            }
        }

        if (this._input._keys.left) {
            if (this._input._keys.shift) {
                _A.set(0, 1, 0);
                _Q.setFromAxisAngle(_A, 9.0 * Math.PI * this._acceleration.y);
                _R.multiply(_Q);
            }else{
                _A.set(0, 1, 0);
                _Q.setFromAxisAngle(_A, 6.0 * Math.PI * this._acceleration.y);
                _R.multiply(_Q);
            }
        }
        if (this._input._keys.right) {
            if (this._input._keys.shift) {
                _A.set(0, 1, 0);
                _Q.setFromAxisAngle(_A, 9.0 * -Math.PI * this._acceleration.y);
                _R.multiply(_Q);
            }else{
                _A.set(0, 1, 0);
                _Q.setFromAxisAngle(_A, 6.0 * -Math.PI * this._acceleration.y);
                _R.multiply(_Q);
            }
        }
        //TIMER
        //Right now, infinite jump to build

        if(this._input._keys.fly == false){
        if (this._input._keys.space && this._canJump && !this._jumping) {
            if (this._input._keys.space && this._canJump ) {
                this._body.velocity.y = this._jumpVelocity;
                this._jumping = true;
                this._lastJumpTime = Date.now(); // Record the time of the jump
            }
        }
        
        if (Date.now() - this._lastJumpTime >= 1500) { 
                this._canJump = true;
                this._jumping = false;
        }
        
        if (this._jumping) {
            // additional gravity
            this._body.velocity.y -= 0.025 * this._jumpVelocity;
        }
        }
        else if(this._input._keys.fly == true){
            if (this._input._keys.space && this._canJump) {
                if (this._input._keys.space && this._canJump ) {
                    this._body.velocity.y = 5;
                    //this._jumping = true;
                    //this._lastJumpTime = Date.now(); // Record the time of the jump
                }
            }
        }
    
        //SALTO NORMALE

        //if (this._input._keys.space && this._canJump && !this._jumping) {
        //    this._body.velocity.y = this._jumpVelocity;
        //    this._jumping = true; // Set jumping state to true
        //} 
        //const groundDistance = 3.0;                                         //don't allow double jump
        //if (this._body.position.y <= groundDistance) {
        //    this._canJump = true;
        //    this._jumping = false; // Reset jumping state
        //}
        //if(this._jumping){
        //      //additional gravity
        //    this._body.velocity.y -= 0.025*this._jumpVelocity;       
        //}
        if(!(this._input._keys.left||this._input._keys.right ||this._input._keys.forward|| this._input._keys.backward )){

                this._body.velocity.x *= 0.1;
                this._body.velocity.z *= 0.1;
             }

        controlObject.quaternion.copy(_R);

        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();
      
        sideways.multiplyScalar(velocity.x);
        forward.multiplyScalar(velocity.z);
        
        this._body.velocity.x += sideways.x+forward.x;
        this._body.velocity.z += sideways.z+forward.z;

        

        controlObject.position.copy(this._body.position);
    
        if(this._input._keys.view){
            this._stateMachine.setState('view');

        }
    }
    
  
};



class CharacterControllerInput { //resposible for keyboard and other controller input
    constructor() {
        this._Init();
        }

    _Init(){
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
            fly: false,
        };
        document.addEventListener('keydown', (e)=>this._onKeyDown(e), false);
        document.addEventListener('keyup', (e)=>this._onKeyUp(e), false); 
        
    }

    _onKeyDown(event){
        switch(event.keyCode){
            case 87: //W
                this._keys.forward=true;
                break;
            case 65: // a
                this._keys.left = true;
                break;
            case 83: // s
                this._keys.backward = true;
                break;
            case 68: // d
                this._keys.right = true;
                break;
            case 32: // SPACE
                this._keys.space = true;
                break;
            case 16: // SHIFT
                this._keys.shift = true;
                break;
            case 86: //v
                this._keys.view = true;    
            case 48: //0
            this._keys.fly = !this._keys.fly;
                break;
        }
    }
        
    _onKeyUp(event) {
        switch(event.keyCode) {
            case 87: // w
                this._keys.forward = false;
                break;
            case 65: // a
                this._keys.left = false;
                break;
            case 83: // s
                this._keys.backward = false;
                break;
            case 68: // d
                this._keys.right = false;
                break;
            case 32: // SPACE
                this._keys.space = false;
                break;
            case 16: // SHIFT
                this._keys.shift = false;
                break;
        }
    }
};