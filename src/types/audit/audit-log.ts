// export interface AuditLog {
//   id: string;
//   userId?: string | null;
//   action: string;
//   entityType: string;
//   entityId?: string | null;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   oldData?: any | null;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   newData?: any | null;
//   ipAddress?: string | null;
//   userAgent?: string | null;
//   createdAt: string;
// }

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogQuery {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
