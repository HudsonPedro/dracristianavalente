# SITE DRA.CRIS VENDAS PRODUTOS DNA — DECISIONS

## Política
Cada decisão deve registrar ID, título, status, data, contexto, decisão, alternativas, consequências, dependências, commits e aprovação humana.
Status: DECIDIDO, EM ABERTO, SUPERSEDIDO.
Decisão aberta nunca deve ser descrita como implementada.

## D-001 — Identidade clínica/comercial
**Status:** DECIDIDO
O projeto é uma plataforma clínica/comercial premium associada à Dra. Cristiana Valente, não uma loja genérica. Avaliação/protocolo podem condicionar compra.

## D-002 — Catálogo + venda assistida primeiro
**Status:** DECIDIDO
Catálogo + venda assistida → ativação comercial progressiva → e-commerce completo.

## D-003 — Ativação gradual
**Status:** DECIDIDO
Flags comerciais devem controlar comportamento sem rebuild, incluindo `saleEnabled`, `priceVisibility`, `requiresEvaluation`, `requiresProtocol`, `stockEnabled`, `checkoutEnabled` e `paymentEnabled`.

## D-004 — Autorização server-side
**Status:** DECIDIDO
UI/menus/parent route não substituem autenticação e autorização nas mutations server-side.

## D-005 — Preservar Auth/Governance
**Status:** DECIDIDO
A base existente de sessão, Users, Roles, Permissions, Departments e First Access deve ser preservada e evoluída.

## D-006 — Documentação como gate
**Status:** DECIDIDO
Nenhuma nova retomada comercial sem baseline documental.
Fluxo: IMPLEMENTAR → VALIDAR → DOCUMENTAR → REVISAR → COMMITAR → PUSH/DEPLOY → HOMOLOGAR → ATUALIZAR STATUS.

## D-007 — Sequência R1–R12
**Status:** DECIDIDO
R1 Documentation → R2 Source of Truth → R3 Tests/CI → R4 Commercial RBAC → R5 Product CRUD → R6 StoreSettings → R7 Inventory → R8 Authoritative Storefront/Cart → R9 Customers/Addresses/Orders → R10 Checkout → R11 Payment → R12 PRD Expansions.
R1–R12 não é `#PASSO`.

## D-008 — Não inventar próximo #PASSO
**Status:** DECIDIDO
A numeração oficial posterior não é recuperável pelo repositório; nenhum passo deve ser inventado.

## D-009 — RC-01
**Status:** DECIDIDO
`src/functions/store-inventory.ts` permanece CONGELADO, NÃO HOMOLOGADO e será REFEITO POSTERIORMENTE no gate Inventory.
Git object: `5190206904df1133fa6d535ffe03681f3aaf0b72`
SHA-256: `314FE53058D4C57189A735745020845F0D69ECF9011285D029149D23FA802846`

## D-010 — Fonte canônica de Product
**Status:** DECIDIDO — R2-A aceito em 2026-09-09
`store_products` é a fonte canônica definitiva de Product. `store_inventory` é a fonte canônica de estoque. `src/data/products.ts` é fonte temporária de migração e não será autoridade futura de runtime. Categories permanecem como contrato estático controlado nesta etapa. O boundary público deve ser isolado da cadeia existente de `src/functions/store-products.ts`.

## D-011 — Cutover incremental do storefront
**Status:** DECIDIDO — R2-D-W1 em 2026-09-10
O cutover será incremental, não big-bang. O catálogo `/produtos-capilares` pode migrar antes do Cart desde que o ramo público esteja estruturalmente isolado do CartContext legado. Não haverá fallback automático para `src/data/products.ts` em falha de infraestrutura.

## D-012 — Compatibilidade transitória do ProductCard
**Status:** DECIDIDO — R2-D-W1 em 2026-09-10
O `ProductCard` usa temporariamente um contrato discriminado: o ramo `public` recebe `PublicProduct` e não acessa Cart; o ramo `legacy` recebe `Product` e preserva o `ProductMarquee`. A compatibilidade permanece até a Wave 3.

