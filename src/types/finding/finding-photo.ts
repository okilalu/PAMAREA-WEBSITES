// src/types/finding/finding-photo.types.ts
export interface FindingPhoto {
  id: string;
  findingId: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}
