// src/types/patrol/patrol-answer.types.ts
import type { PatrolPhoto } from "./patrol-photo";

export interface PatrolAnswer {
  id: string;
  patrolId: string;
  questionId: string;
  questionTextSnapshot: string;
  answerValue?: string | null;
  answerLabelSnapshot?: string | null;
  createdAt: string;
  updatedAt: string;

  photos?: PatrolPhoto[];
}
