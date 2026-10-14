// src/types/nfc/nfc-assignment.types.ts
import type { NfcAssignmentStatus } from "../enums/prisma-enums";
import type { PatrolPoint } from "../patrol-point/checkpoints";
import type { NfcTag } from "./nfc-tag";

export interface PatrolPointNfc {
  id: string;
  patrolPointId: string;
  nfcTagId: string;
  assignedAt: string;
  unassignedAt?: string | null;
  status: NfcAssignmentStatus;
  reason?: string | null;
  createdById: string;
  createdAt: string;

  patrolPoint?: PatrolPoint;
  nfcTag?: NfcTag;
}
