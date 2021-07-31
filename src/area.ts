import { BehaviorSubject, Subject } from 'rxjs';
import { mp5 } from '../main';
import { Area } from './types';

export const playerHead$ = new Subject<Area>();

export const revealedArea$ = new BehaviorSubject<Area>({
  x: 0,
  y: 0,
  w: 0,
});

export function areasColliding(areaOne: Area, areaTwo: Area): boolean {
  const distanceBetweenPoints = mp5.dist(areaOne.x, areaOne.y, areaTwo.x, areaTwo.y);
  const shapeArea = areaTwo.w / 2 + areaOne.w / 2;

  return distanceBetweenPoints < shapeArea;
}
