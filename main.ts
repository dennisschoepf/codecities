import p5 from 'p5';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './src/constants/screen';
import { OverviewScene } from './src/scenes/OverviewScene';
import { Scenes } from './src/scenes/scenes';

const sketch = (s) => {
  let currentScene: Scenes = Scenes.OVERVIEW;
  let overviewScene: OverviewScene;

  s.setup = () => {
    s.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    s.noCursor();

    overviewScene = new OverviewScene();
  };

  s.draw = () => {
    if (currentScene === Scenes.OVERVIEW) {
      overviewScene.draw();
    }
  };

  s.mousePressed = () => {
    if (currentScene === Scenes.OVERVIEW) {
      overviewScene.onSceneClick();
    }
  };
};

export const mp5 = new p5(sketch);
