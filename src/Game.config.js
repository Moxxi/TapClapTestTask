const Game = {};

Game.scenesForInit = ['START', 'GAME', 'PAUSE', 'MONEY'];
Game.g_resources = [];
Game.scenes = [];
Game.layers = [];

Game.res = {
  N: 10,
  M: 10,
  C: 5,
  K: 3,
  R: 2,
  S: 3,
  0: 'src/sprites/blocks/blue.png',
  1: 'src/sprites/blocks/red.png',
  2: 'src/sprites/blocks/green.png',
  3: 'src/sprites/blocks/purple.png',
  4: 'src/sprites/blocks/yellow.png',
  tp: 'src/sprites/bonus/tp.png',
  bomb: 'src/sprites/bonus/bomb.png',
  expl: 'src/sprites/bonus/expl.png',
  bonus: 'src/sprites/bonus/bonus.png',
  plus: 'src/sprites/interface/plus.png',
  play: 'src/sprites/interface/play.png',
  effect: 'src/sprites/bonus/effect.png',
  ball: 'src/sprites/interface/ball.png',
  money: 'src/sprites/interface/money.png',
  pause: 'src/sprites/interface/pause.png',
  header: 'src/sprites/interface/header.png',
  points: 'src/sprites/interface/points.png',
  bonus_cost: 'src/sprites/bonus/bonus_cost.png',
  background: 'src/sprites/interface/background.png',
  top_background: 'src/sprites/interface/top_back.png',
  line_back: 'src/sprites/interface/top_line_back.png',
  points_main: 'src/sprites/interface/points_main.png',
  green_line: 'src/sprites/interface/top_line_green.png',
  money_holder: 'src/sprites/interface/money_holder.png',
  Custom_font: {
    type: 'font',
    name: 'CustomFont',
    srcs: ['src/fonts/font.ttf'],
  },
  audio: {
    boop: 'src/audio/mp3/boop.mp3',
    win: 'src/audio/mp3/win.mp3',
    gameover: 'src/audio/mp3/gameover.mp3',
    boom: 'src/audio/wav/boom.wav',
    tp: 'src/audio/wav/tp.wav',
  },
};

Game.config = {
  bombCost: 5,
  tpCost: 5,
  moneyCounter: 0,
  counterToLose: 10,
  counterScore: 0,
  needToWinCounter: 5000,
  idCounter: 0,
};

Game.state = {
  canClick: true,
  tpEnable: false,
  bombEnable: false,
  isEnd: false,
};

Game.borderLeft = null;
Game.tpTarget = null;
Game.borderRight = null;
Game.subjects = null;

for (const i in Game.res) {
  Game.g_resources.push(Game.res[i]);
}

export default Game;
