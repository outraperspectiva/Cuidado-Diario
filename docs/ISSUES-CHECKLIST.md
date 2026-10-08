# Checklist de Issues — Cuidado Diário

Este arquivo reúne as issues do projeto em formato de checklist pronto para uso no GitHub Projects, com associação a Milestone e Iteration conforme GOV-0003 e project.md.

## Sprint 1 — 14/08/2026 a 27/08/2026

### Milestone: v0.1.0 — Fundação e CI/CD

- [ ] `1.1` Configurar Vite, React, TypeScript, Tailwind e Redux
  - Epic: E1
  - Responsável: Dev frontend
  - Apoio: DevOps
  - Dependência: -
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `1.2` Aplicar paleta e fontes como tokens
  - Epic: E1
  - Responsável: Dev frontend
  - Apoio: UX/UI
  - Dependência: 1.1
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `1.3` Login com Google e e-mail/senha
  - Epic: E1
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 1.1
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `1.4` Modo visitante com dados de demonstração
  - Epic: E1
  - Responsável: Dev frontend
  - Apoio: UX/UI
  - Dependência: 1.3
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `1.5` Regras de segurança por usuário no Firestore
  - Epic: E1
  - Responsável: Dev backend/dados
  - Apoio: DevOps
  - Dependência: -
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `2.1` Cadastrar e editar medicamento
  - Epic: E2
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 1.2, 1.5
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `2.2` Gerar doses a partir dos horários
  - Epic: E2
  - Responsável: Dev backend/dados
  - Apoio: Consultor de saúde
  - Dependência: 2.1
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `8.1` Redigir política de privacidade
  - Epic: E8
  - Responsável: Especialista LGPD
  - Apoio: PO
  - Dependência: 1.3
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `9.1` Dockerfile e nginx para Cloud Run
  - Epic: E9
  - Responsável: DevOps
  - Apoio: Dev frontend
  - Dependência: 1.1
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `9.2` vercel.json e variáveis de ambiente
  - Epic: E9
  - Responsável: DevOps
  - Apoio: Dev frontend
  - Dependência: 1.3
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `9.3` Pipeline de CI com lint e build
  - Epic: E9
  - Responsável: DevOps
  - Apoio: QA
  - Dependência: 1.1
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `D1` Decisão: o que o SOS Crise aciona e para quem
  - Tipo: Decisão de negócio
  - Responsável: PO
  - Apoio: Consultor de saúde
  - Dependência: -
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `D2` Decisão: valor de referência para estoque baixo e dose atrasada
  - Tipo: Decisão de negócio
  - Responsável: PO
  - Apoio: Consultor de saúde
  - Dependência: -
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `D3` Decisão: critério para classificar registro como crise
  - Tipo: Decisão de negócio
  - Responsável: PO
  - Apoio: Consultor de saúde
  - Dependência: -
  - Iteration: Sprint 1
  - Milestone: v0.1.0

- [ ] `D4` Decisão: conteúdo e período do relatório em PDF
  - Tipo: Decisão de negócio
  - Responsável: PO
  - Apoio: Consultor de saúde
  - Dependência: -
  - Iteration: Sprint 1
  - Milestone: v0.1.0

## Sprint 2 — 28/08/2026 a 11/09/2026

### Milestone: v0.2.0 — Gestão de Medicamentos e Tela Hoje

- [ ] `2.3` Registrar dose como tomada ou pulada
  - Epic: E2
  - Responsável: Dev frontend
  - Apoio: Consultor de saúde
  - Dependência: 2.2
  - Iteration: Sprint 2
  - Milestone: v0.2.0

- [ ] `2.4` Alertar estoque baixo
  - Epic: E2
  - Responsável: Dev frontend
  - Apoio: Consultor de saúde
  - Dependência: 2.3, D2
  - Iteration: Sprint 2
  - Milestone: v0.2.0

- [ ] `3.1` Card Azul com data formatada
  - Epic: E3
  - Responsável: Dev frontend
  - Apoio: UX/UI
  - Dependência: 1.2
  - Iteration: Sprint 2
  - Milestone: v0.2.0

- [ ] `3.2` Progresso diário e medicamentos do turno
  - Epic: E3
  - Responsável: Dev frontend
  - Apoio: UX/UI
  - Dependência: 2.3, 3.1
  - Iteration: Sprint 2
  - Milestone: v0.2.0

- [ ] `3.3` Botão SOS Crise
  - Epic: E3
  - Responsável: Dev frontend
  - Apoio: Consultor de saúde
  - Dependência: 3.2, D1
  - Iteration: Sprint 2
  - Milestone: v0.2.0

- [ ] `4.1` Cadastrar prescrição de exercícios
  - Epic: E4
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 1.5
  - Iteration: Sprint 2
  - Milestone: v0.2.0

- [ ] `8.3` Exportar e excluir dados do usuário
  - Epic: E8
  - Responsável: Dev backend/dados
  - Apoio: Especialista LGPD
  - Dependência: 8.1, 1.5
  - Iteration: Sprint 2
  - Milestone: v0.2.0

## Sprint 3 — 14/09/2026 a 25/09/2026

### Milestone: v0.3.0 — Fisioterapia e Monitoramento de Dor

