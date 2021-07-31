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
  hover: boolean;

  constructor({ type, name, path, contents, url, imageUrl }: RevealableInterface, area: Area) {
    this.area = area;

    combineLatest([revealedArea$, playerHead$]).subscribe(([revealedArea, playerHead]) => {
      const isRevealed = areasColliding(revealedArea, this.area);
      const isHovered = areasColliding(playerHead, this.area);

      if (isRevealed && isHovered) {
        this.state = RevealableStates.FOUND;
      } else if (isRevealed && !isHovered) {
        this.state = RevealableStates.REVEALED;
      } else {
        this.state = RevealableStates.HIDDEN;
      }
    });
  }

  public draw() {
    if (this.state === RevealableStates.HIDDEN) {
      mp5.fill(mp5.color(colors.greyLight));
    } else if (this.state === RevealableStates.REVEALED) {
      mp5.fill(mp5.color(colors.red));
    } else if (this.state === RevealableStates.FOUND) {
      mp5.fill(mp5.color(colors.redDark));
    }

    mp5.ellipse(this.area.x, this.area.y, this.area.w);
  }

  public onClick() {}
}
