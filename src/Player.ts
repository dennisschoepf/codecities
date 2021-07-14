import { mp5 } from '../main';
import { colors } from './colors';

export class Player {
  x: number;
  y: number;
  r: number;
  easing: number;
  history: Array<{ x: number; y: number }> = [];

  constructor() {
    this.x = mp5.height / 2;
    this.y = mp5.width / 2;
    this.r = 30;
    this.easing = 0.06;
  }

  public follow() {
    const targetX = mp5.mouseX;
    const deltaX = targetX - this.x;
    this.x += deltaX * this.easing;

    const targetY = mp5.mouseY;
    const deltaY = targetY - this.y;
    this.y += deltaY * this.easing;

    this.storeInHistory({ x: this.x, y: this.y });

    this.drawPlayerTrail();
    this.drawPlayerShape(this.x, this.y);
    this.drawCursorIndicator(mp5.mouseX, mp5.mouseY, 4);
  }

  private drawPlayerShape(x: number, y: number) {
    mp5.fill(mp5.color(colors.grey));
    mp5.noStroke();
    mp5.ellipse(x, y, this.r);
  }

  private drawTrailElement(x: number, y: number, r: number) {
    mp5.noStroke();
    mp5.fill(mp5.color(colors.greyLight));
    mp5.ellipse(x, y, r);
  }

  private drawPlayerTrail() {
    const immediateHistory = this.history.slice(1).slice(-30);

    immediateHistory.forEach((pointInHistory, i) => {
      if (i % 5 === 0) {
        this.drawTrailElement(pointInHistory.x, pointInHistory.y, 2 * i);
      }
    });
  }

  private drawCursorIndicator(x: number, y: number, size: number) {
    mp5.stroke(mp5.color(colors.black));
    mp5.line(x - size, y + size, x + size, y - size);
    mp5.line(x + size, y - size, x - size, y + size);
    mp5.line(x + size, y + size, x - size, y - size);
    mp5.line(x - size, y - size, x + size, y + size);
  }

  private storeInHistory(coordinates: { x: number; y: number }) {
    const lastPositionVector = mp5.createVector(coordinates.x, coordinates.y);
    this.history.push(lastPositionVector);
  }
}
