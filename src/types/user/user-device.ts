// src/types/user/user-device.types.ts
import type { DeviceStatus } from "../enums/prisma-enums";

export interface UserDevice {
  id: string;
  userId: string;
  deviceIdentifier: string;
  platform?: string | null;
  model?: string | null;
  osVersion?: string | null;
  appVersion?: string | null;
  status: DeviceStatus;
  lastSeenAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
