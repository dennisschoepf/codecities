import { LegacyScene } from './LegacyScene';
import { OverviewScene } from './OverviewScene';
import { Scenes } from './scenes';

export class SceneManager {
  currentScene: Scenes;

  // Scenes
  overviewScene: OverviewScene;
  legacyScene: LegacyScene;

  constructor() {
    this.currentScene = Scenes.OVERVIEW;

    // Scenes
    this.overviewScene = new OverviewScene();
    this.legacyScene = new LegacyScene();
  }

  public draw() {
    if (this.currentScene === Scenes.OVERVIEW) {
      this.overviewScene.draw();
    } else if (this.currentScene === Scenes.LEGACY) {
      this.legacyScene.draw();
    }
  }

  public changeSceneTo(newScene: Scenes) {
    this.currentScene = newScene;
  }

  public handleClick() {
    if (this.currentScene === Scenes.OVERVIEW) {
      this.overviewScene.onSceneClick(this);
    } else if (this.currentScene === Scenes.LEGACY) {
      this.legacyScene.onSceneClick(this);
    }
  }
}
