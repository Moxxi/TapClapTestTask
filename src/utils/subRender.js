import Game from '../Game.config.js';
import { touchBlockListener } from './listeners.js';

export function createAndMoveBlock(y, x, color, idCounter) {
  const block = cc.Sprite.create(Game.res[color]);

  block.attr({
    tag: idCounter,
    x: Game.matrix[0][x].posX,
    y: Game.matrix[0][x].posY + 300,
    scaleX: (Game.background.width - 100) / Game.res.N / block.width,
    scaleY: (Game.background.height - 100) / Game.res.M / block.height,
    anchorX: 0,
    anchorY: 0,
    opacity: 0,
  });

  cc.eventManager.addListener(touchBlockListener.clone(), block);

  Game.background.addChild(block);
  block.runAction(new cc.MoveTo(1, cc.p(Game.matrix[y][x].posX, Game.matrix[y][x].posY)));

  Game.matrix[y][x].color = color;
  Game.matrix[y][x].id = idCounter;
  idCounter++;

  setTimeout(() => {
    block.runAction(new cc.FadeIn(1));
  }, 300);
}

export function updatePlayground() {
  if (!Game.gameLayer) return;

  for (let y = 0; y < Game.res.N; y++) {
    for (let x = 0; x < Game.res.M; x++) {
      const block = Game.gameLayer.getChildByTag(Game.matrix[y][x].id);
      block.setSprite(Game.res[Game.matrix[y][x].color]);
    }
  }
}
