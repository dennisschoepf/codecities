import { combineLatest, map } from 'rxjs';
import { mp5 } from '../../main';
import { playerHead$, areasColliding, revealedArea$ } from '../area';
import { colors } from '../constants/colors';
import store from '../store';

enum PackageStates {
  HIDDEN = 'HIDDEN',
  REVEALED = 'REVEALED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Package {
  x: number;
  y: number;
  size: number;
  name: string;
  url: string;
  messageContents: string;
  corners: number = 10;
  startSize: number = 5;
  currentSize: number;
  wasTouched: boolean = false;
  wasInteractedWith: boolean = false;
  hover: boolean = false;
  packageState: PackageStates = PackageStates.HIDDEN;

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
      const isTouched = areasColliding({ x: this.x, y: this.y, w: this.size }, playerHead, true);

      console.log('Revealed', isRevealed);
      console.log('isTouched', isTouched);
      console.log('wasTouched', this.wasTouched);
      console.log('wasInteractedWith', this.wasInteractedWith);

      if (isRevealed) {
        if (this.packageState !== PackageStates.ACTIVE) {
          this.packageState = PackageStates.REVEALED;
        }
        if (this.wasInteractedWith) {
          this.packageState = PackageStates.INACTIVE;
        }

        if (isTouched && !this.wasTouched) {
          this.packageState = PackageStates.ACTIVE;
          this.wasTouched = true;
        }
      } else {
        if (this.wasInteractedWith) {
          this.packageState = PackageStates.INACTIVE;
        } else if (this.wasTouched && !this.wasInteractedWith) {
          this.packageState = PackageStates.ACTIVE;
        } else {
          this.packageState = PackageStates.HIDDEN;
        }
      }

      // console.log(this.packageState);
    });
  }

  public draw() {
    mp5.noStroke();
    mp5.rectMode('center');
    mp5.ellipseMode('center');

    if (this.packageState === PackageStates.HIDDEN) {
      // Scale down after it was revealed or active
      if (this.currentSize > this.startSize) {
        this.currentSize--;
      }

      /*mp5.square(this.x, this.y, this.currentSize, this.corners);*/
    } else if (this.packageState === PackageStates.REVEALED) {
      // Scale up if not large enough
      if (this.currentSize < this.size) {
        this.currentSize++;
      }

      mp5.square(this.x, this.y, this.currentSize, this.corners);
      mp5.square(this.x - this.size - 10, this.y, this.currentSize, this.corners);
      mp5.square(this.x, this.y - this.size - 10, this.currentSize, this.corners);
    } else if (this.packageState === PackageStates.ACTIVE) {
      mp5.fill(mp5.color(colors.redLight));
      mp5.square(this.x, this.y, this.currentSize, this.corners);
      mp5.square(this.x - this.size - 10, this.y, this.currentSize, this.corners);
      mp5.square(this.x, this.y - this.size - 10, this.currentSize, this.corners);

      // Check if mouse is over the squares, if so animate and enable click
      const mouseOverShape = areasColliding(
        { x: mp5.mouseX, y: mp5.mouseY, w: 70 },
        { x: this.x, y: this.y, w: this.currentSize }
      );

      if (mouseOverShape) {
        this.hover = true;
        mp5.square(this.x, this.y, this.currentSize + mp5.random(-5, 5), this.corners);
        mp5.square(
          this.x - this.size - 10,
          this.y,
          this.currentSize + mp5.random(-5, 5),
          this.corners
        );
        mp5.square(
          this.x,
          this.y - this.size - 10,
          this.currentSize + mp5.random(-5, 5),
          this.corners
        );
      } else {
        this.hover = false;
      }
    } else if (this.packageState === PackageStates.INACTIVE) {
      mp5.fill(mp5.color(colors.greyLight));
      mp5.square(this.x, this.y, this.currentSize, this.corners);
      mp5.square(this.x - this.size - 10, this.y, this.currentSize, this.corners);
      mp5.square(this.x, this.y - this.size - 10, this.currentSize, this.corners);
    }
  }

  public onClick() {
    if (this.hover && !this.wasInteractedWith) {
      console.log('click on shape');
      this.wasInteractedWith = true;
      store.getState().addInfoMessage({
        headline: this.name,
        innerHTML: this.messageContents,
      });
    }
  }
}