## D-013 — Tratamento de indisponibilidade na Wave 1
**Status:** DECIDIDO — R2-D-W1 em 2026-09-10
HTTP 503 explícito permanece deferido. A Wave 1 adota `errorComponent` controlado, retry e pending state, sem expor erro bruto e sem fallback estático.

## D-014 — Política CRLF/Prettier fora da Wave 1
**Status:** DECIDIDO — R2-D-W1 em 2026-09-10
A divergência preexistente de CRLF/Prettier é uma issue separada e não será corrigida nesta wave. Classificação: **NON-BLOCKING PREEXISTING FORMAT POLICY ISSUE**. ESLint normal permanece FAIL; ESLint sem `prettier/prettier` passa.

## D-015 — Boundary do detalhe público
**Status:** DECIDIDO — R2-D-W2 em 2026-09-10
O detalhe público usa somente `PublicProduct`, obtido por `getPublicStoreProductBySlug`, sem conversão para o `Product` legado e sem fallback para `src/data/products.ts`. Imagens estruturadas persistidas são consumidas diretamente.

## D-016 — Cart desconectado do detalhe até a Wave 3
**Status:** DECIDIDO — R2-D-W2 em 2026-09-10
O detalhe permanece apresentacional e sem ação de carrinho. `CartContext`, `ProductMarquee` e os demais consumidores estáticos só serão migrados na Wave 3, ainda não iniciada.

## D-017 — SEO canônico do detalhe
**Status:** DECIDIDO — R2-D-W2 em 2026-09-10
Metadata e canonical derivam do mesmo loader canônico do detalhe, sem segundo fetch e sem uso de `src/data/products.ts` para SEO.

## D-018 — Semântica pública de not-found e infraestrutura
**Status:** DECIDIDO — R2-D-W2 em 2026-09-10
Produto inexistente, `DRAFT` ou `INACTIVE` é indistinguível na superfície pública e resulta em `notFound()`. Falha de infraestrutura permanece distinta e segue para o `errorComponent`. HTTP 503 explícito continua deferido; o HTTP 404 real deve ser comprovado em produção antes da homologação humana da Wave 2.

# DECISÕES EM ABERTO

## O-001 — Fonte canônica de Product
**Status:** SUPERSEDIDO POR D-010
A fonte canônica e o papel temporário do catálogo estático estão decididos. Paridade de dados, cutover, fallback degradado e detalhes de publicação continuam como trabalho de R2.

## O-002 — Status/availability
**Status:** EM ABERTO — R2
Definir contrato entre status comercial, disponibilidade pública e Inventory; resolver `OUT_OF_STOCK` versus `ACTIVE`.

## O-003 — Categories
**Status:** SUPERSEDIDO POR D-010 NESTA ETAPA
Categories permanecem como contrato estático controlado. Persistência com CRUD/FK poderá ser reconsiderada em etapa futura.

## O-004 — Product/Inventory
**Status:** EM ABERTO — R2/R7
Definir `stockEnabled`, disponibilidade, mínimo, backorder e precedência entre regras comerciais e estoque.

## O-005 — StoreSettings runtime
**Status:** EM ABERTO — R6
Definir governança de loja, cart, checkout, payment, inventory, pickup, delivery, WhatsApp e identificação.

## O-006 — Inventory concurrency
**Status:** EM ABERTO — R7
Definir atomicidade/concorrência de update/reserve/release/commit/backorder.

## O-007 — Audit contract
**Status:** EM ABERTO — R4/R5/R7
Definir eventos e payload mínimo para Products, Inventory, Orders, Payment, Settings e Users/RBAC.

## O-008 — Customer model
**Status:** EM ABERTO — R9
Guest vs conta, identificação, minimização, retenção, LGPD e relação com Orders.

## O-009 — Fulfillment
**Status:** EM ABERTO — R9/R10
Delivery, pickup, endereço, frete, snapshots e lifecycle.

## O-010 — Orders lifecycle
**Status:** EM ABERTO — R9
Transições, idempotência, snapshots, reserva e cancelamento.

## O-011 — Payment architecture
**Status:** EM ABERTO — R11
Modelo Payment, estados, idempotência, webhook, reconciliação, cancelamento/refund e estoque. Gateway ainda não decidido.
