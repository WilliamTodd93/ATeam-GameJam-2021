class Player2{
    constructor(_image, _posX, _posY) {
        this.image = _image;
        this.position = createVector(_posX, _posY)
        this.size = createVector(this.image.width, this.image.height)
    }

    update(){
        this.groundCheck();
        this.move();
        this.wrapCheck();
        let cPos = this.getCenteredPos();
        image(this.image, cPos.x, cPos.y)
    }

    move() {
        this.position.x += Input.GetAxis().x*5
        if(Input.GetAxis().y == -1){
            this.jump();
        }
    }
    
    jump() {
        this.position.y -= 30;
    }

    groundCheck(){
        if(this.position.y >= height - (this.size.y/2)) {
            this.position.y = height - (this.size.y/2)
            return false
        } else {
            this.position.y += 10;
        }
        return true
    }

    wrapCheck() {
        if(this.position.x >= width){
            this.position.x = 0
        } else if(this.position.x <= 0){
            this.position.x = width
        }
    }
    
    getCenteredPos() {
        return createVector(
            this.position.x-(this.size.x/2),
            this.position.y-(this.size.y/2) 
        )
    }

}