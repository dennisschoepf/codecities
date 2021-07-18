import p5 from 'p5';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './src/constants/screen';
import { SceneManager } from './src/scenes/SceneManager';
import { Scenes } from './src/scenes/scenes';

const sketch = (s: p5) => {
  let sm: SceneManager;

  s.setup = () => {
    s.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    s.noCursor();

    sm = new SceneManager();
  };

  s.draw = () => {
    sm.draw();
  };

  s.mousePressed = () => {
    sm.handleClick();
  };
};

export const mp5 = new p5(sketch);
