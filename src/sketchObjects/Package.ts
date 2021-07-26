import { asyncScheduler, distinct, distinctUntilKeyChanged, throttleTime } from 'rxjs';
import { mp5 } from '../../main';
import { revealedArea$ } from '../area';
import { colors } from '../constants/colors';
import { shapeCollision } from '../helpers';

export class Package {
  x: number;
  y: number;
  size: number;
  name: string;
  revealed: boolean;

  constructor(x: number, y: number, size: number, name?: string, profileURL?: string) {
    this.x = x;
    this.y = y;
    this.size = size;

    revealedArea$.subscribe((revealedArea) => {
      this.revealed = shapeCollision({ x: this.x, y: this.y, w: 10 }, revealedArea);
    });
  }

  public place() {
    mp5.fill(mp5.color(colors.redDark));
    mp5.ellipse(this.x, this.y, 10);
  }

  public drawOnReveal() {
    if (this.revealed) {
      mp5.ellipse(this.x, this.y, this.size);
    }
  }
}
