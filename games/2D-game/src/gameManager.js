// Our Main Class, Never Instantiated, Call Static Methods as needed,   preload, setup, loop are called in main.js
// Add other static class method calls into here instead of dumping code into main.js
//p5.disableFriendlyErrors = true;
document.addEventListener('contextmenu', event => event.preventDefault());

class GameManager{

    static settings = {
        CONSTANTS: {
            DEBUG: null,
            SCREEN_W: null,
            SCREEN_H: null,
            TILESIZE: null
        },
        MAPS: {
            LEVEL_0: null
        }
    };

    static groups = {
        ENVIRONMENT: null
    }

    static player;

    static inMapEditor = false;

    static fadingToBlack = false;

    static preload() {
        AsssetManager.loadAssets()
        GameManager.settings = loadJSON('settings.json')
    }

    static setup() {
  

        let canvas = createCanvas(GameManager.settings.CONSTANTS.SCREEN_W, GameManager.settings.CONSTANTS.SCREEN_H)
        canvas.mouseWheel(Input.scrollEvent)
        frameRate(60)
        useQuadTree(true)
        noSmooth();

        LayerManager.setupGroups();
        HUDManager.setupMenus();

        camera.on()
    }


    static loop() {
        background(0)
        let a


        camera.off()

        image(AsssetManager.assets.map.clouds, 0, 0, width, height)
        angleMode(DEGREES);


        camera.on()
        if(GameManager.player){
            let mPos = MapEditor.getMouseWorldPosition()
            let tS = GameManager.settings.CONSTANTS.TILESIZE

            let x = Math.floor(mPos.x/(tS)) * tS + tS/2
            let y = Math.floor(mPos.y/(tS)) * tS + tS/2
            //a = atan2(mPos.y - GameManager.player.weapon.position.y, mPos.x - GameManager.player.weapon.position.x);
            //if(a + 90 > 0 && a + 90 < 180){
            //    GameManager.player.weapon.mirrorY(1)
            //    GameManager.player.weapon.rotation = a

            //} else {
            //    GameManager.player.weapon.mirrorY(-1)
            //    GameManager.player.weapon.rotation = a * -1
            //}
            // let r = rect(GameManager.player.weapon.position.x, GameManager.player.weapon.position.y, 50, 100)
            // r.rotate(a)

            if(GameManager.player.health == 0){
                // End the game loop.
                // Bring up start menu again
                if(!AsssetManager.assets.sounds.player_died.isPlaying()){
                    AsssetManager.assets.sounds.player_died.play();
                }
                setTimeout(()=> {window.location.reload();},200);
            }
        }
        LayerManager.drawLayers();
        GameManager.debugFPS();

        if(GameManager.inMapEditor){
            MapEditor.loop();
        }
        rectMode(CORNER)
        image(LayerManager.testBuffer, 0, 0)
    }



    
    static debugFPS(){
        camera.off()
        // https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#frames-per-second-fps
        let fps = frameRate();
        fill(0, 255, 0);
        stroke(0);
        text("FPS: " + fps.toFixed(2), 25, 25);

        if(GameManager.fadingToBlack){
            GameManager.fadeToBlack()
        } else {
            GameManager.fadeFromBlack()
        }
        camera.on()
    }

    static fade = 0
    static fadeToBlack() {
        fill(0, 0, 0, GameManager.fade)
        rect(0,0, width, height)
        GameManager.fade += 6
        if(GameManager.player)
        GameManager.player.disabledMovement = true;
    }

    static fadeFromBlack() {
        if(GameManager.fade > 0){
            fill(0, 0, 0, GameManager.fade)
            rect(0,0, width, height)
            GameManager.fade -= 5
        } else {

        }
    }
}