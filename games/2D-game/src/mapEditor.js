class MapEditor {

    static toolTab = {
        sprite: null
    }
    static panel = null;
    static currentMap;
    static tileOptions

    static currentTool;
    static currentTile;
    static isDragging = false;

    static currentPage = 0;
    static pageGroup;
    static optionsGroup = {
        buttonEnvironment: null,
        buttonCurrent: null
    };

    static setupMapEditor(){
        MapEditor.setupHUD()
        GameManager.inMapEditor = true;
        MapEditor.currentMap = new Map()

    }


    static loop(){     

        // Get Mouse Pos
        let mPos = MapEditor.getMouseWorldPosition()
        // Shorthand TileSize
        let tS = GameManager.settings.CONSTANTS.TILESIZE
        // Grid Coords
        let x = Math.floor(mPos.x/(tS)) * tS + tS/2
        let y = Math.floor(mPos.y/(tS)) * tS + tS/2

        //#region CAMERA OFF
        camera.off()

        MapEditor.drawToolPanel();

        MapEditor.handleLeftClick(x, y)
        MapEditor.handleRightClickSpecial(x, y)
        MapEditor.handleRightClick(x, y)
        MapEditor.handleRightClickDrag(x, y)

        MapEditor.drawMouseCoords(mPos)

        MapEditor.showCurrentTileOptions()

        camera.on()
        //#endregion CAMERA ON


        MapEditor.drawDraggingLine(x, y)
        MapEditor.drawLinesFromSelectedToRunes();
        MapEditor.tileOutline(x, y);
        MapEditor.cameraMovement();

        MapEditor.drawSelectedOptions()

        MapEditor.saveMap()
        MapEditor.paintUndo()

        MapEditor.clicked = false
    }

    static drawSelectedOptions() {
        if(MapEditor.currentTile != undefined){
            switch(MapEditor.currentTile.type) {
                case Tile.types.NEXTLEVEL:
                    console.log("Next Level")
                break;

                case Tile.types.RUNE:
                    console.log("Rune")
                    stroke(0, 255, 0)
                    circle(MapEditor.currentTile.x, MapEditor.currentTile.y, MapEditor.currentTile.info.radius)
                break;
            }
        }
    }

    static handleRightClickDrag(x, y){
        // If Holding Right Click
        if(MapEditor.isDragging){
            // When We Let Go
            if(mouseWentUp(RIGHT)){
                // Tile We Let Go On
                let draggedTile = MapEditor.currentMap.selectTile(x, y)
                if(draggedTile != undefined){
                    // If we let go on a rune and not on itself
                    if(draggedTile.type == Tile.types.RUNE && draggedTile != MapEditor.currentTile){
                        // Add a runes object to that tile
                        if(MapEditor.currentTile.runes == undefined){
                            MapEditor.currentTile.runes = {}
                        }
                        let x = draggedTile.x
                        let y = draggedTile.y
                        let tileXY = `_${x}${y}`
                        MapEditor.currentTile.runes[tileXY] = draggedTile
                        draggedTile.toActivate = {x: MapEditor.currentTile.x, y: MapEditor.currentTile.y}
                    }
                }
                // We are no longer dragging
                MapEditor.isDragging = false
            }
        }
    }

    static handleRightClick(x, y) {
        // Select Placed Item - Only Right Click
        if(mouseWentDown(RIGHT) && (!keyDown(17) && !keyDown(16))) {
            // Dragging
            MapEditor.isDragging = true
            MapEditor.currentTile = MapEditor.currentMap.selectTile(x, y)
            console.log("Selected Tile")
            console.log(MapEditor.currentTile)
            if(MapEditor.currentTile != undefined){
                // Create Menu
            }
        }
    }

    static handleRightClickSpecial(x, y) {
        // Ctrl Right Click (single) or Holding Shift Right Click (hold)
        if((keyDown(17) && mouseWentUp(RIGHT)) || (keyDown(16) && mouseDown(RIGHT)) ) { // Delete Tile
            let tile = MapEditor.currentMap.selectTile(x, y)
            if(tile != undefined){
                MapEditor.currentMap.removeTile(tile)
            }
        }
    }

    static handleLeftClick(x, y) {
        // Mouse Click (single) or Holding Shift (hold)
        if(mouseWentUp(LEFT) || (keyDown(16) && mouseDown(LEFT))){ // Create Tile
            if(!MapEditor.clicked){
                MapEditor.testDrawTile(MapEditor.currentMap, x, y)
                MapEditor.clicked = false
            }
        }
    }

    static drawToolPanel(){
        // Draw Tool Panel and Panel Items and Current Tool
        drawSprite(MapEditor.panel)
        drawSprites(MapEditor.pageGroup)  
        drawSprite(MapEditor.tileOptions)
        image(AsssetManager.assets.mapEditor.currentPanel, width-AsssetManager.assets.mapEditor.currentPanel.width, height-AsssetManager.assets.mapEditor.currentPanel.height)
        if(MapEditor.currentTool){
            image(Tile.getTileImage(MapEditor.currentTool), width-AsssetManager.assets.mapEditor.currentPanel.width + 50, height-AsssetManager.assets.mapEditor.currentPanel.height + 60)
            text(MapEditor.currentTool, width-AsssetManager.assets.mapEditor.currentPanel.width + 150, height-AsssetManager.assets.mapEditor.currentPanel.height + 60)
        }
    }

    static saveMap(){
        // ESC Key - SAVE
        if(keyWentDown(27)){ 
            MapEditor.currentMap.saveMap()
        }
    }

    static paintUndo(){
        // Ctrl Z - UNDO (single) -  + Shift (hold)
        if((keyDown(17) && keyWentDown(90)) || (keyDown(17) && keyDown(90) && keyDown(16))){ 
            MapEditor.currentMap.removeLastTile()
        }
    }

    static drawMouseCoords(mPos) {
        // Mouse Coords
        text(`${Math.floor(mPos.x)} ${Math.floor(mPos.y)}`, mouseX + 25, mouseY- 25)
    }

    static drawDraggingLine(x, y){
        // If Dragging, draw a Line from where we are dragging from to where we are dragging to
        if(MapEditor.isDragging){
            stroke(0,255,0)
            if(MapEditor.currentTile != undefined){
                line(MapEditor.currentTile.x, MapEditor.currentTile.y, x, y)
            }
        }
    }

    static drawLinesFromSelectedToRunes(){
        // If we have selected a tile
        if(MapEditor.currentTile != undefined) {
            // Add the tile has runes
            if(MapEditor.currentTile.runes != undefined){
                // Draw Lines from the selected tile to all the runes
                Object.values(MapEditor.currentTile.runes).forEach(rune => {
                    stroke(0,255,0)
                    line(MapEditor.currentTile.x, MapEditor.currentTile.y, rune.x, rune.y)
                })
            }
        }
    }

    static tileOutline(x, y) {
        rectMode(CENTER)
        fill(0,0,0,0)
        stroke(0,255,0)
        rect(            
            x,
            y,
            64,
            64
        )


    }
    
    static cameraMovement() {

        let inputV = Input.GetMovementVector2()
        camera.position.add(inputV.mult(10))
        
        // Scroll Camera
        let scrollV = Input.getScroll()
        camera.zoom = constrain(camera.zoom+scrollV, 0.2, 2)

    }

    static getMouseWorldPosition() {
        return createVector(
            (camera.mouseX + ((camera.mouseX-camera.position.x) * (1/camera.zoom)) - (camera.mouseX-camera.position.x)),
            (camera.mouseY + ((camera.mouseY-camera.position.y) * (1/camera.zoom)) - (camera.mouseY-camera.position.y))
        )
    }

    static testDrawTile(to, x, y){
        if(!MapEditor.clicked && MapEditor.currentTool){
            console.log("Clicked: true")
            MapEditor.clicked = true
            // let mPos = MapEditor.getMouseWorldPosition()
            // let tS = GameManager.settings.CONSTANTS.TILESIZE
            // let x = Math.floor(mPos.x/(tS)) * tS + tS/4
            // let y = Math.floor(mPos.y/(tS)) * tS + tS/4
            let tile = {
                type: MapEditor.currentTool,
                x: x,
                y: y 
            }
            switch(MapEditor.currentTool){
                case Tile.types.RUNE:
                    tile.info = {
                        radius: 150,
                        secondsToActivate: 2
                    }
                break;
            }
            MapEditor.currentMap.createTile(to, tile)

        }
    }

    static setupHUD() {
        camera.off()
        MapEditor.panel = createSprite(width/2, height+100, 0, 0)
        MapEditor.panel.addImage(AsssetManager.assets.mapEditor.toolTab)
        MapEditor.panel.setCollider("rectangle",0, -100, 200, 50)
        MapEditor.panel.modifier = 0
        MapEditor.panel.debug = true

        MapEditor.panel.onMouseReleased  = () => {
            if(!MapEditor.clicked){
                console.log("Clicked");
                console.log("Clicked: true")
                MapEditor.clicked = true;
                if(MapEditor.panel.modifier == 200){
                    MapEditor.panel.modifier = 0
                    MapEditor.pageGroup.forEach(sprite => {
                        sprite.position.y = sprite.position.y + 200
                    })
                } else {
                    MapEditor.pageGroup.forEach(sprite => {
                        sprite.position.y = sprite.position.y - 200
                    })
                    MapEditor.panel.modifier = 200
                }

                MapEditor.panel.position.y = height+100 - MapEditor.panel.modifier
            }
        }
        MapEditor.setupPage()


        MapEditor.tileOptions = createSprite(width+100, height/2-50, 500, 500)
        MapEditor.tileOptions.addImage(AsssetManager.assets.mapEditor.optionsTab)
        MapEditor.tileOptions.setCollider("rectangle",-100, 0, 50, 200)
        MapEditor.tileOptions.debug = true
        MapEditor.tileOptions.modifier = 0
        MapEditor.setupOptions()
        MapEditor.tileOptions.onMouseReleased  = () => {
            if(!MapEditor.clicked){
                console.log("Clicked");
                console.log("Clicked: true")
                MapEditor.clicked = true;
                if(MapEditor.tileOptions.modifier == 200){
                    MapEditor.tileOptions.modifier = 0
                    MapEditor.optionsGroup.buttonCurrent.hide()
                    MapEditor.optionsGroup.textBackground.hide()
                    MapEditor.optionsGroup.buttonEnvironment.hide()

                } else {
                    MapEditor.tileOptions.modifier = 200
                    MapEditor.optionsGroup.buttonCurrent.show()
                    MapEditor.optionsGroup.buttonEnvironment.show()
                    MapEditor.optionsGroup.textBackground.show()
                }
                console.log(MapEditor.optionsGroup.currentOption)
                MapEditor.tileOptions.position.x = width+100 - MapEditor.tileOptions.modifier
            }
        }


        camera.on()
    }

    static showCurrentTileOptions() {
        //MapEditor.optionsGroup.buttonCurrent.hide()
        MapEditor.optionsGroup.textNextLevel.hide()
        MapEditor.optionsGroup.textNextDoor.hide()
        MapEditor.optionsGroup.textRuneSeconds.hide()
        MapEditor.optionsGroup.textRuneRadius.hide()

        if(MapEditor.currentTile == undefined || MapEditor.tileOptions.modifier == 0 || MapEditor.optionsGroup.currentOption != "currenttile"){
            return
        }
        

        switch(MapEditor.currentTile.type){
            case Tile.types.NEXTLEVEL:
                console.log("Show Button")
                MapEditor.optionsGroup.buttonCurrent.show()
                MapEditor.optionsGroup.textNextLevel.show()
                MapEditor.optionsGroup.textNextDoor.show()
                fill(0)
                text("Next Level: ", width - 75, height/2-245)
                text("Next Door: ", width - 75, height/2-210)
                fill(255)
                text(MapEditor.currentTile.nextLevelName, width - 75, height/2-225)
                text(MapEditor.currentTile.nextLevelDoor, width - 75, height/2-190)
            break
            case Tile.types.DOOR:
                console.log("Show Button")
                MapEditor.optionsGroup.buttonCurrent.show()
            break
            case Tile.types.RUNE:
                console.log("Show Button")
                MapEditor.optionsGroup.textRuneSeconds.show()
                MapEditor.optionsGroup.textRuneRadius.show()
                text("Seconds Off: ", width - 75, height/2-245)
                text("Radius: ", width - 75, height/2-210)
                if(MapEditor.currentTile.info.secondsToActivate)
                text(MapEditor.currentTile.info.secondsToActivate, width - 75, height/2-225)
                text(MapEditor.currentTile.info.radius, width - 75, height/2-190)
            break
        }
    }

    static setupOptions() {

        MapEditor.optionsGroup.buttonEnvironment = createButton("Environment");
        MapEditor.optionsGroup.buttonEnvironment.position(width - 180, height/2-280)
        MapEditor.optionsGroup.buttonEnvironment.mousePressed(() => {
            MapEditor.optionsGroup.currentOption = "environment"
            MapEditor.optionsGroup.textBackground.show()

        })
        MapEditor.optionsGroup.buttonEnvironment.hide()

        MapEditor.optionsGroup.textNextLevel = createInput('Next Level')
        MapEditor.optionsGroup.textNextLevel.position(width - 180, height/2-250)
        MapEditor.optionsGroup.textNextLevel.size(80)
        MapEditor.optionsGroup.textNextLevel.input(setLevelNext)
        function setLevelNext() {
            MapEditor.currentTile.nextLevelName = this.value()
        }
        MapEditor.optionsGroup.textNextLevel.hide()

        MapEditor.optionsGroup.textNextDoor = createInput('Next Door')
        MapEditor.optionsGroup.textNextDoor.position(width - 180, height/2-210)
        MapEditor.optionsGroup.textNextDoor.size(80)
        MapEditor.optionsGroup.textNextDoor.input(setLevelDoor)
        function setLevelDoor() {
            MapEditor.currentTile.nextLevelDoor = this.value()
        }
        MapEditor.optionsGroup.textNextDoor.hide()

        MapEditor.optionsGroup.textBackground = createInput('Background')
        MapEditor.optionsGroup.textBackground.position(width - 180, height/2-250)
        MapEditor.optionsGroup.textBackground.size(80)
        MapEditor.optionsGroup.textBackground.hide()

        
        MapEditor.optionsGroup.textRuneSeconds = createInput('Seconds')
        MapEditor.optionsGroup.textRuneSeconds.position(width - 180, height/2-250)
        MapEditor.optionsGroup.textRuneSeconds.size(80)
        MapEditor.optionsGroup.textRuneSeconds.input(setSecondsRune)
        function setSecondsRune() {
            MapEditor.currentTile.info.secondsToActivate = parseInt(this.value())
        }
        MapEditor.optionsGroup.textRuneSeconds.hide()

        MapEditor.optionsGroup.textRuneRadius = createInput('Radius')
        MapEditor.optionsGroup.textRuneRadius.position(width - 180, height/2-210)
        MapEditor.optionsGroup.textRuneRadius.size(80)
        MapEditor.optionsGroup.textRuneRadius.input(setRadiusRune)
        function setRadiusRune() {
            MapEditor.currentTile.info.radius = parseInt(this.value())
        }
        MapEditor.optionsGroup.textRuneRadius.hide()

        MapEditor.optionsGroup.buttonCurrent = createButton("Current Tile");
        MapEditor.optionsGroup.buttonCurrent.position(width - 90, height/2-280)
        MapEditor.optionsGroup.buttonCurrent.mousePressed(() => {
            MapEditor.optionsGroup.currentOption = "currenttile"
            MapEditor.optionsGroup.textBackground.hide()

        })


        MapEditor.optionsGroup.buttonCurrent.hide()

    }

    static setupPage(index) {

        let pageItems = [
            {name: "concrete", image: AsssetManager.assets.map.ground},
            {name: "blob", image: AsssetManager.assets.enemy.blob},
            {name: "player", image: AsssetManager.assets.mapEditor.penguinIcon},
            {name: "door", image: AsssetManager.assets.mapEditor.doorIcon},
            {name: "nextlevel", image: AsssetManager.assets.map.nextLevelDoor},
            {name: "concrete", image: AsssetManager.assets.map.ground},
            {name: "concrete", image: AsssetManager.assets.map.ground},
        ]


        MapEditor.pageGroup = new Group()

        let maxItemsPerPage = 5
        pageItems.forEach((item, index) =>{
            if(index < 5){
                console.log(item)
                let sprite = createSprite(width/2 + (index * 80) - 155, height+115)
                sprite.addImage("image", item.image)
                sprite.setDefaultCollider()
                sprite.debug = true
                sprite.onMouseReleased = () => {
                    MapEditor.clicked = true;
                    MapEditor.currentTool = item.name
                    console.log(MapEditor.currentTool)
                }
                MapEditor.pageGroup.add(sprite);
            }
        })
    }

}


