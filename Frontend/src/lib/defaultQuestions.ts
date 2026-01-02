// src/lib/defaultQuestions.ts
export interface Question {
  id: string; // temporary local ID
  text: string;
  type: 'text' | 'select' | 'rating';
  options?: string[];
  required: boolean;
}

export const defaultQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is your current solution for managing inventory?',
    type: 'text',
    required: true,
  },
  {
    id: 'q2',
    text: 'How satisfied are you with your current provider?',
    type: 'rating',
    required: true,
  },
  {
    id: 'q3',
    text: 'What features are most important to you?',
    type: 'select',
    options: ['Cost Efficiency', 'Speed', 'Reliability', 'Customer Support', 'Integration'],
    required: true,
  },
  {
    id: 'q4',
    text: 'What is your monthly budget for this solution?',
    type: 'select',
    options: ['Under $500', '$500-$1000', '$1000-$5000', 'Over $5000'],
    required: false,
  },
  {
    id: 'q5',
    text: 'Any specific pain points with your current setup?',
    type: 'text',
    required: false,
  },
];