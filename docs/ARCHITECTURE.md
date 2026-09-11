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
- Cart: `store_products` via boundary pública canônica em lote.
- ProductMarquee: DEAD/UNUSED, ainda com import legado de `src/data/products.ts`.
- Admin/server: `store_products`.
Resultado: catálogo, detalhe e carrinho usam produtos persistidos; não há autoridade runtime estática ativa.

Decisão R2: `store_products` é a fonte canônica definitiva. `src/data/products.ts` passa a ser fonte temporária de migração, não autoridade futura de runtime. R2-B introduziu um boundary público read-only isolado, a Wave 1 fez o cutover de `/produtos-capilares` e a Wave 2 fez o cutover de `/produtos-capilares/$slug`.

### Public Catalog — Migrated
`store_products` → ProductRepository → ProductService → PublicProductCatalogService → `public-store-products` → TanStack route loader → `PublicProduct[]` → ProdutosCapilaresLayout → ProductCard public.

O ramo público usa `PublicProduct` e, desde a Wave 3, acessa o CartContext canônico somente para produtos comercialmente elegíveis. Não há fallback para `src/data/products.ts`. Pending, error e catálogo vazio são tratados pela rota/layout. Nenhum acesso a Inventory foi introduzido.

### Product Detail — Migrated
`store_products` → ProductRepository → ProductService → PublicProductCatalogService → `getPublicStoreProductBySlug` → `$slug.tsx` loader → `PublicProduct` → ProductDetailPage apresentacional.

O boundary expõe somente produto `ACTIVE`; inexistente, `DRAFT` ou `INACTIVE` retorna `null` e a rota chama `notFound()`. Erros de infraestrutura são propagados para o `errorComponent`, com mensagem controlada e retry manual por `router.invalidate()`/`reset()`. Há `pendingComponent` local, sem fallback estático e sem exposição de stack ou erro interno. HTTP 503 explícito permanece deferido. O HTTP 404 real em produção ainda deve ser comprovado por smoke após deploy.

`ProductDetailPage` consome diretamente `PublicProduct`, sem conversão para `Product`. Desde a Wave 3, usa a regra comercial compartilhada e adiciona ao carrinho somente produtos elegíveis; produtos restritos preservam CTAs de avaliação, consulta ou WhatsApp. As imagens usam `PublicProductImage[]` (`id`, `url`, `alt`, `main`, `position`), em cópia ordenada por `main` primeiro, `position` crescente e `id` como desempate, sem mutar o DTO e com fallback seguro para ausência de imagem.

O SEO é derivado do mesmo `loaderData`, sem segundo fetch: `title`, `description`, canonical, Open Graph (`title`, `description`, `url`, `type`) e `robots`. Os fallbacks são `${product.name} | Dra. Cristiana Valente`, `product.shortDescription` e `https://www.dracristianavalente.com.br/produtos-capilares/${product.slug}`; `seo.noIndex === true` produz `noindex,nofollow`.

### Cart — Canonical Product Hydration
`localStorage` → `StoredCartItem[]` (`productId`, `quantity`) → `getPublicStoreProductsByIds` → `PublicProductCatalogService.getByIds` → `ProductRepository.list({ ids, status: ACTIVE })` → `PublicProduct[]` → elegibilidade comercial → `CartItem[]` → `/carrinho`.

A consulta é única e em lote; IDs são normalizados e deduplicados, a ordem solicitada é restaurada, e desconhecidos/DRAFT/INACTIVE são omitidos. Erros de infraestrutura propagam, sem fallback estático e sem Drizzle no cliente.

A hidratação possui estados `initial`, `loading`, `ready` e `error`. O storage só é atualizado em `ready`; falha temporária preserva as entradas e permite retry. Remoção por inexistência ou inelegibilidade só é persistida após resposta canônica bem-sucedida. Não existe snapshot financeiro: preço e preço promocional vêm do dado atual.

O `ProductCard` mantém o ramo `legacy` somente para compatibilidade com o `ProductMarquee` dormente. O ramo `public` recebe `PublicProduct` e usa o carrinho canônico; o ramo legado não alimenta esse carrinho.

### Categories
`src/data/categories.ts` é estático; IDs também são persistidos sem entidade/FK.
Nesta etapa, permanece como contrato estático controlado.

### Cart
Cart atual = React Context + `localStorage` mínimo + reidratação canônica. `canProductBeAddedToCart` exige venda habilitada, preço visível e válido, ausência de restrição por avaliação/protocolo e disponibilidade `AVAILABLE`. Checkout permanece desabilitado. Inventory ainda não participa do runtime.

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
Catálogo e detalhe: DB Product → boundary público → loader → `PublicProduct` → UI → CartContext canônico quando elegível.
Carrinho: IDs/quantidades locais → boundary pública em lote → regras comerciais → UI com dados canônicos.
ProductMarquee: DEAD/UNUSED com compatibilidade estática residual, fora do grafo runtime ativo.
Admin: DB Product/Inventory → repositories → services → functions → Admin read-only.

Não existem end-to-end: Product CRUD, Inventory homologado, StoreSettings runtime, Customer/Address commerce, Orders, Checkout, Payment, autorização individual por avaliação/protocolo e audit log operacional.

## Arquitetura futura — alvo
Product canônico persistido → StoreSettings → Inventory → storefront/cart autoritativos → Customers/Addresses → Orders → Checkout → Payment.

Princípios: fonte única, validação e autorização server-side, ativação gradual, idempotência, atomicidade, auditoria, privacidade, testes e CI.

## Sequência de recuperação
R1 Documentation → R2 Product Source of Truth + canonical cart/static retirement → R3 Tests/CI → R4 Commercial RBAC → R5 Product CRUD → R6 StoreSettings → R7 Inventory → R8 Commercial Storefront integration with StoreSettings/Inventory → R9 Customers/Addresses/Orders → R10 Checkout → R11 Payment → R12 PRD Expansions.

Esta sequência não é a árvore oficial de `#PASSO`.
