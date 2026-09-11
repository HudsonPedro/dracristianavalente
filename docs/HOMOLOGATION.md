# SITE DRA.CRIS VENDAS PRODUTOS DNA — HOMOLOGATION

## Política
Nenhum item recebe estado **HOMOLOGADO** sem aceite humano explícito.

Estados:
- IMPLEMENTADO
- VALIDADO TECNICAMENTE
- DEPLOYED
- HOMOLOGADO
- NÃO HOMOLOGADO
- CONGELADO

Deploy não significa homologação. Código presente não significa feature operacional.

## Registro mínimo futuro
Área; passo oficial quando existir; data; ambiente; branch; commit; escopo; pré-condições; roteiro; resultado; evidências sem secrets/dados pessoais; regressões; pendências; decisão final; aceite humano.

## H-001 — Papéis e Permissões
- Registro: `#PASSO 10.14.4.12.12.23.4`
- Estado: **HOMOLOGADO**
- Aceite humano explícito.
Findings posteriores não revogam automaticamente a homologação sem evidência de regressão do fluxo homologado.

## H-002 — Usuários / Primeiro Acesso
- Registro: `#PASSO 10.14.4.12.13.2.5.4`
- Estado: **HOMOLOGADO**
- Baseline associada: `8d5a1f03421af4e3e3ed6697438e5b5f276558b5`
Escopo conhecido: criação administrativa, convite, Resend, CTA, rota pública, token, senha, ativação, redirecionamento, login posterior, RBAC efetivo e consumo one-time.
Correções integrantes: `c9113ce` e `8d5a1f0`.
Primeiro acesso usa `admin_password_reset_tokens`, não `admin_user_invitations`.

## H-003 — RC-01 / Inventory authorization patch
Arquivo: `src/functions/store-inventory.ts`
- **NÃO HOMOLOGADO**
- **CONGELADO**
- **REFAZER POSTERIORMENTE NO GATE INVENTORY**
Git object: `5190206904df1133fa6d535ffe03681f3aaf0b72`
SHA-256: `314FE53058D4C57189A735745020845F0D69ECF9011285D029149D23FA802846`

## H-004 — R1 Documentation baseline
- Baseline: `b10dd136902fbdf93afe8740fd4f4942b49a63da`
- Estado: **HOMOLOGADO**
- Aceite humano explícito em 2026-09-09.

## R2 — Source of Truth
- R2-A: diagnóstico **ACEITO** com correção R2-A-C01.
- R2-B: boundary público read-only **HOMOLOGADO**, commit `8aecfc5a35652cb5261a766077c320072593ea54`.
- R2-C: **ACEITO**.
- R2-D: **ACEITO**.
- Nenhuma alteração de banco, schema, migration ou Inventory foi realizada por R2-D-W1.

## R2-D-W1 — Public Catalog Wave 1
- Data: 2026-09-10.
- Escopo: somente `/produtos-capilares`.
- Estado: **HUMAN HOMOLOGATED / CONCLUÍDA**.
- Wave 1 homologated: **YES**.
- Evidências: code review sem findings CRITICAL, HIGH, MEDIUM ou LOW; autoridade canônica comprovada; nenhum fallback estático; ramo público sem Cart; integridade de escopo e RC-01 comprovadas; typecheck e builds client, SSR e Nitro/Cloudflare aprovados.
- ESLint normal: **FAIL**, somente pela issue preexistente `prettier/prettier`/CRLF; ESLint sem essa regra: **PASS**.
- Homologação humana concluída após os gates de publicação e smoke da Wave 1.

## R2-D-W2 — Public Product Detail Cutover
- Data: 2026-09-10.
- `R2-D-W2-P01`: **APPROVED**.
- `R2-D-W2-I01`: **ACCEPTED / TECHNICALLY IMPLEMENTED**.
- `R2-D-W2-C01`: **CODE REVIEW PASS / ACCEPTED**.
- Estado da Wave 2: **HUMAN HOMOLOGATED / CLOSED**.
- Evidências técnicas: typecheck, diff check e builds client/SSR/Nitro aprovados; ESLint sem `prettier/prettier` aprovado; ESLint normal falhou somente pela política CRLF/Prettier preexistente; code review sem findings CRITICAL, HIGH, MEDIUM ou LOW.
- Produção verificada externamente: produto válido com HTTP 200, slug inexistente com HTTP 404 real e SEO/canonical dinâmicos corretos.
- Aceite humano registrado; W2 encerrada.
- HTTP 503 explícito permanece deferido e **NÃO foi implementado**.

## R2-D-W3 — Canonical Cart
- Data: 2026-09-11.
- `R2-D-W3-P02`: **APPROVED**.
- `R2-D-W3-I01`: **IMPLEMENTED / TECHNICALLY VALIDATED**.
- `R2-D-W3-C01`: **CODE REVIEW PASS / ACCEPTED**.
- Commit: `585bd39f5a639281d30a2ddcd376aab21e76f1c4`.
- Push para `main`: **CONCLUÍDO**.
- Deploy Vercel produção: **CONCLUÍDO / READY**.
- Smoke humano: produto **OK**; carrinho **OK**; erro visível **NÃO**.
- Evidências: boundary pública em lote; `CartContext` sobre `PublicProduct`; storage mínimo protegido contra falha; compra elegível no catálogo e detalhe; zero imports runtime ativos de `products.ts`; diff check, TypeScript e build aprovados.
- Findings LOW: hidratação sem generation token/cancelamento e três warnings `react-refresh/only-export-components`. Sem evidência de perda de storage ou impacto funcional/produção.
- Estado final da Wave 3: **HUMAN HOMOLOGATED / CLOSED**.
- R2 — Source of Truth: **CONCLUÍDA**.

## Public Store Entry Gate
- Data: 2026-09-11.
- Escopo: menu principal, seção de Produtos na Home e link de Produtos no footer.
- Rota alvo: `/produtos-capilares`.
- Feature flag: `STORE_PUBLIC_ENTRY_ENABLED`.
- Teste local com flag `true`: menu **OK**; seção Home **OK**; footer **OK**; link **OK**; layout **OK**.
- Após o teste, a flag foi revertida para `false`.
- Estado: **IMPLEMENTADO / TESTADO LOCALMENTE / APROVADO / DESATIVADO**.
- Não está homologado para ativação pública.
- Ativação pública somente mediante autorização explícita do Hudson.
- Nenhum commit, push ou deploy deste gate pode ocorrer com `STORE_PUBLIC_ENTRY_ENABLED = true` sem essa autorização.
- RC-01.1 permaneceu congelado e fora do escopo.

## Código presente sem homologação humana conhecida
Site institucional, Admin Products read-only, Inventory read-only, Departments, password/security, persistência comercial, workflows e SEO/LGPD.

## Ausente / não homologável no estado atual
Product CRUD completo, Inventory management homologado, StoreSettings runtime, Orders operacional, Checkout, Payment e expansões futuras do PRD.

## Numeração oficial
Último registro humano conhecido: `#PASSO 10.14.4.12.13.2.5.4`.
A numeração oficial seguinte não é recuperável pelo repositório.
Nenhum passo posterior deve ser inventado.
