import { create } from 'zustand';

interface Question {
  question: string;
  correctAnswer: number;
  topic?: string;
}

interface GameState {
  score: number;
  hearts: number;
  isGameOver: boolean;
  isLevelComplete: boolean;
  questions: Question[];
  currentQuestionIndex: number;
  mistakesInCurrentQuestion: number;

  // Actions
  setQuestions: (questions: Question[]) => void;
  answerQuestion: (isCorrect: boolean) => void;
  resetLevel: () => void;
  nextQuestion: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  hearts: 5,
  isGameOver: false,
  isLevelComplete: false,
  questions: [],
  currentQuestionIndex: 0,

  setQuestions: (questions) => set({
    questions,
    currentQuestionIndex: 0,
    hearts: 5,
    score: 0,
    isGameOver: false,
    isLevelComplete: false,
    mistakesInCurrentQuestion: 0
  }),

  // Only advance question if answer is CORRECT (retry mechanic)
  answerQuestion: (isCorrect) => set((state) => {
    if (isCorrect) {
      const newScore = state.score + 1;
      const newIndex = state.currentQuestionIndex + 1;
      const isComplete = newIndex >= state.questions.length;
      return {
        score: newScore,
        currentQuestionIndex: isComplete ? state.currentQuestionIndex : newIndex,
        isLevelComplete: isComplete,
        mistakesInCurrentQuestion: 0, // Reset for next mission
      };
    } else {
      // Wrong: STAY on the same question
      const isFirstMistake = state.mistakesInCurrentQuestion === 0;
      
      if (isFirstMistake) {
        return {
          mistakesInCurrentQuestion: 1
          // No heart lost!
        };
      } else {
        const newHearts = state.hearts - 1;
        return {
          hearts: newHearts,
          isGameOver: newHearts <= 0,
          mistakesInCurrentQuestion: state.mistakesInCurrentQuestion + 1
        };
      }
    }
  }),

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1
  })),

  resetLevel: () => set((state) => ({
    hearts: 5,
    score: 0,
    currentQuestionIndex: 0,
    isGameOver: false,
    isLevelComplete: false,
    mistakesInCurrentQuestion: 0,
    questions: [...state.questions] // keep same questions, reset progress
  })),
}));
