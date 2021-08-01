import create from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { Scenes } from './scenes/scenes';
import { CompanionMessage, CompanionState } from './ui/companion';
import project from '../metadata/project.json';
import { InfoMessageType } from './ui/info';
import { RevealableInterface, RevealableTypes } from './sketchObjects/Revealable';
import { getRevealablesforSubproject } from './helpers';

export interface State {
  currentScene: Scenes;
  companionState: CompanionState;
  infoMessageShown: boolean;
  infoMessages: InfoMessageType[];
  addInfoMessage: (newMessage: InfoMessageType) => void;
  userMessages: CompanionMessage[];
  addUserMessage: (newMessage: CompanionMessage) => void;
  revealables: RevealableInterface[];
  setProjectMetadata: (projectName: string) => void;
}

const store = create<State>(
  devtools((set) => ({
    currentScene: Scenes.OVERVIEW,
    companionState: CompanionState.IDLE,
    infoMessageShown: false,
    infoMessages: [],
    addInfoMessage: (newMessage) =>
      set((state) => ({ ...state, infoMessages: [...state.infoMessages, newMessage] })),
    userMessages: [],
    addUserMessage: (newMessage) =>
      set((state) => ({
        userMessages: [...state.userMessages, newMessage],
      })),
    revealables: [],
    setProjectMetadata: (projectName) =>
      set((state) => ({
        ...state,
        revealables: getRevealablesforSubproject(projectName, project.subprojects),
      })),
  }))
);

export default store;
