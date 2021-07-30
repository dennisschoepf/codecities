import { combineLatest, map } from 'rxjs';
import { mp5 } from '../../main';
import { playerHead$, areasColliding, revealedArea$ } from '../area';
import { colors } from '../constants/colors';

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
  corners: number = 10;
  startSize: number = 5;
  currentSize: number;
  wasTouched: boolean = false;
  packageState: PackageStates = PackageStates.HIDDEN;

  constructor(x: number, y: number, size: number, name?: string, packageURL?: string) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.name = name;
    this.url = packageURL;
    this.currentSize = this.startSize;

    combineLatest([revealedArea$, playerHead$]).subscribe(([revealedArea, playerHead]) => {
      const isRevealed = areasColliding(
        { x: this.x, y: this.y, w: this.currentSize },
        revealedArea
      );
      const isTouched = areasColliding({ x: this.x, y: this.y, w: this.size }, playerHead, true);

      if (this.wasTouched) {
        this.packageState = PackageStates.ACTIVE;
      } else if (isRevealed && !this.wasTouched) {
        this.packageState = PackageStates.REVEALED;

        if (isTouched) {
          this.wasTouched = true;
        }
      } else {
        this.packageState = PackageStates.HIDDEN;
      }

      // console.log(this.packageState);
    });
  }

  public draw() {
    mp5.noStroke();

    if (this.packageState === PackageStates.HIDDEN) {
      // Scale down after it was revealed or active
      if (this.currentSize > this.startSize) {
        this.currentSize--;
      }

      mp5.square(this.x, this.y, this.currentSize, this.corners);
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
    }
  }
}
