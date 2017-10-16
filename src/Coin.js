import Phaser from 'phaser'

// this class creates a coin that has some random values and spins by animation
export default class extends Phaser.Group {
  constructor ({ game, x, y }) {
    super(game)
    this.coinX = x;
    this.coinY = y;
    this.init();
  }
  init () {
    this.frameNumber = 0;
    this.coin = new Phaser.Sprite(this.game, this.coinX, this.coinY, 'coin', this.frameNumber);
    this.coin.anchor.setTo(0.5);
    this.game.add.existing(this.coin);

    // random speed
    this.speed = Math.floor(Math.random() * (15 - 8 + 1)) + 8;

    // random size
    this.size = Math.random() + 0.5;
    this.coin.width *= this.size;
    this.coin.height *= this.size;

    // random x
    this.positionX = Math.random() * 200;
    this.coin.x += this.positionX;

    // flip animations
    this.coinFlip1 = this.coin.animations.add('flip1');
    this.coinFlip2 = this.coin.animations.add('flip2');

    // start flipping
    this.coinFlip1.onComplete.add(() => {
      this.coin.angle += 180;
      this.coinFlip2.isReversed = true;
      this.coinFlip2.play(30, false);
      this.coinFlip2.frame = 3;
    });
    this.coinFlip2.onComplete.add(() => {
      this.coinFlip1.play(30, false);
      this.coin.angle += 180;
    });
    this.coinFlip1.play(30, false);
  }

  update () {
    // move coin down
    this.coin.y += this.speed;

    // reset coin above screen
    if (this.coin.y > 750) {
      this.coin.y = -50;
    }
  }
}
