# ADR-0005: Deploy multinuvem (GCP, Vercel e OCI)

| Campo | Valor |
| --- | --- |
| ID | ADR-0005 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [ADR-000](ADR-000-INDEX.md) |

> Texto sugerido a partir do README. Se esta decisão já existe no portal (ADR-001 a ADR-007), alinhe o conteúdo e a numeração antes de aceitá-la.

## Contexto

O app precisa poder ser implantado em mais de um provedor. A versão publicada hoje está na Vercel.

## Decisão

Suportar três caminhos de implantação documentados no README e em [TDD-0002](../tdds/TDD-0002-DEPLOY-E-AMBIENTES.md): **Google Cloud** (Firebase/Cloud Run ou Cloud SQL), **Vercel** e **Oracle Cloud (OCI)**.

## Consequências

- Evita dependência de um único provedor.
- Aumenta o esforço de documentação e de testes de cada caminho.

## Alternativas consideradas

A registrar.
