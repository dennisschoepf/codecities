import moment from 'moment';
import { logger } from '../logger';
import { RevealableTypes } from '../sketchObjects/Revealable';
import store from '../store';

export interface Commit {
  url: string;
  message: string;
  time: string;
}
export interface InfoMessageType {
  type: RevealableTypes;
  headline: string;
  innerHTML: string;
  imgUrl?: string;
  url?: string;
  commits?: Commit[];
  version?: string;
}

export class InfoMessage {
  type: RevealableTypes;
  name: string;
  infoMessage: HTMLElement;
  infoMessageSubheadline: HTMLElement;
  infoMessageHeadline: HTMLElement;
  infoMessageContents: HTMLElement;
  infoMessageClose: HTMLElement;
  infoMessageImgRef: HTMLImageElement;
  infoMessageLinkRef: HTMLAnchorElement;

  infoMessageCommitsHeadlineRef: HTMLElement;
  infoMessageCommitsRef: HTMLElement;
  infoMessageVersionRef: HTMLElement;
  backdrop: HTMLElement;

  constructor() {
    this.infoMessage = document.getElementById('info-message');
    this.infoMessageHeadline = document.getElementById('info-message-headline');
    this.infoMessageSubheadline = document.getElementById('info-message-subheadline');
    this.infoMessageContents = document.getElementById('info-message-contents');
    this.infoMessageClose = document.getElementById('info-message-close');
    this.infoMessageImgRef = document.getElementById('info-message-img') as HTMLImageElement;
    this.infoMessageLinkRef = document.getElementById('info-message-link') as HTMLAnchorElement;
    this.infoMessageCommitsRef = document.getElementById('info-message-contents-commits');
    this.infoMessageCommitsHeadlineRef = document.getElementById(
      'info-message-content-commits-headline'
    );
    this.infoMessageVersionRef = document.getElementById('info-message-contents-version');
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

        this.type = newMessage.type;
        this.name = newMessage.headline;

        this.infoMessageSubheadline.innerHTML = this.getTextForType();

        if (newMessage.imgUrl) {
          this.setImg(newMessage.imgUrl);
        } else {
          this.infoMessageImgRef.style.display = 'none';
        }

        if (newMessage.url) {
          this.setLink(newMessage.url);
        } else {
          this.infoMessageLinkRef.style.display = 'none';
        }

        if (this.type === RevealableTypes.CONTRIBUTOR) {
          this.infoMessageCommitsRef.style.display = 'block';
          this.infoMessageCommitsHeadlineRef.style.display = 'block';
          this.setCommits(newMessage.commits);
        } else {
          this.infoMessageCommitsRef.style.display = 'none';
          this.infoMessageCommitsHeadlineRef.style.display = 'none';
        }

        if (this.type === RevealableTypes.PACKAGE) {
          this.infoMessageVersionRef.style.display = 'block';
          this.setVersion(newMessage.version);
        } else {
          this.infoMessageVersionRef.style.display = 'none';
        }

        store.setState({ infoMessageShown: true });
      }
    });
  }

  private getTextForType(): string {
    if (this.type === RevealableTypes.CONTRIBUTOR) {
      return 'Contributor';
    } else if (this.type === RevealableTypes.PACKAGE) {
      return 'NPM Package';
    } else {
      return 'Legacy Alert';
    }
  }

  private setContents(headline: string, innerHTML: string) {
    this.infoMessageHeadline.innerText = headline;
    // this.infoMessageContents.innerHTML = innerHTML;
  }

  private setVersion(version: string) {
    this.infoMessageVersionRef.innerHTML = `This package is installed at<br/><h3>${version}</h3>`;
  }

  private setCommits(commits: Commit[]) {
    const commitEls = commits.map(
      ({ message, url, time }) =>
        `<div class="info-message-contents-commit">
         <p>${message}</p>
         <div>
            <span>${moment(time).format(
              'LLL'
            )}</span> • <a href="${url}" target="_blank">Take a look on Github</a>
         </div>
      </div>`
    );
    console.log(commitEls);

    this.infoMessageCommitsRef.innerHTML = commitEls.join('');
  }

  private setImg(imgUrl: string) {
    this.infoMessageImgRef.src = imgUrl;
    this.infoMessageImgRef.style.display = 'block';
  }

  private setLink(url: string) {
    this.infoMessageLinkRef.href = url;
    this.infoMessageLinkRef.style.display = 'block';
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
    logger.log({
      type:
        this.type === RevealableTypes.CONTRIBUTOR
          ? 'NC'
          : this.type === RevealableTypes.LEGACY
          ? 'LC'
          : 'PC',
      timestamp: Date.now(),
      message: `Closing info message for ${this.name}`,
    });
    store.setState({ infoMessageShown: false });
  }

  private onCloseClick() {
    logger.log({
      type:
        this.type === RevealableTypes.CONTRIBUTOR
          ? 'NC'
          : this.type === RevealableTypes.LEGACY
          ? 'LC'
          : 'PC',
      timestamp: Date.now(),
      message: `Closing info message for ${this.name}`,
    });
    store.setState({ infoMessageShown: false });
  }
}
