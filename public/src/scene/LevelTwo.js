import { soundLoader } from '../sounds.js';
import { IntroScene } from './IntroScene.js';
class LevelTwo {

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
    this.isTreeLoaded = false;
    this.isGrassLoaded = false;
    this.isBushLoaded = false;
    this.isSardinaLoaded = false;
    this.endLoading = false;
    this.score = 0;
  }

  async configureAssetManager() {
    this.modifySettings();
    var instance = this;
    this.hero = await this.getHero();

    if (this.hero != null) {
      console.log(this.hero);
      this.camera = this.createFollowCamera(this.scene, this.hero);
      this.scene.activeCamera = this.camera;
      console.log(this.camera);
    }

    instance.creerElementsScene();

    instance.configuration.engine.runRenderLoop(function () {
      instance.renderScene()
    });
  }

  creerElementsScene() {
    this.creerLumiere();
    this.greateGround();
    this.createObstacles();
    this.createPortal();
    this.createSkybox(this.scene);
  }

  creerLumiere() {
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    light.intensity = 0.7;

    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/images/skybox/skybox", this.scene);
    skybox.material = skyboxMaterial;


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

  greateGround() {
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("./assets/images/pavement3.jpg", this.scene);
    const groundWidth = 10;
    const groundLength = 400;
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundWidth, height: groundLength });
    ground.material = groundMaterial;
  }

  createPortal() {
    BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "portalLevel1.glb", this.scene, (meshes) => {
      const portal = meshes[0];
      portal.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
      portal.position = new BABYLON.Vector3(0, -1, -198);
      portal.name = "portal";
    });
  }

  createObstacles() {
    this.createTrees(2.5, 170, 0, 0.5, "tree1");

    this.createTrees(2.9, -7, 0, 0.5, "tree2");
    this.createTrees(2.9, 0, 0, 0.7, "tree3");
    this.createTrees(0, 7, 0, 0.4, "tree4");
    this.createTrees(2.9, 12, 0, 0.4, "tree5");

    this.createTrees(-2.9, 93, 0, 0.5, "tree6");
    this.createTrees(-2.9, 100, 0, 0.7, "tree7");
    this.createTrees(0, 107, 0, 0.4, "tree8");
    this.createTrees(-2.9, 112, 0, 0.4, "tree9");

    this.createTrees(-2.9, -107, 0, 0.5, "tree10");
    this.createTrees(-2.9, -100, 0, 0.7, "tree11");
    this.createTrees(0, -93, 0, 0.4, "tree12");
    this.createTrees(-2.9, -88, 0, 0.4, "tree13");

    this.createtrash(2.8, -190, 0, 0.09, "trash1");
    this.createtrash(2.8, 70, 0, 0.09, "trash2");
    this.createtrash(2.8, 20, 0, 0.09, "trash3");
    this.createtrash(0, -65, 0, 0.09, "trash4");
    this.createtrash(0, -130, 0, 0.09, "trash5");
    this.createtrash(0, 45, 0, 0.09, "trash6");
    this.createtrash(-2.8, 80, 0, 0.09), "trash7";
    this.createtrash(-2.8, -90, 0, 0.09, "trash8");
    this.createtrash(-2.8, -160, 0, 0.09, "trash9");

    this.createGrass(-2.9, 145, 0, 0.01, "grass1");
    this.createGrass(2.9, 150, 0, 0.01, "grass2");
    this.createBushes(-2.9, 145, 0.4, 0.01, "bush1");
    this.createBushes(2.9, 150, 0.4, 0.01, "bush2");

    this.createGrass(-2.9, 115, 0, 0.01);
    this.createGrass(2.9, 120, 0, 0.01);
    this.createBushes(-2.9, 115, 0.4, 0.01);
    this.createBushes(2.9, 120, 0.4, 0.01);

    this.createGrass(-2.9, 85, 0, 0.01);
    this.createGrass(-2.9, -30, 0, 0.01);
    this.createBushes(-2.9, 85, 0.4, 0.01, "bush3");
    this.createBushes(-2.9, -30, 0.4, 0.01, "bush4");

    this.createGrass(-2.9, 55, 0, 0.01);
    this.createGrass(2.9, 50, 0, 0.01);
    this.createBushes(-2.9, 55, 0.4, 0.01, "bush5");
    this.createBushes(2.9, 50, 0.4, 0.01, "bush6");

    this.createGrass(-2.9, -145, 0, 0.01);
    this.createGrass(2.9, -150, 0, 0.01);
    this.createBushes(-2.9, -145, 0.4, 0.01, "bush7");
    this.createBushes(2.9, -150, 0.4, 0.01, "bush8");

    this.createGrass(-2.9, -115, 0, 0.01);
    this.createGrass(2.9, -120, 0, 0.01);
    this.createBushes(-2.9, -115, 0.4, 0.01, "bush9");
    this.createBushes(2.9, -120, 0.4, 0.01, "bush10");

    this.createGrass(-2.9, -85, 0, 0.01);
    this.createBushes(-2.9, -85, 0.4, 0.01, "bush11");

    this.createGrass(-2.9, -55, 0, 0.01);
    this.createGrass(2.9, -50, 0, 0.01);
    this.createBushes(-2.9, -55, 0.4, 0.01, "bush12");
    this.createBushes(2.9, -50, 0.4, 0.01, "bush13");

    this.createBanana(-2.9, 186, 0.4, 0.5, "trash");
    this.createCoca(0, 149, 1, 0.5, "trash");
    this.createBanana(-2.9, -16, 0.4, 0.5, "trash");
    this.createCoca(2.9, -36, 1, 0.5, "trash");
    this.createBanana(0, -103, 0.4, 0.5, "trash");
    this.createCoca(-2.9, -170, 1, 0.5, "trash");





    this.endLoading = true;



  }
  getObstacles() {
    let tree1 = this.scene.getMeshByName("tree1");
    let tree2 = this.scene.getMeshByName("tree2");
    let tree3 = this.scene.getMeshByName("tree3");
    let tree4 = this.scene.getMeshByName("tree4");
    let tree5 = this.scene.getMeshByName("tree5");
    let tree6 = this.scene.getMeshByName("tree6");
    let tree7 = this.scene.getMeshByName("tree7");
    let tree8 = this.scene.getMeshByName("tree8");
    let tree9 = this.scene.getMeshByName("tree9");
    let tree10 = this.scene.getMeshByName("tree10");
    let tree11 = this.scene.getMeshByName("tree11");
    let tree12 = this.scene.getMeshByName("tree12");
    let tree13 = this.scene.getMeshByName("tree13");
    let bush1 = this.scene.getMeshByName("bush1");
    let bush2 = this.scene.getMeshByName("bush2");
    let bush3 = this.scene.getMeshByName("bush3");
    let bush4 = this.scene.getMeshByName("bush4");
    let bush5 = this.scene.getMeshByName("bush5");
    let bush6 = this.scene.getMeshByName("bush6");
    let bush7 = this.scene.getMeshByName("bush7");
    let bush8 = this.scene.getMeshByName("bush8");
    let bush9 = this.scene.getMeshByName("bush9");
    let bush10 = this.scene.getMeshByName("bush10");
    let bush11 = this.scene.getMeshByName("bush11");
    let bush12 = this.scene.getMeshByName("bush12");
    let bush13 = this.scene.getMeshByName("bush13");
    return [tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, tree9, tree10, tree11, tree12, tree13, bush1, bush2, bush3, bush4, bush5, bush6, bush7, bush8, bush9, bush10, bush11, bush12, bush13];
  }

  getTrashTab() {
    let trash1 = this.scene.getMeshByName("trash1");
    let trash2 = this.scene.getMeshByName("trash");
    let trash3 = this.scene.getMeshByName("trash");
    let trash4 = this.scene.getMeshByName("trash");
    let trash5 = this.scene.getMeshByName("trash");
    let trash6 = this.scene.getMeshByName("trash");
    let trash7 = this.scene.getMeshByName("trash");
    let trash8 = this.scene.getMeshByName("trash");
    let trash9 = this.scene.getMeshByName("trash");


    return [trash1, trash2, trash3, trash4, trash5, trash6, trash7, trash8, trash9];
  }
  createTrees(x, y, z, size, name) {
    BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "tree.glb", this.scene, (meshes) => {
      let tree = meshes[0];
      tree.position.x = x;
      tree.position.z = y;
      tree.position.y = z;
      tree.scaling = new BABYLON.Vector3(size, size, size);
      tree.name = name;

      let collideBox = new BABYLON.MeshBuilder.CreateBox("collideBoxTree", { height: 7, depth: 2, width: 2 }, this.scene);
      collideBox.checkCollisions = true;
      collideBox.position = new BABYLON.Vector3(x, z, y);

      let collideBoxMaterial = new BABYLON.StandardMaterial("collideBoxMaterial", this.scene);
      collideBoxMaterial.diffuseColor = new BABYLON.Color3.Yellow;
      collideBoxMaterial.emissiveColor = new BABYLON.Color3.Magenta;
      collideBoxMaterial.alpha = 0;

      collideBox.material = collideBoxMaterial;

    });

    this.isTreeLoaded = true;
  }

  createtrash(x, y, z, size, name) {
    BABYLON.SceneLoader.ImportMesh("", "./assets/trashItems/", "sardina_2022.glb", this.scene, (meshes) => {
      let sardina = meshes[0];
      sardina.position.x = x;
      sardina.position.z = y;
      sardina.position.y = z;
      sardina.scaling = new BABYLON.Vector3(size, size, size);
      sardina.name = name;

      let collideBox = new BABYLON.MeshBuilder.CreateBox("collideBoxSardina", { height: 0.9, depth: 2, width: 2 }, this.scene);
      collideBox.checkCollisions = true;
      collideBox.position = new BABYLON.Vector3(x, 0, y);

      let collideBoxMaterial = new BABYLON.StandardMaterial("collideBoxMaterial", this.scene);
      collideBoxMaterial.diffuseColor = new BABYLON.Color3.Yellow;
      collideBoxMaterial.emissiveColor = new BABYLON.Color3.Magenta;
      collideBoxMaterial.alpha = 0;
      collideBox.material = collideBoxMaterial;
    });

  }

    createBanana(x, y, z, size, name) {
      BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "banana.glb", this.scene, (meshes) => {
        let banana = meshes[0];
        banana.position.x = x;
        banana.position.z = y;
        banana.position.y = z;
        banana.scaling = new BABYLON.Vector3(size, size, size);
        banana.name = name;

        let collideBox = new BABYLON.MeshBuilder.CreateBox("collideBoxSardina", { height: 0.9, depth: 2, width: 2 }, this.scene);
        collideBox.checkCollisions = true;
        collideBox.position = new BABYLON.Vector3(x, 0, y);

        let collideBoxMaterial = new BABYLON.StandardMaterial("collideBoxMaterial", this.scene);
        collideBoxMaterial.diffuseColor = new BABYLON.Color3.Yellow;
        collideBoxMaterial.emissiveColor = new BABYLON.Color3.Magenta;
        collideBoxMaterial.alpha = 0;
        collideBox.material = collideBoxMaterial;
      });


      this.isSardinaLoaded = true;
    }

    createCoca(x, y, z, size, name) {
      BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "coca-cola_can.glb", this.scene, (meshes) => {
        let coke = meshes[0];
        coke.position.x = x;
        coke.position.z = y;
        coke.position.y = z;
        coke.scaling = new BABYLON.Vector3(size, size, size);
        coke.name = name;

        let collideBox = new BABYLON.MeshBuilder.CreateBox("collideBoxSardina", { height: 0.9, depth: 2, width: 2 }, this.scene);
        collideBox.checkCollisions = true;
        collideBox.position = new BABYLON.Vector3(x, 0, y);

        let collideBoxMaterial = new BABYLON.StandardMaterial("collideBoxMaterial", this.scene);
        collideBoxMaterial.diffuseColor = new BABYLON.Color3.Yellow;
        collideBoxMaterial.emissiveColor = new BABYLON.Color3.Magenta;
        collideBoxMaterial.alpha = 0;
        collideBox.material = collideBoxMaterial;
      });


      this.isSardinaLoaded = true;
    }

    createGrass(x, y, z, size) {
      BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "grass.glb", this.scene, (meshes) => {
        let grass = meshes[0];
        grass.position.x = x;
        grass.position.z = y;
        grass.position.y = z;
        grass.scaling = new BABYLON.Vector3(size, size, size);

        let collideBox = new BABYLON.MeshBuilder.CreateBox("collideBoxGrass", { height: 3.5, depth: 2, width: 2 }, this.scene);
        collideBox.checkCollisions = true;
        collideBox.position = new BABYLON.Vector3(x, z, y);

        let collideBoxMaterial = new BABYLON.StandardMaterial("collideBoxMaterial", this.scene);
        collideBoxMaterial.diffuseColor = new BABYLON.Color3.Yellow;
        collideBoxMaterial.emissiveColor = new BABYLON.Color3.Magenta;
        collideBoxMaterial.alpha = 0;
        collideBox.material = collideBoxMaterial;
      });

      this.isGrassLoaded = true;
    }

    createBushes(x, y, z, size, name) {
      BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "bush.glb", this.scene, (meshes) => {
        let bush = meshes[0];
        bush.position.x = x;
        bush.position.z = y;
        bush.position.y = z;
        bush.scaling = new BABYLON.Vector3(size, size, size);
        bush.name = name;
      });

      this.isBushLoaded = true;
    }

  async getHero() {
      let hero = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/models/", "male.glb", this.scene);
      if (hero.meshes.length > 0) {
        let main = hero.meshes[0];
        main.position.x = 0;
        main.position.z = 196.6;
        main.position.y = 1.4;

        main.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);

        main.name = "heroMain";
        main.checkCollisions = true;
        main.speed = 0.17;

        let check = false;
        let check2 = false;
        let check3 = false;
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let score = new BABYLON.GUI.TextBlock("score");
        score.text = "SCORE = " + this.score;
        score.fontSize = "35px";
        score.color = "white";
        score.top = "-260px";
        score.left = "100px";
        score.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_DOWN;
        score.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_DOWN;

        advancedTexture.addControl(score);
        main.move = () => {



          let a = this.scene.getAnimationGroupByName("Idle");
          a.start(true, 1.0, a.from, a.to, false);

          let movementVector = new BABYLON.Vector3(0, 0, 0);


          if (this.inputStates.up) {
            check = true;
          }

          if (check) {
            console.log("in move function : right");
            let a = this.scene.getAnimationGroupByName("Run");
            a.start(false, 1.0, a.from, a.to, false);
            movementVector.z -= 0.1;
            main.position.y = 1.4;
            main.onCollideObservable.add(
              function (m, evt) {
                let msg = "Collision with: " + m.name;
                if (m.name == "collideBoxSardina") {
                  check3 = true;
                  m.dispose();

                } else {
                  check2 = true;
                }
              }
            );
            this.inputStates.up = false;
          }
          if (check3) {
            this.score = this.score + 1;
            score.text = "SCORE : " + this.score;
            score.fontSize = "35px";
            score.color = "white";
            score.top = "-260px";
            score.left = "100px";
            score.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_DOWN;
            score.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_DOWN;
            check3 = false;
          }
          if (check2) {
            this.configuration.scenes[0].dispose();
            soundLoader.StopSoundAction(soundLoader.levelTwoMusic);
            soundLoader.PlaySoundAction(soundLoader.gameOver);
            this.configuration.createNewEngine();
            this.scene.dispose();
            soundLoader.PlaySoundAction(soundLoader.introMusic);
            new IntroScene(this.configuration);
          }

          if (this.inputStates.left) {
            //console.log(movementVector.x);
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
            if (newPosition.x > 5) {
              newPosition.x = 5;
            } else if (newPosition.x < -5) {
              newPosition.x = -5;
            }
            if (newPosition.z > 200) {
              newPosition.z = 200;
            }
            else if (newPosition.z < -196) {
              this.configuration.scenes[0].dispose();
              soundLoader.StopSoundAction(soundLoader.levelTwoMusic);
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
export { LevelTwo };