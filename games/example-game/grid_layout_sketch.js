let grid;
function preload(){
  grid = loadStrings("assets/grid.txt")
}

function setup() {
  createCanvas(1000, 1000);
  let xCo_ord = 0;
  let yCo_ord = 0;
  for (let lines of grid){
    for (let x of lines){
      if (x == 1){
        new Obstacle((xCo_ord + 15), (yCo_ord + 15), 30, 30);
        xCo_ord += 40;
      }else {
        new Pathing((xCo_ord + 15), (yCo_ord + 15), 30, 30);
        xCo_ord += 40;
      }
    }
    xCo_ord = 0;
    yCo_ord += 40;
  }
}

function draw() {
  drawSprites();
}
