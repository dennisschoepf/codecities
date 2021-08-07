import { combineLatest } from 'rxjs';
import { mp5 } from '../../main';
import { areasColliding, playerHead$, revealedArea$ } from '../area';
import { colors } from '../constants/colors';
import { logger } from '../logger';
import store from '../store';
import { Area, Coordinates } from '../types';
import { Commit } from '../ui/info';

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
  version?: string;
  commits?: Commit[];
  fileContents?: string;
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
  version: string;
  commits: Commit[];
  fileContents: string;

  isHovered: boolean;
  isRevealed: boolean;
  wasInteractedWith: boolean;
  wasRevealed: boolean;
  hasMovedAway: boolean;
  newMovePosition: Coordinates;
  originalMovePosition: Coordinates;

  minSize: number = 5;
  currentSize: number;
  maxSize: number;

  pulseCurrentSize: number;
  pulseOpacity: number = 255;
  pulseCountUp: boolean;

  constructor(
    {
      type,
      name,
      path,
      contents,
      url,
      imageUrl,
      version,
      commits,
      fileContents,
    }: RevealableInterface,
    area: Area
  ) {
    this.type = type;
    this.name = name;
    this.path = path;
    this.contents = contents;
    this.url = url;
    this.version = version;
    this.commits = commits;
    this.fileContents = fileContents;
    this.imageUrl = imageUrl;
    this.area = area;
    this.currentSize = this.minSize;
    this.pulseCurrentSize = area.w;
    this.maxSize = area.w;
    this.newMovePosition = {
      x: this.area.x + mp5.random(-800, 800),
      y: this.area.y + mp5.random(-800, 800),
    };
    this.originalMovePosition = {
      x: this.area.x,
      y: this.area.y,
    };

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

          if (!this.wasRevealed) {
            logger.log({
              type:
                this.type === RevealableTypes.CONTRIBUTOR
                  ? 'NR'
                  : this.type === RevealableTypes.LEGACY
                  ? 'LR'
                  : 'PR',
              timestamp: Date.now(),
              message: `Revealed ${this.name}`,
            });
          }

          this.wasRevealed = true;
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

      if (!this.hasMovedAway) {
        this.moveAway();
      } else {
        this.moveBack();
      }

      mp5.fill(mp5.color(colors.greyLight));
      mp5.ellipse(this.area.x, this.area.y, this.currentSize);
    } else if (this.state === RevealableStates.FOUND) {
      this.pulsate();
      mp5.fill(mp5.color(colors.red));
      mp5.ellipse(this.area.x, this.area.y, this.currentSize);
    } else if (this.state === RevealableStates.INACTIVE) {
      this.minSize = 35;
      this.reduceSize();

      mp5.fill(mp5.color(colors.redDark));
      mp5.ellipse(this.area.x, this.area.y, this.currentSize);
      mp5.strokeWeight(4);
      mp5.stroke(mp5.color(colors.greyLighter));

      mp5.line(
        this.area.x + this.currentSize / 5,
        this.area.y - this.currentSize / 5,
        this.area.x - this.currentSize / 5,
        this.area.y + this.currentSize / 5
      );

      mp5.line(
        this.area.x - this.currentSize / 5,
        this.area.y - this.currentSize / 5,
        this.area.x + this.currentSize / 5,
        this.area.y + this.currentSize / 5
      );
    }
  }

  public onClick() {
    if (this.isHovered && !this.wasInteractedWith) {
      this.wasInteractedWith = true;

      logger.log({
        type:
          this.type === RevealableTypes.CONTRIBUTOR
            ? 'NS'
            : this.type === RevealableTypes.LEGACY
            ? 'LS'
            : 'PS',
        timestamp: Date.now(),
        message: `Showing info message for ${this.name}`,
      });

      store.getState().addInfoMessage({
        type: this.type,
        headline: this.name,
        innerHTML: this.contents,
        imgUrl: this.imageUrl,
        url: this.url,
        version: this.version,
        commits: this.commits,
        fileContents: this.fileContents,
      });
    }
  }

  private moveAway() {
    const boundaryX = mp5.width - 200;
    const boundaryY = mp5.height - 200;

    const newX = this.newMovePosition.x;
    const newY = this.newMovePosition.y;

    const limitedX = newX > boundaryX ? boundaryX : newX < 200 ? 200 : newX;
    const limitedY = newY > boundaryY ? boundaryY : newY < 200 ? 200 : newY;

    if (limitedX > this.area.x) {
      this.area.x += 5;
      if (limitedX <= this.area.x) {
        this.area.x = limitedX;
        this.hasMovedAway = true;
      }
    } else {
      this.area.x -= 5;
      if (limitedX >= this.area.x) {
        this.area.x = limitedX;
        this.hasMovedAway = true;
      }
    }

    if (limitedY > this.area.y) {
      this.area.y += 5;
      if (limitedY <= this.area.y) {
        this.area.y = limitedY;
        this.hasMovedAway = true;
      }
    } else {
      this.area.y -= 5;
      if (limitedY >= this.area.y) {
        this.area.y = limitedY;
        this.hasMovedAway = true;
      }
    }
  }

  private moveBack() {
    const newX = this.originalMovePosition.x;
    const newY = this.originalMovePosition.y;

    if (newX > this.area.x) {
      this.area.x += 5;
      if (newX <= this.area.x) {
        this.area.x = newX;
        this.hasMovedAway = false;
      }
    } else {
      this.area.x -= 5;
      if (newX >= this.area.x) {
        this.area.x = newX;
        this.hasMovedAway = false;
      }
    }

    if (newY > this.area.y) {
      this.area.y += 5;
      if (newY <= this.area.y) {
        this.area.y = newY;
        this.hasMovedAway = false;
      }
    } else {
      this.area.y -= 5;
      if (newY >= this.area.y) {
        this.area.y = newY;
        this.hasMovedAway = false;
      }
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
