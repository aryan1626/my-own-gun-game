var gamestate
var shooter, standing, dead, jumping
var bgImg
var ground;
var obstacle1, obstacle2
var obstacle1Img, obstacle2Img
var score;
var restartImg, restart
var gameoverImg, gameover
var bullet, bulletGroup, bulletImg

function preload() {
  //code to load all images and animations
  bgImg = loadImage("images/background.png");
  standing = loadImage("images/standing.png");
  dead = loadImage("images/dead.png")
  jumping = loadAnimation("images/jumping.png", "images/standing.png");
  obstacle1Img = loadImage("images/monster.png");
  obstacle2Img = loadImage("images/fire.png");
  restartImg = loadImage("images/restart.png");
  gameoverImg = loadImage("images/gameover.png");
  bulletImg = loadImage("images/bullet.png");
}

function setup() {
  createCanvas(1000, 400);
  gamestate = 0
  //code to create the background
  backgr = createSprite(1000, 200, 2000, 400)
  backgr.addImage(bgImg)
  backgr.visible = false
  backgr.x = backgr.width / 2
  backgr.velocityX = -2
  backgr.scale = 1.3

  //code to create the shooter
  shooter = createSprite(63, 320, 20, 20);
  shooter.addAnimation("standing", standing)
  shooter.visible = false;

  //code to create the button
  button = createButton('PLAY')
  button.position(500, 200)

  //code to create an invisible ground
  ground = createSprite(400, 380, 1900, 10)
  ground.visible = false
  ground.x = ground.width / 2
  ground.velocityX = -2

  restart = createSprite(500, 300)
  restart.addImage(restartImg)
  restart.visible = false
  restart.scale = 0.5

  gameover = createSprite(500, 150)
  gameover.addImage(gameoverImg)
  gameover.visible = false
  gameover.scale = 0.4

  obstacle1 = new Group()
  obstacle2 = new Group()
  bulletGroup = new Group()

  score = 0

}

function draw() {

  switch (gamestate) {
    case 0: start()
      break;
    case 1: play()
      break;
    case 2: end()
      break;
  }
  // code to reset the background
  if (backgr.x < 0) {
    backgr.x = width / 2
  }
  // code to reset the invisible ground  
  if (ground.x < 0) {
    ground.x = width / 2
  }

  if (keyDown("s")) {
    createBullets();
  }

  //code to generate ramdome enemies
  var select_enemies = Math.round(random(1, 2));

  if (World.frameCount % 100 == 0) {
    if (select_enemies == 1) {
      monster()
    } else if (select_enemies == 2)
      fireball()
  }

  drawSprites();

  fill("brown")
  textSize(20)
  text("Score: " + score, 450, 50);
}

function start() {
  background("black")

  fill("white")
  textSize(16)
  text("The rules for this game is very simple, tap S to shoot and SPACE to jump", 300, 300);

  //code to hide the "PLAY" button once clicked
  button.mousePressed(() => {
    button.hide()
    gamestate = 1

  })

}

function play() {
  backgr.visible = true
  shooter.visible = true;

  score = score + Math.round(getFrameRate()/60)

  if(score>0 && score%100 === 0){
  text("Level 1 - Compleated",500,320) 
 }
 
  console.log(frameRate())

  //code for shooter to jump
  if (keyDown("space")) {
    shooter.velocityY = -14
  }
  //code to add gravity to the shooter
  shooter.velocityY = shooter.velocityY + 0.8
  //code to collide the player with the ground so he dosent fall through
  shooter.collide(ground)

  if (bulletGroup.isTouching(obstacle1)) {
    console.log("monster has been hit")
    obstacle1.destroyEach();
    bulletGroup.destroyEach();
  }

  if(obstacle1.isTouching(shooter)){
    gamestate = 2
  }
  if(obstacle2.isTouching(shooter)){
    gamestate = 2
  }

}

function end() {
  gamestate = 2
  gameover.visible = true
  restart.visible = true

  if (mousePressedOver(restart)) {
    reset();
  }

 ground.velocityX = 0
  shooter.velocityY = 0

 obstacle1.setLifetimeEach(-1);
 obstacle2.setLifetimeEach(-1);

 obstacle1.setVelocityEach(0);
 obstacle2.setVelocityEach(0);
 
 shooter.collide(ground)
}


function reset() {
  gamestate = 1
  gameover.visible = false
  restart.visible = false
  obstacle1.destroyEach();
  obstacle2.destroyEach();
  shooter.changeAnimation("standing", standing)
  score = 0
}

function monster() {
  var badmonster = createSprite(1500, 320)
  badmonster.addImage(obstacle1Img)
  badmonster.velocityX = -5
  //badmonster.lifetime = 100
  badmonster.scale = 1
  obstacle1.add(badmonster);
}

function fireball() {
  var badfire = createSprite(1500, 320)
  badfire.addImage(obstacle2Img)
  badfire.velocityX = -5
  //badfire.lifetime = 100
  badfire.scale = 1
  obstacle2.add(badfire)
}

function createBullets() {
  var bullet = createSprite(65, 320, 20, 10)
  bullet.addImage(bulletImg)
  bullet.velocityX = 3
  bullet.scale = 0.03
  bulletGroup.add(bullet)
}