class Door{
    constructor(x, y, runes){
        this.x = x
        this.y = y

        this.sprite = createSprite(x, y + GameManager.settings.CONSTANTS.TILESIZE/2)
        this.loadAnimations()
        //this.sprite.debug = true
        this.sprite.setCollider("rectangle", 0, -GameManager.settings.CONSTANTS.TILESIZE, 64, 128)
        LayerManager.layers.environment.add(this.sprite)

        this.superDraw = this.sprite.draw
        this.sprite.draw = this.draw.bind(this)

        this.runes = runes
        this.isInRange = false
        this.isClosed = false
    }

    closeDoor() {
        if(!this.isClosed){
            this.sprite.animation.goToFrame(0)
            this.isClosed = true
            this.sprite.collider.offset.y = 0
        }
    }

    openDoor() {
        //Check If Runes are Active
        let allActive = true
        Object.values(this.runes).forEach(rune => {
            rune = GameManager.currentLevel.selectTile(rune.x, rune.y)
            if(rune.isActive != true){
                allActive = false
            }
        })
        if(allActive){
            if(!this.sprite.animation.playing){
                this.sprite.animation.play()
                this.isClosed = false
            }
            this.sprite.collider.offset.y = -64
            this.sprite.collider.extents.y = 0
        }
    }

    draw() {
        this.superDraw()

        if(dist(GameManager.player.sprite.position.x, GameManager.player.sprite.position.y, this.sprite.position.x, this.sprite.position.y) < 200){
            console.log("OPEN")
            this.isInRange = true
        } else {
            this.isInRange = false
        }

        if(this.isInRange){
            this.openDoor()
        } else {
            this.closeDoor()
        }
        
    }


    loadAnimations() {     
        function loadAndAdd(label, frames, delay, sprite, looping=true) {
            let anim = loadAnimation(new SpriteSheet('assets/testDoorSheet.png', frames))
            anim.frameDelay = delay;
            anim.looping = looping;
            sprite.addAnimation(label, anim)
        }

        loadAndAdd("open", [
            {'name':'testDoor_01', 'frame':{'x':0, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_02', 'frame':{'x':64, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_03', 'frame':{'x':128, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_04', 'frame':{'x':192, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_05', 'frame':{'x':256, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_06', 'frame':{'x':320, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_07', 'frame':{'x':384, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_08', 'frame':{'x':448, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_09', 'frame':{'x':512, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_10', 'frame':{'x':576, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_11', 'frame':{'x':640, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_12', 'frame':{'x':704, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_13', 'frame':{'x':768, 'y': 0, 'width': 64, 'height': 128}},
            {'name':'testDoor_14', 'frame':{'x':832, 'y': 0, 'width': 64, 'height': 128}},
        ], 10, this.sprite, false)


        this.sprite.changeAnimation("open")
        this.sprite.animation.playing = false

    }
}