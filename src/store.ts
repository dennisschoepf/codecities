import create from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { Scenes } from './scenes/scenes';
import { CompanionMessage, CompanionState } from './ui/companion';
import project from '../metadata/project.json';
import { InfoMessageType } from './ui/info';
import { RevealableInterface, RevealableTypes } from './sketchObjects/Revealable';
import { getRevealablesforSubproject } from './helpers';
import { SubProject } from './types';

export interface State {
  currentIntroStep: number;
  currentScene: Scenes;
  currentSubproject?: string;
  companionState: CompanionState;
  infoMessageShown: boolean;
  infoMessages: InfoMessageType[];
  addInfoMessage: (newMessage: InfoMessageType) => void;
  userMessages: CompanionMessage[];
  addUserMessage: (newMessage: CompanionMessage) => void;
  revealables: RevealableInterface[];
  finishedSubProjects: string[];
  setProjectMetadata: (projectName: string) => void;
}

const store = create<State>(
  devtools((set) => ({
    currentIntroStep: 1,
    currentScene: Scenes.OVERVIEW,
    currentSubproject: null,
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
    finishedSubProjects: [],
    setProjectMetadata: (projectName) =>
      set((state) => ({
        ...state,
        revealables: getRevealablesforSubproject(projectName, project.subprojects),
      })),
  }))
);

export default store;
