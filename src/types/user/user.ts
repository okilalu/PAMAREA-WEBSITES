import type { UserStatus } from "../enums/prisma-enums";

import type { Role } from "./role";
import type { Site } from "../site/site";

export interface UserResponse {
  id: string;
  roleId: string;
  siteId: string | null;

  employeeNumber: string | null;
  fullName: string;
  username: string;
  email: string | null;
  phone: string | null;

  status: UserStatus;

  lastLoginAt: string | null;
  deletedAt: string | null;

  createdAt: string;
  updatedAt: string;

  role?: Role;
  site?: Site | null;
}

export interface CreateUserRequest {
  employeeNumber?: string | null;
  fullName: string;
  username?: string;
  email?: string | null;
  phone?: string | null;
  password: string;

  roleId: string;
  siteId?: string | null;

  // status?: UserStatus;
}

export interface UpdateUserRequest {
  employeeNumber?: string | null;
  fullName?: string;
  username?: string;
  email?: string | null;
  phone?: string | null;
  password: string;

  roleId?: string;
  siteId?: string | null;

  // status?: UserStatus;
}

export interface UserQuery {
  search?: string;
  roleId?: string;
  siteId?: string;
  status?: UserStatus;

  page?: number;
  limit?: number;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserSummary {
  id: string;
  fullName: string;
  username: string;
  employeeNumber: string | null;
  status: UserStatus;
}
