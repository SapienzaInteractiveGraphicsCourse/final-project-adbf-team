import { FiniteStateMachine , State } from './FiniteStateMachine.js';

const PI_6 = Math.PI / 6;


export class CharacterFSM extends FiniteStateMachine {
  constructor(target) {
      super(target);

      //Create dictionary in order to assign rotation to the body parts later
      this._targetDict = {
          Head:         { name: "Head_05", mesh: null},

          Shoulder_sx:  { name: "Shoulderl_010", mesh: null},
          Upper_Arm_sx: { name: "Arml_011", mesh: null, initValue: null},
          Lower_Arm_sx: { name: "ForeArml_012", mesh: null}, 

          Shoulder_dx:  { name: "Shoulderr_029", mesh: null,},
          Upper_Arm_dx: { name: "Armr_030", mesh: null, initValue: null },
          Lower_Arm_dx: { name: "ForeArmr_031", mesh: null},

          Upper_Leg_sx: { name: "Legl_048", mesh: null},
          Lower_Leg_sx: { name: "Forelegl_049", mesh: null},
          Upper_Leg_dx: { name: "Legr_052", mesh: null},
          Lower_Leg_dx: { name: "Forelegr_053", mesh: null},

          trunk: { name: "Spine1_02", mesh: null},
          trunk1: { name: "Spine2_03", mesh: null},
          trunk2: { name: "Spine3_00", mesh: null},
   
      };
      
      this._prepareDict();  //assigns the mesh taken from the gltf file to the body part
      
      this._addState('idle', IdleState);
      this._addState('walk', WalkState);
      this._addState('run', RunState);
      this._addState('jump', JumpState);
      this._addState('view',ViewState);
    }
  
}




class IdleState extends State {
    constructor(params) {
    super(params);
    
    this._stateHead = 0;
    this._stateArms = 0;
    }
  
  enter() {
    //INITIAL POSITION OF THE CHARACTER
    this._targetDict.Shoulder_dx.mesh.rotation.y =-1.0;
    this._targetDict.Shoulder_sx.mesh.rotation.y = 1.0;
    this._targetDict.Upper_Leg_sx.mesh.rotation.x = 0.0005007128929719329;
    this._targetDict.Upper_Leg_dx.mesh.rotation.x = -0.0005001537501811981;
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
  }
  update(input) {
    if (input._keys.forward || input._keys.backward || input._keys.left || input._keys.right || input._keys.space) {  
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

    var speed = 0.05;
    switch (this._stateLegs) {
        case 0:
            if (this._targetDict.Upper_Leg_sx.mesh.rotation.x >= PI_6) {
                this._stateLegs = 1;
            } else {
                this._targetDict.Upper_Leg_sx.mesh.rotation.x += speed;
                this._targetDict.Upper_Leg_dx.mesh.rotation.x -= speed;
            }
            break;

        case 1:
            if (this._targetDict.Upper_Leg_sx.mesh.rotation.x <= -PI_6) {
                this._stateLegs = 0;
            } else {
                this._targetDict.Upper_Leg_sx.mesh.rotation.x -= speed;
                this._targetDict.Upper_Leg_dx.mesh.rotation.x += speed;
            }
            break;
    }
    
    
  } 

  
}

class JumpState extends State {
  constructor(params) {
    super(params);
    }
    enter() {
    }
    update(input) {
    this._parent.setState('walk');
    }
  
}

class RunState extends State {
  constructor(params) {
    super(params);
    }
    enter() {
    }
    update(input) {
    this._parent.setState('walk');
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
    this._targetDict.trunk.mesh.rotation.y = Math.PI;
    //this._targetDict.trunk1.mesh.rotation.y +=0.1;
    //this._targetDict.trunk2.mesh.rotation.y +=0.1;
  }
  update(input) {
  this._parent.setState('idle');
  }
}
