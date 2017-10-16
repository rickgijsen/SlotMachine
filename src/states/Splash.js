import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    this.load.image('bg', 'assets/images/bg.jpg');
    this.load.image('darkOverlay', 'assets/images/dark-bg-overlay.png');
    this.load.image('slotmachine', 'assets/images/slotmachine.jpg');
    this.load.image('spinButton', 'assets/images/spin-btn.png');
    this.load.image('spinButtonPressed', 'assets/images/spin-btn-glow.png');
    this.load.image('installButton', 'assets/images/install-btn.png');
    this.load.image('reelbg', 'assets/images/reel-bg.png');
    this.load.image('reelOverlay', 'assets/images/reel-overlay.png');
    this.load.image('startSpinning', 'assets/images/start-spinning.png');
    this.load.image('mousehand', 'assets/images/mousehand.png');
    this.load.image('bigWin', 'assets/images/big-win.png');
    this.load.image('hugeWin', 'assets/images/huge-win.png');
    this.load.image('topBarsGlow', 'assets/images/top-bars-glow.png');
    this.load.image('topDiamondsGlow', 'assets/images/top-diamond-glow.png');

    this.load.spritesheet('coin', 'assets/images/coin-animation.png', 126, 126, 5);

    this.load.spritesheet('numbers', 'assets/images/red-numbers-sprite.png', 11, 22, 11);
    this.load.image('linesNumber', 'assets/images/lines-number.png');
    this.load.image('totalBetNumber', 'assets/images/total-bet-number.png');

    // slots
    this.load.image('seven', 'assets/images/slots-7.png');
    this.load.image('ten', 'assets/images/slots-10.png');
    this.load.image('bar', 'assets/images/slots-bar.png');
    this.load.image('crown', 'assets/images/slots-crown.png');
    this.load.image('diamond', 'assets/images/slots-diamond.png');
    this.load.image('lemon', 'assets/images/slots-lemon.png');
    this.load.image('melon', 'assets/images/slots-melon.png');
    this.load.image('diamondLighter', 'assets/images/slots-diamond-lighter.png');
    this.load.image('barLighter', 'assets/images/slots-bar-lighter.png');
  }

  create () {
    this.state.start('Game');
  }
}
