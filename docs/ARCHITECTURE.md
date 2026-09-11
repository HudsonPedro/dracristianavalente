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
- Catálogo `/produtos-capilares`: `store_products` por boundary público persistido.
- Detalhe `/produtos-capilares/$slug`: `store_products` por boundary público persistido.
- Marquee e Cart: `src/data/products.ts` temporariamente.
- Admin/server: `store_products`.
Resultado: catálogo e detalhe públicos migrados; superfícies legadas de marquee e Cart ainda dependem da fonte temporária.

Decisão R2: `store_products` é a fonte canônica definitiva. `src/data/products.ts` passa a ser fonte temporária de migração, não autoridade futura de runtime. R2-B introduziu um boundary público read-only isolado, a Wave 1 fez o cutover de `/produtos-capilares` e a Wave 2 fez o cutover de `/produtos-capilares/$slug`.

### Public Catalog — Migrated
`store_products` → ProductRepository → ProductService → PublicProductCatalogService → `public-store-products` → TanStack route loader → `PublicProduct[]` → ProdutosCapilaresLayout → ProductCard public.

O ramo público não possui acesso ao CartContext e não há fallback automático para `src/data/products.ts`. Pending, error e catálogo vazio são tratados pela rota/layout. Nenhum acesso a Inventory foi introduzido.

### Product Detail — Migrated
`store_products` → ProductRepository → ProductService → PublicProductCatalogService → `getPublicStoreProductBySlug` → `$slug.tsx` loader → `PublicProduct` → ProductDetailPage apresentacional.

O boundary expõe somente produto `ACTIVE`; inexistente, `DRAFT` ou `INACTIVE` retorna `null` e a rota chama `notFound()`. Erros de infraestrutura são propagados para o `errorComponent`, com mensagem controlada e retry manual por `router.invalidate()`/`reset()`. Há `pendingComponent` local, sem fallback estático e sem exposição de stack ou erro interno. HTTP 503 explícito permanece deferido. O HTTP 404 real em produção ainda deve ser comprovado por smoke após deploy.

`ProductDetailPage` consome diretamente `PublicProduct`, sem conversão para `Product`, `useCart`, `addItem`, `canProductBeAddedToCart` ou feedback comercial. O detalhe não adiciona itens ao carrinho até a Wave 3. As imagens usam `PublicProductImage[]` (`id`, `url`, `alt`, `main`, `position`), em cópia ordenada por `main` primeiro, `position` crescente e `id` como desempate, sem mutar o DTO e com fallback seguro para ausência de imagem.

O SEO é derivado do mesmo `loaderData`, sem segundo fetch: `title`, `description`, canonical, Open Graph (`title`, `description`, `url`, `type`) e `robots`. Os fallbacks são `${product.name} | Dra. Cristiana Valente`, `product.shortDescription` e `https://www.dracristianavalente.com.br/produtos-capilares/${product.slug}`; `seo.noIndex === true` produz `noindex,nofollow`.

### Cart — Legacy Temporary
IDs e quantidades em `localStorage` → CartContext → reidratação por `src/data/products.ts` → renderização do carrinho.

O `ProductCard` mantém compatibilidade transitória: `public` → `PublicProduct` → sem Cart; `legacy` → `Product` → Cart permitido conforme o comportamento anterior. Essa compatibilidade permanece até a Wave 3.

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
Catálogo público principal: DB Product → boundary público → loader → UI sem Cart.
Detalhe público: DB Product → boundary público → loader → `PublicProduct` → UI apresentacional sem Cart.
Marquee e carrinho: Static Product → UI → CartContext/localStorage → WhatsApp/carrinho.
Admin: DB Product/Inventory → repositories → services → functions → Admin read-only.

Não existem end-to-end: Product CRUD, Inventory homologado, StoreSettings runtime, Customer/Address commerce, Orders, Checkout, Payment, autorização individual por avaliação/protocolo e audit log operacional.

## Arquitetura futura — alvo
Product canônico persistido → StoreSettings → Inventory → storefront/cart autoritativos → Customers/Addresses → Orders → Checkout → Payment.

Princípios: fonte única, validação e autorização server-side, ativação gradual, idempotência, atomicidade, auditoria, privacidade, testes e CI.

## Sequência de recuperação
R1 Documentation → R2 Source of Truth → R3 Tests/CI → R4 Commercial RBAC → R5 Product CRUD → R6 StoreSettings → R7 Inventory → R8 Authoritative Storefront/Cart → R9 Customers/Addresses/Orders → R10 Checkout → R11 Payment → R12 PRD Expansions.

Esta sequência não é a árvore oficial de `#PASSO`.
