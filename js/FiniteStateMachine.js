    export class FiniteStateMachine {
        constructor(target) {
            this._states = {};
            this._currentState = null;
            this._target = target;
        }

        _prepareDict() {
            function FindObjectByName(root, targetName) {
              const stack = [root];
          
              while (stack.length > 0) {
                const object = stack.pop();
          
                if (object.name === targetName) {
                  return object;
                }
          
                if (object.children) {
                  stack.push(...object.children);
                }
              }
          
              return null;
            }
          
            // Traverse the gltf file and build an array with all the bones
            function sceneGraphToBFSArray(root) {
                const hierarchyArray = [];
                const stack = [{ object: root, depth: 0 }];
            
                while (stack.length > 0) {
                    const { object, depth } = stack.pop();
                    hierarchyArray.push({ ...object, depth }); 
            
                    if (object.children) {
                        for (const child of object.children) {
                            stack.push({ object: child, depth: depth + 1 });
                        }
                    }
                }
            
                return hierarchyArray;
            }
            
              // Get the scene graph hierarchy in an array so that we can check names (names in the gltf files were different..)
              const hierarchyArray = sceneGraphToBFSArray(this._target);
              console.log("Scene Graph Hierarchy:");
              console.log(hierarchyArray);
          
            // Finding objects by name and preparing the dictionary
            for (const i in this._targetDict) {
              const targetName = this._targetDict[i].name;
              const targetObject = FindObjectByName(this._target, targetName);
          
              if (targetObject) {
                this._targetDict[i].mesh = targetObject;
                //console.log('Object found: ' + targetName);
              } else {
                console.warn(`Object with name '${targetName}' not found.`);
              }
            }
          }

        _addState(name, type) {
            this._states[name] = type;
        }

        setState(name) {
            const prevState = this._currentState;

            if (prevState) {
                if (prevState.Name == name) {
                    return;
                }
                prevState.exit();
            }

            const state = new this._states[name]({
                parent: this,
                targetDict: this._targetDict, name: name, 
            });

            this._currentState = state;
            state.enter(prevState);
        }

        update(input) {
            if (this._currentState) {
                this._currentState.update(input);
            }
        }
    }

    export class State {
        constructor(params) {
            this._parent = params.parent;
            this._targetDict = params.targetDict;
            this._name = params.name;
        }

        get Name() {
            return this._name;
        }

        enter() {return;}
        exit() {return;}
        update() {return;}
    }