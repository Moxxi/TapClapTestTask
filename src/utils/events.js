import Game from '../Game.config.js';
import audioService from '../services/AudioService.js';
import { newGame } from './listeners.js';

const fontName = Game.res.Custom_font.name;

export function gameOver() {
  const size = cc.director.getWinSize();
  const loseText = cc.LabelTTF.create('Игра Окончена', fontName, 100);
  loseText.setPosition(size.width / 2, size.height / 2 - 100);
  loseText.setOpacity(0);
  Game.gameLayer.addChild(loseText);
  audioService.playGameOver();
  loseText.runAction(new cc.MoveTo(3, size.width / 2, size.height * 0.8));
  loseText.runAction(new cc.FadeIn(3));
  Game.state.canClick = false;
  Game.state.isEnd = true;
  cc.eventManager.addListener(newGame.clone(), loseText);
}

export function win() {
  const size = cc.director.getWinSize();
  const winText = cc.LabelTTF.create('Ты Выиграл', fontName, 100);
  winText.setPosition(size.width / 2, size.height / 2 - 100);
  winText.setOpacity(0);
  Game.gameLayer.addChild(winText);
  audioService.playWin();
  winText.runAction(new cc.MoveTo(3, size.width / 2, size.height * 0.8));
  winText.runAction(new cc.FadeIn(3));
  Game.state.canClick = false;
  Game.state.isEnd = true;
  cc.eventManager.addListener(newGame.clone(), winText);
}

export function jump(sprite) {
  sprite.runAction(new cc.MoveBy(0.3, cc.p(0, 50)));
  setTimeout(() => {
    sprite.runAction(new cc.MoveBy(0.3, cc.p(0, -50)));
  }, 350);
}
