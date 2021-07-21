import p5 from 'p5';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './src/constants/screen';
import { LegacyScene } from './src/scenes/LegacyScene';
import { OverviewScene } from './src/scenes/OverviewScene';
import { Scenes } from './src/scenes/scenes';
import store from './src/store';
import { Companion, CompanionState } from './src/ui/companion';

const sketch = (s: p5) => {
  // Scenes
  let overviewScene: OverviewScene;
  let legacyScene: LegacyScene;

  s.setup = () => {
    s.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    s.noCursor();

    new Companion();

    overviewScene = new OverviewScene();
    legacyScene = new LegacyScene();
  };

  s.draw = () => {
    const { currentScene } = store.getState();

    if (currentScene === Scenes.OVERVIEW) {
      overviewScene.draw();
    } else if (currentScene === Scenes.LEGACY) {
      legacyScene.draw();
    }
  };

  s.mousePressed = () => {
    const { currentScene, companionState } = store.getState();

    if (companionState === CompanionState.ACTIVE) return;

    if (currentScene === Scenes.OVERVIEW) {
      overviewScene.onSceneClick();
    } else if (currentScene === Scenes.LEGACY) {
      legacyScene.onSceneClick();
    }
  };
};

// Setup Sketch
export const mp5 = new p5(sketch);
