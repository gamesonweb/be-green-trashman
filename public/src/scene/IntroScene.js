import { LevelTwo } from './LevelTwo.js';
import {LevelOne} from './LevelOne.js';
import {soundLoader} from '../sounds.js';
import {GameState} from '../utils.js';
 class IntroScene{
   /**
     * Constructeur
     * @param {*} configuration : configuration du projet
     */
   constructor(configuration) {
    this.configuration = configuration;
    console.log(configuration);
    this.scene = new BABYLON.Scene(configuration.engine);  //  Creates a basic Babylon Scene object
    this.configuration.scenes.push(this.scene)// Mettre la scene en 1er dans la liste
    this.mainMenuActive = true;
    this.levelsMenuActive = false;
    this.canvas = configuration.canvas;
    console.log(this.canvas);
    this.musicOn = false;
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.configureAssetManager();  //  Configure la scene et affiche le rendu à interval réguliers

}
/** 
* Configurer tout les eléménts de la scene et recharger régulierement le rendu scene
*/
configureAssetManager() {

   var instance = this;

   instance.creerElementsScene();  //  Call the createScene function

   instance.configuration.engine.runRenderLoop(function () {  //  Register a render loop to repeatedly render the scene
       instance.renderScene()
   });
}
creerElementsScene() {

    this.creerCamera();
    this.creerLumiere();
    this.playMusic();
    if (this.mainMenuActive) {
        this.mainMenu();
    }
    else {
        this.levelsMenu();
    }
   // this.creerInterface();

}

    /**
     * Créer la camera (obligatoire dans toutes les scenes)
     */
    creerCamera() {
        // This creates and positions a free camera (non-mesh)
        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(this.canvas, true);
    }
     /**
    * charger le rendu de la scene
    */
   renderScene() {
       this.scene.render();
   }
   creerLumiere() {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
}
playMusic(){
    soundLoader.PlaySoundAction(soundLoader.introMusic);
}
   mainMenu() {
        console.log("//////INSIDE MAIN MENU In CLASS INTROSCENE/////");

        this.mainMenuActive = true;
        this.levelsMenuActive = false;


        const background = new BABYLON.GUI.Image("background", "./assets/images/MAIN_PAGE.png");
        
    //    background.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
        const titleText = new BABYLON.GUI.TextBlock();
        titleText.text = "Trashman";
        titleText.fontSize = 80;
        titleText.color = "green";
        titleText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleText.top = "-20%";

        const playButton = BABYLON.GUI.Button.CreateSimpleButton("playButton", "Play");
        playButton.width = 0.25;
        playButton.height = "50px";
        playButton.color = "white";
        playButton.background = "green";
        playButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        playButton.cornerRadius = 10;
        playButton.fontSize = "30px";
        // Move the button down by 50% of its height
        playButton.top = "-8%";
        playButton.onPointerUpObservable.add(() => {
            soundLoader.PlaySoundAction(soundLoader.buttonClick);
            this.mainMenuActive = false;
            this.levelsMenuActive = true;
            this.levelsMenu();
        });
       this.advancedTexture.addControl(background);
       this.advancedTexture.addControl(titleText);
        this.advancedTexture.addControl(playButton);
        this.scene.render();
    }
   levelsMenu() {
 //   this.advancedTexture.dispose();
            this.mainMenuActive = false;
            this.levelsMenuActive = true;
          
            // Create background image
            const background = new BABYLON.GUI.Image("background", "./assets/images/MAIN_PAGE.png");
            background.width = 1;
            background.height = 1;
            this.advancedTexture.addControl(background);
            
            // Create level 1 button
            const level1Button = BABYLON.GUI.Button.CreateSimpleButton("level1Button", "Level 1");
            level1Button.width = "150px";
            level1Button.height = "40px";
            level1Button.color = "white";
            level1Button.background = "green";
            level1Button.cornerRadius = 10;
            level1Button.top = "-100px";
            level1Button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            this.advancedTexture.addControl(level1Button);
            level1Button.onPointerUpObservable.add(() => { 
                soundLoader.PlaySoundAction(soundLoader.buttonClick);
                GameState.state = GameState.LevelOne;
                this.advancedTexture.dispose();
                this.configuration.createNewEngine();
                this.configuration.scenes[0].dispose();
                this.mainMenuActive = false;
                this.levelsMenuActive = false;
                this.scene.dispose();
                soundLoader.StopSoundAction(soundLoader.introMusic);
                soundLoader.PlaySoundAction(soundLoader.levelOneMusic);
                new LevelOne(this.configuration);

            });
            const level2Button = BABYLON.GUI.Button.CreateSimpleButton("level2Button", "Level 2");
            level2Button.width = "150px";
            level2Button.height = "40px";
            level2Button.color = "white";
            level2Button.background = "blue";
            level2Button.cornerRadius = 10;
            level2Button.top = "-50px";
            level2Button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            level2Button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            this.advancedTexture.addControl(level2Button);
            level2Button.onPointerUpObservable.add(() => { 
                soundLoader.PlaySoundAction(soundLoader.buttonClick);
                GameState.state = GameState.LevelTwo;
                this.advancedTexture.dispose();
                this.configuration.createNewEngine();
                this.configuration.scenes[0].dispose();
                this.mainMenuActive = false;
                this.levelsMenuActive = false;
                this.scene.dispose();
                soundLoader.StopSoundAction(soundLoader.introMusic);
                soundLoader.PlaySoundAction(soundLoader.levelTwoMusic);
                new LevelTwo(this.configuration);

            });

    }
} export {IntroScene};

