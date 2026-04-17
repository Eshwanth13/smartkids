export interface Question {
  id: string;
  question: string;
  correctAnswer: number | string;
  type: string;
  options?: (number | string)[];
  topic: string;
  level: number;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Phase 1: Basic Generators
export const generateAddition = (min: number, max: number, level: number): Question => {
  const a = randomInt(min, max);
  const b = randomInt(min, max);
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `${a} + ${b}`,
    correctAnswer: a + b,
    type: 'addition',
    topic: 'Addition',
    level
  };
};

export const generateSubtraction = (min: number, max: number, level: number): Question => {
  let a = randomInt(min, max);
  let b = randomInt(min, max);
  if (a < b) [a, b] = [b, a];
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `${a} - ${b}`,
    correctAnswer: a - b,
    type: 'subtraction',
    topic: 'Subtraction',
    level
  };
};

// Phase 1: Advanced Generators (Higher Classes)

export const generateBODMAS = (min: number, max: number, level: number): Question => {
  const a = randomInt(min, max);
  const b = randomInt(min, max);
  const c = randomInt(1, 5);
  // Example: a + b * c
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `${a} + ${b} × ${c}`,
    correctAnswer: a + (b * c),
    type: 'bodmas',
    topic: 'Operations',
    level
  };
};

export const generateFractions = (min: number, max: number, level: number): Question => {
  const denom = randomInt(2, 10);
  const num1 = randomInt(1, denom - 1);
  const num2 = randomInt(1, denom - 1);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `${num1}/${denom} + ${num2}/${denom}`,
    correctAnswer: `${num1 + num2}/${denom}`,
    type: 'fractions',
    topic: 'Fractions',
    level
  };
};

export const generateDecimals = (min: number, max: number, level: number): Question => {
  const a = parseFloat((Math.random() * (max - min) + min).toFixed(1));
  const b = parseFloat((Math.random() * (max - min) + min).toFixed(1));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `${a} + ${b}`,
    correctAnswer: parseFloat((a + b).toFixed(1)),
    type: 'decimals',
    topic: 'Decimals',
    level
  };
};

export const getQuestionGenerator = (type: string) => {
  switch (type.toLowerCase()) {
    case 'addition': return generateAddition;
    case 'subtraction': return generateSubtraction;
    case 'bodmas': return generateBODMAS;
    case 'fractions': return generateFractions;
    case 'decimals': return generateDecimals;
    default: return generateAddition;
  }
};
