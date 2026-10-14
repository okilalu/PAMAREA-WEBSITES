export interface AuditLog {
  id: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oldData?: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newData?: any | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}
