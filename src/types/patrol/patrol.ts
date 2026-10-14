// src/types/patrol/patrol.types.ts
import type {
  PatrolStatus,
  GpsValidationStatus,
  NfcValidationStatus,
  NfcBypassReason,
} from "../enums/prisma-enums";
import type { PatrolAnswer } from "./patrol-answer";
import type { PatrolPhoto } from "./patrol-photo";

export interface Patrol {
  id: string;
  reportNumber: string;
  userId: string;
  siteId: string;
  patrolPointId: string;
  scheduleAssignmentId?: string | null;
  checkpointId?: string | null;
  deviceId?: string | null;
  startedAt: string;
  completedAt?: string | null;

  // GPS
  latitude?: number | null;
  longitude?: number | null;
  gpsAccuracy?: number | null;
  distanceFromPoint?: number | null;
  gpsValidationStatus: GpsValidationStatus;

  // NFC
  nfcTagId?: string | null;
  nfcUidSnapshot?: string | null;
  nfcValidationStatus: NfcValidationStatus;
  nfcBypass: boolean;
  nfcBypassReason?: NfcBypassReason | null;
  nfcBypassNote?: string | null;

  status: PatrolStatus;
  createdAt: string;
  updatedAt: string;

  answers?: PatrolAnswer[];
  photos?: PatrolPhoto[];
}
