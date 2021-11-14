class HUDManager {
    static createMenu(buttons, visible){
        return new Menu(buttons, visible);
    }

    static setupMenus(){
        
        // Start Menu
        let startMenu = HUDManager.createMenu([
            //Start Button
            new Button(width/2, 100, 600, 120, () => {
                startMenu.switchTo(secondMenu)
            }, AsssetManager.assets.buttons.start),
            // Map Editor
            new Button(width/2, 300, 600, 120, () => {
                startMenu.switchTo(mapEditorStart)
            }, AsssetManager.assets.buttons.mapEditor),
            // Restart Game
            new Button(width/2, 700, 600, 120, () => window.location.reload(), AsssetManager.assets.buttons.exitButton)
        ], true)
        
        // Game Select
        let secondMenu = HUDManager.createMenu([
            // Start Game
            new Button(width/2, 100, 600, 120, () => { 

                loadJSON("map1.json", (json) => {
                    GameManager.currentLevel = new Map()
                    GameManager.currentLevel.loadMap(json, GameManager.currentLevel, true)
                })
                secondMenu.disableAll(); 
                // TODO
                LayerManager.layers.hud.isEnabled = false
            }, AsssetManager.assets.buttons.start),
            // Back Button
            new Button(width/2, 700, 600, 120, () => {                
                secondMenu.switchTo(startMenu)
            }, AsssetManager.assets.buttons.back),
        ])

        // Map Editor Select
        let mapEditorStart = HUDManager.createMenu([
            // New Map
            new Button(width/2, 100, 600, 120, () => { 
                mapEditorStart.disableAll()
                MapEditor.setupMapEditor()
                GameManager.inMapEditor = true;
            }, AsssetManager.assets.buttons.newMapButton),
            // Load Map
            new Button(width/2, 400, 600, 120, () => {                 
                loadJSON("map3.json", (json) => {
                    mapEditorStart.disableAll()
                    MapEditor.setupMapEditor()
                    MapEditor.currentMap.loadMap(json, MapEditor.currentMap)
                    GameManager.inMapEditor = true;
                })
            }, AsssetManager.assets.buttons.loadMapButton),
            // Back
            new Button(width/2, 700, 600, 120, () => {                
                mapEditorStart.switchTo(startMenu)
            }, AsssetManager.assets.buttons.back),
        ])
    }

    static gameEndMenus(){
        let gameEndMenu = HUDManager.createMenu([
            // Return Home
            new Button(width/2, 100, 600, 120, () => {
                gameEndMenu.switchTo(startMenu)
            }, AsssetManager.assets.buttons.home),
            // Restart
            new Button(width/2, 400, 600, 120, () => { 
                loadJSON("testMap.json", (json) => {
                    GameManager.currentLevel = new Map()
                    GameManager.currentLevel.loadMap(json, GameManager.currentLevel, true)
                })
                homeMenu.disableAll(); 
                LayerManager.layers.hud.isEnabled = false
            }, AsssetManager.assets.buttons.restart),
        ])
    }
}

class Button{
    constructor(x, y, width, height, callback, image=null){
        this.sprite = createSprite(x, y, width, height);
        this.sprite.onMouseReleased = callback
        this._setup(image);
        return this.sprite
    }

    _setup(image){
        LayerManager.layers.hud.add(this.sprite)
        if(image!=null){
            this.sprite.addImage("base", this._resizeImage(image, this.sprite.width, this.sprite.height))
        }

        this.sprite.setDefaultCollider()
        this.sprite.visible = false
        this.sprite.removed = true
        //this.sprite.debug = GameManager.settings.CONSTANTS.DEBUG
    }

    _resizeImage(image, width, height){
        let img = image.get()
        img.resize(width, height)
        return img
    }
}


class Menu{
    buttons;
    
    constructor(buttons, visible=false){
        this.buttons = buttons

        if(visible){
            this.enableAll()
        } else {
            this.disableAll();
        }
        
    }

    disableAll() {
        this.buttons.forEach(button => {
            button.visible = false;
            button.removed = true
        });
    }

    
    enableAll() {
        this.buttons.forEach(button => {
            button.visible = true;
            button.removed = false
        });
    }
    

    switchTo(menu){
        this.disableAll()
        menu.enableAll()
    }
}