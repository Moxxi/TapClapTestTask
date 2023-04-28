import LayerService from './LayerService.js';
import Game from '../Game.config.js';

export default class SceneService {
  constructor() {
    this.scenes = new Map();
    this.LayerService = new LayerService();
  }

  createScene(tag) {
    const layerTag = this.LayerService.createLayer(tag);
    Game.scenes[`scene_${tag}`] = {};
    Game.scenes[`scene_${tag}`].extend = cc.Scene.extend({
      onEnter() {
        this._super();
        this.tag = `scene_${tag}`;
        const layer = new Game.layers[layerTag].extend();
        layer.init();
        this.addChild(layer);
      },
    });

    return `scene_${tag}`;
  }
}
