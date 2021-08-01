import { mp5 } from '../../main';
import { colors } from '../constants/colors';
import { generateRevealableCoords } from '../helpers';
import { Player } from '../sketchObjects/Player';
import { Revealable, RevealableInterface } from '../sketchObjects/Revealable';
import store from '../store';
import { Coordinates } from '../types';

export class DetailScene {
  player: Player;
  revealables: RevealableInterface[];
  revealableCoords: Coordinates[];
  revealableObjects: Revealable[];

  constructor() {
    this.player = new Player();

    store.subscribe((state) => {
      this.revealables = state.revealables;
      this.revealableCoords = generateRevealableCoords();
      this.revealableObjects = this.revealables.map(
        (revealable, i) =>
          new Revealable(revealable, {
            x: this.revealableCoords[i].x,
            y: this.revealableCoords[i].y,
            w: this.revealables[i].size,
          })
      );
    });
  }

  draw() {
    mp5.background(mp5.color(colors.greyLighter));

    this.player.drawOnReveal();
    this.player.follow();

    this.revealableObjects.forEach((revObj) => {
      revObj.draw();
    });

    this.player.move();
  }

  onSceneClick() {
    this.revealableObjects.forEach((revObj) => {
      if (revObj.isHovered) {
        revObj.onClick();
      } else {
        this.player.reveal();
      }
    });
  }
}
