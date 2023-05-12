
class GameState {
    static introScene = 0;
    static levelsMenu =1;
    static LevelOne = 2;
    static win = 3; 
    static gameOver = 4;

    static scene = GameState.IntroScene;
}

class GameLevel {
    static getLevelByName(name){ 
        switch(name){ 
            case "Level1" : 
            return GameLevel.level1;
        }
    }
}

export {GameState, GameLevel};