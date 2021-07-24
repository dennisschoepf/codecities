import { mp5 } from '../../main';
import { colors } from '../constants/colors';
import { Player } from '../sketchObjects/Player';
import store from '../store';
import { Scenes } from './scenes';

export class DetailScene {
  player: Player;
  contributors: any;
  legacy: any;
  packages: any;

  constructor() {
    this.player = new Player();

    store.subscribe((state) => {
      this.contributors = state.currContributors;
      this.legacy = state.currLegacy;
      this.packages = state.currPackages;
    });
  }

  draw() {
    mp5.background(mp5.color(colors.greyLighter));
    this.player.follow();
    this.player.move();

    // TODO: Draw what can be found
  }

  onSceneClick() {
    console.log('Click on detail scene');
    console.log('Changing back to overview');
    store.setState({ currentScene: Scenes.OVERVIEW });
  }
}
