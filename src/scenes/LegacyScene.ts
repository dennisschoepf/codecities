import { mp5 } from '../../main';
import store from '../store';
import { Scenes } from './scenes';
export class LegacyScene {
  constructor() {}

  draw() {
    mp5.background(100);
  }

  onSceneClick() {
    console.log('Click on legacy scene');
    store.setState({ currentScene: Scenes.OVERVIEW });
  }
}
