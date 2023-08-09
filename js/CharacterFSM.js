import { FiniteStateMachine , State } from './FiniteStateMachine.js';

const PI_6 = Math.PI / 6;


export class CharacterFSM extends FiniteStateMachine {
  constructor(target) {
      super(target);

      //Create dictionary in order to assign rotation to the body parts later
      this._targetDict = {
          Head:         { name: "Head_05", mesh: null},
          Neck:         { name: "Neck_04", mesh: null},

          Trunk:        { name: "Spine1_02", mesh: null},

          Shoulder_sx:  { name: "Shoulderl_010", mesh: null},
          Upper_Arm_sx: { name: "Arml_011", mesh: null},
          Lower_Arm_sx: { name: "ForeArml_012", mesh: null},
          Hand_sx:      { name: "Handl_013", mesh: null}, 

          Shoulder_dx:  { name: "Shoulderr_029", mesh: null,},
          Upper_Arm_dx: { name: "Armr_030", mesh: null},
          Lower_Arm_dx: { name: "ForeArmr_031", mesh: null},
          Hand_dx:      { name: "Handr_032", mesh: null}, 

          Upper_Leg_sx: { name: "Legl_048", mesh: null},
          Lower_Leg_sx: { name: "Forelegl_049", mesh: null},
          Ankle_sx:     { name: "Anklel_050", mesh: null},
          Foot_sx:      { name: "Footl_051", mesh: null},

          Upper_Leg_dx: { name: "Legr_052", mesh: null},
          Lower_Leg_dx: { name: "Forelegr_053", mesh: null},
          Ankle_dx:      { name: "Ankler_054", mesh: null},
          Foot_dx:      { name: "Footr_055", mesh: null},

          //trunk: { name: "Spine1_02", mesh: null},
          //trunk1: { name: "Spine2_03", mesh: null},
          //trunk2: { name: "Spine3_00", mesh: null},
   
      };

      
      
      this._prepareDict();  //assigns the mesh taken from the gltf file to the body part
      
      this._addState('idle', IdleState);
      this._addState('walk', WalkState);
      this._addState('run', RunState);
      this._addState('jump', JumpState);
      this._addState('view',ViewState);

    }
    _setValues() {
      this._targetDict.Head.mesh.rotation.x = -3.0;
      this._targetDict.Trunk.mesh.rotation.x = 0.01004335843026638;

      this._targetDict.Shoulder_dx.mesh.rotation.y = -0.3;
      this._targetDict.Shoulder_sx.mesh.rotation.y = 0.3;
      this._targetDict.Upper_Arm_dx.mesh.rotation.x = -0.9;
      this._targetDict.Upper_Arm_sx.mesh.rotation.x = -0.9;
      this._targetDict.Lower_Arm_dx.mesh.rotation.x = -0.2 ;
      this._targetDict.Lower_Arm_sx.mesh.rotation.x = -0.2;
      this._targetDict.Upper_Arm_dx.mesh.rotation.z = 0.0014557918766513467;
      this._targetDict.Upper_Arm_sx.mesh.rotation.z = -0.0014557787217199802;
      this._targetDict.Lower_Arm_dx.mesh.rotation.z = 0.2;
      this._targetDict.Lower_Arm_sx.mesh.rotation.z = -0.2;

      this._targetDict.Upper_Leg_sx.mesh.rotation.x = 0.0005007128929719329;
      this._targetDict.Upper_Leg_dx.mesh.rotation.x = -0.0005001537501811981;
      this._targetDict.Lower_Leg_sx.mesh.rotation.x = 0.061433207243680954;
      this._targetDict.Lower_Leg_dx.mesh.rotation.x = 0.06143326684832573;
      this._targetDict.Ankle_sx.mesh.rotation.x = -0.005164853762835264;
      this._targetDict.Ankle_dx.mesh.rotation.x = 0.005164777860045433;
      this._targetDict.Foot_sx.mesh.rotation.x = 0.226236954331398;
      this._targetDict.Foot_dx.mesh.rotation.x = 0.22623677551746368;
    }
  
}





