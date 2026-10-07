# PRD-0004: Dor, Sintomas e Evolução Clínica

| Campo | Valor |
| --- | --- |
| ID | PRD-0004 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [PRD-0001](PRD-0001-VISAO-GERAL-DO-PRODUTO.md), [STD-0001](../standards/STD-0001-IDENTIDADE-VISUAL.md), [TDD-0001](../tdds/TDD-0001-MODELO-DE-DADOS.md) |

## 1. Objetivo

Registrar dor e sintomas e mostrar a evolução clínica em gráficos e relatórios.

## 2. Requisitos

| # | Requisito |
| --- | --- |
| 1 | O usuário registra o nível de dor em escala de 0 a 10 (EVA, escala visual analógica). |
| 2 | O registro informa localização (por exemplo, lombar ou joelho), tipo de dor e fatores desencadeantes. |
| 3 | O registro pode ser marcado como **crise**. |
| 4 | O botão **SOS Crise** está disponível na tela Hoje. |
| 5 | A tela de evolução mostra o gráfico semanal de tendência de dor e a adesão medicamentosa. |
| 6 | O usuário pode exportar o relatório em PDF. |

## 3. Pontos em aberto

- O que exatamente o SOS Crise aciona e para quem.
- Critério para classificar um registro como crise (nível mínimo de dor ou escolha do usuário).
- Conteúdo e período do relatório em PDF.
