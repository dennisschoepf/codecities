import { mp5 } from '../../main';
import { areasColliding, playerHead$ } from '../area';
import { colors } from '../constants/colors';

export class Edge {
  x: number;
  y: number;
  r: number;
  name: string;

  currentSize: number;
  maxSize: number;
  isHovered: boolean;
  hoverColor: any;

  finished: boolean;

  constructor({ x, y, r, name }: { x: number; y: number; r: number; name: string }) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.name = name;
    this.maxSize = r * 2 + 20;
    this.currentSize = r * 2;
    this.hoverColor = mp5.color(colors.red);
    this.hoverColor.setAlpha(200);

    playerHead$.subscribe((playerHead) => {
      this.isHovered = areasColliding(playerHead, { x: this.x, y: this.y, w: this.r * 2 });
    });
  }

  draw() {
    if (this.finished) {
      mp5.fill(mp5.color(colors.greyLight));
      mp5.ellipse(this.x, this.y, this.r * 2);
      mp5.textSize(20);
      mp5.fill(mp5.color(colors.grey));
      mp5.text(`packages/${this.name}`, this.x - this.r / 2, this.y);
    } else {
      mp5.fill(mp5.color(colors.grey));

      if (this.isHovered) {
        mp5.fill(mp5.color(this.hoverColor));

        if (this.currentSize < this.maxSize) {
          this.currentSize++;
        } else {
          this.currentSize = this.maxSize;
        }
      } else {
        if (this.currentSize > this.r * 2) {
          this.currentSize--;
        } else {
          this.currentSize = this.r * 2;
        }
      }

      mp5.ellipse(this.x, this.y, this.currentSize);
      mp5.textSize(20);
      mp5.fill(mp5.color(colors.black));
      mp5.text(`packages/${this.name}`, this.x - this.r / 2, this.y);
    }
  }
}
