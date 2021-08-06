import anime from 'animejs/lib/anime.es';
import { logger } from '../logger';
import store from '../store';

export enum CompanionState {
  IDLE = 'IDLE',
  AWAIT = 'AWAIT',
  ACTIVE = 'ACTIVE',
  SUCCESS = 'SUCCESS',
}

export interface CompanionMessage {
  text: string;
  inputWanted: boolean;
  timestamp?: number;
  onNext?: () => void;
  showIdle?: boolean;
}

export class Companion {
  ref: HTMLElement;
  messageRef: HTMLElement;
  messageTextRef: HTMLElement;
  messageInputRef: HTMLElement;
  messageButtonRef: HTMLElement;
  backdrop: HTMLElement;
  hoverAnimation: any;
  message: CompanionMessage;

  constructor() {
    this.ref = document.getElementById('companion');
    this.messageRef = document.getElementById('message');
    this.messageTextRef = document.getElementById('message-text');
    this.messageInputRef = document.getElementById('message-input');
    this.messageButtonRef = document.getElementById('message-confirm');
    this.backdrop = document.getElementById('comp-backdrop');

    this.ref.addEventListener('click', () => this.handleClick());
    this.ref.addEventListener('mouseover', () => this.handleMouseEnter());
    this.ref.addEventListener('mouseleave', () => this.handleMouseLeave());

    this.messageButtonRef.addEventListener('click', () => this.confirmMessage());

    this.pupilFollowCursor();

    store.subscribe(
      (companionState) => {
        if (companionState === CompanionState.ACTIVE) {
          this.backdrop.style.display = 'block';
          this.stopAwaitAnimation();
          this.showActiveShape();
          this.scaleUpCompanion();
          this.showMessage(this.message);
        } else if (companionState === CompanionState.IDLE) {
          this.backdrop.style.display = 'none';
          this.scaleDownCompanion();
          this.showIdleShape();
          this.stopAwaitAnimation();
        } else if (companionState === CompanionState.AWAIT) {
          this.playAwaitAnimation();
        } else if (companionState === CompanionState.SUCCESS) {
          this.stopAwaitAnimation();
          this.playSuccessAnimation();
          this.scaleDownCompanion();
          this.showIdleShape();
        }
      },
      (state) => state.companionState
    );

    store.subscribe((state, prevState) => {
      if (prevState.userMessages.length < state.userMessages.length) {
        const newMessage = state.userMessages[state.userMessages.length - 1];
        this.message = newMessage;

        store.setState({ companionState: CompanionState.ACTIVE });
      }
    });
  }

  showMessage(message: CompanionMessage) {
    this.messageTextRef.innerHTML = message.text;
    this.messageRef.style.display = 'flex';

    if (message.inputWanted) {
      this.messageInputRef.style.display = 'block';
    } else {
      this.messageInputRef.style.display = 'none';
    }
  }

  confirmMessage() {
    if (this.message.inputWanted) {
      // TODO: Get text from textarea
      // TODO: Send via API
    }

    // Hide Message
    this.messageRef.style.display = 'none';
    store.setState({ companionState: CompanionState.IDLE });
    logger.log({
      type: 'CC',
      timestamp: Date.now(),
      message: 'Close message',
    });

    if (this.message.onNext) {
      this.message.onNext();
    }
  }

  showActiveShape() {
    const mouth = document.getElementById('companion-mouth');
    mouth.style.opacity = '100%';

    anime({
      targets: '#companion-shape polygon',
      points: [{ value: '40,0 68,12 80,40 80,75 40,80 0,75 0,40 12,12' }],
      easing: 'easeOutQuad',
      duration: 500,
      loop: false,
    });
  }

  showIdleShape() {
    const mouth = document.getElementById('companion-mouth');
    mouth.style.opacity = '0%';

    anime({
      targets: '#companion-shape polygon',
      points: [{ value: '40,0 68,12 80,40 68,68 40,80 12,68 0,40 12,12' }],
      easing: 'easeOutQuad',
      duration: 500,
      loop: false,
    });
  }

  scaleUpCompanion() {
    anime({
      targets: '#companion',
      scale: 3,
      translateX: -15,
      translateY: -12,
      loop: false,
      duration: 700,
    });
  }

  scaleDownCompanion() {
    anime({
      targets: '#companion',
      scale: 1,
      loop: false,
      translateX: 0,
      translateY: 0,
      duration: 800,
    });
  }

  playSuccessAnimation() {}

  playAwaitAnimation() {
    document.getElementById('companion-await-indicator').style.display = 'inline';
    anime({
      targets: '#companion-await-indicator',
      keyframes: [
        { scale: 4, opacity: 0, rotate: '45deg', duration: 900 },
        { scale: 5, duration: 200 },
      ],
      easing: 'easeOutQuad',
      duration: 900,
      loop: true,
    });
  }

  stopAwaitAnimation() {
    anime.remove('#companion-await-indicator');

    const indicator = document.getElementById('companion-await-indicator');
    indicator.style.display = 'none';
    indicator.style.opacity = '1';
    indicator.style.transform = 'scale(1) rotate(0)';
  }

  pupilFollowCursor() {
    document.addEventListener('mousemove', (e) => {
      const pupil = document.getElementById('companion-pupil');
      const pupDim = pupil.getBoundingClientRect();

      pupil.style.transform = `translate(${-((pupDim.x - e.pageX) * 0.005)}px, ${-(
        (pupDim.y - e.pageY) *
        0.012
      )}px)`;
    });
  }

  handleClick() {
    /*const { companionState } = store.getState();
    let newCompanionState: CompanionState;

    if (companionState === CompanionState.ACTIVE) {
      newCompanionState = CompanionState.IDLE;
    } else {
      newCompanionState = CompanionState.ACTIVE;
    }

    store.setState({ companionState: newCompanionState });*/
    logger.log({
      type: 'CC',
      timestamp: Date.now(),
    });
  }

  handleMouseEnter() {
    this.showActiveShape();
  }

  handleMouseLeave() {
    const { companionState } = store.getState();

    if (companionState !== CompanionState.ACTIVE) {
      this.showIdleShape();
    }
  }
}
