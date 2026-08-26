import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useMemo,
  useState,
} from "react";

import {
  createAdminUserAction,
  getAdminDepartments,
  getAdminRoles,
} from "../../../functions/admin-users";

export const Route =
  createFileRoute(
    "/admin/usuarios/novo",
  )({
    loader: async () => {
      const [
        departments,
        roles,
      ] =
        await Promise.all([
          getAdminDepartments(),
          getAdminRoles(),
        ]);

      return {
        departments:
          departments.filter(
            (department) =>
              department.isActive,
          ),
        roles:
          roles.filter(
            (role) =>
              role.active &&
              role.code !== "SUPER_ADMIN",
          ),
      };
    },
    component: AdminUserCreatePage,
  });

function AdminUserCreatePage() {
  const { departments, roles } =
    Route.useLoaderData();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [roleId, setRoleId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const canSubmit =
    useMemo(
      () =>
        name.trim().length > 0 &&
        email.trim().length > 0 &&
        department.length > 0 &&
        roleId.length > 0 &&
        !submitting,
      [
        name,
        email,
        department,
        roleId,
        submitting,
      ],
    );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await createAdminUserAction({
        data: {
          name,
          email,
          department,
          roleId,
        },
      });

      await navigate({
        to: "/admin/usuarios",
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível criar o usuário administrativo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/admin/usuarios"
          className="text-sm font-semibold text-stone-500 transition hover:text-stone-950"
        >
          ← Voltar para usuários
        </Link>

        <header className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Usuários e acessos
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
            Novo usuário
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            Cadastre um usuário administrativo utilizando somente
            Departamentos e Papéis ativos já governados pela plataforma.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="border-b border-stone-200 px-6 py-6 md:px-8">
            <h2 className="text-lg font-semibold text-stone-950">
              Dados do usuário
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              O e-mail será a identidade administrativa do usuário e deve ser único.
            </p>
          </div>

          <div className="space-y-6 px-6 py-7 md:px-8 md:py-8">
            <div>
              <label
                htmlFor="admin-user-name"
                className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500"
              >
                Nome
              </label>
              <input
                id="admin-user-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                maxLength={255}
                autoComplete="name"
                required
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label
                htmlFor="admin-user-email"
                className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500"
              >
                E-mail
              </label>
              <input
                id="admin-user-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                maxLength={255}
                autoComplete="email"
                required
                className="mt-2 min-h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                placeholder="usuario@empresa.com.br"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="admin-user-department"
                  className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500"
                >
                  Departamento
                </label>
                <select
                  id="admin-user-department"
                  value={department}
                  onChange={(event) =>
                    setDepartment(event.target.value)
                  }
                  required
                  className="mt-2 min-h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                >
                  <option value="">
                    Selecione um departamento
                  </option>
                  {departments.map((item) => (
                    <option
                      key={item.id}
                      value={item.code}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Somente departamentos ativos são disponibilizados.
                </p>
              </div>

              <div>
                <label
                  htmlFor="admin-user-role"
                  className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500"
                >
                  Papel
                </label>
                <select
                  id="admin-user-role"
                  value={roleId}
                  onChange={(event) =>
                    setRoleId(event.target.value)
                  }
                  required
                  className="mt-2 min-h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                >
                  <option value="">
                    Selecione um papel
                  </option>
                  {roles.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                    >
                      {role.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  SUPER_ADMIN não é oferecido para criação de novos usuários.
                </p>
              </div>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end md:px-8">
            <Link
              to="/admin/usuarios"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Criando..."
                : "Criar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
