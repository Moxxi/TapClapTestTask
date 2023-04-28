import Game from '../Game.config.js';
import { moneyButton, renderGameScene } from '../utils/listeners.js';

export default function initMoneyScene(game) {
  const fontName = Game.res.Custom_font.name;
  const size = cc.director.getWinSize();
  game.addChild(new cc.LayerColor(cc.color(32, 84, 154, -1), size.width, size.height));

  const text = cc.LabelTTF.create('Продолжить', fontName, 50);
  const text2 = cc.LabelTTF.create('Кнопка Деньги', fontName, 50);
  const text3 = cc.LabelTTF.create(`Баланс: ${Game.config.moneyCounter}`, fontName, 50);
  const money = cc.Sprite.create(Game.res.money);

  text.attr({
    x: size.width / 2,
    y: size.height / 1.1,
  });

  text2.attr({
    x: size.width / 2,
    y: size.height / 4.5,
  });

  text3.attr({
    x: size.width / 2,
    y: size.height / 7.5,
  });

  money.attr({
    x: size.width / 2,
    y: size.height / 2,
  });

  game.addChild(text);
  game.addChild(text2);
  game.addChild(text3);
  game.addChild(money);
  cc.eventManager.addListener(renderGameScene.clone(), text);
  cc.eventManager.addListener(moneyButton.clone(), money);
  Game.moneyCount2 = text3;
}
