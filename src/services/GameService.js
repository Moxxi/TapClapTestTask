import Game from '../Game.config.js';

export default class GameService {
  constructor(Game) {
    this.Game = Game;
    window.onload = function () {
      cc.game.run('game');
    };
  }

  startScene(scene) {
    cc.game.onStart = function () {
      cc.LoaderScene.preload(Game.g_resources, () => {
        cc.director.runScene(new scene.extend());
      }, this);
    };
  }

  onStart(scene) {
    cc.LoaderScene.preload(Game.g_resources, function () {
      this.cc.director.runScene(scene.extend());
    });
  }
}