class Map{

    constructor( ) {
        this.tileIndex = 0
        this.tiles = []
        this.tileMap = {}
    }


    createTile(to, tile, playing=false){
        let type = tile.type
        let x = tile.x
        let y = tile.y
        // If We are loading tiles to play
        if(playing) {
            let sprite;
            switch(type){

                case Tile.types.PLAYER:
                    if(GameManager.player == undefined){
                        GameManager.player = new Player(x, y, GameManager.settings.CONSTANTS.TILESIZE);
                        sprite = GameManager.player.sprite
                    }
                    else {
                        GameManager.player.sprite.position.x = x
                        GameManager.player.sprite.position.y = y
                        sprite = GameManager.player.sprite
                    }
                break;

                case Tile.types.RUNE:
                    let rune = new Rune( x, y, GameManager.settings.CONSTANTS.TILESIZE, tile.info.secondsToActivate, tile.info.radius);
                    sprite = rune.sprite
                    sprite.setDefaultCollider()

                break;

                case Tile.types.DOOR:
                    console.log(tile)
                    let door = new Door( x, y, tile.runes);
                    sprite = door.sprite
                break;


                case Tile.types.NEXTLEVEL:
                    let nextlevel = new NextLevelDoor(x, y, tile.nextLevelName, tile.NextLevelDoor)
                    sprite  = nextlevel.sprite
                break;

                case Tile.types.Blob:
                    let blob = new BlobEnemy(x, y)
                    sprite = blob.sprite
                break;

                case Tile.types.DeathSquare:
                    let deathSquare = new DeathSquare(x, y)
                    sprite = deathSquare.sprite
                break;

                default:
                    sprite = createSprite(
                        x,
                        y,
                    32, 32)
            
                    let image = Tile.getTileImage(type)

                    sprite.addImage(type, image)
                    sprite.scale = 1
                    sprite.setDefaultCollider()
                    LayerManager.layers.environment.add(sprite)
                break;
            }
            if(type != Tile.types.PLAYER)
            to.addTile(sprite, tile)
            
        } else {
            let sprite = createSprite(
                x,
                y,
            32, 32)
    
            let image = Tile.getTileImage(type)
    
    
            sprite.addImage(type, image)
            sprite.scale = 1
    
            LayerManager.layers.environment.add(sprite)
            to.addTile(sprite, tile)
        }

    }


