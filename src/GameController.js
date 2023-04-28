import GameService from './services/GameService.js';
import SceneService from './services/ScenceService.js';
import MatrixService from './services/MatrixService.js';
import Game from './Game.config.js';

export const matrixService = new MatrixService();

export class GameController {
  constructor() {
    this.SceneService = new SceneService();
    this.GameService = new GameService();
    this.MatrixService = matrixService;
  }

  initGame() {
    Game.scenesForInit.forEach((tag) => {
      this.SceneService.createScene(tag);
    });
    this.GameService.startScene(Game.scenes.scene_START);
    this.MatrixService.sync();
  }
}
