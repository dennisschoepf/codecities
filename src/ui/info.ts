import store from '../store';

export interface InfoMessageType {
  headline: string;
  innerHTML: string;
}

export class InfoMessage {
  infoMessage: HTMLElement;
  infoMessageHeadline: HTMLElement;
  infoMessageContents: HTMLElement;
  infoMessageClose: HTMLElement;
  backdrop: HTMLElement;

  constructor() {
    this.infoMessage = document.getElementById('info-message');
    this.infoMessageHeadline = document.getElementById('info-message-headline');
    this.infoMessageContents = document.getElementById('info-message-contents');
    this.infoMessageClose = document.getElementById('info-message-close');
    this.backdrop = document.getElementById('backdrop');

    this.backdrop.addEventListener('click', this.onBackdropClick);
    this.infoMessageClose.addEventListener('click', this.onCloseClick);

    store.subscribe((state, prevState) => {
      if (state.infoMessageShown) {
        this.show();
      } else {
        this.hide();
      }

      if (state.infoMessages.length > prevState.infoMessages.length) {
        const newMessage = state.infoMessages[state.infoMessages.length - 1];
        this.setContents(newMessage.headline, newMessage.innerHTML);
        store.setState({ infoMessageShown: true });
      }
    });
  }

  private setContents(headline: string, innerHTML: string) {
    this.infoMessageHeadline.innerText = headline;
    this.infoMessageContents.innerHTML = innerHTML;
  }

  private show() {
    this.infoMessage.style.display = 'block';
    this.backdrop.style.display = 'block';
  }

  private hide() {
    this.infoMessage.style.display = 'none';
    this.backdrop.style.display = 'none';
  }

  private onBackdropClick() {
    store.setState({ infoMessageShown: false });
  }

  private onCloseClick() {
    store.setState({ infoMessageShown: false });
  }
}
