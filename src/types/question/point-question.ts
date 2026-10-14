// src/types/question/point-question.types.ts
import type { Question } from "./question";

export interface PointQuestion {
  id: string;
  patrolPointId: string;
  questionId: string;
  sortOrder: number;
  isRequired: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;

  question?: Question;
}
