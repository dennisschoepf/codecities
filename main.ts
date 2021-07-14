import p5 from 'p5';
import { colors } from './src/colors';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './src/constants';
import { Player } from './src/Player';

const sketch = (s) => {
  let player;

  s.setup = () => {
    s.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    s.noCursor();

    player = new Player();
  };

  s.draw = () => {
    s.background(s.color(colors.greyLighter));

    player.follow();
  };
};

export const mp5 = new p5(sketch);
