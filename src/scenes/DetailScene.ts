import { mp5 } from '../../main';
import { colors } from '../constants/colors';
import { Contributor } from '../sketchObjects/Contributor';
import { Legacy } from '../sketchObjects/Legacy';
import { Package } from '../sketchObjects/Package';
import { Player } from '../sketchObjects/Player';
import store from '../store';
import { Scenes } from './scenes';

export class DetailScene {
  player: Player;
  contributors: any[];
  legacy: any[];
  packages: any[];

  constructor() {
    this.player = new Player();

    store.subscribe((state) => {
      this.contributors = state.currContributors.map(
        (contributor) => new Contributor(100, 200, 100)
      );
      this.legacy = state.currLegacy.map((legacy) => new Legacy(200, 300, 100));
      this.packages = state.currPackages.map((currPackage) => new Package(400, 300, 100));
    });
  }

  draw() {
    mp5.background(mp5.color(colors.greyLighter));
    this.player.drawOnReveal();
    this.player.follow();
    this.player.move();

    this.contributors.forEach((contributor) => {
      contributor.place();
    });
    this.legacy.forEach((legacyObj) => {
      legacyObj.place();
    });
    this.packages.forEach((packageObj) => {
      packageObj.place();
      packageObj.drawOnReveal();
    });
  }

  onSceneClick() {
    // store.setState({ currentScene: Scenes.OVERVIEW });
    this.player.reveal();
  }
}
