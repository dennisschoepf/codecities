import anime from 'animejs/lib/anime.es';
import { reject } from 'core-js/fn/promise';
import store from '../store';

export enum CompanionState {
  IDLE = 'IDLE',
  AWAIT = 'AWAIT',
  ACTIVE = 'ACTIVE',
  SUCCESS = 'SUCCESS',
}

export class Companion {
  ref: HTMLElement;
  hoverAnimation: any;

  constructor() {
    this.ref = document.getElementById('companion');
    this.ref.addEventListener('click', () => this.handleClick());
    this.ref.addEventListener('mouseover', () => this.handleMouseEnter());
    this.ref.addEventListener('mouseleave', () => this.handleMouseLeave());

    store.subscribe(
      (companionState) => {
        if (companionState === CompanionState.ACTIVE) {
          this.showActiveShape();
          this.scaleUpCompanion();
          this.pupilFollowCursor();
        } else if (companionState === CompanionState.IDLE) {
          this.scaleDownCompanion();
          this.showIdleShape();
        } else if (companionState === CompanionState.AWAIT) {
          this.playAwaitAnimation();
        } else if (companionState === CompanionState.SUCCESS) {
          this.playSuccessAnimation();
          this.scaleDownCompanion();
          this.showIdleShape();
        }
      },
      (state) => state.companionState
    );
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

  playAwaitAnimation() {}

  pupilFollowCursor() {
    document.addEventListener('mousemove', (e) => {
      const pupil = document.getElementById('companion-pupil');
      const pupDim = pupil.getBoundingClientRect();

      pupil.style.transform = `translate(${-((pupDim.x - e.pageX) * 0.005)}px, ${-(
        (pupDim.y - e.pageY) *
        0.015
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