class IdleState extends State {
    constructor(params) {
    super(params);
    
    this._stateHead = 0;
    this._stateArms = 0;
    }
  
  enter() {
    
   this._parent._setValues();
    

  }

  update(input) { 
    if (input._keys.forward || input._keys.backward || input._keys.left || input._keys.right) {
        this._parent.setState('walk');
        return;
    } else if (input._keys.space) {
        this._parent.setState('jump');
        return;
    }

    


  }
}

class WalkState extends State {
  constructor(params) {
  super(params);

  this._stateLegs = 0;
  this._stateArms = 0;
  }

  enter(){
    this._targetDict.Head.mesh.rotation.x = -3.0;
    this._targetDict.Trunk.mesh.rotation.x = 0.01004335843026638;
    this._targetDict.Lower_Arm_dx.mesh.rotation.z = 0.2;
    this._targetDict.Lower_Arm_sx.mesh.rotation.z = -0.2;
  }
  update(input) {
    if (input._keys.forward || input._keys.backward || input._keys.left || input._keys.right ) {  
      if (input._keys.shift) {
          this._parent.setState('run');
          return;
      }
      if(input._keys.space){
          this._parent.setState('jump');
          return;       
      }
    } else {
      this._parent.setState('idle');
      return;
    }

    var speed = 0.035;
    var angle_leg = Math.PI / 6; // 30 degrees

  switch (this._stateLegs) {
    case 0:
      if (this._targetDict.Upper_Leg_sx.mesh.rotation.x >= angle_leg) {
        this._stateLegs = 1;
      } else {
        this._targetDict.Upper_Leg_sx.mesh.rotation.x += speed;
        this._targetDict.Upper_Leg_dx.mesh.rotation.x -= speed;

        // Foreleg (Lower Leg) movement
        this._targetDict.Lower_Leg_sx.mesh.rotation.x -= speed;
        this._targetDict.Lower_Leg_dx.mesh.rotation.x += speed;

        // Ankle movement
        this._targetDict.Ankle_sx.mesh.rotation.x -= speed;
        this._targetDict.Ankle_dx.mesh.rotation.x += speed;

        // Foot movement
        this._targetDict.Foot_sx.mesh.rotation.x -= speed;
        this._targetDict.Foot_dx.mesh.rotation.x += speed;
      
        //set arms in order to be inverted wrt. the leg
        this._stateArms = 1;
      }
      break;

    case 1:
      if (this._targetDict.Upper_Leg_sx.mesh.rotation.x <= -angle_leg) {
        this._stateLegs = 0;
      } else {
        this._targetDict.Upper_Leg_sx.mesh.rotation.x -= speed;
        this._targetDict.Upper_Leg_dx.mesh.rotation.x += speed;

        // Foreleg (Lower Leg) movement
        this._targetDict.Lower_Leg_sx.mesh.rotation.x += speed;
        this._targetDict.Lower_Leg_dx.mesh.rotation.x -= speed;

        // Ankle movement
        this._targetDict.Ankle_sx.mesh.rotation.x += speed;
        this._targetDict.Ankle_dx.mesh.rotation.x -= speed;

        // Foot movement
        this._targetDict.Foot_sx.mesh.rotation.x += speed;
        this._targetDict.Foot_dx.mesh.rotation.x -= speed;
      
        //set arms in order to be inverted wrt. the leg
        this._stateArms = 0;
      }
      break;
  }

  switch (this._stateArms) {
    case 0:
      this._targetDict.Upper_Arm_dx.mesh.rotation.z -= speed;
      this._targetDict.Upper_Arm_sx.mesh.rotation.z -= speed;
      break;
    
    case 1:
      this._targetDict.Upper_Arm_dx.mesh.rotation.z += speed;
      this._targetDict.Upper_Arm_sx.mesh.rotation.z += speed;
      break;  
    }
  } 
}

class JumpState extends State {
  constructor(params) {
      super(params);

      this._stateLegs = 0;
      this._stateArms = 0;
      this._isJumping = 0;
      this.prevState = "";
  }

