import {soundLoader} from '../sounds.js';
import { IntroScene } from './IntroScene.js';
class LevelOne {

    /**
     * Constructeur
     * @param {*} configuration : configuration du projet
     */
    
    constructor(configuration) {
        this.configuration = configuration;
    
        this.scene = new BABYLON.Scene(configuration.engine);  //  Creates a basic Babylon Scene object
        this.configuration.scenes.push(this.scene)// Mettre la scene en 1er dans la liste
        this.canvas = configuration.canvas;
        this.hero = null;
        this.camera = null;
        this.inputStates = {};
        this.configureAssetManager();  //  Configure la scene et afficher le rendu à interval réguliers
        let tree;
        this.isTreeLoaded = false;
    }


    /**
     * Configurer tout les eléménts de la scene et recharger régulierement le rendu scene
     */
 async configureAssetManager() {
       this.modifySettings();
        var instance = this;
        this.hero =  await this.getHero();
     
        if (this.hero != null){
            console.log(this.hero);
            this.camera = this.createFollowCamera(this.scene, this.hero);
            this.scene.activeCamera = this.camera;
            console.log(this.camera);
        }

      
        instance.creerElementsScene();  //  Call the createScene function

        instance.configuration.engine.runRenderLoop(function () { //  Register a render loop to repeatedly render the scene
            
            instance.renderScene()
        });
    }

    creerElementsScene() {
        this.creerLumiere();
        this.greateGround();
        this.createTrees();
        this.createPortal();
        this. createSkybox(this.scene)
    }
    creerLumiere() {
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    }
    createFollowCamera(scene, target) {
        let camera = new BABYLON.FollowCamera("heroFollowCamera", target.position, scene, target);
    
        camera.radius = 8; // how far from the object to follow
        camera.heightOffset = 3; // how high above the object to place the camera
        camera.rotationOffset = 180; // the viewing angle
        camera.cameraAcceleration = 1; // how fast to move
        camera.maxCameraSpeed = 1; // speed limit

        return camera;
    }
    greateGround() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("./assets/images/pavement2.jpg", this.scene);
        const groundWidth = 10;
        const groundLength = 400;

        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundWidth, height: groundLength });

        ground.material = groundMaterial;
            // Create a particle system
            const particleSystem =BABYLON.ParticleHelper.CreateDefault(new BABYLON.Vector3(0, 0.5, -198));
        
            particleSystem.minSize = 1;
            particleSystem.maxSize = 3;
            
particleSystem.minEmitBox = new BABYLON.Vector3(-2, 0, -2);
particleSystem.maxEmitBox = new BABYLON.Vector3(2, 40, 2);

