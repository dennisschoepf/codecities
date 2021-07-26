import { CompanionMessage } from '../ui/companion';

export const introMessage = {
  text: "Hello there 👋 Let's start exploring the <a href='https://github.com/ethereumjs/ethereumjs-monorepo'>ethereumjs<a/> open source project",
  inputWanted: false,
};

export const feedbackQuestions: CompanionMessage[] = [
  {
    text: 'Would you say, that you have learned something about the underlying project from going through this interactive probe? If yes, what have you learned? If no, what was missing from the probe in your opinion?',
    inputWanted: true,
  },
  {
    text: 'What was your overall experience going through this probe? What did you like or did not like? Is there anything that stood out for you?',
    inputWanted: true,
  },
  {
    text: 'How did you experience the companion (Lower right)? Was it helpful or rather annoying?',
    inputWanted: true,
  },
  {
    text: 'Could you imageine yourself using the probe on different projects to learn about them? If so, on which projects would you want to try it out?',
    inputWanted: true,
  },
  {
    text: 'Have you felt like any information was missing on the things that were shown within the probe?',
    inputWanted: true,
  },
  {
    text: 'Would you have liked to see additional information on the underlying project? If so, what kind of information and how would you have liked its presentation?',
    inputWanted: true,
  },
  {
    text: 'Do you have any additional ideas on how playful elements or game mechanics could be used within the onboarding phase of software development projects?',
    inputWanted: true,
  },
  {
    text: 'Anything else you want to mention?',
    inputWanted: true,
  },
];

export const knowledgeQuestions: CompanionMessage[] = [
  {
    text: 'You would like to ask something on X within the block subproject, who could you ask about that?',
    inputWanted: true,
  },
  {
    text: 'What packages that are used in this project can you think of?',
    inputWanted: true,
  },
  {
    text: 'Legacy',
    inputWanted: true,
  },
];
