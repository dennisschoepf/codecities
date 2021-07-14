export class Player {
  x: number;
  y: number;
  sketch: any;

  constructor(sketch: any, x: number, y: number) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
  }

  draw() {}
}
