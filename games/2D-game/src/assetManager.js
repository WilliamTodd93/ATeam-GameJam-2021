class AsssetManager {
    static assets = {
        buttons: {
            start: null,
            mapEditor: null,
            newMapButton: null,
            loadMapButton: null,
            exitButton: null,
            back: null,
            home: null,
            restart: null
        },
        rune: {
            on: null,
            off: null
        },
        mapEditor: {
            currentPanel: null,
            toolTab: null,
            optionsTab: null,
            doorIcon: null,
            penguinIcon: null
        },
        map: {
            clouds: null,
            ground: null,
            nextLevelDoor: null
        },
        enemy: {
            blob: null,
            deathSquare: null
        },
        tombStone: null,
        weapons: {
            pistol: null
        },
        projectiles: {
            deathBeam: null
        },
        sounds: {
            zap: null,
            player_died: null
        }
    }

    static loadAssets() {
        AsssetManager.assets.buttons.start = loadImage("assets/buttons/startButton.png")
        AsssetManager.assets.buttons.mapEditor = loadImage("assets/buttons/mapEditorButton.png")
        AsssetManager.assets.buttons.newMapButton = loadImage("assets/buttons/newMapButton.png")
        AsssetManager.assets.buttons.loadMapButton = loadImage("assets/buttons/loadMapButton.png")
        AsssetManager.assets.buttons.exitButton = loadImage("assets/buttons/exitButton.png")
        AsssetManager.assets.buttons.back = loadImage("assets/buttons/backButton.png")
        AsssetManager.assets.buttons.home = loadImage("assets/buttons/homeButton.png")
        AsssetManager.assets.buttons.restart = loadImage("assets/buttons/restartButton.png")
        
        AsssetManager.assets.rune.on = loadImage("assets/runeOn.png")
        AsssetManager.assets.rune.off = loadImage("assets/runeOff.png")

        AsssetManager.assets.mapEditor.currentPanel = loadImage("assets/currentMapTool.png")
        AsssetManager.assets.mapEditor.optionsTab = loadImage("assets/mapEditorOptionsTab.png")
        AsssetManager.assets.mapEditor.toolTab = loadImage("assets/mapEditorToolTab.png")
        AsssetManager.assets.mapEditor.doorIcon = loadImage("assets/doorIcon.png")
        AsssetManager.assets.mapEditor.penguinIcon = loadImage("assets/penguinIcon.png")

        AsssetManager.assets.map.clouds = loadImage("assets/clouds.png")
        AsssetManager.assets.map.ground = loadImage("assets/ground.png")
        AsssetManager.assets.map.nextLevelDoor = loadImage("assets/nextLevelDoor.png")

        AsssetManager.assets.enemy.blob = loadImage("assets/blob.png")
        AsssetManager.assets.enemy.deathSquare = loadImage("assets/death_square.png")
        AsssetManager.assets.tombStone = loadImage("assets/tombStone.png")

        AsssetManager.assets.weapons.pistol = loadImage("assets/pistol.png")

        AsssetManager.assets.projectiles.deathBeam = loadImage("assets/death_beam.png")
        
        AsssetManager.assets.sounds.zap = loadSound("assets/sounds/zap_hit.mp3")
        AsssetManager.assets.sounds.player_died = loadSound("assets/sounds/player_died.mp3")
        AsssetManager.assets.sounds.zap.setVolume(0.2)
        AsssetManager.assets.sounds.player_died.setVolume(0.2)
    }
}