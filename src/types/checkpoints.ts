export type CheckpointStatus = "Aktif" | "Nonaktif";

export interface Checkpoint {
  id: string;
  code: string;
  name: string;
  site: string;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
  radiusMeters: number;
  status?: CheckpointStatus;
  nfcStatus?: string | null;
}

export type CreateCheckpointPayload = Omit<Checkpoint, "id">;

export type UpdateCheckpointPayload = Partial<CreateCheckpointPayload>;
