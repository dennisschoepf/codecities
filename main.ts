import p5 from 'p5';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './src/constants/screen';
import { DetailScene } from './src/scenes/DetailScene';
import { OverviewScene } from './src/scenes/OverviewScene';
import { Scenes } from './src/scenes/scenes';
import store from './src/store';
import { Companion, CompanionState } from './src/ui/companion';
import { InfoMessage } from './src/ui/info';
import { Intro } from './src/ui/intro';

const sketch = (s: p5) => {
  // Scenes
  let overviewScene: OverviewScene;
  let detailScene: DetailScene;

  s.setup = () => {
    s.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    s.noCursor();

    new Intro();
    new Companion();
    new InfoMessage();

    overviewScene = new OverviewScene();
    detailScene = new DetailScene();
  };

  s.draw = () => {
    const { currentScene } = store.getState();

    if (currentScene === Scenes.OVERVIEW) {
      overviewScene.draw();
    } else if (currentScene === Scenes.DETAIL) {
      detailScene.draw();
    }
  };

  s.mousePressed = () => {
    const { currentScene, companionState, infoMessageShown } = store.getState();

    if (
      companionState !== CompanionState.ACTIVE ||
      !infoMessageShown ||
      store.getState().currentIntroStep === 0
    ) {
      if (currentScene === Scenes.OVERVIEW) {
        overviewScene.onSceneClick();
      } else if (currentScene === Scenes.DETAIL) {
        detailScene.onSceneClick();
      }
    }
  };
};

// Setup Sketch
export const mp5 = new p5(sketch);
