/* globals __DEV__ */
import Phaser from 'phaser'
import Reel from '../Reel'
import NumberSprite from '../NumberSprite'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    // Background image
    this.bg = new Phaser.Sprite(this.game, 0, 0, 'bg');
    this.game.add.existing(this.bg);

    // Slotmachine image
    this.slotmachine = new Phaser.Sprite(this.game, this.world.centerX, this.world.centerY, 'slotmachine');
    this.slotmachine.anchor.setTo(0.5);
    this.game.add.existing(this.slotmachine);

    // Spin button
    this.spinButton = new Phaser.Button(this.game, this.world.centerX, this.world.centerY, 'spinButton');
    this.spinButton.x = 808;
    this.spinButton.y = 582;
    this.game.add.existing(this.spinButton);
    // const bannerText = 'Phaser + ES6 + Webpack'
    // let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    // banner.font = 'Bangers'
    // banner.padding.set(10, 16)
    // banner.fontSize = 40
    // banner.fill = '#77BFA3'
    // banner.smoothed = false
    // banner.anchor.setTo(0.5)
    this.spinNumber = 0;
    this.reels = [];
    for (let i = 0; i < 4; i++) {
      this.reels[i] = new Reel({
        game: this.game,
        x: 352 + (i * 155),
        y: 260,
        reelNumber: i
      });
      if (i < 3) {
        this.spinButton.events.onInputDown.add(() => {
          this.reels[i].spin((this.reels[i].slotAmount + 2) + ((i + 1) * this.reels[i].slotAmount), i);
          this.startSpinning.destroy();
          this.mousehand.destroy();
          this.spinNumber++;
        });
      } else {
        this.spinButton.events.onInputDown.add(() => {
          this.reels[i].spin((this.reels[i].slotAmount + 2) + ((i + 1) * this.reels[i].slotAmount + this.reels[i].slotAmount * 2), i);
          this.startSpinning.destroy();
          this.mousehand.destroy();
          this.spinNumber++;
        });
      }
    }

    // Start Spinning image
    this.startSpinning = new Phaser.Sprite(this.game, 772, 480, 'startSpinning');
    this.game.add.existing(this.startSpinning);
    this.game.add.tween(this.startSpinning).to({ y: this.startSpinning.y + 20 }, 1000, Phaser.Easing.Linear.Out, true).yoyo(true).loop(true);

    this.mousehand = new Phaser.Sprite(this.game, 915, 620, 'mousehand');
    this.game.add.existing(this.mousehand);

    this.numbers = [];
    for (let i = 0; i < 9; i++) {
      this.numbers[i] = new NumberSprite({
        game: this.game,
        x: 642 - (i * 14),
        y: 619,
        numberPosition: i
      });
      if (i % 3 === 0 && i !== 0) {
        this.comma = new Phaser.Sprite(this.game, 645 - (i * 14), 619, 'numbers', 10);
        this.game.add.existing(this.comma);
      }
    }
  }

  afterSpin (spinNumber) {
    switch (spinNumber) {
      case 1:
        // for (let i = 0; i < 9; i++) {
        //   this.numbers[i].addScore(10048918);
        // }
        // lighter bar image
        this.barLights = [];
        for (let i = 1; i < 4; i++) {
          this.barLights[i] = new Phaser.Sprite(this.game, 300 - (155 * (i - 1)), 300, 'barLighter');
          this.barLights[i].anchor.setTo(0.5);
          this.barLights[i].alpha = 0.1;
          this.add.existing(this.barLights[i]);
        }

        // Dark overlay
        this.darkOverlay = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'darkOverlay');
        this.darkOverlay.anchor.setTo(0.5);
        this.darkOverlay.alpha = 0;
        this.add.existing(this.darkOverlay);

        // Big win image
        this.bigWin = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'bigWin');
        this.bigWin.alpha = 0;
        this.bigWin.anchor.setTo(0.5);
        this.add.existing(this.bigWin);

        // Define all tweens
        this.barLightTweens = [];
        for (let m = 0; m < 3; m++) {
          for (let n = 1; n < 4; n++) {
            this.barLightTweens[n + m * 3] = this.game.add.tween(this.barLights[n]).to({alpha: 1}, 200, Phaser.Easing.Linear.Out, false).yoyo(true);
            this.barLightTweens[n + m * 3] = this.game.add.tween(this.barLights[n]).to({alpha: 1}, 200, Phaser.Easing.Linear.Out, false).yoyo(true);
            this.barLightTweens[n + m * 3] = this.game.add.tween(this.barLights[n]).to({alpha: 1}, 200, Phaser.Easing.Linear.Out, false).yoyo(true);
          }
        }
        this.bigWinFadeIn = this.game.add.tween(this.bigWin).to({ alpha: 1 }, 300, Phaser.Easing.Linear.Out, false);
        this.darkOverlayFadeIn = this.game.add.tween(this.darkOverlay).to({ alpha: 0.15 }, 400, Phaser.Easing.Linear.Out, false);
        this.bigWinGrow = this.game.add.tween(this.bigWin).from({ width: 0.1, height: 0.1 }, 300, Phaser.Easing.Linear.Out, false);
        this.bigWinBounces = []
        for (let i = 1; i < 5; i++) {
          this.bigWinBounces[i] = this.game.add.tween(this.bigWin).to({width: this.bigWin.width + 20, height: this.bigWin.height + 20}, 200, Phaser.Easing.Linear.Out, false).yoyo(true);
        }
        this.bigWinFadeOut = this.game.add.tween(this.bigWin).to({ alpha: 0.1 }, 400, Phaser.Easing.Linear.Out, false);
        this.darkOverlayFadeOut = this.game.add.tween(this.darkOverlay).to({ alpha: 0 }, 400, Phaser.Easing.Linear.Out, false);

        // start tweens
        // this.darkOverlayFadeIn.start();
        for (let n = 1; n < 4; n++) {
          this.barLightTweens[n].start();
          this.barLightTweens[n].onComplete.add(function () { this.barLightTweens[n + 3].start(); }, this);
          this.barLightTweens[n + 3].onComplete.add(function () { this.barLightTweens[n + 6].start(); }, this);
          this.barLightTweens[n + 6].onComplete.add(function () { this.barLights[n].destroy(); }, this);
        }
        this.barLightTweens[9].onComplete.add(function () { this.bigWinFadeIn.start(); this.bigWinGrow.start(); }, this);
        this.bigWinGrow.chain(this.bigWinBounces[1], this.bigWinBounces[2], this.bigWinBounces[3], this.bigWinBounces[4], this.bigWinFadeOut, this.darkOverlayFadeOut);
        this.bigWinFadeOut.onComplete.add(() => {
          this.bigWin.destroy();
          this.darkOverlay.visible = false;
        }, this);
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }
  update () {

  }

  render () {
    if (__DEV__) {
      // !VERI HANDY DEBUG
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
