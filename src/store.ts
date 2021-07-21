import create from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { Scenes } from './scenes/scenes';
import { CompanionMessage, CompanionState } from './ui/companion';

export interface State {
  currentScene: Scenes;
  companionState: CompanionState;
  userMessages: CompanionMessage[];
  addUserMessage: (newMessage: CompanionMessage) => void;
}

const store = create<State>(
  devtools((set) => ({
    currentScene: Scenes.OVERVIEW,
    companionState: CompanionState.IDLE,
    userMessages: [],
    addUserMessage: (newMessage) =>
      set((state) => ({ userMessages: [...state.userMessages, newMessage] })),
  }))
);

export default store;
