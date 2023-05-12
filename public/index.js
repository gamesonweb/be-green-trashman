import {IntroScene} from './src/scene/IntroScene.js';
import {soundLoader} from './src/sounds.js';
import {GameState} from './src/utils.js';
import { Configuration } from "./configuration.js";

let scene; 
let engine;
let menuscene;
let inputStates = {};

let configuration;
function startGame(){
    let canvas = document.getElementById("myCanvas");  //  Get the canvas element
    // Get the dimensions of the browser window


    configuration = new Configuration(canvas);  //  configuration

 //   new IntroScene(configuration); 
    menuscene = new IntroScene(configuration);

 
  
    gameLoop();
    setTimeout(() => {
       
    },200);
}

function gameLoop() {
    GameState.state = GameState.introScene; 
    console.log("GAME STATE: " + GameState.state);
    engine.runRenderLoop(() => {
      
        switch(GameState.state) {
            case GameState.introScene:
                soundLoader.PlaySoundAction(soundLoader.introMusic);
                menuscene.mainMenu().then(() => {
                    console.log("INSIDE MAIN MENU");
                    scene.render();
                });
                break;

            case GameState.gameOver : 
                introScene.gameOverMenu.then(() => {
                    GameState.state = GameState.IntroScene;
                introScene.render();
                });
                break;
            case GameState.win :
                introScene.winMenu().then(() => {
                    GameState.state = GameState.IntroScene;
                    introScene.render();
                 }) 
                break;
            default : 
                break;
        }
    });
}


window.onload = startGame;
