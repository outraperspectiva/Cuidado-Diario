# PRD-0003: Fisioterapia e Reabilitação

| Campo | Valor |
| --- | --- |
| ID | PRD-0003 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [PRD-0001](PRD-0001-VISAO-GERAL-DO-PRODUTO.md), [TDD-0001](../tdds/TDD-0001-MODELO-DE-DADOS.md) |

## 1. Objetivo

Acompanhar a execução das sessões de fisioterapia e atividades físicas prescritas.

## 2. Requisitos

| # | Requisito |
| --- | --- |
| 1 | O usuário cadastra prescrições com título, horários, séries, repetições e tempo de sustentação (em segundos). |
| 2 | O app lista os exercícios prescritos do dia. |
| 3 | Um timer em tempo real apoia a execução do exercício. |
| 4 | Cada sessão registra o número da sessão, o total de sessões, o horário previsto e o horário de conclusão. |
| 5 | O status de cada sessão é **pendente** ou **concluída**. |

## 3. Pontos em aberto

- Regras para sessões não realizadas no dia.
- Origem da prescrição (cadastro pelo usuário ou por profissional).
