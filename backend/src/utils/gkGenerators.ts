import { Question } from './mathGenerators';

export const generateAnimalsGK = (level: number): Question => {
  const questions = [
    { q: 'Which animal is known as the "King of the Jungle"?', a: 'Lion' },
    { q: 'What is the largest land animal?', a: 'Elephant' },
    { q: 'What is a baby dog called?', a: 'Puppy' },
    { q: 'Which bird can fly backwards?', a: 'Hummingbird' },
    { q: 'How many legs does a spider have?', a: '8' }
  ];
  const item = questions[Math.floor(Math.random() * questions.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: item.q,
    correctAnswer: item.a,
    type: 'animals',
    topic: 'Animals',
    level
  };
};

export const generateIndiaGK = (level: number): Question => {
  const questions = [
    { q: 'What is the capital of India?', a: 'New Delhi' },
    { q: 'Which is the national animal of India?', a: 'Tiger' },
    { q: 'How many colors are there in the Indian flag?', a: '3' },
    { q: 'Who is known as the "Father of the Nation" in India?', a: 'Mahatma Gandhi' },
    { q: 'Which festival is known as the "Festival of Lights"?', a: 'Diwali' }
  ];
  const item = questions[Math.floor(Math.random() * questions.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: item.q,
    correctAnswer: item.a,
    type: 'india',
    topic: 'India Facts',
    level
  };
};

export const generateScienceGK = (level: number): Question => {
  const questions = [
    { q: 'What is the center of our Solar System?', a: 'Sun' },
    { q: 'How many planets are there in our Solar System?', a: '8' },
    { q: 'Plants need sunlight and ___ to grow.', a: 'Water' },
    { q: 'What type of gas do we breathe out?', a: 'Carbon Dioxide' },
    { q: 'Which planet is known as the "Red Planet"?', a: 'Mars' }
  ];
  const item = questions[Math.floor(Math.random() * questions.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: item.q,
    correctAnswer: item.a,
    type: 'general',
    topic: 'Science',
    level
  };
};

export const getGKGenerator = (template: string) => {
  switch (template.toLowerCase()) {
    case 'animals': return generateAnimalsGK;
    case 'planets': return generateScienceGK;
    case 'capitals': return generateIndiaGK; // India facts include capitals
    case 'symbols': return generateIndiaGK;
    case 'general': return generateScienceGK;
    default: return generateScienceGK;
  }
};
