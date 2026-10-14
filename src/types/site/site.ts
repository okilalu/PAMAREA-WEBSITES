import type { SiteStatus } from "../enums/prisma-enums";

export interface Site {
  id: string;
  createdById?: string | null;
  code: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: SiteStatus;
  createdAt: string;
  updatedAt: string;
}
