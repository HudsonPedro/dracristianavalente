# SITE DRA.CRIS VENDAS PRODUTOS DNA — PROJECT STATUS

Última atualização: 2026-09-10

## Identidade
Plataforma clínica/comercial premium de produtos capilares associada à Dra. Cristiana Valente. Estratégia: catálogo + venda assistida → ativação comercial progressiva → e-commerce completo. Jornada pretendida: Avaliação → Indicação → Protocolo → Produto → Acompanhamento.

## Baseline Git
- Repositório: `C:\HudsonPedro\dracristianavalente`
- Branch: `main`
- Baseline R1 homologada: `b10dd136902fbdf93afe8740fd4f4942b49a63da`
- HEAD antes de R2-B: `b10dd136902fbdf93afe8740fd4f4942b49a63da`
- `origin/main` antes de R2-B: `b10dd136902fbdf93afe8740fd4f4942b49a63da`
- Working tree preexistente: `M src/functions/store-inventory.ts`

## Homologações humanas conhecidas
- Papéis e Permissões — `#PASSO 10.14.4.12.12.23.4` — **HOMOLOGADO**
- Usuários/Primeiro Acesso — `#PASSO 10.14.4.12.13.2.5.4` — **HOMOLOGADO**
- Nenhum passo posterior deve ser inventado.

## RC-01
Arquivo: `src/functions/store-inventory.ts`
- **CONGELADO**
- **NÃO HOMOLOGADO**
- Decisão: **REFAZER POSTERIORMENTE NO GATE INVENTORY**
- Git object: `5190206904df1133fa6d535ffe03681f3aaf0b72`
- SHA-256: `314FE53058D4C57189A735745020845F0D69ECF9011285D029149D23FA802846`

## Fronteira comercial
- site institucional implementado;
- catálogo principal `/produtos-capilares` persistido; detalhe, ProductMarquee e carrinho temporariamente legados;
- detalhe público de produto;
- carrinho client-side com `localStorage`;
- Product e Inventory persistidos;
- Admin Products persistido, porém read-only;
- leitura administrativa de estoque;
- Auth/Governance mais madura que commerce.
A frente comercial não chegou a Orders operacional, Checkout ou Payment.

## Principal blocker arquitetural
A decisão de fonte canônica foi encerrada em R2: `store_products` é a fonte canônica definitiva de Product, `store_inventory` é a fonte canônica de estoque, `src/data/products.ts` é fonte temporária de migração e `src/data/categories.ts` permanece como contrato estático controlado nesta etapa.

Enquanto o cutover total não for concluído, permanecem pendentes:
- paridade e reconciliação das superfícies ainda legadas com o catálogo persistido;
- cutover do detalhe, Cart e consumidores legados, com retirada final do catálogo estático do runtime;
- política degradada em caso de indisponibilidade do banco;
- precedência futura entre `availability` e Inventory.

## Maturidade
| Área | Estado |
| --- | --- |
| Site institucional | IMPLEMENTADO |
| Avaliação | PARCIAL |
| Catálogo | PARCIALMENTE MIGRADO |
| Detalhe de produto | IMPLEMENTADO |
| Categorias | PARCIAL |
| Carrinho | PARCIAL |
| Products persistence | IMPLEMENTADO |
| Inventory | PARCIAL |
| StoreSettings | FUNDAÇÃO |
| Customers | FUNDAÇÃO |
| Addresses | FUNDAÇÃO |
| Orders | FUNDAÇÃO |
| Checkout | AUSENTE |
| Payment | AUSENTE |
| Admin Products | PREPARADO/DESABILITADO |
| Admin Auth | IMPLEMENTADO |
| Users | IMPLEMENTADO |
| Roles | IMPLEMENTADO |
| Permissions | IMPLEMENTADO |
| Departments | IMPLEMENTADO |
| First Access | IMPLEMENTADO |
| Audit Log | FUNDAÇÃO |
| Permission Overrides | PARCIAL |
| SEO | PARCIAL |
| LGPD | PARCIAL |
| Security | PARCIAL |
| Accessibility | PARCIAL |
| Performance | PARCIAL |
| Tests | AUSENTE |
| CI automático | AUSENTE |
| Documentation | R1 HOMOLOGADO |

## Blockers
- dependência temporária de `src/data/products.ts` para seed/migração e runtime das superfícies ainda não migradas; `store_products` permanece como fonte canônica;
- G-01/F-01: escalada para `SUPER_ADMIN` condicionada a sessão válida + `USERS:VIEW`;
- autorização server-side comercial incompleta;
- ausência de testes e CI automático;
- Inventory sem gate completo de concorrência/atomicidade;
- StoreSettings desconectado;
- Orders sem implementação concreta;
- Checkout e Payment ausentes;
- GA4 sem consentimento implementado;
- lead externo sem consentimento explícito e controles de abuso comprovados.

## Sequência R1–R12
1. R1 — Documentation baseline
2. R2 — Source of truth
3. R3 — Tests + CI
4. R4 — Commercial RBAC
5. R5 — Product CRUD
6. R6 — StoreSettings runtime
7. R7 — Inventory
8. R8 — Authoritative storefront/cart
9. R9 — Customers/Addresses/Orders
10. R10 — Checkout
11. R11 — Payment
12. R12 — PRD expansions

Esta sequência não é a árvore oficial de `#PASSO`.

## Gate atual
**R2 — Source of truth**

- R2-A: **ACEITO** com R2-A-C01.
- R2-B: **HOMOLOGADO**.
- R2-C: **ACEITO**.
- R2-D: **ACEITO**.
- R2-D-W1: **IMPLEMENTED / TECHNICALLY VALIDATED / CODE REVIEW PASSED / AWAITING HUMAN HOMOLOGATION**.

A Wave 1 migrou somente `/produtos-capilares` para a fonte persistida, via loader SSR e `PublicProduct[]`. O layout não consulta mais `src/data/products.ts`, o ramo público do `ProductCard` está isolado do CartContext e não existe fallback estático. Categorias continuam em `src/data/categories.ts`.

O catálogo público principal está parcialmente migrado. `/produtos-capilares/$slug`, `ProductDetailPage`, `ProductMarquee`, `CartContext` e `/carrinho` continuam temporariamente legados e ainda usam `src/data/products.ts`. Inventory, Checkout, Orders, Payment e StoreSettings não foram alterados pela Wave 1.

O Source of Truth R2 ainda não está totalmente fechado: Wave 2 e Wave 3 permanecem pendentes. Não avançar R3.

Decisão de R2: `store_products` é a fonte canônica definitiva de Product; `store_inventory` é a fonte canônica de estoque; `src/data/products.ts` é fonte temporária de migração; Categories permanecem como contrato estático controlado nesta etapa.

## Decisões abertas
Paridade e reconciliação `static → persisted` das superfícies restantes; cutover do detalhe, Cart e consumidores legados; retirada final de `src/data/products.ts` do runtime; política degradada em indisponibilidade do banco; status/availability; IDs/slugs; publicação; imagens; Product/Inventory; StoreSettings runtime; estoque/backorder; concorrência; auditoria; guest vs conta; delivery/pickup; frete; Orders; Payment.

## Governança
IMPLEMENTAR → VALIDAR → DOCUMENTAR → REVISAR → COMMITAR → PUSH/DEPLOY → HOMOLOGAR → ATUALIZAR STATUS.

Deploy não significa homologação. Código presente não significa feature operacional. Nenhum item entra como HOMOLOGADO sem aceite humano explícito.
