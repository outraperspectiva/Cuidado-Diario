
# Cuidado Diário — Gestão de Saúde e Reabilitação

Aplicativo web para acompanhamento diário de saúde da adesão medicamentosa, sessões de atividades físicas, diário de dor/sintomas e agenda de consultas de saúde.

---
## Portal do Projeto (Documentação, Regras & Design)

O projeto conta com um **Portal de Gestão**:

- 🌐 **Acompanhamento para Stakeholders**: [Projeto e Regras de Negócio](https://outraperspectiva.github.io/Cuidado-Diario/)
- 🚀 **App Publicado**: [cuidado-diario.app](https://cuidado-diario.vercel.app)
- 📋 **Desenvolvimetno do Projeto no Github**: planejamento e gerenciamento de trabalho [Kamban e Roadmap](https://github.com/users/outraperspectiva/projects/6/views/1)


### Conteúdo do Portal:
1. **Visão Geral & Simulador Diário**:
   - Status atual da aplicação, mapa de módulos e papéis de usuário (*Paciente* e *Cuidador*).
   - **Simulador interativo "Um dia no app"**: teste em tempo real de alteração de estados de doses (Pendente → Tomada → Pulada) e fisioterapia.
2. **Identidade Visual & Escalas**:
   - Paleta de cores oficial (Petróleo `#103557`, Verde Cuidador `#88C6B0`, Névoa `#F8FAFC`, Alerta/Crise `#DC2626`) com botão de clique para copiar HEX.
   - Régua da escala analógica visual de dor de 0 a 10 com cálculo HSL dinâmico.
   - Especificação tipográfica (Bricolage Grotesque e Public Sans).
3. **Catálogo de Regras de Negócio (REQ-001 a REQ-050)**:
   - Filtros por categoria: *Contas*, *Medicamentos*, *Fisioterapia*, *Dor e Sintomas*, *Consultas* e *Privacidade (LGPD)*.
   - Fluxos de decisão (confirmação de dose e acionamento de SOS Crise) e mapeamento de pontos em aberto.
4. **Decisões de Arquitetura (ADRs)**:
   - Registro das decisões de projeto (ADR-001 a ADR-007: React 18, Redux Toolkit, Tailwind, Firebase/PostgreSQL, deploy multinuvem) e template padronizado para novas decisões.

---
## 📱 Telas do Aplicativo (Screenshots)

As capturas de tela oficiais e vetores do aplicativo estão salvos e versionados neste repositório na pasta [`docs/screenshots/`](./docs/screenshots/) e em [`public/screenshots/`](./public/screenshots/):

| 1. Tela Hoje (Dashboard & Card Azul) | 2. Gestão de Medicamentos & Doses |
| :---: | :---: |
| <img src="docs/screenshots/01-tela-hoje-dashboard.png" width="360" alt="Tela Hoje - Dashboard e Card Azul" /> | <img src="docs/screenshots/02-tela-medicamentos.png" width="360" alt="Tela de Medicamentos" /> |
| **Card Azul com Data formatada**, SOS Crise, progresso diário e remédios do turno. | Controle de horários (08:00, 14:00), alerta de estoque baixo e registro de doses. |

| 3. Registro de Dor & Sintomas (Escala EVA) | 4. Evolução Clínica & Relatórios |
| :---: | :---: |
| <img src="docs/screenshots/03-tela-registro-dor.png" width="360" alt="Registro de Dor" /> | <img src="docs/screenshots/04-tela-evolucao-relatorios.png" width="360" alt="Evolução e Relatórios" /> |
| Régua de dor 0-10, seleção de membros (lombar, joelho) e fatores desencadeantes. | Gráfico semanal de tendência de dor, adesão medicamentosa e exportação para PDF. |

| 5. Autenticação & Modo Visitante | 6. Sessões de Fisioterapia & Reabilitação |
| :---: | :---: |
| <img src="docs/screenshots/05-tela-login-autenticacao.png" width="360" alt="Tela de Login" /> | <img src="docs/screenshots/06-tela-fisioterapia-exercicios.png" width="360" alt="Tela de Fisioterapia" /> |
| Login Google, e-mail/senha e acesso imediato em modo demonstração. | Lista de exercícios prescritos, séries, repetições e timer em tempo real. |

---


## 🛠️ Tecnologias Principais

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Redux Toolkit.
- **Build Tool**: Vite.
- **Armazenamento e Autenticação**: Estrutura adaptável para **Firebase Firestore**, **PostgreSQL** ou bancos relacionais de nuvem (Cloud SQL, Supabase, Neon, Oracle ATP).

---

