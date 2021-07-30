import { combineLatest, map } from 'rxjs';
import { mp5 } from '../../main';
import { playerHead$, areasColliding, revealedArea$ } from '../area';
import { colors } from '../constants/colors';
import store from '../store';

enum ContribStates {
  HIDDEN = 'HIDDEN',
  REVEALED = 'REVEALED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Contributor {
  x: number;
  y: number;
  size: number;
  currentSize: number;
  startSize: number = 5;
  name: string;
  url: string;
  messageContents: string;
  wasTouched: boolean = false;
  wasInteractedWith: boolean = false;
  hover: boolean = false;
  contribState: ContribStates = ContribStates.HIDDEN;

  constructor(
    x: number,
    y: number,
    size: number,
    name?: string,
    messageContents?: string,
    packageURL?: string
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.name = name;
    this.url = packageURL;
    this.currentSize = this.startSize;
    this.messageContents = messageContents;

    combineLatest([revealedArea$, playerHead$]).subscribe(([revealedArea, playerHead]) => {
      const isRevealed = areasColliding(
        { x: this.x, y: this.y, w: this.currentSize },
        revealedArea
      );

      if (isRevealed) {
        this.contribState = ContribStates.REVEALED;
      } else {
        this.contribState = ContribStates.HIDDEN;
      }

      // console.log(this.packageState);
    });
  }

  public draw() {
    mp5.noStroke();
    mp5.rectMode('center');
    mp5.ellipseMode('center');

    if (this.contribState === ContribStates.HIDDEN) {
    } else if (this.contribState === ContribStates.REVEALED) {
      mp5.arc(this.x, this.y, this.size, 80, 0, mp5.PI + mp5.QUARTER_PI, mp5.CHORD);
    } else if (this.contribState === ContribStates.ACTIVE) {
      // Check if mouse is over the squares, if so animate and enable click
      const mouseOverShape = areasColliding(
        { x: mp5.mouseX, y: mp5.mouseY, w: 70 },
        { x: this.x, y: this.y, w: this.currentSize }
      );

      if (mouseOverShape) {
        this.hover = true;
      } else {
        this.hover = false;
      }
    } else if (this.contribState === ContribStates.INACTIVE) {
    }
  }

  public onClick() {
    if (this.hover && !this.wasInteractedWith) {
      this.wasInteractedWith = true;
      store.getState().addInfoMessage({
        headline: this.name,
        innerHTML: this.messageContents,
      });
    }
  }
}