particleSystem.start();


    }
    createSkybox(scene) {

      var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
      var skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
        "./assets/images/cubemap/",
        scene
      );
      skyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.disableLighting = true;
      skybox.material = skyboxMaterial;
    }
    createPortal(){
      BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "portalLevel1.glb", this.scene, (meshes) => {
        const portal = meshes[0];
        portal.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
        portal.position = new BABYLON.Vector3(0, -1, -198);
        portal.name = "portal";
      });
    }
    createTrees() {
      const treeWidth = 0.9;
      const treeHeight = 0.9;
      const treeDepth = 0.9;
    
      // Load the tree model
      BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "tree.glb", this.scene, (meshes) => {
        this.tree = meshes[0];
    
        // Position trees on the left side of the ground
        for (let i = 0; i < 9; i++) {
          const x = -4.5;
          const y = treeHeight / 2;
          const z = (i * 50) - 180; // Updated z value
              
          const newTree = this.tree.clone(`tree_${i}`);
          newTree.scaling = new BABYLON.Vector3(treeWidth, treeHeight, treeDepth);
          newTree.position = new BABYLON.Vector3(x, y, z);
          console.log(newTree.position.x);
        }
    
        // Position trees on the right side of the ground
        for (let i = 0; i < 9; i++) {
          
          const x = 4.5;
          const y = treeHeight / 2;
          const z = (i * 50) - 180; // Updated z value
              
          const newTree = this.tree.clone(`tree_${i + 10}`);
          newTree.scaling = new BABYLON.Vector3(treeWidth, treeHeight, treeDepth);
          newTree.position = new BABYLON.Vector3(x, y, z);
          console.log(newTree.position.x);
        }
      });
      this.isTreeLoaded = true;
    }
    
    
  async getHero() {
        let hero = await BABYLON.SceneLoader.ImportMeshAsync(
            "", "./assets/models/", "male.glb", this.scene);
            if (hero.meshes.length > 0) {
            let main = hero.meshes[0];
            main.position.x = 0;
            main.position.z = 196.6;
            main.position.y = 1.4;

            //main.frontVector = new BABYLON.Vector3(0, 0, 1);

            // main.rotation.x = Math.PI;
            // main.rotation.y = 0;
            // main.rotation.z = Math.PI;

            main.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);

            main.name = "heroMain";
            main.checkCollisions = true;
            main.speed = 0.5;
            
            main.move = () => {
  
              let a = this.scene.getAnimationGroupByName("Idle");
              a.start(true, 1.0, a.from, a.to, false);
          
              let movementVector = new BABYLON.Vector3(0, 0, 0);

              if (this.tree && main.intersectsMesh(this.tree, true)) {
                
                console.log("collision");
              }
              if (this.inputStates.up) {
                  console.log("in move function : up");
                  let a = this.scene.getAnimationGroupByName("Run");
                  a.start(false, 1.0, a.from, a.to, false);
                  movementVector.z -= 1;
                  this.inputStates.up = false;
              } 

              if (this.inputStates.left) {
                console.log(movementVector.x);
                  console.log("in move function : left");
                  let a = this.scene.getAnimationGroupByName("Run");
                  a.start(false, 1.5, a.from, a.to, false);
                  movementVector.x += 2;
                  this.inputStates.left = false;
                }
              if (this.inputStates.right) {
                  console.log("in move function : right");
                  let a = this.scene.getAnimationGroupByName("Run");
                  a.start(false, 2.0, a.from, a.to, false);
                  movementVector.x -= 2;
                  this.inputStates.right = false;
              }
              if (this.inputStates.space) {
                  console.log("in move function : space");
                  movementVector.y += 15;
                  movementVector.z -= 4;
                  let a = this.scene.getAnimationGroupByName("Jump");
                 
                  a.start(false, 1.0, a.from, a.to, false);
                  this.inputStates.space = false;
                  movementVector.y -= 15;
                 
          
                  let idle = this.scene.getAnimationGroupByName("Idle");
                  idle.start(true, 1.0, idle.from, idle.to, false);
              }
          
              if (movementVector.length() !== 0) {
                  movementVector = movementVector.normalize().scale(main.speed);
                  let newPosition = main.position.add(movementVector);
                  if (newPosition.x > 4.5) {
                    newPosition.x = 4.5;
                } else if (newPosition.x < -4.5) {
                    newPosition.x = -4.5;
                }
                if (newPosition.z > 200) {
                    newPosition.z = 200;
                }
                else if (newPosition.z < -196) {
                  this.configuration.scenes[0].dispose();
                  soundLoader.StopSoundAction(soundLoader.levelOneMusic);
                  soundLoader.PlaySoundAction(soundLoader.gameWon);
                  this.configuration.createNewEngine(); 
                  this.scene.dispose();
                  soundLoader.PlaySoundAction(soundLoader.introMusic);
                  new IntroScene(this.configuration);

                }
                main.position = newPosition;
                main.moveWithCollisions(movementVector);
              } 

             
              else {
                  let a = this.scene.getAnimationGroupByName("Idle");
                  a.start(true, 1.0, a.from, a.to, false);
              }

          }
          
    return main;
            }
        else {
            return null;
        }
    }
    /**
     * charger le rendu de la scene
     */
    renderScene() {
        this.hero.move();
        this.scene.render();
    }

    
modifySettings() {
    this.scene.onPointerDown = () => {
        if (!this.scene.alreadyLocked) {
          console.log("requesting pointer lock");
          this.canvas.requestPointerLock();
        } else {
          console.log("Pointer already locked");
        }
      };
    
      document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if (element) {
          // lets create a custom attribute
          this.scene.alreadyLocked = true;
        } else {
          this.scene.alreadyLocked = false;
        }
      });
   
      this.inputStates.left = false;
      this.inputStates.right = false;
      this.inputStates.up = false;
      this.inputStates.down = false;
      this.inputStates.space = false;

    
      window.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "ArrowLeft" || event.key === "q" || event.key === "Q") {
            this.inputStates.left = true;
          } else if (
            event.key === "ArrowUp" ||
            event.key === "z" ||
            event.key === "Z"
          ) {
            this.inputStates.up = true;
          } else if (
            event.key === "ArrowRight" ||
            event.key === "d" ||
            event.key === "D"
          ) {
            this.inputStates.right = true;
          } else if (
            event.key === "ArrowDown" ||
            event.key === "s" ||
            event.key === "S"
          ) {
            this.inputStates.down = true;
          } else if (event.key === " ") {
            this.inputStates.space = true;
          }
        },
        false
      );
}

}
export { LevelOne};