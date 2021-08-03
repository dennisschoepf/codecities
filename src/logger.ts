import firebase from 'firebase/app';
import 'firebase/database';
import store from './store';

const firebaseConfig = {
  apiKey: 'AIzaSyCORIIdFkDBagiVf0IeK0UxZL1qv0m90_E',
  authDomain: 'codewanderer-d9212.firebaseapp.com',
  databaseURL: 'https://codewanderer-d9212-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'codewanderer-d9212',
  storageBucket: 'codewanderer-d9212.appspot.com',
  messagingSenderId: '143940874668',
  appId: '1:143940874668:web:d2f860b4fc5d4292cf8a09',
};

type LogEventType =
  | 'CC'
  | 'OC'
  | 'RC'
  | 'LI'
  | 'LR'
  | 'LS'
  | 'LC'
  | 'PI'
  | 'PR'
  | 'PS'
  | 'PC'
  | 'NI'
  | 'NR'
  | 'NS'
  | 'NC'
  | 'GF'
  | 'SF'
  | 'OTHER';

export interface LogEvent {
  timestamp: number;
  type: LogEventType;
  message?: string;
  additionalData?: any;
}

export class Logger {
  database: firebase.database.Database;

  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.database = firebase.database();
  }

  public log(ev: LogEvent) {
    console.log('Logging event');
    const uid = store.getState().uid;
    const logEvKey = this.database.ref(uid).child('logs').push().key;

    this.database.ref(uid).update({ [`logs/${logEvKey}`]: ev });
  }

  public logPersonalData() {}

  public logKnowledgeQuestions() {}

  public logGeneralQuestions() {}
}

export const logger = new Logger();
