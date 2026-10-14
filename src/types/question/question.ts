// src/types/question/question.types.ts
import type {
  QuestionType,
  PhotoRequirement,
  QuestionStatus,
} from "../enums/prisma-enums";
import type { QuestionOption } from "./question-option";

export interface Question {
  id: string;
  code: string;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  photoRequirement: PhotoRequirement;
  status: QuestionStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;

  options?: QuestionOption[];
}
