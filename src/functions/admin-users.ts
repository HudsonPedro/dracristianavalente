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
