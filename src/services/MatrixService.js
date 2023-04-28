import Game from '../Game.config.js';
import { createAndMoveBlock } from '../utils/subRender.js';
import { gameOver, win } from '../utils/events.js';

export default class MatrixService {
  constructor() {
    Game.matrix = [];
    this.matrix = [];
    this.init();
  }

  init() {
    for (let y = 0; y < Game.res.N; y++) {
      const row = [];
      for (let x = 0; x < Game.res.M; x++) {
        const color = this.getRandomInt(Game.res.C);
        const id = Game.config.idCounter;
        Game.config.idCounter++;
        row.push({
          id,
          color,
        });
      }
      Game.matrix.push(row);
    }
  }

  sync() {
    this.matrix = Game.matrix;
  }

  newGame() {
    for (let y = 0; y < Game.res.N; y++) {
      for (let x = 0; x < Game.res.M; x++) {
        Game.matrix[y][x].color = this.getRandomInt(Game.res.C);
      }
    }
  }

  generateNewBlocks() {
    for (let x = Game.borderLeft; x <= Game.borderRight; x++) { // x
      for (let y = Game.res.N - 1; y >= 0; y--) { // y
        if (Game.matrix[y][x].color !== null) {
          continue;
        }
        const color = this.getRandomInt(Game.res.C);
        createAndMoveBlock(y, x, color, Game.config.idCounter);
        Game.config.idCounter += 1;
      }
    }
  }

  blowUpBomb(Y, X) {
    const R = Game.res.R - 1;
    let x_start = X - R; let
      x_end = X + R;
    let y_start = Y - R; let
      y_end = Y + R;
    if (x_start < 0) x_start = 0;
    if (y_start < 0) y_start = 0;
    if (x_end >= Game.res.M) x_end = Game.res.M - 1;
    if (y_end >= Game.res.N) y_end = Game.res.N - 1;

    for (let y = y_start; y <= y_end; y++) {
      for (let x = x_start; x <= x_end; x++) {
        Game.counterScore += 100;
        const item = Game.matrix[y][x];
        Game.background.removeChildByTag(item.id);
        Game.matrix[y][x].color = null;
        Game.matrix[y][x].id = null;
        if (Game.borderLeft === null) Game.borderLeft = x;
        if (Game.borderRight === null) Game.borderRight = x;
        if (Game.borderLeft > x) Game.borderLeft = x;
        if (Game.borderRight < x) Game.borderRight = x;
      }
    }

    Game.config.counterToLose--;
    Game.green.runAction(new cc.ScaleTo(1, Math.min(1.7 * Game.config.counterScore / Game.config.needToWinCounter, 1.7), 0.55));
    Game.score.setString(`ОЧКИ:\n ${Game.config.counterScore}`);
    Game.toLose.setString(`${Game.config.counterToLose}`);

    this.moveAllDown();
    this.generateNewBlocks();

    if (Game.config.counterToLose === 0) {
      if (Game.config.counterScore < Game.config.needToWinCounter) {
        gameOver();
      } else {
        win();
      }
    }
  }

  moveAllDown() {
    for (let x = Game.borderLeft; x <= Game.borderRight; x++) { // x
      for (let y = Game.res.N - 1; y >= 0; y--) { // y
        if (Game.matrix[y][x].color !== null) {
          continue;
        }

        let nonHoleX = null; let
          nonHoleY = null;
        for (let k = y; k >= 0; k--) { // y
          if (Game.matrix[k][x].color === null) continue;
          nonHoleY = k; // y
          nonHoleX = x; // x
          break;
        }
        if (nonHoleX === null) continue;

        const subToMove = Game.matrix[nonHoleY][nonHoleX];
        const spriteToMove = Game.background.getChildByTag(subToMove.id);

        spriteToMove.runAction(new cc.MoveTo(1, cc.p(Game.matrix[y][x].posX, Game.matrix[y][x].posY)));

        Game.matrix[y][x].color = Game.matrix[nonHoleY][nonHoleX].color;
        Game.matrix[y][x].id = Game.matrix[nonHoleY][nonHoleX].id;
        Game.matrix[nonHoleY][nonHoleX].color = null;
        Game.matrix[nonHoleY][nonHoleX].id = null;
      }
    }
  }

  checkIsPossibleToPlay() {
    let canPlay = false;
    for (let s = 0; s < Game.res.S; s++) {
      this.sync();
      for (let y = 0; y < Game.res.N; y++) {
        for (let x = 0; x < Game.res.M; x++) {
          Game.subjects = new Map();
          this.checkAround(y, x);
          if (Game.subjects.size >= Game.res.K) {
            canPlay = true;
            break;
          }
        }
      }
      if (!canPlay) {
        this.newGame();
      } else break;
    }
    if (!canPlay) {
      gameOver();
    }
  }

  returnMaxK() {
    let maxK = 0;
    for (let y = 0; y < Game.res.N; y++) {
      for (let x = 0; x < Game.res.M; x++) {
        Game.subjects = new Map();
        this.checkAround(y, x);
        if (maxK < Game.subjects.size) {
          maxK = Game.subjects.size;
        }
      }
    }
    return maxK;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  checkAround(y, x) {
    if (y >= Game.res.N || x >= Game.res.M) return;
    const sub = Game.matrix[y][x];

    Game.subjects.set(sub.id, {
      id: sub.id,
      color: sub.color,
      x,
      y,
    });

    if (sub.color === Game.matrix[y + 1]?.[x]?.color) {
      if (Game.matrix[y + 1]?.[x].id && !Game.subjects.has(Game.matrix[y + 1]?.[x].id)) {
        this.checkAround(y + 1, x);
      }
    }

    if (sub.color === Game.matrix[y - 1]?.[x]?.color) {
      if (Game.matrix[y - 1]?.[x].id && !Game.subjects.has(Game.matrix[y - 1]?.[x].id)) {
        this.checkAround(y - 1, x);
      }
    }

    if (sub.color === Game.matrix[y]?.[x + 1]?.color) {
      if (Game.matrix[y]?.[x + 1].id && !Game.subjects.has(Game.matrix[y]?.[x + 1].id)) {
        this.checkAround(y, x + 1);
      }
    }

    if (sub.color === Game.matrix[y]?.[x - 1]?.color) {
      if (Game.matrix[y]?.[x - 1].id && !Game.subjects.has(Game.matrix[y]?.[x - 1].id)) {
        this.checkAround(y, x - 1);
      }
    }
  }

  reverse() {
    Game.matrix = Game.matrix.reverse();
  }

  findByTag(tag) {
    for (let y = 0; y < Game.res.N; y++) {
      for (let x = 0; x < Game.res.M; x++) {
        if (this.matrix[y][x].id === tag) {
          return {
            matrix: this.matrix[y][x],
            x,
            y,
          };
        }
      }
    }
    return {
      matrix: null,
      x: null,
      y: null,
    };
  }
}
