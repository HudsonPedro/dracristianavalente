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
Fluxo: IMPLEMENTAR → VALIDAR → DOCUMENTAR → COMMITAR → DEPLOY → HOMOLOGAR → ATUALIZAR STATUS.

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

# DECISÕES EM ABERTO

## O-001 — Fonte canônica de Product
**Status:** EM ABERTO — R2
Decidir fonte canônica, estratégia `static → persisted`, IDs/slugs, reconciliação de modelos, publicação, fallback de DB e prevenção de publicação incompleta.

## O-002 — Status/availability
**Status:** EM ABERTO — R2
Definir contrato entre status comercial, disponibilidade pública e Inventory; resolver `OUT_OF_STOCK` versus `ACTIVE`.

## O-003 — Categories
**Status:** EM ABERTO — R2
Decidir catálogo estático validado no servidor ou entidade persistida com CRUD/FK.

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