  enter(prevState){
    this.prevState = prevState;
    this._isJumping = 1;
    this._parent._setValues();

    if(this.prevState._name != "idle"){
    this._targetDict.Lower_Arm_sx.mesh.rotation.z = -1.2;
    this._targetDict.Lower_Arm_dx.mesh.rotation.z = 1.2;
    this._targetDict.Upper_Leg_sx.mesh.rotation.x = 0.5;
    this._targetDict.Upper_Leg_dx.mesh.rotation.x = -0.5;
    this._targetDict.Lower_Leg_sx.mesh.rotation.x = 1;
    this._targetDict.Lower_Leg_dx.mesh.rotation.x = -1;
    }
  }

  update(input) {

      var jump_movement_speed = 0.06;
      if(this._isJumping == 1){
      switch (this._stateArms) {
          case 0:
              if (this._targetDict.Upper_Arm_dx.mesh.rotation.z >= Math.PI/3) {
                  this._stateArms = 1;
              } else {
                if(this.prevState._name == "idle"){   //if the character was not moving, the jump is on the spot!
                  this._targetDict.Upper_Arm_sx.mesh.rotation.z -= jump_movement_speed;
                  this._targetDict.Upper_Arm_dx.mesh.rotation.z += jump_movement_speed;

                  this._targetDict.Upper_Leg_sx.mesh.rotation.x += jump_movement_speed;
                  this._targetDict.Upper_Leg_dx.mesh.rotation.x += jump_movement_speed;

                  this._targetDict.Lower_Leg_sx.mesh.rotation.x = 1;
                  this._targetDict.Lower_Leg_dx.mesh.rotation.x = 1;

                  this._targetDict.Trunk.mesh.rotation.x += 0.005;

                  this._targetDict.Head.mesh.rotation.x += 0.003;

                }
                else{
                  this._targetDict.Upper_Arm_sx.mesh.rotation.z -= jump_movement_speed;
                  this._targetDict.Upper_Arm_dx.mesh.rotation.z += jump_movement_speed;

                  this._targetDict.Upper_Leg_sx.mesh.rotation.x -= jump_movement_speed;
                  this._targetDict.Upper_Leg_dx.mesh.rotation.x += jump_movement_speed;

                  this._targetDict.Trunk.mesh.rotation.x += 0.005;

                  this._targetDict.Head.mesh.rotation.x +=  0.003;
                }
                  
              }
              break;

          case 1:
            if (this._targetDict.Upper_Arm_dx.mesh.rotation.z < -Math.PI/7) {
              this._isJumping = 0; // Jump animation finished
              this._parent.setState("idle"); // Transition to idle state
          } else {
            if(this.prevState._name == "idle"){
              this._targetDict.Upper_Arm_sx.mesh.rotation.z += jump_movement_speed;
              this._targetDict.Upper_Arm_dx.mesh.rotation.z -= jump_movement_speed;

              this._targetDict.Upper_Leg_sx.mesh.rotation.x -= jump_movement_speed;
              this._targetDict.Upper_Leg_dx.mesh.rotation.x -= jump_movement_speed;

              this._targetDict.Lower_Leg_sx.mesh.rotation.x -= 0.05;
              this._targetDict.Lower_Leg_dx.mesh.rotation.x -= 0.05;

              this._targetDict.Trunk.mesh.rotation.x -= 0.005;

              this._targetDict.Head.mesh.rotation.x -= 0.003;
            }
            else{
            this._targetDict.Upper_Arm_sx.mesh.rotation.z += jump_movement_speed;
            this._targetDict.Upper_Arm_dx.mesh.rotation.z -= jump_movement_speed;

            this._targetDict.Upper_Leg_sx.mesh.rotation.x += jump_movement_speed;
            this._targetDict.Upper_Leg_dx.mesh.rotation.x -= jump_movement_speed;

            this._targetDict.Trunk.mesh.rotation.x -= 0.005;

            this._targetDict.Head.mesh.rotation.x -= 0.003;
            }
          }
              break;
      }
    }
      //this._parent.setState("idle");
  }
  }

