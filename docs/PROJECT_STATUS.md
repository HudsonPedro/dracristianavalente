# SITE DRA.CRIS VENDAS PRODUTOS DNA — PROJECT STATUS

Última atualização: 2026-09-11

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
- catálogo principal, detalhe e carrinho usam produtos públicos persistidos; ProductMarquee permanece dormente com compatibilidade legada;
- detalhe público de produto;
- carrinho client-side com `localStorage` contendo somente `productId + quantity` e reidratação canônica em lote;
- Product e Inventory persistidos;
- Admin Products persistido, porém read-only;
- leitura administrativa de estoque;
- Auth/Governance mais madura que commerce.
A frente comercial não chegou a Orders operacional, Checkout ou Payment.

## Pendências arquiteturais após R2
A decisão de fonte canônica foi encerrada em R2: `store_products` é a fonte canônica definitiva de Product, `store_inventory` é a fonte canônica de estoque, `src/data/products.ts` é fonte temporária de migração e `src/data/categories.ts` permanece como contrato estático controlado nesta etapa.

Com a Wave 3 publicada e homologada, permanecem pendentes:
- limpeza futura do `ProductMarquee` dormente, sem autoridade runtime ativa;
- política degradada em caso de indisponibilidade do banco;
- precedência futura entre `availability` e Inventory.

## Maturidade
| Área | Estado |
| --- | --- |
| Site institucional | IMPLEMENTADO |
| Avaliação | PARCIAL |
| Catálogo | MIGRADO / HUMAN HOMOLOGATED |
| Detalhe de produto | IMPLEMENTADO |
| Categorias | PARCIAL |
| Carrinho | CANÔNICO / HUMAN HOMOLOGATED |
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
| Tests | R3 TECHNICALLY COMPLETE — 47 TESTS PASS |
| CI automático | IMPLEMENTADO — QUALITY GATE PR/PUSH MAIN |
| Documentation | R1 HOMOLOGADO |

R3 — Tests + CI está **TECHNICALLY COMPLETE / AGUARDANDO COMMIT, PUSH E EXECUÇÃO REMOTA DO QUALITY GATE**. Vitest 5 em ambiente Node cobre `ProductService`, `Public Product Catalog Boundary`, regras críticas do carrinho, permissões efetivas/RBAC e `requireAdmin`/`authVersion`; 5 arquivos e 47 testes em **PASS**. O quality gate automático executa em pull request e push para `main`, com instalação frozen, typecheck, testes e build.

O escopo essencial definido para R3 foi implementado. W1, W2 e W3 permanecem encerradas e não serão reabertas por R3. O encerramento final de R3 depende apenas do commit/push e da confirmação do quality gate remoto; depois disso a sequência avança para R4 — Commercial RBAC.

## Blockers
- `src/data/products.ts` permanece para seed/migração/reconciliação e compatibilidade dormente, sem autoridade runtime ativa;
- G-01/F-01: escalada para `SUPER_ADMIN` condicionada a sessão válida + `USERS:VIEW`;
- autorização server-side comercial incompleta;
- cobertura automatizada essencial de R3 implementada; expansão futura permanece incremental conforme novas áreas comerciais forem implementadas;
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
8. R8 — Commercial storefront integration with StoreSettings + Inventory
9. R9 — Customers/Addresses/Orders
10. R10 — Checkout
11. R11 — Payment
12. R12 — PRD expansions

Esta sequência não é a árvore oficial de `#PASSO`.

## Gate atual
**Public Store Entry Gate — controle de exposição pública antes de R3**

- R2-A: **ACEITO** com R2-A-C01.
- R2-B: **HOMOLOGADO**.
- R2-C: **ACEITO**.
- R2-D: **ACEITO**.
- R2-D-W1: **HUMAN HOMOLOGATED / CONCLUÍDA**.
- R2-D-W2: **HUMAN HOMOLOGATED / CLOSED**.
- R2-D-W3: **HUMAN HOMOLOGATED / CLOSED**.
- R2-D-W3 commit: `585bd39f5a639281d30a2ddcd376aab21e76f1c4`.
- R2 — Source of Truth: **CONCLUÍDA**.
- Public Store Entry Gate: **IMPLEMENTADO / TESTADO LOCALMENTE / APROVADO / DESATIVADO**.
- Feature flag: `STORE_PUBLIC_ENTRY_ENABLED = false`.
- Menu, seção da Home e footer para `/produtos-capilares` permanecem visíveis quando a flag está `false`, porém desabilitados e sem navegação; a flag `true` ativa os mesmos pontos de entrada.
- Ativação pública somente mediante autorização explícita do Hudson.

A Wave 1 migrou somente `/produtos-capilares` para a fonte persistida, via loader SSR e `PublicProduct[]`. O layout não consulta mais `src/data/products.ts`, o ramo público do `ProductCard` está isolado do CartContext e não existe fallback estático. Categorias continuam em `src/data/categories.ts`.

O detalhe `/produtos-capilares/$slug` foi migrado na Wave 2: usa `getPublicStoreProductBySlug`, recebe `PublicProduct`, deriva SEO do mesmo loader e não possui fallback estático. A produção foi verificada externamente: produto válido respondeu HTTP 200, slug inexistente respondeu HTTP 404 real, SEO/canonical dinâmicos foram verificados e o aceite humano encerrou a W2. HTTP 503 explícito continua deferido.

Na Wave 3, `CartContext` e `/carrinho` passaram a usar `PublicProduct`, resolvido em lote por IDs. Catálogo e detalhe restauraram a entrada de compra somente para produtos elegíveis. Os imports restantes de `products.ts` são o seed e o `ProductMarquee` DEAD/UNUSED; imports runtime ativos chegaram a zero. Inventory, Checkout, Orders, Payment e StoreSettings não foram alterados.

O Source of Truth R2 está encerrado após commit, push, deploy, smoke humano e homologação final da Wave 3. O gate de exposição pública de Produtos é um controle de release separado e deve permanecer desativado até autorização explícita.

Decisão de R2: `store_products` é a fonte canônica definitiva de Product; `store_inventory` é a fonte canônica de estoque; `src/data/products.ts` é fonte temporária de migração; Categories permanecem como contrato estático controlado nesta etapa.

## Decisões abertas
Limpeza do código dormente; política degradada futura; status/availability com Inventory; StoreSettings runtime; estoque/backorder; concorrência; auditoria; guest vs conta; delivery/pickup; frete; Orders; Checkout; Payment.

## Governança
IMPLEMENTAR → VALIDAR → DOCUMENTAR → REVISAR → COMMITAR → PUSH/DEPLOY → HOMOLOGAR → ATUALIZAR STATUS.

Deploy não significa homologação. Código presente não significa feature operacional. Nenhum item entra como HOMOLOGADO sem aceite humano explícito.
