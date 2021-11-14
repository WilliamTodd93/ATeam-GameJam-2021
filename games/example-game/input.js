class Input {

    static GetAxis() {
        let x = keyIsDown(LEFT_ARROW) ? -1 : keyIsDown(RIGHT_ARROW) ? 1 : 0
        let y = keyIsDown(UP_ARROW) ? -1 : keyIsDown(DOWN_ARROW) ? 1 : 0
        console.log(`${x} ${y}`)
        return createVector(x, y)
    }
}