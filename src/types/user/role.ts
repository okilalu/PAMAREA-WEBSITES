import type { RoleName } from "../enums/prisma-enums";

export interface Role {
  id: string;
  name: RoleName;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}
