import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'

const config = {
  width: 1280,
  height: 720,
  parent: 'gameWrapper',
  scaleMode: Phaser.ScaleManager.EXACT_FIT,
  renderer: Phaser.CANVAS,
  fullScreenScaleMode: Phaser.ScaleManager.NO_SCALE,
  transparent: false,
  antialias: false
};

class Game extends Phaser.Game {
  constructor (config) {
    super(config)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Boot')
  }
}

window.game = new Game(config)
