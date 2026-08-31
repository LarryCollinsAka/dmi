export type Role = "ADMIN" | "ANALYST" | "VIEWER";

export const PERMISSIONS = {
  analyze: ["ADMIN", "ANALYST"] as Role[],
  decide: ["ADMIN"] as Role[],
  viewAudit: ["ADMIN", "ANALYST", "VIEWER"] as Role[],
};

export function can(role: Role, action: keyof typeof PERMISSIONS) {
  return (PERMISSIONS[action] as Role[]).includes(role);
}

export function requireRole(userRole: Role, action: keyof typeof PERMISSIONS) {
  if (!can(userRole, action)) {
    throw new Error(`Role ${userRole} cannot ${action}`);
  }
}