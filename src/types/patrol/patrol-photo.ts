export interface PatrolPhoto {
  id: string;
  patrolId: string;
  answerId?: string | null;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  latitude?: number | null;
  longitude?: number | null;
  capturedAt?: string | null;
  createdAt: string;
}
