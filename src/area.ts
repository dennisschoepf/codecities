import { BehaviorSubject, Subject } from 'rxjs';
import { mp5 } from '../main';

export const playerHead$ = new Subject<{ x: number; y: number; w: number }>();

export const revealedArea$ = new BehaviorSubject<{ x: number; y: number; w: number }>({
  x: 0,
  y: 0,
  w: 0,
});

export function areasColliding(
  areaOne: { x: number; y: number; w: number },
  areaTwo: { x: number; y: number; w: number },
  log?: boolean
): boolean {
  const distanceBetweenPoints = mp5.dist(areaOne.x, areaOne.y, areaTwo.x, areaTwo.y);
  const shapeArea = areaTwo.w / 2 + areaOne.w / 2;

  return distanceBetweenPoints < shapeArea;
}
