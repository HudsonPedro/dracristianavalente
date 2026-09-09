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
- R2-B: boundary público read-only implementado tecnicamente, sem cutover.
- Estado de R2-B: **NÃO HOMOLOGADO**.
- Nenhuma alteração de banco, schema, migration, storefront ou Inventory.

## Código presente sem homologação humana conhecida
Site institucional, catálogo, detalhe, carrinho, Admin Products read-only, Inventory read-only, Departments, password/security, persistência comercial, workflows e SEO/LGPD.

## Ausente / não homologável no estado atual
Product CRUD completo, Inventory management homologado, StoreSettings runtime, Orders operacional, Checkout, Payment e expansões futuras do PRD.

## Numeração oficial
Último registro humano conhecido: `#PASSO 10.14.4.12.13.2.5.4`.
A numeração oficial seguinte não é recuperável pelo repositório.
Nenhum passo posterior deve ser inventado.
