import { createServerFn } from "@tanstack/react-start";

type AdminLoginInput = {
  email: string;
  password: string;
};

type ChangeAdminPasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type CompleteAdminUserFirstAccessInput = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};
type UpdateAdminUserInput = {
  userId: string;
  name: string;
  department: string;
  roleId: string;
};

function validateLoginInput(input: AdminLoginInput) {
  const email = input.email?.trim().toLowerCase();

  const password = input.password ?? "";

  if (!email) {
    throw new Error("E-mail é obrigatório.");
  }

  if (email.length > 255 || !email.includes("@")) {
    throw new Error("E-mail inválido.");
  }

  if (!password || password.length > 200) {
    throw new Error("Senha inválida.");
  }

  return {
    email,
    password,
  };
}

function validateChangePasswordInput(input: ChangeAdminPasswordInput) {
  const currentPassword = input.currentPassword ?? "";

  const newPassword = input.newPassword ?? "";

  const confirmPassword = input.confirmPassword ?? "";

  if (!currentPassword) {
    throw new Error("A senha atual é obrigatória.");
  }

  if (!newPassword) {
    throw new Error("A nova senha é obrigatória.");
  }

  if (!confirmPassword) {
    throw new Error("A confirmação da nova senha é obrigatória.");
  }

  if (currentPassword.length > 200 || newPassword.length > 200 || confirmPassword.length > 200) {
    throw new Error("Senha inválida.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("A confirmação da nova senha não corresponde.");
  }

  if (currentPassword === newPassword) {
    throw new Error("A nova senha deve ser diferente da senha atual.");
  }

  return {
    currentPassword,
    newPassword,
  };
}

function validateCompleteAdminUserFirstAccessInput(input: CompleteAdminUserFirstAccessInput) {
  const token = input.token?.trim();

  const newPassword = input.newPassword ?? "";

  const confirmPassword = input.confirmPassword ?? "";

  if (!token || token.length > 500) {
    throw new Error("Token de primeiro acesso invalido.");
  }

  if (!newPassword) {
    throw new Error("A nova senha e obrigatoria.");
  }

  if (!confirmPassword) {
    throw new Error("A confirmacao da nova senha e obrigatoria.");
  }

  if (newPassword.length > 200 || confirmPassword.length > 200) {
    throw new Error("Senha invalida.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("A confirmacao da nova senha nao corresponde.");
  }

  return {
    token,
    newPassword,
  };
}
function validateUpdateAdminUserInput(input: UpdateAdminUserInput) {
  const userId = input.userId?.trim();

  const name = input.name?.trim();

  const department = input.department?.trim();

  const roleId = input.roleId?.trim();

  if (!userId || userId.length > 120) {
    throw new Error("Usuário administrativo inválido.");
  }

  if (!name || name.length > 255) {
    throw new Error("Nome do usuário inválido.");
  }

  if (!department || department.length > 80) {
    throw new Error("Departamento inválido.");
  }

  if (!roleId || roleId.length > 120) {
    throw new Error("Papel administrativo inválido.");
  }

  return {
    userId,
    name,
    department,
    roleId,
  };
}

export const loginAdmin = createServerFn({
  method: "POST",
})
  .validator(validateLoginInput)
  .handler(async ({ data }) => {
    const { authenticateAdminUser } =
      await import("../services/auth/authenticate-admin-user.server");

    const authentication = await authenticateAdminUser(data.email, data.password);

    if (!authentication.success) {
      if (authentication.reason === "BLOCKED") {
        return {
          success: false as const,
          error: "Acesso temporariamente bloqueado. Tente novamente mais tarde.",
        };
      }

      if (authentication.reason === "INACTIVE") {
        return {
          success: false as const,
          error: "Acesso administrativo indisponível.",
        };
      }

      return {
        success: false as const,
        error: "E-mail ou senha inválidos.",
      };
    }

    const { useAdminSession } = await import("../services/auth/admin-session.server");

    const session = await useAdminSession();

    await session.update({
      authenticated: true,

      userId: authentication.user.id,

      roleId: authentication.user.roleId,

      role: authentication.user.role,

      authVersion: authentication.user.authVersion,
    });

    return {
      success: true as const,
    };
  });

export const getAdminAuth = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const { getAdminEffectivePermissions } =
      await import("../services/auth/admin-effective-permissions.server");

    const effective = await getAdminEffectivePermissions();

    const admin = effective.admin;

    return {
      authenticated: true as const,

      userId: admin.userId,

      name: admin.name,

      email: admin.email,

      roleId: admin.roleId,

      role: admin.role,

      roleName: admin.roleName,

      authVersion: admin.authVersion,

      permissions: effective.permissions,
    };
  } catch {
    return {
      authenticated: false as const,

      userId: null,

      name: null,

      email: null,

      roleId: null,

      role: null,

      roleName: null,

      authVersion: null,

      permissions: [],
    };
  }
});

