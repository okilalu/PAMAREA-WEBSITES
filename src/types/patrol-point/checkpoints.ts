// export type CheckpointStatus = "Aktif" | "Nonaktif";

// export interface Checkpoint {
//   id: string;
//   code: string;
//   name: string;
//   site: string;
//   description?: string;
//   latitude?: number | null;
//   longitude?: number | null;
//   radiusMeters: number;
//   status?: CheckpointStatus;
//   nfcStatus?: string | null;
// }

// export type CreateCheckpointPayload = Omit<Checkpoint, "id">;

// export type UpdateCheckpointPayload = Partial<CreateCheckpointPayload>;

// src/types/patrol-point/patrol-point.types.ts
import type { PatrolPointStatus } from "../enums/prisma-enums";
import type { Site } from "../site/site";

export interface PatrolPoint {
  id: string;
  siteId: string;
  createdById: string;
  code: string;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  status: PatrolPointStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  site?: Site;
}
