class Player{
    sprite;

    constructor(x, y, tS) {
        this.sprite = createSprite(x, y, tS, tS)
        LayerManager.layers.player.add(this.sprite)

        this.loadAnimations(); // Load the Animations or add A Sprite
        this.sprite.scale = 2
        //this.sprite.debug = GameManager.settings.CONSTANTS.DEBUG
        this.sprite.setCollider("rectangle", 0, 6, 20, 28);
        //Make A Clone of the 'sprites' draw 
        // so we can call it after overwriting it
        this.superDraw = this.sprite.draw

        // We overwrite the sprites default draw function to our function
        //   which will call the default + our extra logic
        this.sprite.draw = this.draw.bind(this)
        this.movementSpeed = 1.5;
        this.jumpStrength = 8;
        this.isAirborne = true;
        this.isTouchingSides = false;
        this.timeouts = {
            touchingRight: false,
            touchingLeft: false,
        }

        this.jumpTimeout = 2000
        //this.sprite.debug = true
        this.sprite.maxSpeed = 12
        this.isSliding = false;

        this.disabledMovement = false;


        this.health = 100
        this.maxHealth = 100

        // Not using weapon. Just dodging enemies
        //this.weapon = createSprite(this.sprite.position.x, this.sprite.position.y)
        //LayerManager.layers.player.add(this.weapon)
        //this.weapon.addImage("pistol", AsssetManager.assets.weapons.pistol)
        //this.weapon.scale = 2

    }

    /* Didn't implement a heal
    heal(amount){
        this.health += amount
        if(this.health > this.maxHealth){
            this.health = this.maxHealth
        }
    }*/

    clearTimeouts() {
        this.timeouts = {
            touchingRight: false,
            touchingLeft: false,
        }
    }
    
    // This function will run every frame the sprite is visible
    draw() {
        this.superDraw();
        //this.weapon.position = this.sprite.position

        //console.log(this.weapon.rotation)
        let moved = false
        let iA = Input.GetMovementVector2();
        this.jump(iA)
        this.movement(iA, moved)
        this.applyGravity()
        camera.position = this.sprite.position

        //Disabled for now
        //this.grabbing(iA)
        this.slide(iA)

        this.sprite.mirrorX(Math.sign(this.sprite.velocity.x))

        camera.off()
        rectMode(CENTER)
        rect(this.sprite.position.x, this.sprite.position.y - 50, this.health, 10)
        text(Math.floor(this.health), this.sprite.position.x-10, this.sprite.position.y - 60)
        camera.on()
        //this.loop();
        this.enemyCollision();
    }

    grabbing(iA){
        if(((this.timeouts.touchingRight || this.timeouts.touchingLeft) && this.isAirborne && !this.isSliding)){
            this.sprite.changeAnimation("grab")
        } else if(!this.isSliding){
            this.sprite.changeAnimation("stand")
        }
    }

    slide(iA){
        if(Input.GetSlide() && !this.isSliding && (!this.timeouts.touchingRight && !this.timeouts.touchingLeft)){ 
            this.isSliding = true;
            console.log("Slide")
            this.sprite.friction = 0.01;
            this.sprite.changeAnimation("slide")
        } else if(!Input.GetSlide() && this.isSliding && !this.isAirborne) {
            this.isSliding = false
            this.sprite.animation.changeFrame(0)
            this.sprite.friction = 0.3
            this.sprite.changeAnimation("stand")
        }
    }

    jump(iA){
        if(Input.GetJump()){
            if(!this.isAirborne){
                this.sprite.velocity.y -= this.jumpStrength
            } else if ( this.timeouts.touchingLeft && Math.sign(iA.x) == 1) {
                console.log("Wall Jump")
                this.sprite.velocity.y -= this.jumpStrength*5
                this.sprite.velocity.x += this.jumpStrength*2
                this.clearTimeouts();
            }
            else if ( this.timeouts.touchingRight && Math.sign(iA.x) == -1) {
                console.log("Wall Jump")
                this.sprite.velocity.y -= this.jumpStrength*5
                this.sprite.velocity.x -= this.jumpStrength*2
                this.clearTimeouts();
            }


            // setTimeout(() => {
            //     this.clearTimeouts();
            // }, this.jumpTimeout)

        }

    }

