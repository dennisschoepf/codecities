import p5 from 'p5';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './src/constants';

const sketch = (s) => {
  s.setup = () => {
    s.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  };
  s.draw = () => {
    s.background(220);
    s.rect(200, 200, 200, 200);
    s.print(s.mouseX, s.mouseY);
  };
};

const p5Instance = new p5(sketch);
