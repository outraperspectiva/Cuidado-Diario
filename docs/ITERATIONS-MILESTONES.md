# Iterations e Milestones — Cuidado Diário

Guia de configuração do GitHub Projects V2 com Sprints (Iterations) e Versões de Entrega (Milestones) baseado em GOV-0003 e project.md.

---

## 1. Milestones (Versões de Entrega de Valor)

Configure **um milestone por linha** do quadro de Milestones. Use **Opção 1** de project.md como referência.

### M1: v0.1.0 — Fundação e CI/CD

| Campo | Valor |
| --- | --- |
| **Título** | `v0.1.0 — Fundação e CI/CD` |
| **Descrição** | Infraestrutura básica pronta, pipeline de deploy ativo, autenticação por usuário e regras de negócio essenciais definidas. |
| **Data de vencimento** | **27/08/2026** *(Fim da Sprint 1)* |
| **Issues incluídas** | E1 completo (1.1, 1.2, 1.3, 1.4, 1.5)<br>E9 completo (9.1, 9.2, 9.3)<br>Decisões: D1, D2, D3, D4<br>Início E2: 2.1, 2.2<br>Início E8: 8.1 |

**Issues a atribuir a este milestone:**
- `1.1` Configurar Vite, React, TypeScript, Tailwind e Redux
- `1.2` Aplicar paleta e fontes como tokens
- `1.3` Login com Google e e-mail/senha
- `1.4` Modo visitante com dados de demonstração
- `1.5` Regras de segurança por usuário no Firestore
- `9.1` Dockerfile e nginx para Cloud Run
- `9.2` vercel.json e variáveis de ambiente
- `9.3` Pipeline de CI com lint e build
- `2.1` Cadastrar e editar medicamento
- `2.2` Gerar doses a partir dos horários
- `8.1` Redigir política de privacidade
- `D1` Decisão: o que o SOS Crise aciona e para quem
- `D2` Decisão: valor de referência para estoque baixo e dose atrasada
- `D3` Decisão: critério para classificar registro como crise
- `D4` Decisão: conteúdo e período do relatório em PDF

---

### M2: v0.2.0 — Gestão de Medicamentos e Tela Hoje

| Campo | Valor |
| --- | --- |
| **Título** | `v0.2.0 — Gestão de Medicamentos e Tela Hoje` |
| **Descrição** | Ciclo completo de medicamentos (cadastro, doses, estoque), Tela Hoje com progresso diário e acionamento de SOS Crise. |
| **Data de vencimento** | **11/09/2026** *(Fim da Sprint 2)* |
| **Issues incluídas** | E2 conclusão (2.3, 2.4)<br>E3 completo (3.1, 3.2, 3.3)<br>E4 início (4.1 — Prescrição)<br>E8 (8.3 — Exportação/exclusão de dados) |

**Issues a atribuir a este milestone:**
- `2.3` Registrar dose como tomada ou pulada
- `2.4` Alertar estoque baixo
- `3.1` Card Azul com data formatada
- `3.2` Progresso diário e medicamentos do turno
- `3.3` Botão SOS Crise
- `4.1` Cadastrar prescrição de exercícios
- `8.3` Exportar e excluir dados do usuário

---

### M3: v0.3.0 — Fisioterapia e Monitoramento de Dor

| Campo | Valor |
| --- | --- |
| **Título** | `v0.3.0 — Fisioterapia e Monitoramento de Dor` |
| **Descrição** | Módulo de exercícios com timer em tempo real e régua dinâmica de dor/sintomas com marcação de crise. |
| **Data de vencimento** | **25/09/2026** *(Fim da Sprint 3)* |
| **Issues incluídas** | E4 conclusão (4.2, 4.3, 4.4)<br>E5 completo (5.1, 5.2, 5.3) |

