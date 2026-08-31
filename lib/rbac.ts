import { Role } from "@prisma/client";

export const PERMISSIONS = {
  UPLOAD: [Role.ADMIN, Role.ANALYST],
  DECIDE: [Role.ADMIN, Role.REVIEWER],
  VIEW_GOVERNANCE: [Role.ADMIN, Role.REVIEWER],
  MANAGE_USERS: [Role.ADMIN],
}

export function can(role: Role, action: keyof typeof PERMISSIONS) {
  return PERMISSIONS[action].includes(role);
}