// src/types/schedule/patrol-schedule.types.ts
import type { ScheduleStatus } from "../enums/prisma-enums";
import type { PatrolSchedulePoint } from "./schedule-point";

export interface PatrolSchedule {
  id: string;
  siteId: string;
  name: string;
  startTime: string;
  endTime: string;
  intervalMinutes: number;
  gracePeriodMinutes: number;
  enforceSequence: boolean;
  status: ScheduleStatus;
  createdById: string;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;

  points?: PatrolSchedulePoint[];
}
