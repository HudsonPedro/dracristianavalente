# SITE DRA.CRIS VENDAS PRODUTOS DNA — ARCHITECTURE

## Visão
Plataforma clínica/comercial premium de produtos capilares. Estratégia: catálogo + venda assistida → ativação gradual → e-commerce completo. Jornada: Avaliação → Indicação → Protocolo → Produto → Acompanhamento.

## Stack
React 19, TypeScript, Tailwind CSS 4, Radix/shadcn-style, TanStack Router/Start, Nitro, Vite, PostgreSQL/Neon, Drizzle ORM/Kit, auth próprio persistido, cookie session, RBAC persistido, Resend server-side, GA4, ESLint, Prettier. Bun e pnpm coexistem historicamente.

## Camadas
Arquitetura madura esperada:
Routes → Server Functions → Services → Repositories → DB/Schema/Domain.

A aderência atual é heterogênea.

### Público
Site institucional, tratamentos/avaliação, `/produtos-capilares`, `/produtos-capilares/$slug`, `/carrinho`, privacidade e termos.

### Admin
Login, dashboard, Products read-only, Users, Roles/Permissions, Departments, Segurança/Senha e Primeiro Acesso.

### Functions
`admin-auth`, `admin-users`, `store-products` read-only, `store-inventory` leitura + quantity mutation.

### Services
Auth/Governance, ProductService, InventoryService, OrderService desconectado.

### Repositories
DrizzleProductRepository, DrizzleInventoryRepository e OrderRepository apenas como contrato.

### Database
Commerce: Products, Inventory, Customers, Addresses, Orders/Items, StoreSettings.
Admin: Users, Roles, Permissions, Departments, tokens, overrides, invitations estruturais e audit logs.

## Exceções arquiteturais

### Product
- Público: `src/data/products.ts`.
- Admin/server: `store_products`.
Resultado: duas fontes concorrentes de verdade.

Decisão R2: `store_products` é a fonte canônica definitiva. `src/data/products.ts` passa a ser fonte temporária de migração, não autoridade futura de runtime. R2-B introduz um boundary público read-only isolado (`PublicProduct` → serviço público → server functions públicas), ainda sem cutover do storefront.

### Categories
`src/data/categories.ts` é estático; IDs também são persistidos sem entidade/FK.
Nesta etapa, permanece como contrato estático controlado.

### Cart
Cart operacional = React Context + `localStorage`; não é autoridade de preço, flags, disponibilidade ou estoque. Existe cart domain paralelo desconectado.

### StoreSettings
Modelado/persistido, sem repository/service/runtime efetivo.

### Orders
Domínio/schema/repository contract/service existem; sem DrizzleOrderRepository, functions ou UI operacional.

### Leads/WhatsApp
Fluxos externos contornam o domínio comercial interno.

### First Access
Usa `admin_password_reset_tokens`, não `admin_user_invitations`.

## Auth/session
`requireAdmin` revalida usuário, soft delete, status ACTIVE, role ativa, roleId/role e authVersion. `authVersion` permite invalidação global.

## RBAC
Módulos: DASHBOARD, CATALOG, INVENTORY, ORDERS, CUSTOMERS, SALES, FULFILLMENT, USERS, SETTINGS, AUDIT.
Ações: VIEW, CREATE, UPDATE, DELETE, MANAGE.
Permissões efetivas: role permissions → DENY remove → ALLOW adiciona.
Toda mutation deve aplicar RBAC no servidor.

Finding crítico aberto: `updateAdminUser` permite escalada para `SUPER_ADMIN` quando o ator possui sessão válida + `USERS:VIEW`. Pertence a R4.

## Fronteira comercial atual
Público: Static Product → UI → CartContext/localStorage → WhatsApp/carrinho.
Admin: DB Product/Inventory → repositories → services → functions → Admin read-only.

Não existem end-to-end: Product CRUD, Inventory homologado, StoreSettings runtime, Customer/Address commerce, Orders, Checkout, Payment, autorização individual por avaliação/protocolo e audit log operacional.

## Arquitetura futura — alvo
Product canônico persistido → StoreSettings → Inventory → storefront/cart autoritativos → Customers/Addresses → Orders → Checkout → Payment.

Princípios: fonte única, validação e autorização server-side, ativação gradual, idempotência, atomicidade, auditoria, privacidade, testes e CI.

## Sequência de recuperação
R1 Documentation → R2 Source of Truth → R3 Tests/CI → R4 Commercial RBAC → R5 Product CRUD → R6 StoreSettings → R7 Inventory → R8 Authoritative Storefront/Cart → R9 Customers/Addresses/Orders → R10 Checkout → R11 Payment → R12 PRD Expansions.

Esta sequência não é a árvore oficial de `#PASSO`.