    movement(iA) {
        let sprite = this.sprite;
        if(!sprite.collide(LayerManager.layers.environment)){
            // We are Not Colliding
            this.isAirborne = true;
        } else {
            //We are Collding
            if((sprite.touching.left || sprite.touching.right) && (!sprite.touching.bottom)) {
                this.timeouts.touchingRight = sprite.touching.right
                this.timeouts.touchingLeft = sprite.touching.left

                this.isTouchingSides = true
                setTimeout(() => {
                    this.clearTimeouts();
                }, this.jumpTimeout)
                this.sprite.velocity.x = 0
            }
            if(sprite.touching.bottom){
                if(this.isAirborne){
                    // Get Velocity
                    // Add Fall Damage
                    if(this.sprite.velocity.y > 11.5)
                    this.damage(this.sprite.velocity.y/2)
                }
                this.isAirborne = false;
                
            }
            if(sprite.touching.top) {
                this.sprite.velocity.y = 0
            }
        }

        
        if (
            (sprite.touching.left && iA.x > 0) ||
            (sprite.touching.right && iA.x < 0) ||
            (!sprite.touching.left && !sprite.touching.right)
        ){
            if(!this.disabledMovement){
                if(!this.isAirborne){
                    sprite.velocity.x += (iA.x * this.movementSpeed);
                } else {
                    sprite.velocity.x += (iA.x * this.movementSpeed/10);
                }
            }
        }

    }

    applyGravity() {
        if(this.isAirborne){
            this.sprite.friction = 0.01
            this.sprite.velocity.y += 0.3
        } else if(!this.isSliding){
            this.sprite.friction = 0.25
            this.sprite.velocity.y -= 0.03;
        }
    }

    enemyCollision(){
        // Need a way to access the specific enemy and use it's damage.
        if (this.sprite.collide(LayerManager.layers.enemy)){
            this.damage(5);
        }else if (this.sprite.collide(LayerManager.layers.projectiles)){
            this.damage(10);
            if(!AsssetManager.assets.sounds.zap.isPlaying()){
                AsssetManager.assets.sounds.zap.play();
            }
            for(let object of LayerManager.layers.environment){
                console.log(object);
            }
        }
    }


    damage(amount){
        this.health -= amount
        if(this.health <= 0){
            this.health = 0
            this.die()
        }
    }

    die() {
        GameManager.player.disabledMovement = true; //<-- maybe change to this.disabledMovement 
        this.sprite.changeImage("dead")
    }
        

    loop() {
        let inputV = Input.GetMovementVector2()        
        this.sprite.position.x += inputV.x 
    }


    preload(){
        this.loadAnimations();
    }

    loadAnimations() {     
        function loadAndAdd(label, frames, delay, sprite, looping=true) {
            let anim = loadAnimation(new SpriteSheet('assets/penguin-sheet.png', frames))
            anim.frameDelay = delay;
            anim.looping = looping;
            sprite.addAnimation(label, anim)
        }

        loadAndAdd("walk", [
            {'name':'player_walk01', 'frame':{'x':0, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_walk02', 'frame':{'x':32, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_walk03', 'frame':{'x':64, 'y': 0, 'width': 32, 'height': 32}},
        ], 10, this.sprite)

        loadAndAdd("stand", [
            {'name':'player_stand01', 'frame':{'x':96, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_stand02', 'frame':{'x':128, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_stand03', 'frame':{'x':160, 'y': 0, 'width': 32, 'height': 32}},
        ], 16, this.sprite)

        loadAndAdd("slide", [
            {'name':'player_slide01', 'frame':{'x':192, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_slide02', 'frame':{'x':224, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_slide03', 'frame':{'x':256, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_slide04', 'frame':{'x':288, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_slide05', 'frame':{'x':320, 'y': 0, 'width': 32, 'height': 32}},
            {'name':'player_slide06', 'frame':{'x':352, 'y': 0, 'width': 32, 'height': 32}},
        ], 3, this.sprite, false)

        loadAndAdd("grab", [
            {'name':'player_grab01', 'frame':{'x':384, 'y': 0, 'width': 32, 'height': 32}},
        ], 3, this.sprite, false)

        this.sprite.addImage("dead", AsssetManager.assets.tombStone)
        this.sprite.changeAnimation("stand")

    }

}