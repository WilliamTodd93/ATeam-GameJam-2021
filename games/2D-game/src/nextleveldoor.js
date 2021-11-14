class NextLevelDoor{
    constructor(x, y, nextLevel, nextDoor){
        this.x = x
        this.y = y

        this.sprite = createSprite(x, y + GameManager.settings.CONSTANTS.TILESIZE/2)
        this.loadAnimations()
        //this.sprite.debug = true
        this.sprite.addImage("image", AsssetManager.assets.map.nextLevelDoor)
        //this.sprite.setCollider("rectangle", 0, -GameManager.settings.CONSTANTS.TILESIZE, 64, 128)
        LayerManager.layers.environment.add(this.sprite)
        //this.sprite.collider.offset.y = 0

        this.superDraw = this.sprite.draw
        this.sprite.draw = this.draw.bind(this)
        this.nextLevel = nextLevel
        this.nextDoor = nextDoor
        this.range = 100
        this.triggered = false
    }

   
    draw() {
        this.superDraw()

        if(dist(GameManager.player.sprite.position.x, GameManager.player.sprite.position.y, this.sprite.position.x, this.sprite.position.y) < this.range) {
            if(!this.triggered){
                this.triggered = true
                console.log("Teleport")
                this.teleport(this.nextLevel)
            }
        }
    }

    teleport(levelName, doorName) {
        GameManager.player.disabledMovement = true;
        GameManager.fadingToBlack = true;
        GameManager.reloadSprites();
        loadJSON(levelName, (json) => {
            setTimeout(function() {
                
                GameManager.fadingToBlack = false;
                GameManager.player.disabledMovement = false;
                LayerManager.layers.environment.removeSprites()
                GameManager.currentLevel = new Map()
                GameManager.currentLevel.loadMap(json, GameManager.currentLevel, true)
            }.bind(this), 1000)
        })
    }


    loadAnimations() {     


    }
}