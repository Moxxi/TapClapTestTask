import Game from '../Game.config.js';
import { newGame, renderGameScene } from '../utils/listeners.js';

export default function initPauseScene(game) {
  const fontName = Game.res.Custom_font.name;

  const size = cc.director.getWinSize();
  game.addChild(new cc.LayerColor(cc.color(32, 84, 154, -1), size.width, size.height));

  const text = cc.LabelTTF.create('Продолжить', fontName, 50);
  text.setPosition(size.width / 2, size.height / 1.1);
  game.addChild(text);

  const text2 = cc.LabelTTF.create('Новая Игра', fontName, 50);
  text2.setPosition(size.width / 2, size.height / 1.3);
  game.addChild(text2);

  const text3 = cc.LabelTTF.create(`Параметры:\nN: ${Game.res.N}\nM: ${Game.res.N}\nC: ${Game.res.C}\nK: ${Game.res.K}\nR: ${Game.res.R}\n`, fontName, 50);
  text3.setPosition(size.width / 2, size.height / 2.7);
  game.addChild(text3);

  cc.eventManager.addListener(renderGameScene.clone(), text);
  cc.eventManager.addListener(newGame.clone(), text2);
}
