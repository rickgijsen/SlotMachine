import Phaser from 'phaser'

export default class extends Phaser.Group {
  constructor ({ game, x, y, numberPosition }) {
    super(game)
    this.numberX = x;
    this.numberY = y;
    this.numberPosition = numberPosition;
    this.init();
  }
  init () {
    this.score = 0;

    this.number = new Phaser.Sprite(this.game, this.numberX, this.numberY, 'numbers', this.numberInScore);
    this.game.add.existing(this.number);
  }
  update () {
    this.score++;
    this.numberInScore = (Math.floor((this.score / (Math.pow(10, this.numberPosition))))) % 10;
    this.number.frame = this.numberInScore;
  }
  addScore (score) {
    this.score += score;
  }
}
