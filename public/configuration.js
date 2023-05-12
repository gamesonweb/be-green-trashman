/**
 * Configuration du projet
 */
class Configuration{

    /**
     * Constructeur
     * @param {*} canvas : l'élement html canvas dans lequel les scene seront afficheés
     */
    constructor(canvas){
        this.canvas = canvas;
        console.log(canvas);
        this.engine = new BABYLON.Engine(canvas, true);  //  Generate the BABYLON 3D engine
        this.scenes = []; // Contien toutes les scenes en cours d'utilisation
        var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

// Set the size of the Babylon.js canvas to the window dimensions
canvas.width = windowWidth;
canvas.height = windowHeight;

    }

    /**
     * Efface la scene et le moteur
     */
    createNewEngine(){
        this.scenes[0].dispose(); // effacer la premiere scene
        this.engine.dispose(); // efface le moteur
        this.engine = new BABYLON.Engine(this.canvas, true); // créer un nouveau moteur
    }
}export{ Configuration };