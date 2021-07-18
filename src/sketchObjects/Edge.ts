import { mp5 } from '../../main';
import { colors } from '../constants/colors';

export class Edge {
  x: number;
  y: number;
  r: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  draw() {
    mp5.fill(mp5.color(colors.grey));
    mp5.ellipse(this.x, this.y, this.r * 2);
  }
}
