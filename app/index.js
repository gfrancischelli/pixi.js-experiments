import PIXI from 'pixi.js';
import keyboard from './keyboard';
import Player from './player';
const P = window.PIXI;




const FISH = "assets/fish.json";


function Game(loader, resources) {
  const game = new P.Application(
    window.innerWidth,
    window.innerHeight
  );

  console.log(resources)
  document.body.appendChild(game.view);

  const Mario = Player(game, resources);

  console.log(game.stage)
  game.ticker.add(function() {
    Mario.update(game.ticker.elapsedMS);
  })

};

P.loader
  .add(FISH)
  .load(Game);




