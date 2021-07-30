import create from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { Scenes } from './scenes/scenes';
import { CompanionMessage, CompanionState } from './ui/companion';
import project from '../metadata/project.json';
import { getSubproject } from './helpers';
import { SubProject } from './types';
import { InfoMessageType } from './ui/info';

export interface State {
  currentScene: Scenes;
  companionState: CompanionState;
  infoMessageShown: boolean;
  infoMessages: InfoMessageType[];
  addInfoMessage: (newMessage: InfoMessageType) => void;
  userMessages: CompanionMessage[];
  addUserMessage: (newMessage: CompanionMessage) => void;
  currContributors: any;
  currLegacy: any;
  currPackages: any;
  setDetailScene: (packageName: string) => void;
}

const store = create<State>(
  devtools((set) => ({
    currentScene: Scenes.OVERVIEW,
    companionState: CompanionState.IDLE,
    infoMessageShown: false,
    infoMessages: [],
    addInfoMessage: (newMessage) =>
      set((state) => ({ infoMessages: [...state.infoMessages, newMessage] })),
    userMessages: [],
    addUserMessage: (newMessage) =>
      set((state) => ({ userMessages: [...state.userMessages, newMessage] })),
    currContributors: [],
    currLegacy: [],
    currPackages: [],
    setDetailScene: (packageName) =>
      set(() => ({
        currContributors: getSubproject(packageName, project.subprojects as SubProject[]).contents
          .contributors,
        currLegacy: getSubproject(packageName, project.subprojects as SubProject[]).contents.legacy,
        currPackages: getSubproject(packageName, project.subprojects as SubProject[]).contents
          .packages,
      })),
  }))
);

export default store;