    selectTile(x, y){
        let tileXY = `_${x}${y}`
        if(this.tileMap[tileXY] != undefined) {
            return this.tileMap[tileXY].saveInfo
        }
    }


    addTile(sprite, tile){
        let x = tile.x
        let y = tile.y
        let tileXY = `_${x}${y}`
        this.removeTileAtXY(x, y)
        this.tileMap[tileXY] = sprite
        this.tileMap[tileXY].saveInfo = tile
    }

    saveMap(name){
        let toSave = {}
        Object.values(this.tileMap).forEach(tile => {
            let tileXY = `_${tile.saveInfo.x}${tile.saveInfo.y}`
            toSave[tileXY] = tile.saveInfo
        })
        console.log(toSave)
        saveJSON(toSave, "testMap.json")
    }

    loadMap(json, to, playing=false){
        GameManager.fade = 300
        Object.values(json).forEach(tile => {
            console.log(tile)
            this.createTile(to, tile, playing)
        })
    }

    removeLastTile(){
        let vals = Object.values(this.tileMap)
        if(vals.length > 0){
            let lastTile = vals[vals.length - 1]
            this.removeTileAtXY(lastTile.saveInfo.x, lastTile.saveInfo.y)
        }
    }

    removeTileAtXY(x, y){
        let tileXY = `_${x}${y}`
        if(this.tileMap[tileXY] != undefined) {
            removeSprite(this.tileMap[tileXY])
            delete this.tileMap[tileXY]
        }
    }

