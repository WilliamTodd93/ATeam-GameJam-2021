class Obstacle {
    /*****************************************************************
    *This is drawing black square sprites to indicate obstacles.     *
    *****************************************************************/
    constructor(x, y, width, height){
        this.obstacle = createSprite(x, y, width, height);
        this.obstacle.shapeColor = color(0, 0, 0);
        this.obstacle.debug = true;
    }
}

class Pathing {
    /*****************************************************************
    * This is drawing green square sprites for available pathing.    *
    ******************************************************************/
    constructor(x, y, width, height){
        this.obstacle = createSprite(x, y, width, height);
        this.obstacle.shapeColor = color(0, 150, 0);
        this.obstacle.debug = true;
    }
}