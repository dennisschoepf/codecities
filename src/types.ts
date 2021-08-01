import { RevealableInterface } from './sketchObjects/Revealable';

export interface SubProject {
  name: string;
  path: string;
  size: number;
  revealables: RevealableInterface[];
}

export interface JSONSubproject {
  name: string;
  path: string;
  size: number;
  revealables: Array<{
    type: string;
    name: string;
    contents: string;
    url: string;
    size: number;
    path?: string;
    imageUrl?: string;
  }>;
}
export interface Coordinates {
  x: number;
  y: number;
}

export interface Area {
  x: number;
  y: number;
  w: number;
}
