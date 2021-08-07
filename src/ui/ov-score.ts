import store from '../store';

export class OvScore {
  showScore: boolean;

  scoreFound: number;
  scoreTotal: number;

  scoreRef: HTMLElement;
  scoreFoundRef: HTMLElement;
  scoreTotalRef: HTMLElement;

  constructor() {
    this.scoreRef = document.querySelector('#ov-score');
    this.scoreFoundRef = document.querySelector('#ov-score-found');
    this.scoreTotalRef = document.querySelector('#ov-score-total');

    this.scoreFound = 0;
    this.scoreTotal = 3;

    this.scoreFoundRef.innerHTML = this.scoreFound.toString();
    this.scoreTotalRef.innerHTML = this.scoreTotal.toString();

    if (store.getState().showOvScore) {
      this.scoreRef.style.display = 'flex';
    }

    store.subscribe((state) => {
      if (state.showOvScore && !state.showScore) {
        this.scoreRef.style.display = 'flex';
      } else {
        this.scoreRef.style.display = 'none';
      }

      this.scoreFound = state.finishedSubProjects.length;

      this.scoreFoundRef.innerHTML = this.scoreFound.toString();
      this.scoreTotalRef.innerHTML = this.scoreTotal.toString();
    });
  }
}