- [ ] `4.2` Listar exercícios do dia
  - Epic: E4
  - Responsável: Dev frontend
  - Apoio: UX/UI
  - Dependência: 4.1
  - Iteration: Sprint 3
  - Milestone: v0.3.0

- [ ] `4.3` Timer em tempo real
  - Epic: E4
  - Responsável: Dev frontend
  - Apoio: Consultor de saúde
  - Dependência: 4.2
  - Iteration: Sprint 3
  - Milestone: v0.3.0

- [ ] `4.4` Registrar conclusão da sessão
  - Epic: E4
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 4.3
  - Iteration: Sprint 3
  - Milestone: v0.3.0

- [ ] `5.1` Régua de dor 0 a 10 com cor dinâmica
  - Epic: E5
  - Responsável: Dev frontend
  - Apoio: UX/UI
  - Dependência: 1.2
  - Iteration: Sprint 3
  - Milestone: v0.3.0

- [ ] `5.2` Formulário de local, tipo e fatores desencadeantes
  - Epic: E5
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 5.1
  - Iteration: Sprint 3
  - Milestone: v0.3.0

- [ ] `5.3` Marcar registro como crise
  - Epic: E5
  - Responsável: Dev frontend
  - Apoio: Consultor de saúde
  - Dependência: 5.2, D3
  - Iteration: Sprint 3
  - Milestone: v0.3.0

## Sprint 4 — 28/09/2026 a 09/10/2026

### Milestone: v0.4.0 — Relatórios Clínicos e Consultas

- [ ] `6.1` Gráfico semanal de dor
  - Epic: E6
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 5.2
  - Iteration: Sprint 4
  - Milestone: v0.4.0

- [ ] `6.2` Gráfico de adesão medicamentosa
  - Epic: E6
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 2.3
  - Iteration: Sprint 4
  - Milestone: v0.4.0

- [ ] `6.3` Exportar relatório em PDF
  - Epic: E6
  - Responsável: Dev frontend
  - Apoio: PO
  - Dependência: 6.1, 6.2, D4
  - Iteration: Sprint 4
  - Milestone: v0.4.0

- [ ] `7.1` Cadastrar e editar consulta
  - Epic: E7
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 1.5
  - Iteration: Sprint 4
  - Milestone: v0.4.0

- [ ] `7.2` Alterar status da consulta
  - Epic: E7
  - Responsável: Dev frontend
  - Apoio: Dev backend/dados
  - Dependência: 7.1
  - Iteration: Sprint 4
  - Milestone: v0.4.0

## Sprint 5 — 13/10/2026 a 26/10/2026

### Milestone: v1.0.0 — Conformidade LGPD e Release Geral

- [ ] `8.2` Registrar consentimento no primeiro acesso
  - Epic: E8
  - Responsável: Dev frontend
  - Apoio: Especialista LGPD
  - Dependência: 8.1
  - Iteration: Sprint 5
  - Milestone: v1.0.0

- [ ] QA final e homologação geral
  - Tipo: Validação final
  - Responsável: QA
  - Apoio: PO, Dev frontend, Dev backend/dados, DevOps
  - Dependência: todas as issues concluídas
  - Iteration: Sprint 5
  - Milestone: v1.0.0

- [ ] Aceite do PO para release
  - Tipo: Gate de release
  - Responsável: PO
  - Apoio: QA, Dev frontend, Dev backend/dados, DevOps
  - Dependência: 8.2 e QA final
  - Iteration: Sprint 5
  - Milestone: v1.0.0

---

## Resumo por Epic

- [ ] E1 — Fundação e autenticação
- [ ] E2 — Medicamentos
- [ ] E3 — Tela Hoje
- [ ] E4 — Fisioterapia
- [ ] E5 — Dor e sintomas
- [ ] E6 — Evolução e relatórios
- [ ] E7 — Consultas
- [ ] E8 — Privacidade e LGPD
- [ ] E9 — Deploy e qualidade

---

## Checklist de criação no GitHub

- [ ] Criar Milestone `v0.1.0 — Fundação e CI/CD`
- [ ] Criar Milestone `v0.2.0 — Gestão de Medicamentos e Tela Hoje`
- [ ] Criar Milestone `v0.3.0 — Fisioterapia e Monitoramento de Dor`
- [ ] Criar Milestone `v0.4.0 — Relatórios Clínicos e Consultas`
- [ ] Criar Milestone `v1.0.0 — Conformidade LGPD e Release Geral`
- [ ] Criar Iteration `Sprint 1` (14/08/2026 - 27/08/2026)
- [ ] Criar Iteration `Sprint 2` (28/08/2026 - 11/09/2026)
- [ ] Criar Iteration `Sprint 3` (14/09/2026 - 25/09/2026)
- [ ] Criar Iteration `Sprint 4` (28/09/2026 - 09/10/2026)
- [ ] Criar Iteration `Sprint 5` (13/10/2026 - 26/10/2026)
- [ ] Atribuir issues ao Milestone correto
- [ ] Atribuir issues ao Iteration correto
- [ ] Atribuir responsável e apoio em cada issue
- [ ] Validar dependências e bloqueios
- [ ] Revisar backlog por Sprint
