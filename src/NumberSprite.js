import Phaser from 'phaser'

// this class changes the sprite according to the number in the score, it also places comma's
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
    this.targetScore = 0;
    this.canAddComma = [];
    for (let i = 3; i <= 9; i += 3) {
      this.canAddComma[i] = true;
    }

    this.number = new Phaser.Sprite(this.game, this.numberX, this.numberY, 'numbers', this.numberInScore);
    this.game.add.existing(this.number);
  }
  update () {
    // counts the score up to the target score
    if (this.score < this.targetScore) {
      this.score += 3456789;
    } else {
      this.score = this.targetScore;
    }
    // adds comma's after each set of 3 numbers
    for (let i = 3; i <= 9; i += 3) {
      if (this.score.toString().length > i && this.canAddComma[i]) {
        if (this.numberPosition === i) {
          this.canAddComma[i] = false;
          this.comma = new Phaser.Sprite(this.game, this.number.x + 4, 619, 'numbers', 10);
          this.game.add.existing(this.comma);
        }
      }
    }
    // only shows the numbers if the score is long enough
    if (this.score.toString().length - 1 < this.numberPosition) {
      this.number.visible = false;
    } else {
      this.number.visible = true;
    }

    // change the number according to the score
    this.numberInScore = (Math.floor((this.score / (Math.pow(10, this.numberPosition))))) % 10;
    this.number.frame = this.numberInScore;
  }
  addScore (score) {
    this.targetScore += score;
  }
}
