# ADR-0002: Usar Redux Toolkit para estado global

| Campo | Valor |
| --- | --- |
| ID | ADR-0002 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [ADR-000](ADR-000-INDEX.md) |

> Texto sugerido a partir do README. Se esta decisão já existe no portal (ADR-001 a ADR-007), alinhe o conteúdo e a numeração antes de aceitá-la.

## Contexto

O app compartilha estado entre telas, como doses do dia, progresso e registros de dor.

## Decisão

Adotar **Redux Toolkit** para o estado global da aplicação.

## Consequências

- Estado previsível e centralizado.
- Exige seguir a convenção de slices e ações do Redux Toolkit.

## Alternativas consideradas

A registrar.
