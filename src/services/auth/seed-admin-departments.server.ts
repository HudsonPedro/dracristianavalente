import {
  eq,
} from "drizzle-orm";

import {
  ADMIN_DEPARTMENTS,
  type AdminDepartment,
} from "../../domain/admin/access";

import {
  getDb,
} from "../../db";

import {
  adminDepartmentsTable,
} from "../../db/schema/admin-departments";

type AdminDepartmentSeedDefinition = {
  code: AdminDepartment;

  name: string;

  description: string;
};

const ADMIN_DEPARTMENT_SEED: readonly AdminDepartmentSeedDefinition[] = [
  {
    code:
      "ADMINISTRATION",

    name:
      "Administração",

    description:
      "Administração geral da operação, usuários, acessos, configurações e governança da plataforma.",
  },

  {
    code:
      "CATALOG",

    name:
      "Catálogo",

    description:
      "Gestão de produtos, conteúdo, preços, informações comerciais e publicação do catálogo.",
  },

  {
    code:
      "INVENTORY",

    name:
      "Estoque",

    description:
      "Gestão de disponibilidade, saldos, movimentações e controles operacionais de estoque.",
  },

  {
    code:
      "SALES",

    name:
      "Vendas",

    description:
      "Gestão comercial, vendas, acompanhamento de pedidos e atividades relacionadas à conversão.",
  },

  {
    code:
      "CUSTOMER_SERVICE",

    name:
      "Atendimento",

    description:
      "Atendimento, suporte, relacionamento e acompanhamento das necessidades dos clientes.",
  },

  {
    code:
      "FULFILLMENT",

    name:
      "Expedição e Entrega",

    description:
      "Separação, expedição, entrega e acompanhamento operacional do atendimento dos pedidos.",
  },
] as const;

export type SeedAdminDepartmentsResult = {
  inserted: number;

  updated: number;

  total: number;
};

function validateSeedCoverage(): void {
  /*
   * O domínio oficial é ADMIN_DEPARTMENTS.
   *
   * Este gate impede que um novo departamento
   * seja adicionado ao domínio e esquecido
   * no seed persistente.
   */
  const officialCodes =
    new Set<string>(
      ADMIN_DEPARTMENTS,
    );

  const seedCodes =
    new Set<string>(
      ADMIN_DEPARTMENT_SEED.map(
        (department) =>
          department.code,
      ),
    );

  if (
    officialCodes.size !==
    seedCodes.size
  ) {
    throw new Error(
      "O seed de departamentos não corresponde ao domínio administrativo oficial.",
    );
  }

  for (
    const code
    of officialCodes
  ) {
    if (
      !seedCodes.has(
        code,
      )
    ) {
      throw new Error(
        `Departamento oficial ausente no seed: ${code}.`,
      );
    }
  }

  for (
    const code
    of seedCodes
  ) {
    if (
      !officialCodes.has(
        code,
      )
    ) {
      throw new Error(
        `Departamento desconhecido encontrado no seed: ${code}.`,
      );
    }
  }
}

export async function seedAdminDepartments(): Promise<
  SeedAdminDepartmentsResult
> {
  validateSeedCoverage();

  const db =
    getDb();

  let inserted =
    0;

  let updated =
    0;

  for (
    const department
    of ADMIN_DEPARTMENT_SEED
  ) {
    /*
     * Buscamos sempre pelo code.
     *
     * code é a identidade funcional já usada
     * por admin_users.department.
     */
    const [
      existingDepartment,
    ] =
      await db
        .select({
          id:
            adminDepartmentsTable.id,

          name:
            adminDepartmentsTable.name,

          description:
            adminDepartmentsTable.description,

          isActive:
            adminDepartmentsTable.isActive,
        })
        .from(
          adminDepartmentsTable,
        )
        .where(
          eq(
            adminDepartmentsTable.code,
            department.code,
          ),
        )
        .limit(1);

    /*
     * Ainda não existe:
     * cria o cadastro oficial.
     */
    if (
      !existingDepartment
    ) {
      await db
        .insert(
          adminDepartmentsTable,
        )
        .values({
          code:
            department.code,

          name:
            department.name,

          description:
            department.description,

          isActive:
            true,
        });

      inserted +=
        1;

      continue;
    }

    /*
     * Já existe:
     * sincroniza nome, descrição e estado.
     *
     * O ID existente é preservado.
     */
    const needsUpdate =
      existingDepartment.name !==
        department.name ||
      existingDepartment.description !==
        department.description ||
      existingDepartment.isActive !==
        true;

    if (
      !needsUpdate
    ) {
      continue;
    }

    await db
      .update(
        adminDepartmentsTable,
      )
      .set({
        name:
          department.name,

        description:
          department.description,

        isActive:
          true,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          adminDepartmentsTable.code,
          department.code,
        ),
      );

    updated +=
      1;
  }

  return {
    inserted,

    updated,

    total:
      ADMIN_DEPARTMENT_SEED.length,
  };
}
