# SITE DRA.CRIS VENDAS PRODUTOS DNA — PROJECT STATUS

Última atualização: 2026-09-09

## Identidade
Plataforma clínica/comercial premium de produtos capilares associada à Dra. Cristiana Valente. Estratégia: catálogo + venda assistida → ativação comercial progressiva → e-commerce completo. Jornada pretendida: Avaliação → Indicação → Protocolo → Produto → Acompanhamento.

## Baseline Git
- Repositório: `C:\HudsonPedro\dracristianavalente`
- Branch: `main`
- HEAD: `8d5a1f03421af4e3e3ed6697438e5b5f276558b5`
- `origin/main`: `8d5a1f03421af4e3e3ed6697438e5b5f276558b5`
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
- catálogo público estático;
- detalhe público de produto;
- carrinho client-side com `localStorage`;
- Product e Inventory persistidos;
- Admin Products persistido, porém read-only;
- leitura administrativa de estoque;
- Auth/Governance mais madura que commerce.
A frente comercial não chegou a Orders operacional, Checkout ou Payment.

## Principal blocker arquitetural
Duas fontes concorrentes de verdade para Product:
- `src/data/products.ts` — storefront, detalhe e carrinho;
- `store_products` — Admin e serviços server-side.
A fonte canônica permanece **NÃO DETERMINADA** até R2.

## Maturidade
| Área | Estado |
| --- | --- |
| Site institucional | IMPLEMENTADO |
| Avaliação | PARCIAL |
| Catálogo | DIVERGENTE |
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
| Documentation | R1 EM EXECUÇÃO |

## Blockers
- duas fontes concorrentes de Product;
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
**R1 — Documentation baseline**

## Próxima ação após R1
**R2 — Source of truth**: decidir qual é a fonte canônica de Product e como o storefront migrará de dados estáticos para persistidos.

## Decisões abertas
Fonte canônica de Product; `static → persisted`; fallback de DB; reconciliação de modelos; status/availability; Categories; IDs/slugs; publicação; imagens; Product/Inventory; StoreSettings runtime; estoque/backorder; concorrência; auditoria; guest vs conta; delivery/pickup; frete; Orders; Payment.

## Governança
IMPLEMENTAR → VALIDAR → DOCUMENTAR → COMMITAR → DEPLOY → HOMOLOGAR → ATUALIZAR STATUS.

Deploy não significa homologação. Código presente não significa feature operacional. Nenhum item entra como HOMOLOGADO sem aceite humano explícito.
