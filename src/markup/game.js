import Game from '../Game.config.js';
import {
  renderMoney, touchBlockListener, touchBomb, touchPause, touchTp,
} from '../utils/listeners.js';

export default function initGameScene(game) {
  const fontName = Game.res.Custom_font.name;
  const size = cc.director.getWinSize();
  const colorLayer = new cc.LayerColor(cc.color(32, 84, 154, -1), size.width, size.height);

  const background = cc.Sprite.create(Game.res.background);
  const pause = cc.Sprite.create(Game.res.pause);
  const points_bar = cc.Sprite.create(Game.res.points_main);
  const bonus = cc.Sprite.create(Game.res.points_main);
  const bonus_block1 = cc.Sprite.create(Game.res.bonus);
  const bonus_cost_1 = cc.Sprite.create(Game.res.bonus_cost);
  const bomb = cc.Sprite.create(Game.res.bomb);
  const tp = cc.Sprite.create(Game.res.tp);
  const bonus_cost_2 = cc.Sprite.create(Game.res.bonus_cost);
  const bonus_block2 = cc.Sprite.create(Game.res.bonus);
  const moneys_cost_1 = cc.Sprite.create(Game.res.money);
  const moneys_cost_2 = cc.Sprite.create(Game.res.money);
  const points = cc.Sprite.create(Game.res.points);
  const ball = cc.Sprite.create(Game.res.ball);
  const header = cc.Sprite.create(Game.res.header);
  const money_holder = cc.Sprite.create(Game.res.money_holder);
  const money = cc.Sprite.create(Game.res.money);
  const plus = cc.Sprite.create(Game.res.plus);
  const top = cc.Sprite.create(Game.res.top_background);
  const line_back = cc.Sprite.create(Game.res.line_back);
  const green_line = cc.Sprite.create(Game.res.green_line);

  const bonusCost1 = cc.LabelTTF.create(`${Game.config.bombCost}`, fontName, 90);
  const bonusText = cc.LabelTTF.create('БОНУСЫ', fontName, 120);
  const bonusCost2 = cc.LabelTTF.create(`${Game.config.tpCost}`, fontName, 90);
  const progress = cc.LabelTTF.create('Прогресс', fontName, 60);
  const moneyCount = cc.LabelTTF.create(`${Game.config.moneyCounter}`, fontName, 95);
  const toLose = cc.LabelTTF.create(`${Game.config.counterToLose}`, fontName, 350);
  const score = cc.LabelTTF.create(`ОЧКИ:\n ${Game.config.counterScore}`, fontName, 95);

  pause.attr({
    x: size.width,
    y: size.height,
    scaleX: 0.3,
    scaleY: 0.3,
    anchorX: 1,
    anchorY: 1,
  });

  points_bar.attr({
    x: size.width / 1.4,
    y: size.height / 1.75,
    scaleX: 0.3,
    scaleY: 0.3,
  });

  bonus.attr({
    x: size.width / 1.4,
    y: size.height / 5,
    scaleX: 0.3,
    scaleY: 0.2,
  });

  bonus_block1.attr({
    x: bonus.width / 3.5,
    y: bonus.height / 2.8,
    tag: 'bomb_bonus',
    scaleX: 1,
    scaleY: 1.5,
  });

  bonus_cost_1.attr({
    x: bonus_block1.width / 2,
    y: bonus_block1.height / 3.2,
    tag: 'bomb_cost',
    scaleX: 1.1,
    scaleY: 1.1,
  });

  bonus_block2.attr({
    x: bonus.width / 1.4,
    y: bonus.height / 2.8,
    scaleX: 1,
    scaleY: 1.5,
  });

  bonus_cost_2.attr({
    x: bonus_block2.width / 2,
    y: bonus_block2.height / 3.2,
    tag: 'tp_cost',
    scaleX: 1.1,
    scaleY: 1.1,
  });

  bomb.attr({
    x: bonus.x / 1.15,
    y: bonus.y / 1.09,
    tag: 'bomb',
    scaleX: 0.05,
    scaleY: 0.05,
  });

  tp.attr({
    tag: 'tp',
    x: bonus.x * 1.13,
    y: bonus.y / 1.09,
    scaleX: 0.3,
    scaleY: 0.3,
  });

  moneys_cost_1.attr({
    x: bonus_cost_1.width / 1.3,
    y: bonus_cost_1.height / 2,
    scaleX: 0.55,
    scaleY: 0.55,
  });

  moneys_cost_2.attr({
    x: bonus_cost_2.width / 1.3,
    y: bonus_cost_2.height / 2,
    scaleX: 0.55,
    scaleY: 0.55,
  });

  points.attr({
    x: points_bar.width / 2,
    y: points_bar.height / 4,
    scaleX: 1,
    scaleY: 1,
  });

  ball.attr({
    x: points_bar.width / 2,
    y: points_bar.height / 1.5,
    scaleX: 1,
    scaleY: 1,
  });

  header.attr({
    x: size.width / 2.2,
    y: size.height,
    scaleX: 0.25,
    scaleY: 0.25,
    anchorY: 1,
  });

  money_holder.attr({
    tag: 'money',
    x: header.width / 1.30,
    y: header.height / 2,
    scaleX: 1.2,
    scaleY: 1.2,
  });

  money.attr({
    x: money.width / 3.75,
    y: money.height / 2,
    scaleX: 0.75,
    scaleY: 0.75,
  });

  plus.attr({
    x: header.width / 1.1,
    y: header.height / 2,
    scaleX: 1.3,
    scaleY: 1.3,
  });

  top.attr({
    x: header.width / 2.95,
    y: size.height / 2,
    scaleX: 1.3,
    scaleY: 2.2,
  });

  line_back.attr({
    x: top.width / 2,
    y: top.height / 5,
    scaleX: 1,
    scaleY: 0.50,
  });

  green_line.attr({
    tag: 'green',
    x: top.width / 23,
    y: top.height / 5,
    anchorX: 0,
    scaleX: Math.min(1.7 * Game.config.counterScore / Game.config.needToWinCounter, 1.7),
    scaleY: 0.55,
  });

  background.attr({
    tag: 'background',
    x: size.width / 4,
    y: size.height / 2,
    scale: 0.23,
  });

  moneyCount.setPosition(cc.p(money.width / 0.9, money.height / 3.5));
  toLose.setPosition(cc.p(ball.width / 2, ball.height / 2.5));
  score.setPosition(cc.p(points.width / 2, points.height / 2.5));
  progress.setPosition(top.width / 2, top.height / 2.8);
  bonusCost1.setPosition(bonus_cost_1.width / 3, bonus_cost_1.height / 3);
  bonusCost2.setPosition(bonus_cost_2.width / 3, bonus_cost_2.height / 3);
  bonusText.setPosition(bonus.width / 2, bonus.height / 1.35);

  progress.setScale(1, 0.75);

  ball.addChild(toLose);
  bonus_block2.addChild(bonus_cost_2);

  points_bar.addChild(ball);
  points_bar.addChild(points);
  points.addChild(score);

  bonus_block1.addChild(bonus_cost_1);
  bonus.addChild(bonus_block1);
  bonus.addChild(bonus_block2);

  bonus_cost_1.addChild(moneys_cost_1);
  bonus.addChild(bonusText);
  bonus_cost_2.addChild(bonusCost2);
  bonus_cost_1.addChild(bonusCost1);
  bonus_cost_2.addChild(moneys_cost_2);

  money_holder.addChild(money);
  money_holder.addChild(moneyCount);

  header.addChild(money_holder);
  header.addChild(plus);
  header.addChild(top);

  top.addChild(progress);
  top.addChild(line_back);
  top.addChild(green_line);

  game.addChild(colorLayer);
  game.addChild(bonus);
  game.addChild(points_bar);
  game.addChild(pause);
  game.addChild(header);
  game.addChild(background);
  game.addChild(bomb);
  game.addChild(tp);

  cc.eventManager.addListener(touchBomb.clone(), bonus_block1);
  cc.eventManager.addListener(touchTp.clone(), bonus_block2);
  cc.eventManager.addListener(touchPause.clone(), pause);
  cc.eventManager.addListener(renderMoney.clone(), plus);

  Game.tp = tp;
  Game.bomb = bomb;
  Game.gameLayer = game;
  Game.background = background;
  Game.moneySprite = money;
  Game.moneyCount = moneyCount;
  Game.toLose = toLose;
  Game.green = green_line;
  Game.score = score;

  const tileWidth = (background.width - 100) / Game.res.N;
  const tileHeight = (background.height - 100) / Game.res.M;

  for (let y = 0; y < Game.res.N; y++) {
    for (let x = Game.res.M - 1; x >= 0; x--) {
      const { color } = Game.matrix[y][x];
      const { id } = Game.matrix[y][x];
      Game.matrix[y][x].posX = 50 + x * tileWidth;
      Game.matrix[y][x].posY = 50 + y * tileHeight;

      const block = cc.Sprite.create(Game.res[color]);
      cc.eventManager.addListener(touchBlockListener.clone(), block);

      block.attr({
        tag: id,
        x: 50 + x * tileWidth,
        y: 50 + y * tileHeight,
        scaleX: tileWidth / block.width,
        scaleY: tileHeight / block.height,
        anchorX: 0,
        anchorY: 0,
      });
      background.addChild(block);
    }
  }
  Game.matrix = Game.matrix.reverse();
}
