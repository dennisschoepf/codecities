import { mp5 } from '../../main';
import { colors } from '../constants/colors';

export class Contributor {
  x: number;
  y: number;
  size: number;
  name: string;
  revealed: boolean;

  constructor(x: number, y: number, size: number, name?: string, profileURL?: string) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  public place() {}

  private draw() {
    mp5.fill(mp5.color(colors.redDark));
    mp5.ellipse(this.x, this.y, this.size);
  }
}
