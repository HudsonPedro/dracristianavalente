import {
  createServerFn,
} from "@tanstack/react-start";

type CreateAdminDepartmentInput = {
  code: string;

  name: string;

  description?: string | null;
};

type UpdateAdminDepartmentInput = {
  departmentId: string;

  name: string;

  description?: string | null;
};

function validateCreateAdminDepartmentInput(
  input: CreateAdminDepartmentInput,
) {
  const code =
    input.code?.trim() ?? "";

  const name =
    input.name?.trim() ?? "";

  const description =
    input.description?.trim() ||
    null;

  if (!code) {
    throw new Error(
      "O código do departamento é obrigatório.",
    );
  }

  if (
    code.length > 80
  ) {
    throw new Error(
      "O código do departamento é inválido.",
    );
  }

  if (!name) {
    throw new Error(
      "O nome do departamento é obrigatório.",
    );
  }

  if (
    name.length > 120
  ) {
    throw new Error(
      "O nome do departamento é inválido.",
    );
  }

  if (
    description &&
    description.length > 2000
  ) {
    throw new Error(
      "A descrição do departamento é inválida.",
    );
  }

  return {
    code,
    name,
    description,
  };
}

function validateUpdateAdminDepartmentInput(
  input: UpdateAdminDepartmentInput,
) {
  const departmentId =
    input.departmentId?.trim() ?? "";

  const name =
    input.name?.trim() ?? "";

  const description =
    input.description?.trim() ||
    null;

  if (!departmentId) {
    throw new Error(
      "Departamento inválido.",
    );
  }

  if (!name) {
    throw new Error(
      "O nome do departamento é obrigatório.",
    );
  }

  if (
    name.length > 120
  ) {
    throw new Error(
      "O nome do departamento é inválido.",
    );
  }

  if (
    description &&
    description.length > 2000
  ) {
    throw new Error(
      "A descrição do departamento é inválida.",
    );
  }

  return {
    departmentId,
    name,
    description,
  };
}

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

export const createAdminDepartmentAction =
  createServerFn({
    method: "POST",
  })
    .validator(
      validateCreateAdminDepartmentInput,
    )
    .handler(async ({
      data,
    }) => {
      const {
        createAdminDepartment,
      } = await import(
        "../services/auth/create-admin-department.server"
      );

      const department =
        await createAdminDepartment({
          code:
            data.code,

          name:
            data.name,

          description:
            data.description,
        });

      return {
        success:
          true as const,

        department: {
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
        },
      };
    });

export const updateAdminDepartmentAction =
  createServerFn({
    method: "POST",
  })
    .validator(
      validateUpdateAdminDepartmentInput,
    )
    .handler(async ({
      data,
    }) => {
      const {
        updateAdminDepartment,
      } = await import(
        "../services/auth/update-admin-department.server"
      );

      const department =
        await updateAdminDepartment({
          departmentId:
            data.departmentId,

          name:
            data.name,

          description:
            data.description,
        });

      return {
        success:
          true as const,

        department: {
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
        },
      };
    });
