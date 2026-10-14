// src/types/question/question-option.types.ts
export interface QuestionOption {
  id: string;
  questionId: string;
  value: string;
  label: string;
  sortOrder: number;
  createdAt: string;
}
