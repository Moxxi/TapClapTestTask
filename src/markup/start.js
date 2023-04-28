import Game from '../Game.config.js';
import { renderGameScene } from '../utils/listeners.js';

export default function initStartScene(game) {
  const fontName = Game.res.Custom_font.name;

  const size = cc.director.getWinSize();
  const text = cc.LabelTTF.create('TAPCLAP', fontName, 50);
  const text2 = cc.LabelTTF.create('Тестовое Задание', fontName, 50);
  const play = cc.Sprite.create(Game.res.play);
  play.attr({
    x: size.width / 2,
    y: size.height / 2.3,
    scale: 0.3,
  });
  const text3 = cc.LabelTTF.create('Играть', fontName, 50);

  text.setPosition(size.width / 2, size.height / 1.3);
  text2.setPosition(size.width / 2, size.height / 1.3 - text.height);
  text3.setPosition(size.width / 2, size.height / 4);
  game.addChild(new cc.LayerColor(cc.color(32, 84, 154, -1), size.width, size.height));

  game.addChild(text);
  game.addChild(text2);
  game.addChild(text3);
  game.addChild(play);

  cc.eventManager.addListener(renderGameScene.clone(), text3);
  cc.eventManager.addListener(renderGameScene.clone(), play);
}
