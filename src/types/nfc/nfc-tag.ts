// src/types/nfc/nfc-tag.types.ts
import type { NfcStatus } from "../enums/prisma-enums";

export interface NfcTag {
  id: string;
  uid: string;
  label?: string | null;
  status: NfcStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
