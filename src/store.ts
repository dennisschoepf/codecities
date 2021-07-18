import create from 'zustand/vanilla';
import { Scenes } from './scenes/scenes';

export interface State {
  currentScene: Scenes;
}

const store = create<State>(() => ({
  currentScene: Scenes.OVERVIEW,
}));

export default store;
