# PRD-0002: Medicamentos

| Campo | Valor |
| --- | --- |
| ID | PRD-0002 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [PRD-0001](PRD-0001-VISAO-GERAL-DO-PRODUTO.md), [TDD-0001](../tdds/TDD-0001-MODELO-DE-DADOS.md) |

## 1. Objetivo

Apoiar o usuário no controle dos medicamentos e no registro das doses ao longo do dia.

## 2. Requisitos

| # | Requisito |
| --- | --- |
| 1 | O usuário cadastra medicamentos com nome, dosagem, forma, horários, estoque e instruções. |
| 2 | Cada horário gera um registro de dose com status **pendente**, **tomada** ou **pulada**. |
| 3 | A tela Hoje exibe os medicamentos do turno atual. |
| 4 | O sistema alerta quando o estoque está baixo. |
| 5 | O registro de dose guarda o horário previsto e o horário em que foi tomada. |
| 6 | A adesão medicamentosa alimenta os relatórios de evolução (ver [PRD-0004](PRD-0004-DOR-E-SINTOMAS.md)). |

## 3. Fluxo de confirmação de dose

`Pendente → Tomada` ou `Pendente → Pulada`, registrado pelo usuário.

## 4. Pontos em aberto

- Valor de referência para considerar o estoque "baixo".
- Tratamento de doses que passam do horário sem registro.
- Possibilidade de desfazer um registro de dose.
