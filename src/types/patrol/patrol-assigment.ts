import type { AssignmentStatus } from "../enums/prisma-enums";

export interface PatrolAssignment {
  id: string;
  userId: string;
  patrolPointId: string;
  startDate: string;
  endDate?: string | null;
  status: AssignmentStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
