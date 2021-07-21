import { mp5 } from '../../main';
import { colors } from '../constants/colors';

export class Edge {
  x: number;
  y: number;
  r: number;
  name: string;

  constructor({ x, y, r, name }: { x: number; y: number; r: number; name: string }) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.name = name;
  }

  draw() {
    mp5.fill(mp5.color(colors.grey));
    mp5.ellipse(this.x, this.y, this.r * 2);
    mp5.textSize(20);
    mp5.fill(0);
    mp5.text(this.name, this.x, this.y);
  }
}
