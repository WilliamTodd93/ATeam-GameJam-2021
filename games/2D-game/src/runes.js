class Rune {
    constructor(x, y, tS, secondsToActivate, radius){
        // tS is defined in the gameManager.js file where we initialise the game.
        this.sprite = createSprite(x, y, tS, tS);
        this.sprite.addImage("Disabled", AsssetManager.assets.rune.off);
        this.sprite.addImage("Enabled", AsssetManager.assets.rune.on);
        this.sprite.scale = 1;
        this.status = false;
        // Define a number for sequence on initialisation
        this.number = null;
        this.superDraw = this.sprite.draw;
        this.sprite.draw = this.draw.bind(this);
        //this.sprite.debug = true;
        LayerManager.layers.environment.add(this.sprite);

        this.secondsToActivate = secondsToActivate
        this.radius = radius
        this.onTimeout = false
    }

    getNumber(){
        return this.number;
    }

    getStatus(){
        return this.status;
    }

    draw(){
        this.superDraw();

        if (dist(this.sprite.position.x, this.sprite.position.y, GameManager.player.sprite.position.x, GameManager.player.sprite.position.y) < (this.radius/2)){
            let tileXY = `_${this.sprite.position.x}${this.sprite.position.y}`
            let tile = GameManager.currentLevel.tileMap[tileXY].saveInfo
            tile.isActive = true;
            this.sprite.changeImage("Enabled");
            if(this.timeout != undefined){
                clearTimeout(this.timeout)
                this.onTimeout = false
            }
        }else {
            let tileXY = `_${this.sprite.position.x}${this.sprite.position.y}`
            let tile = GameManager.currentLevel.tileMap[tileXY].saveInfo
            if(tile.isActive){
                if(!this.onTimeout){
                    this.timeout = setTimeout(() => {
                        tile.isActive = false
                        this.onTimeout = false
                        this.sprite.changeImage("Disabled");
                    }, this.secondsToActivate * 1000)
                    this.onTimeout = true;
                }
            }            
        }
    }
}