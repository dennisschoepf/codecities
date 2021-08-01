import { combineLatest } from 'rxjs';
import { mp5 } from '../../main';
import { areasColliding, playerHead$, revealedArea$ } from '../area';
import { colors } from '../constants/colors';
import store from '../store';
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
  size: number;
  path?: string;
  imageUrl?: string;
}

enum RevealableStates {
  HIDDEN = 'HIDDEN',
  REVEALED = 'REVEALED',
  FOUND = 'FOUND',
  INACTIVE = 'INACTIVE',
}

export class Revealable {
  state: RevealableStates = RevealableStates.HIDDEN;
  area: Area;

  type: RevealableTypes;
  name: string;
  path: string;
  contents: string;
  url: string;
  imageUrl: string;

  isHovered: boolean;
  isRevealed: boolean;
  wasInteractedWith: boolean;

  minSize: number = 5;
  currentSize: number;
  maxSize: number;

  pulseCurrentSize: number;
  pulseOpacity: number = 255;
  pulseCountUp: boolean;

  constructor({ type, name, path, contents, url, imageUrl }: RevealableInterface, area: Area) {
    this.type = type;
    this.name = name;
    this.path = path;
    this.contents = contents;
    this.url = url;
    this.imageUrl = imageUrl;
    this.area = area;
    this.currentSize = this.minSize;
    this.pulseCurrentSize = area.w;
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

      if (this.wasInteractedWith) {
        this.state = RevealableStates.INACTIVE;
      } else {
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
      this.pulsate();
      mp5.fill(mp5.color(colors.red));
      mp5.ellipse(this.area.x, this.area.y, this.currentSize);
    } else if (this.state === RevealableStates.INACTIVE) {
      this.reduceSize();

      mp5.fill(mp5.color(colors.greyDark));
      mp5.ellipse(this.area.x, this.area.y, this.currentSize);
    }
  }

  public onClick() {
    if (this.isHovered && !this.wasInteractedWith) {
      this.wasInteractedWith = true;

      store.getState().addInfoMessage({
        headline: this.name,
        innerHTML: this.contents,
      });
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

  private pulsate() {
    const minPulse = this.currentSize;
    const maxPulse = this.currentSize + 40;

    let color: any = mp5.color(colors.red);

    if (this.pulseCountUp) {
      this.pulseCurrentSize += 1;
      this.pulseOpacity = this.pulseOpacity > 255 ? 255 : this.pulseOpacity - 6;

      if (this.pulseCurrentSize > maxPulse) {
        this.pulseCountUp = false;
      }
    } else {
      this.pulseCurrentSize -= 6;

      if (this.pulseCurrentSize < minPulse) {
        this.pulseCountUp = true;
        this.pulseOpacity = 255;
      }
    }

    color.setAlpha(this.pulseOpacity);

    mp5.fill(mp5.color(color));
    mp5.ellipse(this.area.x, this.area.y, this.pulseCurrentSize);
  }
}
