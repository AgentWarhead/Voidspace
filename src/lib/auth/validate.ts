/** Validates UUID v4 format */
export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/** Validates NEAR account ID format (named or implicit) */
export function isValidNearAccountId(accountId: string): boolean {
  // Named accounts: 2-64 chars, lowercase alphanumeric, -, _, .
  // Implicit accounts: 64-char hex string
  return /^[a-z0-9._-]{2,64}$/.test(accountId) || /^[0-9a-f]{64}$/i.test(accountId);
}
