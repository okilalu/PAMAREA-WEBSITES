// src/types/schedule/schedule-date.types.ts
import type { ScheduleDateStatus } from "../enums/prisma-enums";

export interface PatrolScheduleDate {
  id: string;
  scheduleId: string;
  date: string;
  status: ScheduleDateStatus;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}
