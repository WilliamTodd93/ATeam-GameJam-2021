class Enemy {
    constructor(x, y, stats){
        this.sprite = createSprite(x, y);
        //this.sprite.debug = true;
        
        this.stats = stats;
        //this.hp = this.stats.maxHp;
        
        this.sprite.setCollider("rectangle", 0, 0, 32, 32);

        LayerManager.layers.enemy.add(this.sprite);

        this.superDraw = this.sprite.draw;
        this.sprite.draw = this.draw.bind(this);
        this.extra = null;
    }
    
    draw() {
        this.superDraw()
        if(this.extra != null){
            this.extra();
        }
    }
}

class EnemyStats {
    constructor(stats){
        this.stats = stats
    }
    
    static BlobEnemy(scaled=false) {
        return new EnemyStats({
            //maxHp: scaled ? 10 * GameManager.player.level : 100,
            speed: 1,
            damage: 10
        })
    }

    static DeathSquareEnemy(scaled=false){
        return new EnemyStats({
            //maxHP: scaled ? 10 * GameManager.player.level : 100,
            speed: 1,
            damage: 5
        })
    }
    
}

class BlobEnemy extends Enemy{
    constructor(x, y) {
        super(x, y, EnemyStats.BlobEnemy(true));
        this.extra = this.special;
        //Specific to the Blob Enemy
        this.name = 'Blob';
        this.sprite.addImage("Blob", AsssetManager.assets.enemy.blob);
        this.sprite.velocity.x = 1;
    }
    
    special(){
        this.movement();
        this.applyGravity();
    }

    movement(){
        //Layer manager . layers. environments is the group of sprites for walls,floor,ceiling etc. This checks for collisions.
        if (this.sprite.collide(LayerManager.layers.environment)){
            if (this.sprite.touching.right){
                this.sprite.velocity.x = -1;
            }else if (this.sprite.touching.left){
                this.sprite.velocity.x = 1;
            }
        }
    }

    applyGravity(){
        this.sprite.friction = 0.001;
    }
}

class DeathSquare extends Enemy {
    constructor(x, y){
        super(x, y, EnemyStats.DeathSquareEnemy(true));
        this.extra = this.special;
        this.name = "Death Square";
        this.sprite.addImage("Death Square", AsssetManager.assets.enemy.deathSquare);
        // No velocity. This enemy will shoot with no movement
    }

    special(){
        this.shooting();
    }

    shooting(){
        /* I'm going to check if the enemy is on the left side of the screen or right.
            If they are on the left side of the screen I want them to shoot right, so set projectile velocity as positive int.
            If they are on the right side of the screen I want them to shoot left, so set the projectile velocity as a negative int.
            DeathBeam speed will be the velocity of the projectile.
        */
        if (frameCount % 300 == 0){
            if ( this.sprite.position.x > (GameManager.settings.CONSTANTS.SCREEN_W / 2 ) ) {
                this.shot = new DeathBeam(this.sprite.position.x, this.sprite.position.y, -2, 16);
                console.log(this.shot);
            }else if ( this.sprite.position.x < (GameManager.settings.CONSTANTS.SCREEN_W / 2 ) ){
                this.shot = new DeathBeam(this.sprite.position.x, this.sprite.position.y, 2, 16);
                console.log(this.shot);
            }
        }
    }
}