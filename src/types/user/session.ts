export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  revokedAt?: string | null;
  createdAt: string;
}
