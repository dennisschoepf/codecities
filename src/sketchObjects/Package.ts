import { combineLatest, map } from 'rxjs';
import { mp5 } from '../../main';
import { playerHeadPosition$, pointIsRevealed, revealedArea$ } from '../area';
import { colors } from '../constants/colors';

export class Package {
  x: number;
  y: number;
  size: number;
  name: string;
  revealed: boolean;
  active: boolean = false;
  startSize: number = 5;
  currentSize: number = 5;

  constructor(x: number, y: number, size: number, name?: string, profileURL?: string) {
    this.x = x;
    this.y = y;
    this.size = size;

    combineLatest([revealedArea$, playerHeadPosition$]).subscribe(
      ([revealedArea, playerHeadPosition]) => {
        const isRevealed = pointIsRevealed({ x: this.x, y: this.y }, revealedArea);
        const isTouched = isRevealed
          ? pointIsRevealed(
              { x: this.x, y: this.y },
              {
                x: playerHeadPosition.x,
                y: playerHeadPosition.y,
                w: 30,
              }
            )
          : false;

        this.revealed = isRevealed;

        if (this.active === false && isTouched) {
          this.active = true;
          console.log(this.active);
        }
      }
    );
  }

  public place() {
    mp5.noStroke();
    mp5.rectMode('center');
    mp5.fill(mp5.color(colors.greyLight));
    mp5.rect(this.x, this.y, this.startSize, this.startSize);
  }

  public draw() {
    if (this.revealed && !this.active) {
      this.drawRevealedShape();
    } else if ((this.active && this.revealed) || (!this.revealed && this.active)) {
      this.drawActiveShape();
    } else {
      this.drawUnrevealedShape();
    }
  }

  private drawUnrevealedShape() {
    mp5.rect(this.x, this.y, this.startSize, this.startSize);
  }

  private drawRevealedShape() {
    if (this.currentSize < this.size) {
      this.currentSize++;
    } else {
      this.currentSize = this.size;
    }

    mp5.rect(this.x, this.y, this.currentSize, this.currentSize);
  }

  private drawActiveShape() {
    mp5.fill(mp5.color(colors.redLight));
    mp5.rect(this.x, this.y, this.currentSize, this.currentSize);
  }
}
