// src/types/user/user.types.ts
import type { UserStatus } from "../enums/prisma-enums";
import type { Role } from "./role";
// import { Site } from '../site/site';

export interface User {
  id: string;
  roleId: string;
  siteId?: string | null;
  createdById?: string | null;
  employeeNumber?: string | null;
  fullName: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  status: UserStatus;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  role?: Role;
  //   site?: Site;
}
