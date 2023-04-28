import Game from '../Game.config.js';
import initStartScene from '../markup/start.js';
import initGameScene from '../markup/game.js';
import initMoneyScene from '../markup/money.js';
import initPauseScene from '../markup/pause.js';

export default class LayerService {
  constructor() {
    this.START = initStartScene;
    this.GAME = initGameScene;
    this.MONEY = initMoneyScene;
    this.PAUSE = initPauseScene;
  }

  createLayer(tag) {
    const upperScope = this;
    Game.layers[`layer_${tag}`] = {};
    Game.layers[`layer_${tag}`].extend = cc.Layer.extend({
      init() {
        this._super();
        this.tag = `layer_${tag}`;
        upperScope[tag](this);
      },
    });

    return `layer_${tag}`;
  }
}
