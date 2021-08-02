import store from '../store';

export class Intro {
  currentStep: number;

  nextButton: HTMLElement;
  step1Container: HTMLElement;
  step2Container: HTMLElement;
  step3Container: HTMLElement;
  step4Container: HTMLElement;

  constructor() {
    this.step1Container = document.getElementById('intro-step1');
    this.step2Container = document.getElementById('intro-step2');
    this.step3Container = document.getElementById('intro-step3');
    this.step4Container = document.getElementById('intro-step4');
    this.nextButton = document.getElementById('intro-button');

    this.nextButton.addEventListener('click', this.onNextClick);

    store.subscribe((state) => {
      const currentStep = state.currentIntroStep;
      this.showStep(currentStep);
    });
  }

  private onNextClick() {
    console.log('go next');

    store.setState((state) => ({ currentIntroStep: state.currentIntroStep + 1 }));
  }

  private sendConsent() {}

  private sendDemoographicData() {}

  private showStep(stepToShow: number) {
    if (stepToShow === 1) {
      this.step1Container.style.display = 'flex';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'none';
    } else if (stepToShow === 2) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'flex';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'none';
    } else if (stepToShow === 3) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'flex';
      this.step4Container.style.display = 'none';
    } else if (stepToShow === 4) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'flex';
    }
  }
}
