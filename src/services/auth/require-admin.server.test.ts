import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../db", () => ({
  getDb: vi.fn(),
}));

vi.mock("./admin-session.server", () => ({
  useAdminSession: vi.fn(),
}));

import { getDb } from "../../db";
import { useAdminSession } from "./admin-session.server";
import { requireAdmin } from "./require-admin.server";

type SessionData = {
  authenticated?: boolean;
  userId?: string;
  roleId?: string;
  role?: string;
  authVersion?: number;
};

function createSession(data: SessionData) {
  return {
    data,
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

function configureDbResult(result: unknown) {
  const query = {
    from: vi.fn(),
    innerJoin: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
  };

  query.from.mockReturnValue(query);
  query.innerJoin.mockReturnValue(query);
  query.where.mockReturnValue(query);
  query.limit.mockResolvedValue(result ? [result] : []);

  vi.mocked(getDb).mockReturnValue(
    {
      select: vi.fn().mockReturnValue(query),
    } as never,
  );

  return query;
}

const validUser = {
  id: "user-1",
  name: "Admin Teste",
  email: "admin@example.com",
  roleId: "role-1",
  status: "ACTIVE",
  deletedAt: null,
  authVersion: 3,
};

const validRole = {
  id: "role-1",
  code: "ADMIN",
  name: "Administrador",
  active: true,
};

const validSessionData: SessionData = {
  authenticated: true,
  userId: "user-1",
  roleId: "role-1",
  role: "ADMIN",
  authVersion: 3,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("requireAdmin", () => {
  it("rejects an invalid administrative session before querying the database", async () => {
    const session = createSession({
      authenticated: false,
    });

    vi.mocked(useAdminSession).mockResolvedValue(session as never);

    await expect(requireAdmin()).rejects.toThrow(
      "Acesso administrativo não autorizado.",
    );

    expect(getDb).not.toHaveBeenCalled();
    expect(session.clear).not.toHaveBeenCalled();
  });

  it("clears the session and rejects when the user no longer exists", async () => {
    const session = createSession(validSessionData);

    vi.mocked(useAdminSession).mockResolvedValue(session as never);
    configureDbResult(null);

    await expect(requireAdmin()).rejects.toThrow(
      "Acesso administrativo não autorizado.",
    );

    expect(session.clear).toHaveBeenCalledTimes(1);
  });

  it("clears the session and rejects a deleted user", async () => {
    const session = createSession(validSessionData);

    vi.mocked(useAdminSession).mockResolvedValue(session as never);

    configureDbResult({
      user: {
        ...validUser,
        deletedAt: new Date(),
      },
      role: validRole,
    });

    await expect(requireAdmin()).rejects.toThrow(
      "Acesso administrativo não autorizado.",
    );

    expect(session.clear).toHaveBeenCalledTimes(1);
  });

  it("clears the session and rejects an inactive user", async () => {
    const session = createSession(validSessionData);

    vi.mocked(useAdminSession).mockResolvedValue(session as never);

    configureDbResult({
      user: {
        ...validUser,
        status: "INACTIVE",
      },
      role: validRole,
    });

    await expect(requireAdmin()).rejects.toThrow(
      "Acesso administrativo não autorizado.",
    );

    expect(session.clear).toHaveBeenCalledTimes(1);
  });

  it("clears the session and rejects an inactive role", async () => {
    const session = createSession(validSessionData);

    vi.mocked(useAdminSession).mockResolvedValue(session as never);

    configureDbResult({
      user: validUser,
      role: {
        ...validRole,
        active: false,
      },
    });

    await expect(requireAdmin()).rejects.toThrow(
      "Acesso administrativo não autorizado.",
    );

    expect(session.clear).toHaveBeenCalledTimes(1);
  });

  it("clears the session when the persisted role no longer matches the session", async () => {
    const session = createSession(validSessionData);

    vi.mocked(useAdminSession).mockResolvedValue(session as never);

    configureDbResult({
      user: validUser,
      role: {
        ...validRole,
        code: "OWNER",
      },
    });

    await expect(requireAdmin()).rejects.toThrow(
      "Acesso administrativo não autorizado.",
    );

    expect(session.clear).toHaveBeenCalledTimes(1);
  });

  it("clears the session and reports expiration when authVersion changes", async () => {
    const session = createSession(validSessionData);

    vi.mocked(useAdminSession).mockResolvedValue(session as never);

    configureDbResult({
      user: {
        ...validUser,
        authVersion: 4,
      },
      role: validRole,
    });

    await expect(requireAdmin()).rejects.toThrow(
      "Sessão administrativa expirada.",
    );

    expect(session.clear).toHaveBeenCalledTimes(1);
  });

  it("returns the authenticated administrator when session and database state are valid", async () => {
    const session = createSession(validSessionData);

    vi.mocked(useAdminSession).mockResolvedValue(session as never);

    configureDbResult({
      user: validUser,
      role: validRole,
    });

    await expect(requireAdmin()).resolves.toEqual({
      authenticated: true,
      userId: "user-1",
      name: "Admin Teste",
      email: "admin@example.com",
      roleId: "role-1",
      role: "ADMIN",
      roleName: "Administrador",
      authVersion: 3,
    });

    expect(session.clear).not.toHaveBeenCalled();
  });
});