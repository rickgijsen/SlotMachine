/* globals __DEV__ */
import Phaser from 'phaser'
import Reel from '../Reel'
import NumberSprite from '../NumberSprite'
import Coin from '../Coin'

export default class extends Phaser.State {
  init () {}
  preload () {
    this.game.onAfterSpin = new Phaser.Signal();
    this.game.onAfterSpin.add((spinNumber) => { this.afterSpin(spinNumber) });
  }

  create () {
    // used for the tweens after spinning
    this.canTween = true;
    // Background image
    this.bg = new Phaser.Sprite(this.game, 0, 0, 'bg');
    this.game.add.existing(this.bg);

    // Slotmachine image
    this.slotmachine = new Phaser.Sprite(this.game, this.world.centerX, this.world.centerY, 'slotmachine');
    this.slotmachine.anchor.setTo(0.5);
    this.game.add.existing(this.slotmachine);

    // Spin button
    this.spinButton = new Phaser.Button(this.game, 808, 582, 'spinButton');
    this.game.add.existing(this.spinButton);

    // add button events
    this.spinButton.events.onInputDown.add(() => {
      this.spinButton.loadTexture('spinButtonPressed');
      if (this.spinNumber > 0) {
        this.spinButtonTween.stop();
      }
    });
    this.spinButton.events.onInputUp.add(() => {
      this.spinButton.loadTexture('spinButton');
      this.spinButton.inputEnabled = false;
      this.spinNumber++;
      this.startSpinning.destroy();
      this.mousehand.destroy();
      this.canTween = true;
    });

    // add the 4 reels and add the button input to make them spin, the 4rth reel spins longer
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
        this.spinButton.events.onInputUp.add(() => {
          this.reels[i].spin((this.reels[i].slotAmount + 2) + ((i + 1) * this.reels[i].slotAmount), i, this.spinNumber);
        });
      } else {
        this.spinButton.events.onInputUp.add(() => {
          this.reels[i].spin((this.reels[i].slotAmount + 2) + ((i + 1) * this.reels[i].slotAmount + this.reels[i].slotAmount * 2), i, this.spinNumber);
        });
      }
    }

    // Start Spinning image
    this.startSpinning = new Phaser.Sprite(this.game, 772, 480, 'startSpinning');
    this.game.add.existing(this.startSpinning);
    this.game.add.tween(this.startSpinning).to({ y: this.startSpinning.y + 20 }, 1000, Phaser.Easing.Linear.Out, true).yoyo(true).loop(true);

    this.mousehand = new Phaser.Sprite(this.game, 915, 620, 'mousehand');
    this.game.add.existing(this.mousehand);

    // score win numbers
    this.numbers = [];
    for (let i = 0; i < 12; i++) {
      this.numbers[i] = new NumberSprite({
        game: this.game,
        x: 642 - (i * 14),
        y: 619,
        numberPosition: i
      });
    }
    // lines number
    this.linesNumber = new Phaser.Sprite(this.game, 350, 619, 'linesNumber');
    this.game.add.existing(this.linesNumber);
    // total bet number
    this.totalBetNumber = new Phaser.Sprite(this.game, 420, 619, 'totalBetNumber');
    this.game.add.existing(this.totalBetNumber);
  }

  afterSpin (spinNumber) {
    if (this.canTween) {
      switch (spinNumber) {
        // This happens after the first spin
        case 1:
          this.canTween = false;
          // add score to 'win' score
          for (let i = 0; i < 12; i++) {
            this.numbers[i].addScore(586806988);
          }

          // Dark overlay
          this.darkOverlay = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'darkOverlay');
          this.darkOverlay.anchor.setTo(0.5);
          this.darkOverlay.alpha = 0;
          this.add.existing(this.darkOverlay);
          // tween
          this.darkOverlayFadeIn = this.game.add.tween(this.darkOverlay).to({alpha: 1}, 400, Phaser.Easing.Linear.Out, false);
          this.darkOverlayFadeOut = this.game.add.tween(this.darkOverlay).to({alpha: 0}, 400, Phaser.Easing.Linear.Out, false);

          // lighter bar image
          this.barLights = [];
          for (let i = 1; i < 4; i++) {
            this.barLights[i] = new Phaser.Sprite(this.game, this.reels[0].slots[1].x + (155 * i), this.reels[0].slots[1].y, 'barLighter');
            this.barLights[i].anchor.setTo(0.5);
            this.barLights[i].alpha = 0.1;
            this.add.existing(this.barLights[i]);
          }
          // tweens
          this.barLightTweens = [];
          for (let m = 0; m < 3; m++) {
            for (let n = 1; n < 4; n++) {
              this.barLightTweens[n + m * 3] = this.game.add.tween(this.barLights[n]).to({alpha: 1}, 300, Phaser.Easing.Linear.Out, false).yoyo(true);
            }
          }

          // Top Bar Glow
          this.topBarsGlow = new Phaser.Sprite(this.game, 544, 78, 'topBarsGlow');
          this.topBarsGlow.alpha = 0;
          this.add.existing(this.topBarsGlow);
          // tween
          this.topBarsGlowFadeIn = this.game.add.tween(this.topBarsGlow).to({alpha: 100}, 600, Phaser.Easing.Linear.Out, false);
          this.topBarsGlowFadeOut = this.game.add.tween(this.topBarsGlow).to({alpha: 0}, 700, Phaser.Easing.Linear.Out, false).delay(400);

          // Big win image
          this.bigWin = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'bigWin');
          this.bigWin.alpha = 0;
          this.bigWin.anchor.setTo(0.5);
          this.add.existing(this.bigWin);
          // tweens
          this.bigWinFadeIn = this.game.add.tween(this.bigWin).to({alpha: 1}, 300, Phaser.Easing.Linear.Out, false);
          this.bigWinGrow = this.game.add.tween(this.bigWin).from({
            width: 0.1,
            height: 0.1
          }, 300, Phaser.Easing.Linear.Out, false);
          this.bigWinBounces = []
          for (let i = 1; i < 5; i++) {
            this.bigWinBounces[i] = this.game.add.tween(this.bigWin).to({
              width: this.bigWin.width + 20,
              height: this.bigWin.height + 20
            }, 200, Phaser.Easing.Linear.Out, false).yoyo(true);
          }
          this.bigWinFadeOut = this.game.add.tween(this.bigWin).to({alpha: 0.1}, 400, Phaser.Easing.Linear.Out, false);

          this.spinButtonPressed = new Phaser.Sprite(this.game, this.spinButton.x, this.spinButton.y, 'spinButtonPressed');
          this.spinButtonPressed.alpha = 0;
          this.game.add.existing(this.spinButtonPressed);
          this.spinButtonTween = this.game.add.tween(this.spinButtonPressed)
            .to({alpha: 1}, 400, Phaser.Easing.Linear.Out, false)
            .yoyo(true)
            .loop(true);

          // start tweens
          this.darkOverlayFadeIn.start();

          this.topBarsGlowFadeIn.chain(this.topBarsGlowFadeOut);
          this.topBarsGlowFadeIn.start();
          for (let n = 1; n < 4; n++) {
            this.barLightTweens[n].start();
            this.barLightTweens[n].onComplete.add(function () {
              this.barLightTweens[n + 3].start();
            }, this);
            this.barLightTweens[n + 3].onComplete.add(function () {
              this.barLightTweens[n + 6].start();
            }, this);
            this.barLightTweens[n + 6].onComplete.add(function () {
              this.barLights[n].destroy();
            }, this);
          }
          this.barLightTweens[9].onComplete.add(function () {
            this.bigWinFadeIn.start();
            this.bigWinGrow.start();
          }, this);
          this.bigWinGrow.chain(this.bigWinBounces[1], this.bigWinBounces[2], this.bigWinBounces[3], this.bigWinBounces[4], this.bigWinFadeOut, this.darkOverlayFadeOut);
          this.bigWinFadeOut.onComplete.add(() => {
            this.bigWin.destroy();
            this.spinButton.inputEnabled = true;
            this.spinButtonTween.start();
          }, this);
          break;

        // this happens after the second spin -------------------------------------------------------------------------------
        case 2:
          this.canTween = false;
          this.spinButton.inputEnabled = true;

          this.spinButtonPressed = new Phaser.Sprite(this.game, this.spinButton.x, this.spinButton.y, 'spinButtonPressed');
          this.spinButtonPressed.alpha = 0;
          this.game.add.existing(this.spinButtonPressed);
          this.spinButtonTween = this.game.add.tween(this.spinButtonPressed)
            .to({alpha: 1}, 400, Phaser.Easing.Linear.Out, false)
            .yoyo(true)
            .loop(true);
          this.spinButtonTween.start();
          break;

        // this happens after the third spin --------------------------------------------------------------------------------
        case 3:
          this.canTween = false;
          // add score to 'win' score
          for (let i = 0; i < 12; i++) {
            this.numbers[i].addScore(12236871228);
          }

          // lighter diamond images
          this.diamonds = [];
          for (let i = 1; i < 5; i++) {
            this.diamonds[i] = new Phaser.Sprite(this.game, this.reels[0].slots[0].x + (155 * (i - 1)), this.reels[0].slots[5].y, 'diamond');
            this.diamonds[i].anchor.setTo(0.5);
            this.add.existing(this.diamonds[i]);
          }
          this.diamondLights = [];
          for (let i = 1; i < 5; i++) {
            this.diamondLights[i] = new Phaser.Sprite(this.game, this.reels[0].slots[0].x + (155 * (i - 1)), this.reels[0].slots[5].y, 'diamondLighter');
            this.diamondLights[i].anchor.setTo(0.5);
            this.diamondLights[i].alpha = 0.1;
            this.add.existing(this.diamondLights[i]);
          }
          // tweens
          this.diamondGrowTweens = [];
          this.diamondLightsGrowTweens = [];
          this.diamondLightTweens = [];
          for (let m = 0; m < 4; m++) {
            this.diamondGrowTweens[m] = this.game.add.tween(this.diamonds[m + 1]).to({
              height: 1.2 * this.diamonds[m + 1].height,
              width: 1.2 * this.diamonds[m + 1].width},
            700, Phaser.Easing.Linear.Out, false);

            this.diamondLightsGrowTweens[m] = this.game.add.tween(this.diamondLights[m + 1]).to({
              height: 1.2 * this.diamondLights[m + 1].height,
              width: 1.2 * this.diamondLights[m + 1].width},
            700, Phaser.Easing.Linear.Out, false);

            for (let n = 1; n < 5; n++) {
              this.diamondLightTweens[n + m * 4] = this.game.add.tween(this.diamondLights[n]).to({alpha: 1}, 300, Phaser.Easing.Linear.Out, false).yoyo(true);
            }
          }

          // Top diamonds Glow
          this.topDiamondsGlow = new Phaser.Sprite(this.game, 524, 38, 'topDiamondsGlow');
          this.topDiamondsGlow.alpha = 0;
          this.add.existing(this.topDiamondsGlow);
          // tween
          this.topDiamondsGlowFadeIn = this.game.add.tween(this.topDiamondsGlow).to({alpha: 100}, 600, Phaser.Easing.Linear.Out, false);
          this.topDiamondsGlowFadeOut = this.game.add.tween(this.topDiamondsGlow).to({alpha: 0}, 700, Phaser.Easing.Linear.Out, false).delay(400);

          // Big win image
          this.hugeWin = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'hugeWin');
          this.hugeWin.alpha = 0;
          this.hugeWin.anchor.setTo(0.5);
          this.add.existing(this.hugeWin);
          // tweens
          this.hugeWinFadeIn = this.game.add.tween(this.hugeWin).to({alpha: 1}, 300, Phaser.Easing.Linear.Out, false);
          this.hugeWinGrow = this.game.add.tween(this.hugeWin).from({
            width: 0.1,
            height: 0.1
          }, 300, Phaser.Easing.Linear.Out, false);
          this.hugeWinBounces = []
          for (let i = 1; i < 5; i++) {
            this.hugeWinBounces[i] = this.game.add.tween(this.hugeWin).to({
              width: this.hugeWin.width + 20,
              height: this.hugeWin.height + 20
            }, 200, Phaser.Easing.Linear.Out, false).yoyo(true);
          }
          this.hugeWinFadeOut = this.game.add.tween(this.hugeWin).to({alpha: 0.1}, 400, Phaser.Easing.Linear.Out, false);

          // install button
          this.installButton = new Phaser.Button(this.game, this.world.centerX, this.world.centerY + 160, 'installButton');
          this.installButton.anchor.setTo(0.5);
          this.installButton.visible = false;
          this.game.add.existing(this.installButton);
          this.installButtonGrow = this.game.add.tween(this.installButton).from({
            width: 0.1,
            height: 0.1
          }, 300, Phaser.Easing.Linear.Out, false);
          this.installButtonBounce = this.game.add.tween(this.installButton)
            .to({width: this.installButton.width * 1.05, height: this.installButton.height * 1.05},
              100, Phaser.Easing.Linear.Out, false)
            .loop(true)
            .yoyo(true)
            .delay(1000);

          // start tweens
          this.darkOverlayFadeIn.start();

          this.topDiamondsGlowFadeIn.chain(this.topDiamondsGlowFadeOut);
          this.topDiamondsGlowFadeIn.start();
          for (let n = 1; n < 5; n++) {
            this.diamondGrowTweens[n - 1].start();
            this.diamondLightsGrowTweens[n - 1].start();
            this.diamondLightTweens[n].start();
            this.diamondLightTweens[n].onComplete.add(function () {
              this.diamondLightTweens[n + 4].start();
            }, this);
            this.diamondLightTweens[n + 4].onComplete.add(function () {
              this.diamondLightTweens[n + 8].start();
            }, this);
            this.diamondLightTweens[n + 8].onComplete.add(function () {
              this.diamondLights[n].destroy();
            }, this);
          }
          this.installButtonGrow.chain(this.installButtonBounce);
          this.diamondLightTweens[12].onComplete.add(function () {
            this.hugeWinFadeIn.start();
            this.hugeWinGrow.start();
            this.installButtonGrow.start();
            this.installButton.visible = true;
            this.coins = [];
            for (let i = 0; i < 10; i++) {
              if (i > 4) {
                this.coinX = 450;
              } else {
                this.coinX = -550;
              }
              this.coins[i] = new Coin({
                game: this.game,
                x: this.world.centerX + this.coinX,
                y: i * -50,
                asset: 'coin'
              });
            }
          }, this);
          break;
      }
    }
  }
  update () {
  }
  render () {
  }
}
