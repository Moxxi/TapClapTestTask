import Game from '../Game.config.js';

class AudioService {
  constructor() {
    this.Audio = Audio;
    this.volume = 0.2;
  }

  playBoom() {
    const audio = new this.Audio(Game.res.audio.boom);
    audio.volume = this.volume;
    audio.play();
  }

  playBoop() {
    const audio = new this.Audio(Game.res.audio.boop);
    audio.volume = this.volume;
    audio.play();
  }

  playWin() {
    const audio = new this.Audio(Game.res.audio.win);
    audio.volume = this.volume;
    audio.play();
  }

  playGameOver() {
    const audio = new this.Audio(Game.res.audio.gameover);
    audio.volume = this.volume;
    audio.play();
  }

  playTp() {
    const audio = new this.Audio(Game.res.audio.tp);
    audio.volume = this.volume;
    audio.play();
  }
}

const audioService = new AudioService();

export default audioService;
