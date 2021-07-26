import { BehaviorSubject } from 'rxjs';

export const revealedArea$ = new BehaviorSubject<{ x: number; y: number; w: number }>({
  x: 0,
  y: 0,
  w: 0,
});
