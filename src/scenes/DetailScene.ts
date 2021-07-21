import { mp5 } from '../../main';
import store from '../store';
import { Scenes } from './scenes';

export class DetailScene {
  constructor() {}

  draw() {
    mp5.background(100);
  }

  onSceneClick() {
    console.log('Click on detail scene');
    console.log('Changing back to overview');
    store.setState({ currentScene: Scenes.OVERVIEW });
  }
}
