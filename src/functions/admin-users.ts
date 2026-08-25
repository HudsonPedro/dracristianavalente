import {
  createServerFn,
} from "@tanstack/react-start";

import {
  ADMIN_ACTIONS,
  ADMIN_MODULES,
  type AdminAction,
  type AdminModule,
} from "../domain/admin/access";

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

type SetAdminDepartmentStatusInput = {
  departmentId: string;

  isActive: boolean;
};

type DeleteAdminDepartmentInput = {
  departmentId: string;
};

type CreateAdminRoleInput = {
  code: string;

  name: string;

  description?: string | null;
};

type UpdateAdminRolePermissionsInput = {
  roleId: string;

  permissions: {
    module: AdminModule;

    action: AdminAction;
  }[];
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

function validateSetAdminDepartmentStatusInput(
  input: SetAdminDepartmentStatusInput,
) {
  const departmentId =
    input.departmentId?.trim() ?? "";

  if (!departmentId) {
    throw new Error(
      "Departamento inválido.",
    );
  }

  if (
    typeof input.isActive !==
    "boolean"
  ) {
    throw new Error(
      "Estado do departamento inválido.",
    );
  }

  return {
    departmentId,

    isActive:
      input.isActive,
  };
}

function validateDeleteAdminDepartmentInput(
  input: DeleteAdminDepartmentInput,
) {
  const departmentId =
    input.departmentId?.trim() ?? "";

  if (!departmentId) {
    throw new Error(
      "Departamento inválido.",
    );
  }

  return {
    departmentId,
  };
}

function validateCreateAdminRoleInput(
  input: CreateAdminRoleInput,
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
      "O código do papel é obrigatório.",
    );
  }

  if (
    code.length > 80
  ) {
    throw new Error(
      "O código do papel é inválido.",
    );
  }

  if (!name) {
    throw new Error(
      "O nome do papel é obrigatório.",
    );
  }

  if (
    name.length > 160
  ) {
    throw new Error(
      "O nome do papel é inválido.",
    );
  }

  if (
    description &&
    description.length > 2000
  ) {
    throw new Error(
      "A descrição do papel é inválida.",
    );
  }

  return {
    code,
    name,
    description,
  };
}

function isAdminModule(
  value: string,
): value is AdminModule {
  return (
    ADMIN_MODULES as readonly string[]
  ).includes(
    value,
  );
}

function isAdminAction(
  value: string,
): value is AdminAction {
  return (
    ADMIN_ACTIONS as readonly string[]
  ).includes(
    value,
  );
}

function validateUpdateAdminRolePermissionsInput(
  input: UpdateAdminRolePermissionsInput,
) {
  const roleId =
    input.roleId?.trim() ?? "";

  if (!roleId) {
    throw new Error(
      "Papel administrativo inválido.",
    );
  }

  if (
    !Array.isArray(
      input.permissions,
    )
  ) {
    throw new Error(
      "Permissões administrativas inválidas.",
    );
  }

  const permissions =
    input.permissions.map(
      (
        permission,
      ) => {
        if (
          !isAdminModule(
            permission.module,
          )
        ) {
          throw new Error(
            "Módulo administrativo inválido.",
          );
        }

        if (
          !isAdminAction(
            permission.action,
          )
        ) {
          throw new Error(
            "Ação administrativa inválida.",
          );
        }

        return {
          module:
            permission.module,

          action:
            permission.action,
        };
      },
    );

  return {
    roleId,
    permissions,
  };
}

function serializeAdminRole(
  role: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    systemRole: boolean;
    active: boolean;
    permissions: {
      module: string;
      action: string;
    }[];
  },
) {
  return {
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

    permissions:
      role.permissions.map(
        (
          permission,
        ) => ({
          module:
            permission.module,

          action:
            permission.action,
        }),
      ),
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
      (
        user,
      ) => ({
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
      serializeAdminRole,
    );
  });

export const getAdminRolesForManagement =
  createServerFn({
    method: "GET",
  }).handler(async () => {
    const {
      listAdminRoles,
    } = await import(
      "../services/auth/list-admin-roles.server"
    );

    const roles =
      await listAdminRoles({
        includeInactive:
          true,
      });

    return roles.map(
      serializeAdminRole,
    );
  });

export const createAdminRoleAction =
  createServerFn({
    method: "POST",
  })
    .validator(
      validateCreateAdminRoleInput,
    )
    .handler(async ({
      data,
    }) => {
      const {
        createAdminRole,
      } = await import(
        "../services/auth/create-admin-role.server"
      );

      const role =
        await createAdminRole({
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

        role: {
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

          permissions:
            [] as {
              module: string;
              action: string;
            }[],
        },
      };
    });

export const updateAdminRolePermissionsAction =
  createServerFn({
    method: "POST",
  })
    .validator(
      validateUpdateAdminRolePermissionsInput,
    )
    .handler(async ({
      data,
    }) => {
      const {
        updateAdminRolePermissions,
      } = await import(
        "../services/auth/update-admin-role-permissions.server"
      );

      const result =
        await updateAdminRolePermissions({
          roleId:
            data.roleId,

          permissions:
            data.permissions,
        });

      return {
        success:
          true as const,

        roleId:
          result.roleId,

        permissions:
          result.permissions.map(
            (
              permission,
            ) => ({
              module:
                permission.module,

              action:
                permission.action,
            }),
          ),
      };
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
      (
        department,
      ) => ({
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

export const setAdminDepartmentStatusAction =
  createServerFn({
    method: "POST",
  })
    .validator(
      validateSetAdminDepartmentStatusInput,
    )
    .handler(async ({
      data,
    }) => {
      const {
        setAdminDepartmentStatus,
      } = await import(
        "../services/auth/set-admin-department-status.server"
      );

      const department =
        await setAdminDepartmentStatus({
          departmentId:
            data.departmentId,

          isActive:
            data.isActive,
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

export const deleteAdminDepartmentAction =
  createServerFn({
    method: "POST",
  })
    .validator(
      validateDeleteAdminDepartmentInput,
    )
    .handler(async ({
      data,
    }) => {
      const {
        deleteAdminDepartment,
      } = await import(
        "../services/auth/delete-admin-department.server"
      );

      const result =
        await deleteAdminDepartment({
          departmentId:
            data.departmentId,
        });

      return {
        success:
          true as const,

        department: {
          id:
            result.id,

          code:
            result.code,

          name:
            result.name,
        },

        deleted:
          result.deleted,
      };
    });
