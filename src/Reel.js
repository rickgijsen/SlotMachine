import Phaser from 'phaser'

// this class creates a reel filled with slots, the class has a spin function that will make the reel spin
export default class extends Phaser.Group {
  constructor ({game, x, y, reelNumber}) {
    super(game);
    this.reelX = x;
    this.reelY = y;
    this.reelNumber = reelNumber + 1;
    this.init();
  }

  init () {
    this.spinAmount = 0;
    this.slotAmount = 8;
    this.canTween = true;

    // background of the reel
    this.reelbg = new Phaser.Sprite(this.game, this.reelX, this.reelY, 'reelbg');
    this.add(this.reelbg);

    // create a different order of slots for every reel, this makes them fall to the correct slot after spinning
    this.slotNames = [];
    switch (this.reelNumber) {
      case 1:
        this.slotNames[0] = 'crown';
        this.slotNames[1] = 'lemon'; // 1st spin
        this.slotNames[2] = 'ten';
        this.slotNames[3] = 'seven';
        this.slotNames[4] = 'crown';
        this.slotNames[5] = 'diamond'; // 3rd spin
        this.slotNames[6] = 'bar';
        this.slotNames[7] = 'melon'; // 2nd spin
        break;
      case 2:
        this.slotNames[0] = 'melon';
        this.slotNames[1] = 'bar'; // 1st spin
        this.slotNames[2] = 'seven';
        this.slotNames[3] = 'crown';
        this.slotNames[4] = 'melon';
        this.slotNames[5] = 'diamond'; // 3rd spin
        this.slotNames[6] = 'lemon';
        this.slotNames[7] = 'ten'; // 2nd spin
        break;
      case 3:
        this.slotNames[0] = 'ten';
        this.slotNames[1] = 'bar'; // 1st spin
        this.slotNames[2] = 'melon';
        this.slotNames[3] = 'lemon';
        this.slotNames[4] = 'ten';
        this.slotNames[5] = 'diamond'; // 3rd spin
        this.slotNames[6] = 'crown';
        this.slotNames[7] = 'diamond'; // 2nd spin
        break;
      case 4:
        this.slotNames[0] = 'seven';
        this.slotNames[1] = 'bar'; // 1st spin
        this.slotNames[2] = 'melon';
        this.slotNames[3] = 'crown';
        this.slotNames[4] = 'seven';
        this.slotNames[5] = 'diamond'; // 3rd spin
        this.slotNames[6] = 'lemon';
        this.slotNames[7] = 'crown'; // 2nd spin
        break;
    }
    // create all slots in this reel
    this.slotMiddle = this.reelY + (this.reelbg.height / 2);
    this.slotOffset = 90;
    this.slots = [];
    for (let i = 0; i < this.slotAmount; i++) {
      this.slots[i] = new Phaser.Sprite(this.game, this.reelX + 56, this.slotMiddle - (this.slotOffset * 3) + (i * this.slotOffset), this.slotNames[i]);
      this.slots[i].anchor.setTo(0.5);
      this.add(this.slots[i]);
    }

    // masks all drawn graphics
    this.mask1 = this.game.add.graphics(0, 0);
    this.mask1.beginFill(0xffffff);
    this.mask1.drawRect(this.reelX + 10, this.reelY + 10, 94, 270);
    for (let i = 0; i < this.slotAmount; i++) {
      this.slots[i].mask = this.mask1;
    }

    // Excludes the reel background from the mask
    this.mask2 = this.game.add.graphics(0, 0);
    this.mask2.beginFill(0xffffff);
    this.mask2.drawRect(0, 0, 1280, 720);
    this.reelbg.mask = this.mask2;

    this.reelOverlay = new Phaser.Sprite(this.game, this.reelX + 10, this.reelY + 10, 'reelOverlay');
    this.add(this.reelOverlay);
  }

  spin (amount, reelNumber, spinNumber) {
    // take all the slots and tween them one position down, the lowest slot gets moved to the top
    for (let i = 0; i < this.slotAmount; i++) {
      if (this.slots[i].y >= this.slotMiddle + (this.slotOffset * 5)) {
        // move slot from bottom to top
        this.slots[i].y = this.slotMiddle - (this.slotOffset * 3);
      }
      // spin
      this.slotTweens = this.game.add.tween(this.slots[i]).to({y: this.slots[i].y + 90}, 50, Phaser.Easing.Linear.Out, true);
    }
    this.spinAmount++;
    // check if the reel should spin more
    if (this.spinAmount < amount) {
      // keep spinning
      this.slotTweens.onComplete.add(function () { this.spin(amount, reelNumber, spinNumber); }, this);
    } else {
      for (let i = 0; i < this.slotAmount; i++) {
        // move slot from bottom to top
        if (this.slots[i].y >= this.slotMiddle + (this.slotOffset * 5)) {
          this.slots[i].y = this.slotMiddle - (this.slotOffset * 3);
        }
        // end spin
        this.slotTweens = this.game.add.tween(this.slots[i]).to({y: this.slots[i].y + 90}, 500, Phaser.Easing.Bounce.Out, true);
        this.spinAmount = 0;
        if (this.reelNumber === 4) {
          this.slotTweens.onComplete.add(() => {
            this.game.onAfterSpin.dispatch(spinNumber);
          })
        }
      }
    }
  }
  update () {
  }
}
