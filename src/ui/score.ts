import store from '../store';

export class Score {
  showScore: boolean;

  scoreFound: number;
  scoreTotal: number;

  scoreRef: HTMLElement;
  scoreFoundRef: HTMLElement;
  scoreTotalRef: HTMLElement;

  constructor() {
    this.scoreRef = document.querySelector('#score');
    this.scoreFoundRef = document.querySelector('#score-found');
    this.scoreTotalRef = document.querySelector('#score-total');

    this.scoreFound = 0;
    this.scoreTotal = store.getState().revealables.length;

    this.scoreFoundRef.innerHTML = this.scoreFound.toString();
    this.scoreTotalRef.innerHTML = this.scoreTotal.toString();

    if (store.getState().showScore) {
      this.scoreRef.style.display = 'flex';
    }

    store.subscribe((state) => {
      if (state.showScore) {
        this.scoreRef.style.display = 'flex';
      } else {
        this.scoreRef.style.display = 'none';
      }

      this.scoreTotal = state.revealables.length;
      this.scoreFound = state.revealablesFinished;

      this.scoreFoundRef.innerHTML = this.scoreFound.toString();
      this.scoreTotalRef.innerHTML = this.scoreTotal.toString();
    });
  }
}
