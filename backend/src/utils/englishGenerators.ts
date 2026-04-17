import { randomInt, Question } from './mathGenerators';

export const generateMissingLetters = (level: number): Question => {
  const dictionary = [
    'APPLE', 'ORANGE', 'BANANA', 'ELEPHANT', 'GIRAFFE', 
    'FRIEND', 'SCHOOL', 'TEACHER', 'GARDEN', 'FLOWER',
    'RIVER', 'MOUNTAIN', 'VALLEY', 'SUNSET', 'MORNING'
  ];
  const word = dictionary[Math.floor(Math.random() * dictionary.length)];
  let wordWithBlanks = word.split('');
  const index = Math.floor(Math.random() * word.length);
  const correctLetter = word[index];
  wordWithBlanks[index] = '_';

  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `What is the missing letter?  ${wordWithBlanks.join(' ')}`,
    correctAnswer: correctLetter,
    type: 'missing-letters',
    topic: 'Spelling',
    level
  };
};

export const generateSynonyms = (level: number): Question => {
  const pairs = [
    { word: 'Happy', answer: 'Joyful' },
    { word: 'Quick', answer: 'Fast' },
    { word: 'Silly', answer: 'Funny' },
    { word: 'Large', answer: 'Big' },
    { word: 'Small', answer: 'Tiny' },
    { word: 'Beautiful', answer: 'Pretty' },
    { word: 'Angry', answer: 'Mad' },
    { word: 'Smart', answer: 'Clever' }
  ];
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `What is a synonym (similar word) for "${pair.word}"?`,
    correctAnswer: pair.answer,
    type: 'synonyms',
    topic: 'Vocabulary',
    level
  };
};

export const generateArticles = (level: number): Question => {
  const sentences = [
    { text: 'I saw ___ elephant at the zoo.', answer: 'an' },
    { text: 'There is ___ cat on the roof.', answer: 'a' },
    { text: 'She has ___ umbrella.', answer: 'an' },
    { text: '___ sun shines brightly.', answer: 'The' },
    { text: 'He wants to buy ___ new car.', answer: 'a' }
  ];
  const item = sentences[Math.floor(Math.random() * sentences.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `Choose the correct article for: "${item.text}"`,
    correctAnswer: item.answer,
    type: 'articles',
    topic: 'Grammar',
    level
  };
};

export const getEnglishGenerator = (template: string) => {
  switch (template.toLowerCase()) {
    case 'missing-letters': return generateMissingLetters;
    case 'synonyms': return generateSynonyms;
    case 'articles': return generateArticles;
    case 'correction': return generateArticles; // Placeholder for correction
    default: return generateMissingLetters;
  }
};
