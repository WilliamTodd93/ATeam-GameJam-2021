class Projectile {
    constructor(x, y, speed, size){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = createSprite(this.x, this.y, size);
        this.sprite.velocity.x = this.speed;

        this.sprite.setCollider("rectangle", 0, 0, size, size);

        LayerManager.layers.projectiles.add(this.sprite);

        this.superDraw = this.sprite.draw;
        this.sprite.draw = this.draw.bind(this);
    }

    draw(){
        this.superDraw();
        this.offScreenRemoval();
        this.playerCollisionRemoval();
        this.environmentCollisionRemoval();
    }

    offScreenRemoval(){
        if (this.sprite.position.x < 0 ||
            this.sprite.position.x > GameManager.settings.CONSTANTS.SCREEN_W ||
            this.sprite.position.y < 0 ||
            this.sprite.position.y > GameManager.settings.CONSTANTS.SCREEN_H){
                this.sprite.remove();
            }
    }

    playerCollisionRemoval(){
        if(this.sprite.overlap(LayerManager.layers.player)){
            this.sprite.remove();
        }
    }

    environmentCollisionRemoval(){
        if(this.sprite.overlap(LayerManager.layers.environment)){
            this.sprite.remove();
        }
    }
}

class DeathBeam extends Projectile {
    constructor(x, y, speed, size){
        super(x, y, speed, size);
        this.sprite.addImage("Death Beam", AsssetManager.assets.projectiles.deathBeam);
        this.damage = 100;  // Because it's a death beam. It's gonna destroy you if it hits you.
    }
}