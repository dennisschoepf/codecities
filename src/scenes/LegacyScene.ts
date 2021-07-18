import { mp5 } from '../../main';
import { SceneManager } from './SceneManager';
import { Scenes } from './scenes';

export class LegacyScene {
  constructor() {}

  draw() {
    mp5.background(100);
  }

  onSceneClick(sm: SceneManager) {
    console.log('Click on legacy scene');
    sm.changeSceneTo(Scenes.OVERVIEW);
  }
}
