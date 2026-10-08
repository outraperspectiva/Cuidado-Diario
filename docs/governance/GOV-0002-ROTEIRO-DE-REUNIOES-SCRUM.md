# GOV-0002: Roteiro de Reuniões de Acompanhamento (Scrum)

| Campo | Valor |
| --- | --- |
| ID | GOV-0002 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [GOV-0001](GOV-0001-CANAIS-DO-PROJETO.md), [PRD-000](../products/PRD-000-INDEX.md), [ADR-000](../architecture/ADR-000-INDEX.md), [RFC-000](../rfcs/RFC-000-INDEX.md), [TDD-000](../tdds/TDD-000-INDEX.md), [GLO-000](../glossary/GLO-000-INDEX.md) |

## 1. Objetivo

Definir o ritual de reuniões do projeto Cuidado Diário com base no Scrum e ligar cada reunião aos documentos da pasta `docs/` e ao quadro Kanban do GitHub.

## 2. Premissas

- **Sprint de 2 semanas** (10 dias úteis). Ajuste se o time preferir 1 semana.
- **Product Backlog:** epics e issues do Kanban. Epic = resultado para o usuário, ligada a um PRD. Issue = entrega verificável de 1 a 3 dias.
- **Papéis:** Product Owner (PO), Scrum Master (SM) e Desenvolvedores. Em time pequeno, uma pessoa pode acumular papéis, mas o PO e o SM devem ser nomeados.
- **Consultor de saúde:** convidado nas reuniões em que há regra clínica (medicamentos, fisioterapia, dor e crise).
- Os tempos abaixo são **limites máximos** (timebox) para uma sprint de 2 semanas.

## 3. Calendário da sprint

| Dia | Reunião | Duração máxima |
| --- | --- | --- |
| Dia 1 (manhã) | Planejamento da Sprint | 4 h |
| Todos os dias úteis | Daily | 15 min |
| Dia 3 e dia 8 | Refinamento do backlog | 1 h |
| Dia 10 (manhã) | Revisão da Sprint (com stakeholders) | 1 h 30 |
| Dia 10 (tarde) | Retrospectiva | 1 h 30 |
| Dia 10 ou dia 1 | Checkpoint de saúde e privacidade (quando houver tema) | 45 min |

## 4. Reuniões

### 4.1 Planejamento da Sprint

- **Participantes:** PO, SM, Desenvolvedores. Consultor de saúde, se houver issue clínica.
- **Entradas:** backlog refinado e priorizado, capacidade do time, resultado da última sprint.
- **Roteiro:**
  1. PO apresenta o **objetivo da sprint** (uma frase de valor para o usuário).
  2. O time escolhe as issues que cabem na capacidade, começando pelas de maior prioridade.
  3. Confere-se a **Definição de Pronto para iniciar** (seção 5) de cada issue.
  4. Define-se o responsável de cada issue (ver papéis por epic).
- **Saídas:** objetivo da sprint, Sprint Backlog (milestone no GitHub), responsáveis, riscos e dependências.
- **Documentos:** [PRD](../products/PRD-000-INDEX.md) e [TDD](../tdds/TDD-000-INDEX.md) das issues escolhidas.

### 4.2 Daily

- **Participantes:** Desenvolvedores. SM facilita. PO ouve e responde dúvidas.
- **Formato (15 min, em pé ou por chat):** o que avancei, o que vou fazer hoje, o que me bloqueia.
- **Regras:** não resolver problemas técnicos na reunião, agendar conversa à parte. Atualizar o Kanban antes ou logo depois.
- **Saídas:** impedimentos registrados e quadro atualizado.

### 4.3 Refinamento do backlog

- **Participantes:** PO, Desenvolvedores, SM. Consultor de saúde quando necessário.
- **Roteiro:**
  1. Revisar as próximas issues do backlog (cerca de 1 a 2 sprints à frente).
  2. Quebrar issues com mais de 3 dias.
  3. Escrever critérios de aceite e estimar (1d, 2d ou 3d).
  4. Transformar os **pontos em aberto** dos PRDs em issues de decisão.
  5. Quando surgir uma dúvida técnica relevante, abrir uma [RFC](../rfcs/RFC-000-INDEX.md).