**Issues a atribuir a este milestone:**
- `4.2` Listar exercícios do dia
- `4.3` Timer em tempo real
- `4.4` Registrar conclusão da sessão
- `5.1` Régua de dor 0 a 10 com cor dinâmica
- `5.2` Formulário de local, tipo e fatores desencadeantes
- `5.3` Marcar registro como crise

---

### M4: v0.4.0 — Relatórios Clínicos e Consultas

| Campo | Valor |
| --- | --- |
| **Título** | `v0.4.0 — Relatórios Clínicos e Consultas` |
| **Descrição** | Visualização gráfica de evolução, geração de relatório PDF para o médico e agendamento de consultas. |
| **Data de vencimento** | **09/10/2026** *(Fim da Sprint 4)* |
| **Issues incluídas** | E6 completo (6.1, 6.2, 6.3)<br>E7 completo (7.1, 7.2) |

**Issues a atribuir a este milestone:**
- `6.1` Gráfico semanal de dor
- `6.2` Gráfico de adesão medicamentosa
- `6.3` Exportar relatório em PDF
- `7.1` Cadastrar e editar consulta
- `7.2` Alterar status da consulta

---

### M5: v1.0.0 — Conformidade LGPD e Release Geral

| Campo | Valor |
| --- | --- |
| **Título** | `v1.0.0 — Conformidade LGPD e Release Geral` |
| **Descrição** | Fechamento do fluxo de primeiro acesso com aceite de termos, testes finais e encerramento da versão estável. |
| **Data de vencimento** | **26/10/2026** *(Fim da Sprint 5)* |
| **Issues incluídas** | E8 conclusão (8.2 — Consentimento de primeiro acesso)<br>Validações finais de QA e aceite do PO |

**Issues a atribuir a este milestone:**
- `8.2` Registrar consentimento no primeiro acesso

---

## 2. Iterations (Sprints)

Configure **um iteration por ciclo de 10 dias úteis**, conforme seção 4 de GOV-0003. Use o campo **Iteration** nativo do GitHub Projects V2.

### Sprint 1 (14/08/2026 – 27/08/2026)

| Campo | Valor |
| --- | --- |
| **Título** | `Sprint 1 — Fundação e Setup Técnico` |
| **Início** | 14/08/2026 |
| **Fim** | 27/08/2026 |
| **Meta** | Setup técnico, autenticação, CI/CD, modelo de dados de medicamentos e decisões de negócio. |

**Issues a atribuir a esta iteration:**
- `1.1`, `1.2`, `1.3`, `1.4`, `1.5` ← E1
- `2.1`, `2.2` ← E2 (início)
- `8.1` ← E8 (início)
- `9.1`, `9.2`, `9.3` ← E9
- `D1`, `D2`, `D3`, `D4` ← Decisões

---

### Sprint 2 (28/08/2026 – 11/09/2026)

| Campo | Valor |
| --- | --- |
| **Título** | `Sprint 2 — Medicamentos, Tela Hoje e Prescrição` |
| **Início** | 28/08/2026 |
| **Fim** | 11/09/2026 |
| **Meta** | Registro de doses, alertas de estoque, painel Hoje com SOS e prescrição de fisioterapia. |

**Issues a atribuir a esta iteration:**
- `2.3`, `2.4` ← E2 (conclusão)
- `3.1`, `3.2`, `3.3` ← E3
- `4.1` ← E4 (início)
- `8.3` ← E8

---

### Sprint 3 (14/09/2026 – 25/09/2026)

| Campo | Valor |
| --- | --- |
| **Título** | `Sprint 3 — Fisioterapia e Dor` |
| **Início** | 14/09/2026 |
| **Fim** | 25/09/2026 |
| **Meta** | Execução de exercícios com timer e registro estruturado de dor e crises. |

**Issues a atribuir a esta iteration:**
- `4.2`, `4.3`, `4.4` ← E4 (conclusão)
- `5.1`, `5.2`, `5.3` ← E5

---

### Sprint 4 (28/09/2026 – 09/10/2026)

