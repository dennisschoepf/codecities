import _ from 'lodash';
import { mp5 } from '../../main';
import { colors } from '../constants/colors';
import { generateRevealableCoords } from '../helpers';
import { Player } from '../sketchObjects/Player';
import { Revealable, RevealableInterface } from '../sketchObjects/Revealable';
import store from '../store';
import { Coordinates } from '../types';
import { CompanionState } from '../ui/companion';
import { Scenes } from './scenes';

export class DetailScene {
  player: Player;
  revealables: RevealableInterface[];
  revealableCoords: Coordinates[];
  revealableObjects: Revealable[];

  constructor() {
    this.player = new Player();

    store.subscribe((state, prevState) => {
      if (!_.isEqual(state.revealables, prevState.revealables)) {
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
      }
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

    if (
      this.revealableObjects.every((revObj) => revObj.wasInteractedWith) &&
      !(store.getState().companionState === CompanionState.ACTIVE)
    ) {
      store.getState().addUserMessage({
        text: "Yaay! You've found all of the important parts of this part of the repository. You will be returned to the subproject overview now. Pick the next subproject you want to take a look at there.",
        inputWanted: false,
        onNext: () => store.setState({ currentScene: Scenes.OVERVIEW }),
        showIdle: false,
      });
    }
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
