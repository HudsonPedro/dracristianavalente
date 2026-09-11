import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../db", () => ({
  getDb: vi.fn(),
}));

vi.mock("./require-admin.server", () => ({
  requireAdmin: vi.fn(),
}));

import { getDb } from "../../db";
import { requireAdmin } from "./require-admin.server";

import {
  getAdminEffectivePermissions,
  hasAdminEffectivePermission,
  requireAdminPermission,
} from "./admin-effective-permissions.server";

const admin = {
  authenticated: true as const,
  userId: "user-1",
  name: "Admin Teste",
  email: "admin@example.com",
  roleId: "role-1",
  role: "ADMIN",
  roleName: "Administrador",
  authVersion: 1,
};

type RolePermissionRow = {
  module: string;
  action: string;
};

type UserOverrideRow = {
  module: string;
  action: string;
  effect: string;
};

function configureDb(
  rolePermissions: RolePermissionRow[],
  userOverrides: UserOverrideRow[],
) {
  const roleQuery = {
    from: vi.fn(),
    where: vi.fn(),
  };

  roleQuery.from.mockReturnValue(roleQuery);
  roleQuery.where.mockResolvedValue(rolePermissions);

  const overrideQuery = {
    from: vi.fn(),
    where: vi.fn(),
  };

  overrideQuery.from.mockReturnValue(overrideQuery);
  overrideQuery.where.mockResolvedValue(userOverrides);

  const select = vi
    .fn()
    .mockReturnValueOnce(roleQuery)
    .mockReturnValueOnce(overrideQuery);

  vi.mocked(getDb).mockReturnValue(
    {
      select,
    } as never,
  );

  return {
    select,
    roleQuery,
    overrideQuery,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireAdmin).mockResolvedValue(admin);
});

describe("getAdminEffectivePermissions", () => {
  it("inherits valid permissions from the administrator role", async () => {
    configureDb(
      [
        {
          module: "INVENTORY",
          action: "VIEW",
        },
        {
          module: "CATALOG",
          action: "UPDATE",
        },
      ],
      [],
    );

    const result = await getAdminEffectivePermissions();

    expect(result.admin).toEqual(admin);
    expect(result.permissions).toEqual([
      {
        module: "INVENTORY",
        action: "VIEW",
      },
      {
        module: "CATALOG",
        action: "UPDATE",
      },
    ]);
  });

  it("removes an inherited permission when an individual DENY override exists", async () => {
    configureDb(
      [
        {
          module: "INVENTORY",
          action: "VIEW",
        },
        {
          module: "CATALOG",
          action: "UPDATE",
        },
      ],
      [
        {
          module: "INVENTORY",
          action: "VIEW",
          effect: "DENY",
        },
      ],
    );

    const result = await getAdminEffectivePermissions();

    expect(result.permissions).toEqual([
      {
        module: "CATALOG",
        action: "UPDATE",
      },
    ]);
  });

  it("adds a permission when an individual ALLOW override exists", async () => {
    configureDb(
      [
        {
          module: "INVENTORY",
          action: "VIEW",
        },
      ],
      [
        {
          module: "CATALOG",
          action: "UPDATE",
          effect: "ALLOW",
        },
      ],
    );

    const result = await getAdminEffectivePermissions();

    expect(result.permissions).toEqual([
      {
        module: "INVENTORY",
        action: "VIEW",
      },
      {
        module: "CATALOG",
        action: "UPDATE",
      },
    ]);
  });

  it("ignores unknown role permissions instead of granting access", async () => {
    configureDb(
      [
        {
          module: "INVENTORY",
          action: "VIEW",
        },
        {
          module: "UNKNOWN_MODULE",
          action: "VIEW",
        },
        {
          module: "INVENTORY",
          action: "UNKNOWN_ACTION",
        },
      ],
      [],
    );

    const result = await getAdminEffectivePermissions();

    expect(result.permissions).toEqual([
      {
        module: "INVENTORY",
        action: "VIEW",
      },
    ]);
  });

  it("ignores unknown override effects instead of granting access", async () => {
    configureDb(
      [],
      [
        {
          module: "INVENTORY",
          action: "VIEW",
          effect: "UNKNOWN_EFFECT",
        },
      ],
    );

    const result = await getAdminEffectivePermissions();

    expect(result.permissions).toEqual([]);
  });
});

describe("hasAdminEffectivePermission", () => {
  const permissions = [
    {
      module: "INVENTORY" as const,
      action: "VIEW" as const,
    },
    {
      module: "CATALOG" as const,
      action: "UPDATE" as const,
    },
  ];

  it("matches the exact module and action pair", () => {
    expect(
      hasAdminEffectivePermission(
        permissions,
        "INVENTORY",
        "VIEW",
      ),
    ).toBe(true);
  });

  it("does not infer another action from permission on the same module", () => {
    expect(
      hasAdminEffectivePermission(
        permissions,
        "INVENTORY",
        "UPDATE",
      ),
    ).toBe(false);
  });
});

describe("requireAdminPermission", () => {
  it("returns the effective permission context when access is granted", async () => {
    configureDb(
      [
        {
          module: "INVENTORY",
          action: "VIEW",
        },
      ],
      [],
    );

    const result = await requireAdminPermission(
      "INVENTORY",
      "VIEW",
    );

    expect(result.admin).toEqual(admin);
    expect(result.permissions).toContainEqual({
      module: "INVENTORY",
      action: "VIEW",
    });
  });

  it("rejects access when the exact permission is absent", async () => {
    configureDb(
      [
        {
          module: "INVENTORY",
          action: "VIEW",
        },
      ],
      [],
    );

    await expect(
      requireAdminPermission(
        "INVENTORY",
        "UPDATE",
      ),
    ).rejects.toThrow(
      "Acesso administrativo sem permissão para esta operação.",
    );
  });
});