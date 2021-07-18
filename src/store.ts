import create from 'zustand/vanilla';
import { Scenes } from './scenes/scenes';
import { CompanionState } from './ui/companion';

export interface State {
  currentScene: Scenes;
  companionState: CompanionState;
}

const store = create<State>(() => ({
  currentScene: Scenes.OVERVIEW,
  companionState: CompanionState.IDLE,
}));

export default store;
