import type { PatrolRoundStatus } from "../enums/prisma-enums";
import type { PatrolCheckpoint } from "./patrol-checkpoint";

export interface PatrolRound {
  id: string;
  scheduleDateId: string;
  assignmentId: string;
  roundNumber: number;
  scheduledStartAt: string;
  scheduledEndAt: string;
  status: PatrolRoundStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  checkpoints?: PatrolCheckpoint[];
}
