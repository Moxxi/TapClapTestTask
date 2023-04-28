import Game from '../Game.config.js';
import { matrixService } from '../GameController.js';
import { gameOver, jump, win } from './events.js';
import audioService from '../services/AudioService.js';

export const renderGameScene = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan(touch, event) {
    const target = event.getCurrentTarget();
    const location = target.convertToNodeSpace(touch.getLocation());
    const targetSize = target.getContentSize();
    const targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
    if (cc.rectContainsPoint(targetRectangle, location)) {
      cc.LoaderScene.preload(Game.g_resources, () => {
        cc.director.runScene(new Game.scenes.scene_GAME.extend());
      }, this);
    }
  },
});

export const touchBlockListener = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan(touch, event) {
    const target = event.getCurrentTarget();
    const location = target.convertToNodeSpace(touch.getLocation());
    const targetSize = target.getContentSize();
    const targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
    if (cc.rectContainsPoint(targetRectangle, location)) {
      if (!Game.state.canClick || Game.state.isEnd) return;
      Game.state.canClick = false;

      matrixService.checkIsPossibleToPlay();

      const { x, y } = matrixService.findByTag(target.getTag());

      if (Game.state.tpEnable) {
        if (Game.tpTarget === null) {
          Game.tpTarget = {
            sprite: target,
            x,
            y,
          };
          Game.state.canClick = true;
          return;
        }

        const { id } = Game.matrix[Game.tpTarget.y][Game.tpTarget.x];
        const { color } = Game.matrix[Game.tpTarget.y][Game.tpTarget.x];
        Game.matrix[Game.tpTarget.y][Game.tpTarget.x].id = Game.matrix[y][x].id;
        Game.matrix[Game.tpTarget.y][Game.tpTarget.x].color = Game.matrix[y][x].color;
        Game.matrix[y][x].id = id;
        Game.matrix[y][x].color = color;

        audioService.playTp();
        const effect = cc.Sprite.create(Game.res.effect);
        effect.attr({
          x: Game.background.x,
          y: Game.background.y,
          scale: 0.5,
        });
        Game.gameLayer.addChild(effect);

        effect.runAction(new cc.rotateBy(3, 900));
        effect.runAction(new cc.FadeOut(3));
        Game.tpTarget.sprite.runAction(new cc.MoveTo(1, target.x, target.y));
        target.runAction(new cc.MoveTo(1, Game.matrix[Game.tpTarget.y][Game.tpTarget.x].posX, Game.matrix[Game.tpTarget.y][Game.tpTarget.x].posY));
        Game.gameLayer.removeChildByTag('tp');
        Game.state.canClick = true;
        Game.state.tpEnable = false;
        Game.tpTarget = null;
        return;
      }

      if (Game.state.bombEnable) {
        audioService.playBoom();
        const expl = cc.Sprite.create(Game.res.expl);
        expl.attr({
          x: Game.bomb.x,
          y: Game.bomb.y,
        });
        Game.bomb.addChild(expl);
        Game.bomb.runAction(new cc.FadeOut(0.7));
        expl.runAction(new cc.FadeOut(0.7));
        matrixService.blowUpBomb(y, x);
        Game.gameLayer.removeChild('bomb');
        Game.state.canClick = true;
        Game.state.bombEnable = false;
        return;
      }

      Game.subjects = new Map();
      matrixService.checkAround(y, x);

      if (Game.subjects.size < Game.res.K) {
        target.runAction(new cc.MoveBy(0.3, cc.p(0, 50)));
        setTimeout(() => {
          target.runAction(new cc.MoveBy(0.3, cc.p(0, -50)));
        }, 350);
        Game.state.canClick = true;
        return;
      }

      if (Game.subjects.size > Game.res.K) {
        Game.config.moneyCounter += Game.subjects.size;
        Game.moneyCount.setString(Game.config.moneyCounter.toString());
      }

      Game.config.counterToLose--;
      Game.toLose.setString(`${Game.config.counterToLose}`);

      Game.config.counterScore += (Game.subjects.size * ((Game.subjects.size / 100) + 1)) * 100;
      Game.score.setString(`ОЧКИ:\n ${Game.config.counterScore}`);

      Game.green.runAction(new cc.ScaleTo(1, Math.min(1.7 * Game.config.counterScore / Game.config.needToWinCounter, 1.7), 0.55));

      Game.subjects.forEach((item) => {
        Game.background.removeChildByTag(item.id);
        Game.matrix[item.y][item.x].color = null;
        Game.matrix[item.y][item.x].id = null;
        audioService.playBoop();

        if (Game.borderLeft === null) Game.borderLeft = item.x;
        if (Game.borderRight === null) Game.borderRight = item.x;

        if (Game.borderLeft > item.x) Game.borderLeft = item.x;
        if (Game.borderRight < item.x) Game.borderRight = item.x;
      });

      matrixService.moveAllDown();
      matrixService.generateNewBlocks();
      setTimeout(() => {
        Game.state.canClick = true;
      }, 1000);

      if (Game.config.counterToLose === 0) {
        if (Game.config.counterScore < Game.config.needToWinCounter) {
          gameOver();
        } else {
          win();
        }
      }
    }
  },
});

