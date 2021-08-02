import store from '../store';

export class Intro {
  anonymous: boolean;

  nextButton: HTMLElement;
  anonymousCheckbox: HTMLInputElement;
  introContainer: HTMLElement;
  introBackdrop: HTMLElement;
  step1Container: HTMLElement;
  step2Container: HTMLElement;
  step3Container: HTMLElement;
  step4Container: HTMLElement;

  nameRef: HTMLInputElement;
  ageRef: HTMLInputElement;
  backgroundRef: HTMLInputElement;
  experienceRef: HTMLSelectElement;

  errorRef: HTMLElement;

  constructor() {
    this.step1Container = document.getElementById('intro-step1');
    this.step2Container = document.getElementById('intro-step2');
    this.step3Container = document.getElementById('intro-step3');
    this.step4Container = document.getElementById('intro-step4');
    this.nextButton = document.getElementById('intro-button');
    this.anonymousCheckbox = document.querySelector('#intro-anonymous');
    this.introContainer = document.querySelector('#intro');
    this.introBackdrop = document.querySelector('#intro-backdrop');

    this.nameRef = document.querySelector('#intro-name');
    this.ageRef = document.querySelector('#intro-age');
    this.backgroundRef = document.querySelector('#intro-background');
    this.experienceRef = document.querySelector('#intro-experience');

    this.errorRef = document.querySelector('#intro-error');

    this.nextButton.addEventListener('click', () => this.onNextClick());

    store.subscribe((state) => {
      this.anonymous = state.participantAnonymous;
      this.showStep(state.currentIntroStep);

      console.log(state.currentIntroStep);

      if (state.currentIntroStep === 2) {
        this.nextButton.innerHTML = 'Agree';
      } else if (state.currentIntroStep === 3) {
        this.nextButton.innerHTML = 'Confirm';
      } else if (state.currentIntroStep === 4) {
        this.nextButton.innerHTML = 'Start already!';
      } else if (state.currentIntroStep === 0) {
        this.introContainer.style.display = 'none';
        this.introBackdrop.style.display = 'none';
      }

      if (this.anonymous) {
        this.hideNameInput();
      }
    });
  }

  private onNextClick() {
    const currentStep = store.getState().currentIntroStep;

    // Track if particpant wants to be anon
    if (currentStep === 2) {
      store.setState({ participantAnonymous: this.anonymousCheckbox.checked });
    }

    // Validate input
    if (currentStep === 3) {
      const name = this.nameRef.value;
      const age = Number(this.ageRef.value);
      const background = this.backgroundRef.value;
      const experience = this.experienceRef.value;

      if (!name || !age || !background || experience === 'Choose an option...') {
        this.errorRef.style.display = 'block';
        return;
      } else {
        this.errorRef.style.display = 'none';
        this.sendDemographicData(name, age, background, experience);
      }
    }

    if (currentStep === 4) {
      store.setState({ currentIntroStep: 0 });
      return;
    }

    store.setState((state) => ({ currentIntroStep: state.currentIntroStep + 1 }));
  }

  private sendConsent() {}

  private sendDemographicData(name: string, age: number, background: string, experience: string) {
    console.log(name, age, background, experience);

    // TODO: Log
  }

  private hideNameInput() {}

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
