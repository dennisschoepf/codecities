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
        (contributor) => new Contributor(100, 200, 50)
      );
      this.legacy = state.currLegacy.map((legacy) => new Legacy(200, 300, 100));
      this.packages = state.currPackages.map(
        (currPackage) => new Package(400, 300, 50, 'react', '<h3>Test</h3>')
      );
    });
  }

  draw() {
    mp5.background(mp5.color(colors.greyLighter));

    this.player.drawOnReveal();
    this.player.follow();

    this.contributors.forEach((contributor) => {
      contributor.draw();
    });
    this.legacy.forEach((legacyObj) => {
      legacyObj.place();
    });
    this.packages.forEach((packageObj) => {
      packageObj.draw();
    });

    this.player.move();
  }

  onSceneClick() {
    // store.setState({ currentScene: Scenes.OVERVIEW });
    this.player.reveal();

    this.packages.forEach((packageObj) => {
      packageObj.onClick();
    });
  }
}
