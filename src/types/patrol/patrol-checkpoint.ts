// src/types/patrol/patrol-checkpoint.types.ts
import type { PatrolCheckpointStatus } from "../enums/prisma-enums";
import type { PatrolPoint } from "../patrol-point/checkpoints";

export interface PatrolCheckpoint {
  id: string;
  roundId: string;
  patrolPointId: string;
  sequence: number;
  required: boolean;
  status: PatrolCheckpointStatus;
  pointCodeSnapshot: string;
  pointNameSnapshot: string;
  radiusMetersSnapshot: number;
  visitedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  patrolPoint?: PatrolPoint;
}
