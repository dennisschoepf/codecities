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
  startTime?: number = null;
  wasInteractedWith: boolean = false;
  wasHovered: boolean = false;

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
    if (this.startTime === null) {
      this.startTime = mp5.millis();
    }

    if (mp5.millis() > this.startTime + 3000 && !this.wasInteractedWith) {
      console.log('3 seconds without interaction');
      this.wasInteractedWith = true;
      store.getState().addUserMessage({
        inputWanted: false,
        text: 'Trouble knowing what to do? You should try clicking somewhere in order to spawn reveal bubbles. Try this in different parts of the canvas to see what you can find',
      });
    } else if (mp5.millis() > this.startTime + 6000 && !this.wasHovered && this.wasInteractedWith) {
      console.log('3 seconds without hovering');
      this.wasHovered = true;
      store.getState().addUserMessage({
        inputWanted: false,
        text: "Good job with your reveal bubbles, in order to truly find out what is important in this part of the project, try to catch the revealed objects with your character's head to be able to interact with them.",
      });
    }

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
      store.setState((state) => ({
        finishedSubProjects: [...state.finishedSubProjects, state.currentSubproject],
      }));

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
        this.wasHovered = true;
        revObj.onClick();
      } else {
        this.player.reveal();
        this.wasInteractedWith = true;
      }
    });
  }
}
