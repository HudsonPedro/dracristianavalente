import { createFileRoute, Link } from "@tanstack/react-router";

import { useMemo, useState } from "react";

import {
  createAdminUserAction,
  createAdminUserInvitationTokenAction,
  getAdminDepartments,
  getAdminRoles,
  getAdminUsers,
} from "../../../functions/admin-users";

export const Route = createFileRoute("/admin/usuarios/novo")({
  loader: async () => {
    const [departments, roles] = await Promise.all([getAdminDepartments(), getAdminRoles()]);

    return {
      departments: departments.filter((department) => department.isActive),
      roles: roles.filter((role) => role.active && role.code !== "SUPER_ADMIN"),
    };
  },
  component: AdminUserCreatePage,
});

type FirstAccessResult = {
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
  sent: true;
  expiresAt: string;
};

function formatExpiration(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function AdminUserCreatePage() {
  const { departments, roles } = Route.useLoaderData();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [department, setDepartment] = useState("");

  const [roleId, setRoleId] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [firstAccess, setFirstAccess] = useState<FirstAccessResult | null>(null);
  const canSubmit = useMemo(
    () =>
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      department.length > 0 &&
      roleId.length > 0 &&
      !submitting &&
      firstAccess === null,
    [name, email, department, roleId, submitting, firstAccess],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      /*
       * 1. Cria o usuário administrativo.
       *
       * A criação já foi homologada e mantém
       * o usuário no estado INVITED, ainda
       * sem credencial configurada.
       */
      await createAdminUserAction({
        data: {
          name,
          email,
          department,
          roleId,
        },
      });

      /*
       * 2. Relê a fonte oficial de usuários.
       *
       * Evitamos acoplar esta tela ao formato
       * interno retornado pelo serviço de
       * criação. O e-mail administrativo é
       * único e funciona como identidade.
       */
      const users = await getAdminUsers();

      const normalizedEmail = email.trim().toLowerCase();

      const createdUser = users.find((user) => user.email.trim().toLowerCase() === normalizedEmail);

      if (!createdUser) {
        throw new Error(
          "O usuário foi criado, mas não foi possível localizar o cadastro para gerar o primeiro acesso.",
        );
      }

      /*
       * 3. Emite o token real de primeiro
       * acesso pela Server Function já
       * homologada no PASSO 13.2.5.2.
       */
      const invitation = await createAdminUserInvitationTokenAction({
        data: {
          userId: createdUser.id,
        },
      });

      setFirstAccess({
        user: {
          id: invitation.user.id,

          name: invitation.user.name,

          email: invitation.user.email,

          status: invitation.user.status,
        },

        sent: invitation.sent,

        expiresAt: invitation.expiresAt,
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível concluir a criação do usuário administrativo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (firstAccess) {
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
              Primeiro acesso criado
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
              Usuário criado e convite enviado por e-mail com sucesso.
            </p>
          </header>

          <section className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-200 px-6 py-6 md:px-8">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-stone-950">Convite administrativo</h2>

                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
                  {firstAccess.user.status}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                O convite de primeiro acesso foi enviado para o e-mail cadastrado do fluxo
                profissional de primeiro acesso.
              </p>
            </div>

            <div className="space-y-6 px-6 py-7 md:px-8 md:py-8">
              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                    Usuário
                  </p>

                  <p className="mt-2 text-sm font-semibold text-stone-950">
                    {firstAccess.user.name}
                  </p>
                </article>

                <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                    E-mail
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-stone-950">
                    {firstAccess.user.email}
                  </p>
                </article>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-semibold text-emerald-950">Convite enviado</p>

                <p className="mt-2 text-sm leading-6 text-emerald-900">
                  Enviamos para <strong>{firstAccess.user.email}</strong> o link seguro para criar a
                  senha e ativar a conta.
                </p>

                <p className="mt-2 text-xs leading-5 text-emerald-800">
                  O link é de uso único e expira em{" "}
                  <strong>{formatExpiration(firstAccess.expiresAt)}</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end md:px-8">
              <Link
                to="/admin/usuarios"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Concluir e voltar para usuários
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
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
            Cadastre um usuário administrativo utilizando somente Departamentos e Papéis ativos já
            governados pela plataforma.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="border-b border-stone-200 px-6 py-6 md:px-8">
            <h2 className="text-lg font-semibold text-stone-950">Dados do usuário</h2>
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
                onChange={(event) => setName(event.target.value)}
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
                onChange={(event) => setEmail(event.target.value)}
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
                  onChange={(event) => setDepartment(event.target.value)}
                  required
                  className="mt-2 min-h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                >
                  <option value="">Selecione um departamento</option>
                  {departments.map((item) => (
                    <option key={item.id} value={item.code}>
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
                  onChange={(event) => setRoleId(event.target.value)}
                  required
                  className="mt-2 min-h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                >
                  <option value="">Selecione um papel</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  SUPER_ADMIN não é oferecido para criação de novos usuários.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
              <p className="text-sm font-semibold text-stone-800">Primeiro acesso protegido</p>

              <p className="mt-2 text-xs leading-5 text-stone-500">
                Após criar o cadastro, a plataforma enviará um convite de primeiro acesso por e-mail
                de primeiro acesso para este usuário.
              </p>
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
              {submitting ? "Criando e gerando acesso..." : "Criar usuário e gerar primeiro acesso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
