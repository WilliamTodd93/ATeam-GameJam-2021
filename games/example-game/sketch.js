let playerImage, player;
function preload() {
  playerImage = loadImage('assets/dude.png')
}


function setup() {
  // put setup code here
  createCanvas(800, 800);
  background(100);
  player = new Player(playerImage, width/2, height/2)
}

function draw() {
  background(100);
  player.update();  
  // put drawing code here
}