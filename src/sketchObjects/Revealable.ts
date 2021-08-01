import { combineLatest } from 'rxjs';
import { mp5 } from '../../main';
import { areasColliding, playerHead$, revealedArea$ } from '../area';
import { colors } from '../constants/colors';
import { Area } from '../types';

export enum RevealableTypes {
  LEGACY = 'LEGACY',
  CONTRIBUTOR = 'CONTRIBUTOR',
  PACKAGE = 'PACKAGE',
}

export interface RevealableInterface {
  type: RevealableTypes;
  name: string;
  contents: string;
  url: string;
  path?: string;
  imageUrl?: string;
}

enum RevealableStates {
  HIDDEN = 'HIDDEN',
  REVEALED = 'REVEALED',
  FOUND = 'FOUND',
}

export class Revealable {
  state: RevealableStates = RevealableStates.HIDDEN;
  area: Area;

  isHovered: boolean;
  isRevealed: boolean;

  minSize: number = 5;
  currentSize: number;
  maxSize: number;

  constructor({ type, name, path, contents, url, imageUrl }: RevealableInterface, area: Area) {
    this.area = area;
    this.currentSize = this.minSize;
    this.maxSize = area.w;

    combineLatest([revealedArea$, playerHead$]).subscribe(([revealedArea, playerHead]) => {
      const isRevealed = areasColliding(revealedArea, {
        x: this.area.x,
        y: this.area.y,
        w: this.currentSize,
      });
      const isHovered = areasColliding(playerHead, {
        x: this.area.x,
        y: this.area.y,
        w: this.currentSize,
      });

      if (
        ((isRevealed && isHovered) || (!isRevealed && isHovered)) &&
        (this.state === RevealableStates.REVEALED || this.state === RevealableStates.FOUND)
      ) {
        this.state = RevealableStates.FOUND;
      } else if (isRevealed && !isHovered) {
        this.state = RevealableStates.REVEALED;
      } else {
        this.state = RevealableStates.HIDDEN;
      }

      this.isHovered = this.state === RevealableStates.FOUND ? isHovered : false;
      this.isRevealed = isRevealed;
    });
  }

  public draw() {
    if (this.state === RevealableStates.HIDDEN) {
      this.reduceSize();
    } else if (this.state === RevealableStates.REVEALED) {
      this.increaseSize();

      mp5.fill(mp5.color(colors.greyLight));
      mp5.ellipse(this.area.x, this.area.y, this.currentSize);
    } else if (this.state === RevealableStates.FOUND) {
      mp5.fill(mp5.color(colors.redDark));
      mp5.ellipse(this.area.x, this.area.y, this.currentSize);
    }
  }

  public onClick() {
    if (this.isHovered) {
      console.log('Clicked on Revealable');
    }
  }

  private reduceSize() {
    if (this.currentSize > this.minSize) {
      this.currentSize -= 8;
    } else {
      this.currentSize = this.minSize;
    }
  }

  private increaseSize() {
    if (this.currentSize < this.maxSize) {
      this.currentSize += 8;
    } else {
      this.currentSize = this.maxSize;
    }
  }

  private pulsate() {}
}