class RunState extends State {
  constructor(params) {
    super(params);
    this._stateLegs = 0;
    this._stateArms = 0;
    }
    enter(){
        this._targetDict.Lower_Arm_dx.mesh.rotation.z = 0.6;
        this._targetDict.Lower_Arm_sx.mesh.rotation.z = -0.6;
    }
    update(input) {
      if (input._keys.forward || input._keys.backward || input._keys.left || input._keys.right) {
        if (!input._keys.shift) {
          this._parent.setState('walk');
          return;
      }
        if (input._keys.space) {
          this._parent.setState('jump');
          return;
        }
    } else {
        this._parent.setState('idle');
        return;
    }
  
    var speed = 0.08; 
    var angle_leg = Math.PI / 4; // 45 degrees for larger leg movements

    switch (this._stateLegs) {
      case 0:
        if (this._targetDict.Upper_Leg_sx.mesh.rotation.x >= angle_leg) {
          this._stateLegs = 1;
        } else {
          this._targetDict.Upper_Leg_sx.mesh.rotation.x += speed;
          this._targetDict.Upper_Leg_dx.mesh.rotation.x -= speed;

          // Foreleg (Lower Leg) movement
          this._targetDict.Lower_Leg_sx.mesh.rotation.x -= speed;
          this._targetDict.Lower_Leg_dx.mesh.rotation.x += speed;

          // Ankle movement
          this._targetDict.Ankle_sx.mesh.rotation.x -= speed;
          this._targetDict.Ankle_dx.mesh.rotation.x += speed;

          // Foot movement
          this._targetDict.Foot_sx.mesh.rotation.x -= speed;
          this._targetDict.Foot_dx.mesh.rotation.x += speed;

          //Head movement
          this._targetDict.Head.mesh.rotation.x += 0.008;

          //Body movement
          this._targetDict.Trunk.mesh.rotation.x -= 0.005;

          // Set arms in order to be inverted with respect to the leg
          this._stateArms = 1;
        }
        break;

      case 1:
        if (this._targetDict.Upper_Leg_sx.mesh.rotation.x <= -angle_leg) {
          this._stateLegs = 0;
        } else {
          this._targetDict.Upper_Leg_sx.mesh.rotation.x -= speed;
          this._targetDict.Upper_Leg_dx.mesh.rotation.x += speed;

          // Foreleg (Lower Leg) movement
          this._targetDict.Lower_Leg_sx.mesh.rotation.x += speed;
          this._targetDict.Lower_Leg_dx.mesh.rotation.x -= speed;

          // Ankle movement
          this._targetDict.Ankle_sx.mesh.rotation.x += speed;
          this._targetDict.Ankle_dx.mesh.rotation.x -= speed;

          // Foot movement
          this._targetDict.Foot_sx.mesh.rotation.x += speed;
          this._targetDict.Foot_dx.mesh.rotation.x -= speed;

          //Head movement
          this._targetDict.Head.mesh.rotation.x -= 0.008;

          //Body movement
          this._targetDict.Trunk.mesh.rotation.x += 0.005;

          // Set arms in order to be inverted with respect to the leg
          this._stateArms = 0;
        }
        break;
    }

    switch (this._stateArms) {
      case 0:
        // When the left leg is forward, the left arm moves backward
        this._targetDict.Upper_Arm_sx.mesh.rotation.z -= speed;
        this._targetDict.Upper_Arm_dx.mesh.rotation.z -= speed;

        break;

      case 1:
        // When the right leg is forward, the right arm moves backward
        this._targetDict.Upper_Arm_sx.mesh.rotation.z += speed;
        this._targetDict.Upper_Arm_dx.mesh.rotation.z += speed;

        break;
    }

}
  
};

class ViewState extends State {
  constructor(params) {
  super(params);
  }
  enter() {
    //INITIAL POSITION OF THE CHARACTER
    this._targetDict.Shoulder_dx.mesh.rotation.y =-1.0;
    this._targetDict.Shoulder_sx.mesh.rotation.y = 1.0;
    this._targetDict.Trunk.mesh.rotation.y = Math.PI;
    //this._targetDict.trunk1.mesh.rotation.y +=0.1;
    //this._targetDict.trunk2.mesh.rotation.y +=0.1;
  }
  update(input) {
  this._parent.setState('idle');
  }
}
