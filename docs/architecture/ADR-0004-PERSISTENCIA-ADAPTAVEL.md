# ADR-0004: Persistência de dados adaptável (Firestore ou SQL)

| Campo | Valor |
| --- | --- |
| ID | ADR-0004 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [ADR-000](ADR-000-INDEX.md) |

> Texto sugerido a partir do README. Se esta decisão já existe no portal (ADR-001 a ADR-007), alinhe o conteúdo e a numeração antes de aceitá-la.

## Contexto

O projeto precisa operar em diferentes provedores e ainda não está preso a um único banco.

## Decisão

Manter o modelo de dados ([TDD-0001](../tdds/TDD-0001-MODELO-DE-DADOS.md)) mapeável tanto para **Firebase Firestore** (NoSQL) quanto para **PostgreSQL** e bancos relacionais de nuvem (Cloud SQL, Supabase, Neon, Oracle ATP). O modelo é especificado em `firebase-blueprint.json`.

## Consequências

- Flexibilidade de escolha do provedor por ambiente.
- Custo de manter o modelo compatível com NoSQL e SQL.
- Autenticação com Google e e-mail/senha segue o provedor escolhido.

## Alternativas consideradas

A registrar.