export const logoutAdmin = createServerFn({
  method: "POST",
}).handler(async () => {
  const { useAdminSession } = await import("../services/auth/admin-session.server");

  const session = await useAdminSession();

  await session.clear();

  return {
    success: true as const,
  };
});

export const revokeAllAdminSessions = createServerFn({
  method: "POST",
}).handler(async () => {
  const { requireAdmin } = await import("../services/auth/require-admin.server");

  const admin = await requireAdmin();

  const previousAuthVersion = admin.authVersion;

  const { revokeAdminSessions } = await import("../services/auth/revoke-admin-sessions.server");

  const result = await revokeAdminSessions(admin.userId);

  const expectedAuthVersion = previousAuthVersion + 1;

  if (result.authVersion !== expectedAuthVersion) {
    throw new Error("Falha ao confirmar a revogação das sessões administrativas.");
  }

  const { useAdminSession } = await import("../services/auth/admin-session.server");

  const session = await useAdminSession();

  await session.clear();

  return {
    success: true as const,

    previousAuthVersion,

    authVersion: result.authVersion,
  };
});

export const changeAdminPasswordAction = createServerFn({
  method: "POST",
})
  .validator(validateChangePasswordInput)
  .handler(async ({ data }) => {
    /*
     * O serviço exige requireAdmin()
     * internamente e valida novamente
     * o usuário real antes de alterar
     * qualquer credencial.
     */
    const { changeAdminPassword } = await import("../services/auth/change-admin-password.server");

    const result = await changeAdminPassword(data.currentPassword, data.newPassword);

    /*
     * changeAdminPassword() incrementa
     * authVersion através da revogação.
     *
     * Portanto o cookie atual passa a
     * representar uma sessão antiga e
     * também precisa ser removido.
     */
    const { useAdminSession } = await import("../services/auth/admin-session.server");

    const session = await useAdminSession();

    await session.clear();

    return {
      success: true as const,

      authVersion: result.authVersion,
    };
  });

export const completeAdminUserFirstAccessAction = createServerFn({
  method: "POST",
})
  .validator(validateCompleteAdminUserFirstAccessInput)
  .handler(async ({ data }) => {
    /*
     * O primeiro acesso e publico por design.
     *
     * O usuario convidado ainda nao possui
     * uma sessao administrativa.
     *
     * A autorizacao ocorre exclusivamente
     * atraves do token de primeiro acesso,
     * cuja validacao critica permanece no
     * servico server-side.
     */
    const { completeAdminUserFirstAccess } =
      await import("../services/auth/complete-admin-user-first-access.server");

    const result = await completeAdminUserFirstAccess(data.token, data.newPassword);

    return {
      success: true as const,

      userId: result.userId,
    };
  });
export const updateAdminUserAction = createServerFn({
  method: "POST",
})
  .validator(validateUpdateAdminUserInput)
  .handler(async ({ data }) => {
    /*
     * A implementação crítica permanece
     * exclusivamente no módulo server-side.
     *
     * Esse serviço:
     *
     * - exige requireAdmin();
     * - valida usuário existente;
     * - ignora usuários removidos;
     * - valida o papel escolhido;
     * - exige papel ativo;
     * - protege o próprio SUPER_ADMIN.
     */
    const { updateAdminUser } = await import("../services/auth/update-admin-user.server");

    const result = await updateAdminUser({
      userId: data.userId,

      name: data.name,

      department: data.department,

      roleId: data.roleId,
    });

    /*
     * Não retornamos Date diretamente
     * para a futura interface.
     *
     * O resultado da Server Function
     * fica explicitamente serializável.
     */
    return {
      success: true as const,

      user: {
        id: result.user.id,

        name: result.user.name,

        email: result.user.email,

        department: result.user.department,

        status: result.user.status,

        role: {
          id: result.user.role.id,

          code: result.user.role.code,

          name: result.user.role.name,
        },

        updatedAt: result.user.updatedAt.toISOString(),
      },
    };
  });
