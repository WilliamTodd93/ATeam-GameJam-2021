// Get the Input bruh
class Input {



    static GetMovementVector2() {
        let x = keyIsDown(LEFT_ARROW) || keyIsDown(65)  ? -1 : keyIsDown(RIGHT_ARROW) || keyIsDown(68) ? 1 : 0
        let y = keyIsDown(UP_ARROW) || keyIsDown(87) ? -1 : keyIsDown(DOWN_ARROW) || keyIsDown(83) ? 1 : 0
        return createVector(x, y)
    }

    static GetJump(){
        return keyIsDown(32) || keyIsDown(UP_ARROW) || keyIsDown(87)
    }

    static GetSlide() {
        return keyIsDown(16)
    }

    static GetInteract() {
        return keyWentDown(69)
    }

    static scrollEvent(event){
        Input.hasScrolled = false;
        Input.currentScroll += event.deltaY
    }

    static lastScroll = 0;
    static currentScroll = 0;
    static hasScrolled = false;

    static getScroll(){
        if(Input.hasScrolled){
            return 0
        }

        Input.hasScrolled = true
        if(Input.lastScroll < Input.currentScroll){
            Input.lastScroll = Input.currentScroll
            return -0.1
        } else {
            Input.lastScroll = Input.currentScroll
            return 0.1
        }
    }
}