    removeTile(tile){
        let x = tile.x
        let y = tile.y
        let tileXY = `_${x}${y}`
        if(tile.toActivate != undefined){
            let aX = tile.toActivate.x
            let aY = tile.toActivate.y
            let toActivate = MapEditor.currentMap.selectTile(aX, aY)
            delete toActivate.runes[tileXY]
        }
        if(this.tileMap[tileXY] != undefined) {
            removeSprite(this.tileMap[tileXY])
            delete this.tileMap[tileXY]
        }
    }

}


class Tile {
    
    static types = {
        CONCRETE: "concrete",
        RUNE: "rune",
        PLAYER: "player",
        DOOR: "door",
        NEXTLEVEL: "nextlevel",
        Blob: "blob",
        DeathSquare: "death square"
    }

    constructor(type, x, y){
        this.type = type
        this.x = x
        this.y = y
    }

    static getTileImage(type){
        switch(type){
            case Tile.types.CONCRETE:
                return AsssetManager.assets.map.ground

            case Tile.types.RUNE:
                return AsssetManager.assets.rune.off

            case Tile.types.PLAYER:
                return AsssetManager.assets.mapEditor.penguinIcon

            case Tile.types.DOOR:
                return AsssetManager.assets.mapEditor.doorIcon

            case Tile.types.NEXTLEVEL:
                return AsssetManager.assets.map.nextLevelDoor

            case Tile.types.Blob:
                return AsssetManager.assets.enemy.blob
            
            case Tile.types.DeathSquare:
                return AsssetManager.assets.enemy.deathSquare
        }
    }
}