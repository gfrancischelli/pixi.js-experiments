import PIXI from 'pixi.js';
import keyboard from './keyboard';
const P = window.PIXI;

const stage = new P.Container(),
      renderer = P.autoDetectRenderer(600, 480);
document.body.appendChild(renderer.view);


const MARIO = "assets/mario.png";

function setup() {
  // Create mario Sprite
  const mario = new P.Sprite(
    P.loader.resources[MARIO].texture
  );
  mario.vx = 0;
  mario.vy = 0;
  mario.anchor.set(0.5, 0.5);
  mario.position.set(300, 240);
  stage.addChild(mario);
  console.log(mario)

  const left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  left.press = function() {
    mario.vx = -5;
    mario.vy = 0;
  }
  left.release = function() {
    if(!right.isDown && mario.vy === 0) {
      mario.vx = 0;
    }
  }

  up.press = function() {
    mario.vy = -5;
    mario.vx = 0;
  }
  up.release = function() {
    if (!down.isDown && mario.vx === 0) {
      mario.vy = 0;
    }
  }

  right.press = function() {
    mario.vx = 5;
    mario.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && mario.vy === 0) {
      mario.vx = 0;
    }
  };

  down.press = function() {
    mario.vy = 5;
    mario.vx = 0;
  };
  down.release = function() {
  if (!up.isDown && mario.vx === 0) {
    mario.vy = 0;
    }
  };


  function loop() {
    requestAnimationFrame(loop);
    play();
    renderer.render(stage);
  }

  function play() {
    mario.x += mario.vx;
    mario.y += mario.vy;
  }

  loop();
  renderer.render(stage)
};

P.loader
  .add(MARIO)
  .load(setup);




