class SoundLoader { 
    constructor () {
        this.ready = false;
        this.effects = []; 
        this.musics = [];

        this.introMusic = new Audio('./assets/sounds/intro.mp3');
        this.introMusic.volume = 0.3;
        this.introMusic.loop = true;
        this.introMusic.alreadyPlayed = false;
        this.musics.push(this.introMusic);

        this.levelOneMusic = new Audio('./assets/sounds/levelOne.mp3');
        this.levelOneMusic.volume = 0.2;
        this.levelOneMusic.alreadyPlayed = false;
        this.musics.push(this.levelOneMusic);

        this.levelTwoMusic = new Audio('./assets/sounds/levelTwo.mp3');
        this.levelTwoMusic.volume = 0.2;
        this.levelTwoMusic.alreadyPlayed = false;
        this.musics.push(this.levelTwoMusic);
        
        this.buttonClick = new Audio('./assets/sounds/clickButton.wav');
        this.buttonClick.volume = 0.4;
        this.buttonClick.alreadyPlayed = false;
        this.effects.push(this.buttonClick);
        
        this.trashPickup = new Audio('./assets/sounds/trashCollected.mp3');
        this.trashPickup.volume = 0.4;
        this.trashPickup.alreadyPlayed = false;
        this.effects.push(this.trashPickup);

        this.wrongTrashCollected = new Audio('./assets/sounds/wrongTrashCollected.mp3');
        this.wrongTrashCollected.volume = 0.4;
        this.wrongTrashCollected.alreadyPlayed = false;
        this.effects.push(this.wrongTrashCollected);

        this.gameOver = new Audio('./assets/sounds/gameOver.wav'); 
        this.gameOver.volume = 0.4;
        this.gameOver.alreadyPlayed = false;
        this.effects.push(this.gameOver);

        this.gameWon = new Audio('./assets/sounds/gameWon.wav');
        this.gameWon.volume = 0.8;
        this.gameWon.alreadyPlayed = false;
        this.effects.push(this.gameWon);
    }

    PlaySoundAction(sound) {
        sound.currentTime = 0; // restart the sound
        sound.play();
      
        } 

    StopSoundAction(sound) {
        sound.pause();
        sound.currentTime = 0;
    }
    resetAllSound() {
        for (let i = 0; i <this.musics.length; i++) {
            this.musics[i].pause();
        }
        for (let i = 0; i <this.effects.length; i++) {
            this.effects[i].pause();
        }
    }
   
}
        
export const soundLoader = new SoundLoader();
       
