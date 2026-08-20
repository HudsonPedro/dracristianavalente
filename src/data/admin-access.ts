import {
  ADMIN_ACTIONS,
  ADMIN_MODULES,
  createAdminPermission,
  type AdminAction,
  type AdminModule,
  type AdminPermission,
  type AdminRoleCode,
} from "../domain/admin/access";

export type AdminRoleSeed = {
  id: string;

  code: AdminRoleCode;

  name: string;

  description: string;

  systemRole: boolean;

  active: boolean;

  permissions: AdminPermission[];
};

function permissions(
  module: AdminModule,
  actions: AdminAction[],
): AdminPermission[] {
  return actions.map((action) =>
    createAdminPermission(
      module,
      action,
    ),
  );
}

function allPermissions(): AdminPermission[] {
  return ADMIN_MODULES.flatMap(
    (module) =>
      ADMIN_ACTIONS.map(
        (action) =>
          createAdminPermission(
            module,
            action,
          ),
      ),
  );
}

const dashboardView =
  permissions(
    "DASHBOARD",
    ["VIEW"],
  );

export const ADMIN_ROLE_SEEDS: AdminRoleSeed[] =
  [
    {
      id: "role-super-admin",

      code: "SUPER_ADMIN",

      name: "Super Administrador",

      description:
        "Acesso integral à administração, segurança, usuários, permissões, configurações e auditoria.",

      systemRole: true,

      active: true,

      permissions:
        allPermissions(),
    },

    {
      id: "role-admin",

      code: "ADMIN",

      name: "Administrador",

      description:
        "Administração operacional da loja sem gerenciamento estrutural de usuários, cargos e permissões.",

      systemRole: true,

      active: true,

      permissions: [
        ...dashboardView,

        ...permissions(
          "CATALOG",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "DELETE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "INVENTORY",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "ORDERS",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "CUSTOMERS",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "SALES",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "FULFILLMENT",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "SETTINGS",
          [
            "VIEW",
            "UPDATE",
          ],
        ),

        ...permissions(
          "AUDIT",
          ["VIEW"],
        ),
      ],
    },

    {
      id: "role-catalog-manager",

      code: "CATALOG_MANAGER",

      name: "Gestor de Catálogo",

      description:
        "Responsável pelo cadastro, organização e manutenção do catálogo de produtos.",

      systemRole: true,

      active: true,

      permissions: [
        ...dashboardView,

        ...permissions(
          "CATALOG",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "DELETE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "INVENTORY",
          ["VIEW"],
        ),
      ],
    },

    {
      id: "role-inventory-manager",

      code: "INVENTORY_MANAGER",

      name: "Gestor de Estoque",

      description:
        "Responsável pelo controle operacional de estoque e disponibilidade dos produtos.",

      systemRole: true,

      active: true,

      permissions: [
        ...dashboardView,

        ...permissions(
          "CATALOG",
          ["VIEW"],
        ),

        ...permissions(
          "INVENTORY",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),
      ],
    },

    {
      id: "role-order-manager",

      code: "ORDER_MANAGER",

      name: "Gestor de Pedidos",

      description:
        "Responsável pelo processamento de pedidos, vendas e fluxo de entrega ou retirada.",

      systemRole: true,

      active: true,

      permissions: [
        ...dashboardView,

        ...permissions(
          "ORDERS",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "SALES",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "FULFILLMENT",
          [
            "VIEW",
            "CREATE",
            "UPDATE",
            "MANAGE",
          ],
        ),

        ...permissions(
          "CUSTOMERS",
          ["VIEW"],
        ),

        ...permissions(
          "INVENTORY",
          ["VIEW"],
        ),
      ],
    },

    {
      id: "role-customer-service",

      code: "CUSTOMER_SERVICE",

      name: "Atendimento",

      description:
        "Responsável pelo atendimento ao cliente e acompanhamento operacional dos pedidos.",

      systemRole: true,

      active: true,

      permissions: [
        ...dashboardView,

        ...permissions(
          "CUSTOMERS",
          [
            "VIEW",
            "UPDATE",
          ],
        ),

        ...permissions(
          "ORDERS",
          [
            "VIEW",
            "UPDATE",
          ],
        ),

        ...permissions(
          "SALES",
          ["VIEW"],
        ),

        ...permissions(
          "FULFILLMENT",
          ["VIEW"],
        ),

        ...permissions(
          "CATALOG",
          ["VIEW"],
        ),
      ],
    },

    {
      id: "role-read-only",

      code: "READ_ONLY",

      name: "Somente Leitura",

      description:
        "Acesso exclusivamente de consulta aos módulos operacionais autorizados.",

      systemRole: true,

      active: true,

      permissions: [
        ...dashboardView,

        ...permissions(
          "CATALOG",
          ["VIEW"],
        ),

        ...permissions(
          "INVENTORY",
          ["VIEW"],
        ),

        ...permissions(
          "ORDERS",
          ["VIEW"],
        ),

        ...permissions(
          "CUSTOMERS",
          ["VIEW"],
        ),

        ...permissions(
          "SALES",
          ["VIEW"],
        ),

        ...permissions(
          "FULFILLMENT",
          ["VIEW"],
        ),
      ],
    },
  ];

export function getAdminRoleSeed(
  code: AdminRoleCode,
): AdminRoleSeed | undefined {
  return ADMIN_ROLE_SEEDS.find(
    (role) =>
      role.code === code,
  );
}
