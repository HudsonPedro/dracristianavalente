export const ADMIN_MODULES = [
  "DASHBOARD",
  "CATALOG",
  "INVENTORY",
  "ORDERS",
  "CUSTOMERS",
  "SALES",
  "FULFILLMENT",
  "USERS",
  "SETTINGS",
  "AUDIT",
] as const;

export type AdminModule =
  (typeof ADMIN_MODULES)[number];

export const ADMIN_ACTIONS = [
  "VIEW",
  "CREATE",
  "UPDATE",
  "DELETE",
  "MANAGE",
] as const;

export type AdminAction =
  (typeof ADMIN_ACTIONS)[number];

export type AdminPermission =
  `${AdminModule}:${AdminAction}`;

export const ADMIN_DEPARTMENTS = [
  "ADMINISTRATION",
  "CATALOG",
  "INVENTORY",
  "SALES",
  "CUSTOMER_SERVICE",
  "FULFILLMENT",
] as const;

export type AdminDepartment =
  (typeof ADMIN_DEPARTMENTS)[number];

export const ADMIN_USER_STATUSES = [
  "INVITED",
  "ACTIVE",
  "BLOCKED",
  "INACTIVE",
] as const;

export type AdminUserStatus =
  (typeof ADMIN_USER_STATUSES)[number];

export const ADMIN_ROLE_CODES = [
  "SUPER_ADMIN",
  "ADMIN",
  "CATALOG_MANAGER",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SERVICE",
  "READ_ONLY",
] as const;

export type AdminRoleCode =
  (typeof ADMIN_ROLE_CODES)[number];

export type AdminRole = {
  id: string;

  code: AdminRoleCode;

  name: string;

  description?: string;

  permissions: AdminPermission[];

  systemRole: boolean;

  active: boolean;

  createdAt?: string;

  updatedAt?: string;
};

export type AdminUser = {
  id: string;

  name: string;

  email: string;

  department: AdminDepartment;

  status: AdminUserStatus;

  roleId: string;

  failedLoginAttempts: number;

  lockedUntil?: string;

  lastLoginAt?: string;

  passwordChangedAt?: string;

  authVersion: number;

  createdAt?: string;

  updatedAt?: string;
};

export function createAdminPermission(
  module: AdminModule,
  action: AdminAction,
): AdminPermission {
  return `${module}:${action}`;
}
