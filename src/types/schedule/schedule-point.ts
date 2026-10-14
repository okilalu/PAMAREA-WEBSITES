// src/types/schedule/schedule-point.types.ts
import type { PatrolPoint } from "../patrol-point/checkpoints";

export interface PatrolSchedulePoint {
  id: string;
  scheduleId: string;
  patrolPointId: string;
  sequence: number;
  required: boolean;
  createdAt: string;

  patrolPoint?: PatrolPoint;
}
