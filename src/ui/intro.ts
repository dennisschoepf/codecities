import { logger } from '../logger';
import { Scenes } from '../scenes/scenes';
import store from '../store';

export class Intro {
  currentStep: number;
  anonymous: boolean;

  nextButton: HTMLElement;
  anonymousCheckbox: HTMLInputElement;
  introContainer: HTMLElement;
  introBackdrop: HTMLElement;
  step1Container: HTMLElement;
  step2Container: HTMLElement;
  step3Container: HTMLElement;
  step4Container: HTMLElement;
  step5Container: HTMLElement;
  step6Container: HTMLElement;
  step7Container: HTMLElement;

  nameRef: HTMLInputElement;
  ageRef: HTMLInputElement;
  backgroundRef: HTMLInputElement;
  experienceRef: HTMLSelectElement;

  fb1: HTMLTextAreaElement;
  fb2: HTMLTextAreaElement;
  fb3: HTMLTextAreaElement;
  fb4: HTMLTextAreaElement;
  fb5: HTMLTextAreaElement;
  fb6: HTMLTextAreaElement;
  fb7: HTMLTextAreaElement;
  fb8: HTMLTextAreaElement;
  fb9: HTMLTextAreaElement;
  fb10: HTMLTextAreaElement;

  errorRef: HTMLElement;

  constructor() {
    this.step1Container = document.getElementById('intro-step1');
    this.step2Container = document.getElementById('intro-step2');
    this.step3Container = document.getElementById('intro-step3');
    this.step4Container = document.getElementById('intro-step4');
    this.step5Container = document.getElementById('intro-step5');
    this.step6Container = document.getElementById('intro-step6');
    this.step7Container = document.getElementById('intro-step7');
    this.nextButton = document.getElementById('intro-button');
    this.anonymousCheckbox = document.querySelector('#intro-anonymous');
    this.introContainer = document.querySelector('#intro');
    this.introBackdrop = document.querySelector('#intro-backdrop');

    this.nameRef = document.querySelector('#intro-name');
    this.ageRef = document.querySelector('#intro-age');
    this.backgroundRef = document.querySelector('#intro-background');
    this.experienceRef = document.querySelector('#intro-experience');

    this.fb1 = document.querySelector('#fb-1');
    this.fb2 = document.querySelector('#fb-2');
    this.fb3 = document.querySelector('#fb-3');
    this.fb4 = document.querySelector('#fb-4');
    this.fb5 = document.querySelector('#fb-5');
    this.fb6 = document.querySelector('#fb-6');
    this.fb7 = document.querySelector('#fb-7');
    this.fb8 = document.querySelector('#fb-8');
    this.fb9 = document.querySelector('#fb-9');
    this.fb10 = document.querySelector('#fb-10');

    this.errorRef = document.querySelector('#intro-error');

    this.nextButton.addEventListener('click', () => this.onNextClick());

    this.currentStep = store.getState().currentIntroStep;

    if (this.currentStep === 0) {
      this.introContainer.style.display = 'none';
      this.introBackdrop.style.display = 'none';
    } else {
      this.showStep();
    }

    store.subscribe((state) => {
      this.currentStep = state.currentIntroStep;
      this.anonymous = state.participantAnonymous;

      if (state.currentIntroStep === 2) {
        this.nextButton.innerHTML = 'Agree';
      } else if (state.currentIntroStep === 3) {
        this.nextButton.innerHTML = 'Confirm';
      } else if (state.currentIntroStep === 4) {
        this.nextButton.innerHTML = 'Start already!';
      } else if (state.currentIntroStep === 7) {
        this.nextButton.style.display = 'none';
      } else if (state.currentIntroStep === 0) {
        this.introContainer.style.display = 'none';
        this.introBackdrop.style.display = 'none';
      } else {
        this.nextButton.innerHTML = 'Continue';
      }

      if (state.currentIntroStep !== 0) {
        this.introContainer.style.display = 'block';
        this.introBackdrop.style.display = 'block';
      }

      if (this.anonymous) {
        this.hideNameInput();
      }

      this.showStep();
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

        store.setState({
          uid: `${Date.now()}_${name.replace(/[^a-zA-Z ]/g, '').toLowerCase()}`,
        });

        this.sendDemographicData(name, age, background, experience);
      }
    }

    if (currentStep === 4) {
      store.setState({ currentIntroStep: 0 });

      setTimeout(() => {
        if (store.getState().currentScene !== Scenes.DETAIL) {
          store.getState().addUserMessage({
            inputWanted: false,
            text: "Hey there! Need help here? You'll have to touch the parts of the project you want to take a look at with you character's head. As soon as the project part (packages/...) is highlighted, you can click it to dive deeper into what lies behind 🔬",
          });
        }
      }, 3000);

      return;
    }

    if (currentStep === 6) {
      this.sendGeneralQuestionAnswers();
    }

    store.setState((state) => ({ currentIntroStep: state.currentIntroStep + 1 }));
  }

  private sendDemographicData(name: string, age: number, background: string, experience: string) {
    logger.logPersonalData(name, age, background, experience);
  }

  private sendGeneralQuestionAnswers() {
    const answers = [
      this.fb1.value,
      this.fb2.value,
      this.fb3.value,
      this.fb4.value,
      this.fb5.value,
      this.fb6.value,
      this.fb7.value,
      this.fb8.value,
      this.fb9.value,
      this.fb10.value,
    ];

    console.log(answers);
    logger.logQuestions(answers);
  }

  private sendKnowledgeQuestionAnswers() {}

  private hideNameInput() {}

  private showStep() {
    if (this.currentStep === 1) {
      this.step1Container.style.display = 'flex';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'none';
      this.step5Container.style.display = 'none';
      this.step6Container.style.display = 'none';
      this.step7Container.style.display = 'none';
    } else if (this.currentStep === 2) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'flex';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'none';
      this.step5Container.style.display = 'none';
      this.step6Container.style.display = 'none';
      this.step7Container.style.display = 'none';
    } else if (this.currentStep === 3) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'flex';
      this.step4Container.style.display = 'none';
      this.step5Container.style.display = 'none';
      this.step6Container.style.display = 'none';
      this.step7Container.style.display = 'none';
    } else if (this.currentStep === 4) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'flex';
      this.step5Container.style.display = 'none';
      this.step6Container.style.display = 'none';
      this.step7Container.style.display = 'none';
    } else if (this.currentStep === 5) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'none';
      this.step5Container.style.display = 'flex';
      this.step6Container.style.display = 'none';
      this.step7Container.style.display = 'none';
    } else if (this.currentStep === 6) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'none';
      this.step5Container.style.display = 'none';
      this.step6Container.style.display = 'flex';
      this.step7Container.style.display = 'none';
    } else if (this.currentStep === 7) {
      this.step1Container.style.display = 'none';
      this.step2Container.style.display = 'none';
      this.step3Container.style.display = 'none';
      this.step4Container.style.display = 'none';
      this.step5Container.style.display = 'none';
      this.step6Container.style.display = 'none';
      this.step7Container.style.display = 'flex';
    }
  }
}