export const touchBomb = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan(touch, event) {
    const target = event.getCurrentTarget();
    const location = target.convertToNodeSpace(touch.getLocation());
    const targetSize = target.getContentSize();
    const targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
    if (cc.rectContainsPoint(targetRectangle, location)) {
      if (Game.config.moneyCounter < Game.config.bombCost) {
        jump(Game.moneySprite);
        return;
      }
      Game.config.moneyCounter -= Game.config.bombCost;
      Game.moneyCount.setString(Game.config.moneyCounter.toString());

      target.setOpacity(0);
      target.removeChildByTag('bomb_cost');
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseMove(event) {
          Game.bomb.setPosition(event.getLocationX() / 0.9, event.getLocationY() / 0.9);
        },
      }, target);
      Game.state.bombEnable = true;
    }
  },
});

export const touchTp = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan(touch, event) {
    const target = event.getCurrentTarget();
    const location = target.convertToNodeSpace(touch.getLocation());
    const targetSize = target.getContentSize();
    const targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
    if (cc.rectContainsPoint(targetRectangle, location)) {
      if (Game.config.moneyCounter < Game.config.tpCost) {
        jump(Game.moneySprite);
        return;
      }
      Game.config.moneyCounter -= Game.config.tpCost;
      Game.moneyCount.setString(Game.config.moneyCounter.toString());

      target.setOpacity(0);
      target.removeChildByTag('tp_cost');
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseMove(event) {
          Game.tp.setPosition(event.getLocationX() / 0.9, event.getLocationY() / 0.9);
        },
      }, target);
      Game.state.tpEnable = true;
    }
  },
});

export const touchPause = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan(touch, event) {
    const target = event.getCurrentTarget();
    const location = target.convertToNodeSpace(touch.getLocation());
    const targetSize = target.getContentSize();
    const targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
    if (cc.rectContainsPoint(targetRectangle, location)) {
      Game.matrix = Game.matrix.reverse();
      cc.LoaderScene.preload(Game.g_resources, () => {
        cc.director.runScene(new Game.scenes.scene_PAUSE.extend());
      }, this);
    }
  },
});

export const renderMoney = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan(touch, event) {
    const target = event.getCurrentTarget();
    const location = target.convertToNodeSpace(touch.getLocation());
    const targetSize = target.getContentSize();
    const targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
    if (cc.rectContainsPoint(targetRectangle, location)) {
      Game.matrix = Game.matrix.reverse();
      cc.LoaderScene.preload(Game.g_resources, () => {
        cc.director.runScene(new Game.scenes.scene_MONEY.extend());
      }, this);
    }
  },
});

export const moneyButton = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan(touch, event) {
    const target = event.getCurrentTarget();
    const location = target.convertToNodeSpace(touch.getLocation());
    const targetSize = target.getContentSize();
    const targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
    if (cc.rectContainsPoint(targetRectangle, location)) {
      Game.config.moneyCounter += 10;
      Game.moneyCount2.setString(`Баланс: ${Game.config.moneyCounter}`);
    }
  },
});

export const newGame = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan(touch, event) {
    const target = event.getCurrentTarget();
    const location = target.convertToNodeSpace(touch.getLocation());
    const targetSize = target.getContentSize();
    const targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
    if (cc.rectContainsPoint(targetRectangle, location)) {
      Game.config.counterToLose = 10;
      Game.config.counterScore = 0;
      matrixService.newGame();
      Game.state.canClick = true;
      Game.state.isEnd = false;
      cc.LoaderScene.preload(Game.g_resources, () => {
        cc.director.runScene(new Game.scenes.scene_GAME.extend());
      }, this);
    }
  },
});
