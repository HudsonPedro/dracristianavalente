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
- Estado da Wave 2: **NOT YET HUMAN HOMOLOGATED**.
- Evidências técnicas: typecheck, diff check e builds client/SSR/Nitro aprovados; ESLint sem `prettier/prettier` aprovado; ESLint normal falhou somente pela política CRLF/Prettier preexistente; code review sem findings CRITICAL, HIGH, MEDIUM ou LOW.
- Gate futuro: detalhe válido, conteúdo correto, imagem principal, galeria, composição, benefícios, componentes, observações profissionais, disponibilidade/aquisição, WhatsApp contextual, retorno ao catálogo, metadata dinâmica, canonical, ausência de ação de carrinho, slug inexistente, HTTP real da slug inexistente igual a 404 e ausência de erro visual/runtime.
- A evidência anterior à publicação da Wave 2 era HTTP 200 vazio para slug inexistente. Portanto, HTTP 404 em produção **NÃO está comprovado** e é gate obrigatório após deploy.
- HTTP 503 explícito permanece deferido e **NÃO foi implementado**.
- Pendências: commit, push, deploy de produção, smoke humano e prova de HTTP real para not-found.

## Código presente sem homologação humana conhecida
Site institucional, detalhe da Wave 2, carrinho, Admin Products read-only, Inventory read-only, Departments, password/security, persistência comercial, workflows e SEO/LGPD.

## Ausente / não homologável no estado atual
Product CRUD completo, Inventory management homologado, StoreSettings runtime, Orders operacional, Checkout, Payment e expansões futuras do PRD.

## Numeração oficial
Último registro humano conhecido: `#PASSO 10.14.4.12.13.2.5.4`.
A numeração oficial seguinte não é recuperável pelo repositório.
Nenhum passo posterior deve ser inventado.
