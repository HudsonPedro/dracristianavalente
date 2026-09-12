import { describe, expect, it, vi } from "vitest";

import { getDb } from "../../db";
import { requireAdminPermission } from "./admin-effective-permissions.server";

vi.mock("../../db", () => ({
  getDb: vi.fn(),
}));

vi.mock("./admin-effective-permissions.server", () => ({
  requireAdminPermission: vi.fn(),
}));

vi.mock("./list-admin-departments.server", () => ({
  listAdminDepartments: vi.fn(),
}));

import {
  assertAdminUserRoleAssignmentAllowed,
  updateAdminUser,
} from "./update-admin-user.server";

describe("updateAdminUser authorization", () => {
  it("requires USERS:UPDATE before accessing persistence", async () => {
    vi.mocked(requireAdminPermission).mockRejectedValueOnce(
      new Error("Acesso administrativo sem permissão para esta operação."),
    );

    await expect(
      updateAdminUser({
        userId: "regular-user",
        name: "Usuário regular",
        department: "ADMINISTRATION",
        roleId: "role-admin",
      }),
    ).rejects.toThrow("Acesso administrativo sem permissão para esta operação.");

    expect(requireAdminPermission).toHaveBeenCalledWith("USERS", "UPDATE");
    expect(getDb).not.toHaveBeenCalled();
  });
});

describe("assertAdminUserRoleAssignmentAllowed", () => {
  it("rejects promotion of a regular administrator to SUPER_ADMIN", () => {
    expect(() =>
      assertAdminUserRoleAssignmentAllowed({
        actorUserId: "root-user",
        actorRole: "SUPER_ADMIN",
        targetUserId: "regular-user",
        currentRoleCode: "ADMIN",
        selectedRoleCode: "SUPER_ADMIN",
      }),
    ).toThrow("O papel SUPER_ADMIN não pode ser atribuído pela edição comum de usuários.");
  });

  it("rejects changing the root account through another administrator", () => {
    expect(() =>
      assertAdminUserRoleAssignmentAllowed({
        actorUserId: "other-user",
        actorRole: "ADMIN",
        targetUserId: "root-user",
        currentRoleCode: "SUPER_ADMIN",
        selectedRoleCode: "ADMIN",
      }),
    ).toThrow("A conta do Super Administrador não pode ser alterada por esta operação.");
  });

  it("rejects demotion of the root account by its own user", () => {
    expect(() =>
      assertAdminUserRoleAssignmentAllowed({
        actorUserId: "root-user",
        actorRole: "SUPER_ADMIN",
        targetUserId: "root-user",
        currentRoleCode: "SUPER_ADMIN",
        selectedRoleCode: "ADMIN",
      }),
    ).toThrow("A conta do Super Administrador não pode ser alterada por esta operação.");
  });

  it("allows the root user to update its profile while retaining SUPER_ADMIN", () => {
    expect(() =>
      assertAdminUserRoleAssignmentAllowed({
        actorUserId: "root-user",
        actorRole: "SUPER_ADMIN",
        targetUserId: "root-user",
        currentRoleCode: "SUPER_ADMIN",
        selectedRoleCode: "SUPER_ADMIN",
      }),
    ).not.toThrow();
  });

  it("allows an authorized regular-user role change that does not involve SUPER_ADMIN", () => {
    expect(() =>
      assertAdminUserRoleAssignmentAllowed({
        actorUserId: "manager-user",
        actorRole: "CUSTOM_ROLE",
        targetUserId: "regular-user",
        currentRoleCode: "READ_ONLY",
        selectedRoleCode: "CATALOG_MANAGER",
      }),
    ).not.toThrow();
  });
});
