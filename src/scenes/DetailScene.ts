import { mp5 } from '../../main';
import { Player } from '../sketchObjects/Player';
import store from '../store';
import { Scenes } from './scenes';

export class DetailScene {
  player: Player;

  constructor() {
    this.player = new Player();
  }

  draw() {
    mp5.background(100);
    this.player.follow();
    this.player.move();
  }

  onSceneClick() {
    console.log('Click on detail scene');
    console.log('Changing back to overview');
    store.setState({ currentScene: Scenes.OVERVIEW });
  }
}
