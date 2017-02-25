import Rx from 'rxjs';

const PIXI = require('pixi.js');
const AnimatedSprite = PIXI.extras.AnimatedSprite;

const ACCELERATION = 0.02;
const MAX_SPEED = 8;

function Player( game, resources ) {

  // Initialize 
  const asset = resources["assets/fish.json"].textures;
  const frames = Object.keys(asset).map( k => asset[k] )
  const body = new AnimatedSprite(frames);
  
  console.log('asset', frames )
  console.log('body', body)

  body.anchor.set(0.5, 0.5);
  body.position.set(200, 200);
  body.ax = 0;
  body.ay = 0;
  body.vx = 0;
  body.vy = 0;
  body.animationSpeed = 0.5
  body.play();
  console.log(body.toGlobal(body.position))

  game.stage.addChild(body);


  const keyDown$ = Rx.Observable
    .fromEvent(document, 'keydown');

  const keyUp$ = Rx.Observable
    .fromEvent(document, 'keyup');

  const allowedKeys = [
    'ArrowUp',
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
  ]

  const controls = {
    arrowUp: {
      isDown: false,
    },
    arrowDown: {
      isDown: false,
    },
    arrowLeft: {
      isDown: false,
    },
    arrowRight: {
      isDown: false,
    },
    yArrowsDown() {
      return this.arrowUp.isDown || this.arrowDown.isDown;
    },
    xArrowsDown() {
      return this.arrowLeft.isDown || this.arrowRight.isDown;
    },
  }

  let activeKeys = 0;

  keyDown$
    .filter( e => allowedKeys.includes(e.key) )
    .subscribe( e => {
      e.preventDefault();
      actions.keyDown[e.key]();
    });

  keyUp$
    .filter( e => allowedKeys.includes(e.key) )
    .subscribe( e => {
      e.preventDefault();
      actions.keyUp[e.key]();
    });

  const actions = {
    keyDown: {
      ArrowUp: () => {
        body.ay = - ACCELERATION
        controls.arrowUp.isDown = true;
      },
      ArrowDown: () => {
        body.ay = ACCELERATION
        controls.arrowDown.isDown = true;
      },
      ArrowLeft: () => {
        body.ax = - ACCELERATION
        controls.arrowLeft.isDown = true;
      },
      ArrowRight: () => {
        body.ax = ACCELERATION
        controls.arrowRight.isDown = true;
      },
    },

    keyUp: {
      ArrowUp: () => {
        controls.arrowUp.isDown = false;
        body.ay = 0;
      },
      ArrowDown: () => {
        controls.arrowDown.isDown = false;
        body.ay = 0;
      },
      ArrowLeft: () => {
        controls.arrowLeft.isDown = false;
        body.ax = 0;
      },
      ArrowRight: () => {
        controls.arrowRight.isDown = false;
        if (!controls.arrowLeft.isDown && body.vx !== 0) {
          body.ax = 2 * ACCELERATION * Math.sign(body.vx) * - 1;
        } else {
          body.ax = 0;
        }
      },
    }
  }

  function update( lastFrameTime ) {

    const halfWidth = body.width / 2;
    const halfHeight = body.heigth / 2;

    body.vy += lastFrameTime * body.ay;
    // if body.vy < 0
    if ( Math.abs(body.vy) >= MAX_SPEED ) {
      body.vy = MAX_SPEED * Math.sign(body.vy);
    }
    if (!controls.yArrowsDown() && body.vy !== 0) {
      body.ay = 2 * ACCELERATION * Math.sign(body.vy) * - 1;
      if (body.vy > -1.5 && body.vy < 1.5) {
        body.vy = 0;
        body.ay = 0;
      }
    }
    if (body.position.y + body.vy > window.innerHeight - halfHeight ||
        body.position.y + body.vy < 0 + halfHeight ) {
      body.vy = 0;
    } else {
      body.position.y += body.vy;
    }

    body.vx += lastFrameTime * body.ax;
    if ( Math.abs(body.vx) >= MAX_SPEED ) {
      body.vx = MAX_SPEED * Math.sign(body.vx);
    }
    if (!controls.xArrowsDown() && body.vx !== 0) {
      body.ax = 2 * ACCELERATION * Math.sign(body.vx) * - 1;
      if (body.vx > -1 && body.vx < 1) {
        body.vx = 0;
        body.ax = 0;
      }
    }
    if (body.position.x + body.vx > window.innerWidth - halfWidth ||
        body.position.x + body.vx < halfWidth - 9 ) {
      body.vx = 0;
    } else {
      body.position.x += body.vx;
    }

    body.vy !== 0 || body.vx !==0
      ? body.play()
      : body.stop();

    if (body.vx > 0 ) body.scale.x = 1;
    if (body.vx < 0 ) body.scale.x = -1;

  }


  const init = () => undefined ;
  return {
    init,
    update,
  }
}

export default Player;
