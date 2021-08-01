import { mp5 } from '../../main';
import { colors } from '../constants/colors';
import { Player } from '../sketchObjects/Player';
import { Revealable, RevealableInterface } from '../sketchObjects/Revealable';
import store from '../store';

export class DetailScene {
  player: Player;
  revealables: RevealableInterface[];
  revealableObjects: Revealable[];

  constructor() {
    this.player = new Player();

    store.subscribe((state) => {
      this.revealables = state.revealables;
      this.revealableObjects = this.revealables.map(
        (revealable) => new Revealable(revealable, { x: 100, y: 200, w: 65 })
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
