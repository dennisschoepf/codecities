import anime from 'animejs/lib/anime.es';
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
  timestamp: number;
}

export class Companion {
  ref: HTMLElement;
  messageRef: HTMLElement;
  messageTextRef: HTMLElement;
  messageInputRef: HTMLElement;
  messageButtonRef: HTMLElement;
  hoverAnimation: any;
  message: CompanionMessage;

  constructor() {
    this.ref = document.getElementById('companion');
    this.messageRef = document.getElementById('message');
    this.messageTextRef = document.getElementById('message-text');
    this.messageInputRef = document.getElementById('message-input');
    this.messageButtonRef = document.getElementById('message-confirm');

    this.ref.addEventListener('click', () => this.handleClick());
    this.ref.addEventListener('mouseover', () => this.handleMouseEnter());
    this.ref.addEventListener('mouseleave', () => this.handleMouseLeave());

    this.messageButtonRef.addEventListener('click', () => this.confirmMessage());

    this.pupilFollowCursor();

    store.subscribe(
      (companionState) => {
        if (companionState === CompanionState.ACTIVE) {
          this.showActiveShape();
          this.scaleUpCompanion();
          this.stopAwaitAnimation();
          this.showMessage(this.message);
        } else if (companionState === CompanionState.IDLE) {
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

    store.subscribe(
      (messages: CompanionMessage[], prevMessages: CompanionMessage[]) => {
        if (prevMessages.length !== messages.length) {
          const newMessage = messages[messages.length - 1];
          this.message = newMessage;

          store.setState({ companionState: CompanionState.AWAIT });
        }
      },
      (state) => state.userMessages
    );
  }

  showMessage(message: CompanionMessage) {
    this.messageTextRef.innerText = message.text;
    this.messageRef.style.display = 'flex';

    if (message.inputWanted) {
      this.messageInputRef.style.display = 'block';
    } else {
      this.messageInputRef.style.display = 'none';
    }
  }

  confirmMessage() {
    console.log(this.message);

    if (this.message.inputWanted) {
      // Get text from textarea
      // Send via API
    }

    // Hide Message
    store.setState({ companionState: CompanionState.IDLE });
    this.messageRef.style.display = 'none';
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
    const indicator = document.getElementById('companion-await-indicator');
    indicator.style.display = 'none';
    indicator.style.opacity = '1';
    indicator.style.transform = 'scale(1) rotate(0)';

    anime.remove('#companion-await-indicator');
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
    const { companionState } = store.getState();
    let newCompanionState: CompanionState;

    if (companionState === CompanionState.ACTIVE) {
      newCompanionState = CompanionState.IDLE;
    } else {
      newCompanionState = CompanionState.ACTIVE;
    }

    store.setState({ companionState: newCompanionState });
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