- **Saídas:** issues prontas para a sprint, novas RFCs e PRDs atualizados.
- **Documentos:** [PRD](../products/PRD-000-INDEX.md), [GLO](../glossary/GLO-000-INDEX.md) (novos termos), [RFC](../rfcs/RFC-000-INDEX.md).

### 4.4 Revisão da Sprint

- **Participantes:** time completo e stakeholders. Consultor de saúde quando houver entrega clínica.
- **Roteiro:**
  1. Relembrar o objetivo da sprint.
  2. Demonstrar o incremento funcionando (no app publicado ou em ambiente de teste).
  3. Verificar cada issue contra seus critérios de aceite.
  4. Coletar feedback e ajustar o backlog.
  5. Revisar o roadmap e as próximas prioridades.
- **Saídas:** issues aceitas ou devolvidas, feedback registrado como novas issues, backlog repriorizado.
- **Documentos a atualizar:** status dos PRDs e dos requisitos no portal, [ADR](../architecture/ADR-000-INDEX.md) das decisões tomadas e [sumário](../README.md) da documentação.

### 4.5 Retrospectiva

- **Participantes:** time (PO, SM e Desenvolvedores). Sem stakeholders.
- **Roteiro:**
  1. O que funcionou bem.
  2. O que não funcionou.
  3. O que vamos melhorar na próxima sprint (no máximo 1 a 3 ações, com responsável e prazo).
  4. Revisar as ações da retrospectiva anterior.
- **Saídas:** ações de melhoria como issues. Mudanças permanentes de processo viram um [GOV](GOV-000-INDEX.md), [POL](../policies/POL-000-INDEX.md) ou [STD](../standards/STD-000-INDEX.md).

### 4.6 Checkpoint de saúde e privacidade

- **Quando:** a cada sprint que tiver issue de regra clínica, SOS Crise, relatórios ou dados pessoais.
- **Participantes:** PO, consultor de saúde, desenvolvedor responsável e quem cuida da privacidade e LGPD.
- **Roteiro:** validar regras de dose, estoque, séries e crise, e revisar consentimento, exportação e exclusão de dados.
- **Saídas:** decisões registradas nos PRDs, e na política de privacidade quando houver ([POL](../policies/POL-000-INDEX.md)).

## 5. Definições de Pronto

**Pronto para iniciar a issue (Definition of Ready)**
- Ligada a um PRD, TDD ou decisão.
- Critérios de aceite escritos e testáveis.
- Estimativa de 1 a 3 dias.
- Dependências conhecidas e responsável definido.

**Pronto para encerrar a issue (Definition of Done)**
- Critérios de aceite atendidos e testados.
- Código revisado e integrado, com `npm run lint` e `npm run build` passando.
- Documentação afetada atualizada (PRD, TDD, ADR, glossário) e índices em dia.
- Regra clínica validada pelo consultor de saúde, quando aplicável.
- Demonstrada na Revisão da Sprint.

## 6. Reuniões únicas

| Reunião | Quando | Objetivo |
| --- | --- | --- |
| Kickoff / Sprint 0 | Início do projeto ou da retomada | Alinhar visão ([PRD-0001](../products/PRD-0001-VISAO-GERAL-DO-PRODUTO.md)), papéis, ritual e [DOC-000](../DOC-000-DOCUMENTATION-ARCHITECTURE-GUIDELINES.md) |
| Revisão de roadmap | A cada 4 a 6 sprints | Reavaliar epics, prioridades e riscos com stakeholders |
| Revisão da documentação | A cada 4 a 6 sprints | Passar rascunhos a aceitos, remover o que está desatualizado e avaliar a retirada do DOC-000 |

## 7. Métricas de acompanhamento

- Velocidade: número de issues entregues por sprint.
- Cumprimento do objetivo da sprint (sim ou não).
- Issues devolvidas na Revisão da Sprint.
- Idade média das issues em andamento.
- Documentos em Rascunho há mais de duas sprints.

## 8. Manutenção deste documento

Mudanças no ritual (duração da sprint, horários, novas reuniões) devem sair da Retrospectiva e ser registradas neste documento.
