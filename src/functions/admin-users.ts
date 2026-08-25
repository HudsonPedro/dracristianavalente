import {
  createServerFn,
} from "@tanstack/react-start";

export const getAdminUsers =
  createServerFn({
    method: "GET",
  }).handler(async () => {
    const {
      listAdminUsers,
    } = await import(
      "../services/auth/list-admin-users.server"
    );

    const users =
      await listAdminUsers();

    return users.map(
      (user) => ({
        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        department:
          user.department,

        status:
          user.status,

        role: {
          id:
            user.role.id,

          code:
            user.role.code,

          name:
            user.role.name,
        },

        failedLoginAttempts:
          user.failedLoginAttempts,

        lockedUntil:
          user.lockedUntil
            ? user.lockedUntil.toISOString()
            : null,

        lastLoginAt:
          user.lastLoginAt
            ? user.lastLoginAt.toISOString()
            : null,

        passwordChangedAt:
          user.passwordChangedAt
            ? user.passwordChangedAt.toISOString()
            : null,

        mustChangePassword:
          user.mustChangePassword,

        emailVerifiedAt:
          user.emailVerifiedAt
            ? user.emailVerifiedAt.toISOString()
            : null,

        createdAt:
          user.createdAt.toISOString(),

        updatedAt:
          user.updatedAt.toISOString(),
      }),
    );
  });

export const getAdminRoles =
  createServerFn({
    method: "GET",
  }).handler(async () => {
    const {
      listAdminRoles,
    } = await import(
      "../services/auth/list-admin-roles.server"
    );

    const roles =
      await listAdminRoles();

    return roles.map(
      (role) => ({
        id:
          role.id,

        code:
          role.code,

        name:
          role.name,

        description:
          role.description,

        systemRole:
          role.systemRole,

        active:
          role.active,
      }),
    );
  });

export const getAdminDepartments =
  createServerFn({
    method: "GET",
  }).handler(async () => {
    const {
      listAdminDepartments,
    } = await import(
      "../services/auth/list-admin-departments.server"
    );

    const departments =
      await listAdminDepartments();

    return departments.map(
      (department) => ({
        id:
          department.id,

        code:
          department.code,

        name:
          department.name,

        description:
          department.description,

        isActive:
          department.isActive,

        createdAt:
          department.createdAt.toISOString(),

        updatedAt:
          department.updatedAt.toISOString(),
      }),
    );
  });
