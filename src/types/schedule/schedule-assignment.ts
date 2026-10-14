import type { ScheduleAssignmentStatus } from "../enums/prisma-enums";
import type { User } from "../user/user";
import type { PatrolSchedule } from "./patrol-schedule";

export interface PatrolScheduleAssignment {
  id: string;
  scheduleId: string;
  userId: string;
  startDate: string;
  endDate?: string | null;
  status: ScheduleAssignmentStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;

  schedule?: PatrolSchedule;
  user?: User;
}
