import type { FindingSeverity, FindingStatus } from "../enums/prisma-enums";
import type { FindingPhoto } from "./finding-photo";
import type { User } from "../user/user";

export interface Finding {
  id: string;
  patrolId: string;
  patrolPointId: string;
  reportedById: string;
  assignedToId?: string | null;
  resolvedById?: string | null;
  title: string;
  description?: string | null;
  severity: FindingSeverity;
  status: FindingStatus;
  resolvedAt?: string | null;
  resolutionNote?: string | null;
  createdAt: string;
  updatedAt: string;

  photos?: FindingPhoto[];
  reportedBy?: User;
  assignedTo?: User;
}