| Campo | Valor |
| --- | --- |
| **Título** | `Sprint 4 — Relatórios, Gráficos e Consultas` |
| **Início** | 28/09/2026 |
| **Fim** | 09/10/2026 |
| **Meta** | Gráficos de dor/adesão, exportação de relatório em PDF e cadastro de consultas. |

**Issues a atribuir a esta iteration:**
- `6.1`, `6.2`, `6.3` ← E6
- `7.1`, `7.2` ← E7

---

### Sprint 5 (13/10/2026 – 26/10/2026)

| Campo | Valor |
| --- | --- |
| **Título** | `Sprint 5 — LGPD e Homologação Final` |
| **Início** | 13/10/2026 |
| **Fim** | 26/10/2026 |
| **Meta** | Consentimento LGPD no onboarding, testes integrados e fechamento. |

**Issues a atribuir a esta iteration:**
- `8.2` ← E8 (conclusão)
- *(Testes integrados e aceite — sem issue específica)*

---

## 3. Estrutura Recomendada no GitHub Projects V2

### Configurar os campos:

1. **Milestone** (nativo): Selecione M1 a M5 criados acima.
2. **Iteration** (nativo): Selecione Sprint 1 a 5 criados acima.
3. **Status** (recomendado): Backlog, Em Andamento, Em Revisão, Pronto.
4. **Responsável** (nativo): Atribua a cada issue conforme seção 3 de GOV-0003.
5. **Duração estimada** (opcional): 1d, 2d ou 3d, conforme GOV.md.

### Estrutura de views recomendada:

- **View 1: Roadmap por Milestone** — Gantt com Milestones (M1 a M5) no eixo Y.
- **View 2: Sprint Board** — Kanban com Iteration atual e Status (Backlog → Pronto).
- **View 3: Timeline de Epics** — Gantt com Epics (E1 a E9) no eixo Y.
- **View 4: Carga por Papel** — Tabela com Responsável como dimensão, Duration como métrica.

---

## 4. Notas de Implementação

- **Não crie issues "Decisão" (D1–D4) como issues normais** a menos que já existam. Elas são placeholders de pontos de decisão; bloqueadores devem ser capturados na descrição ou nos comentários.
- **Regra clínica:** Issues com apoio do Consultor de Saúde devem ser revisadas antes de ir para produção.
- **Replanejamento:** Ao final de cada Sprint, atualize as datas e Milestones conforme o progresso real.
- **Dependências:** Use o formato `Blocks issue #X` ou `Depends on issue #Y` nos comentários ou em campo customizado, se disponível.

---

## 5. Checklist de Setup

- [ ] Criar Milestone `v0.1.0 — Fundação e CI/CD` (vencimento: 27/08/2026)
- [ ] Criar Milestone `v0.2.0 — Gestão de Medicamentos e Tela Hoje` (vencimento: 11/09/2026)
- [ ] Criar Milestone `v0.3.0 — Fisioterapia e Monitoramento de Dor` (vencimento: 25/09/2026)
- [ ] Criar Milestone `v0.4.0 — Relatórios Clínicos e Consultas` (vencimento: 09/10/2026)
- [ ] Criar Milestone `v1.0.0 — Conformidade LGPD e Release Geral` (vencimento: 26/10/2026)
- [ ] Criar Iteration `Sprint 1` (14/08 – 27/08/2026)
- [ ] Criar Iteration `Sprint 2` (28/08 – 11/09/2026)
- [ ] Criar Iteration `Sprint 3` (14/09 – 25/09/2026)
- [ ] Criar Iteration `Sprint 4` (28/09 – 09/10/2026)
- [ ] Criar Iteration `Sprint 5` (13/10 – 26/10/2026)
- [ ] Atribuir todas as issues a seus respectivos Milestones
- [ ] Atribuir todas as issues a suas respectivas Iterations
- [ ] Atribuir Responsável conforme seção 3 de GOV-0003
- [ ] Criar views no GitHub Projects (Roadmap, Sprint Board, Timeline, Carga)
