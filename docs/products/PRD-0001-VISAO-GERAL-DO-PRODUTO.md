# PRD-0001: Visão Geral do Produto

| Campo | Valor |
| --- | --- |
| ID | PRD-0001 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [PRD-0002](PRD-0002-MEDICAMENTOS.md), [PRD-0003](PRD-0003-FISIOTERAPIA.md), [PRD-0004](PRD-0004-DOR-E-SINTOMAS.md), [PRD-0005](PRD-0005-CONSULTAS.md), [PERSONAS-PACIENTE](../personas/PERSONAS-PACIENTE.md) |

## 1. Resumo

O **Cuidado Diário** é um aplicativo web para acompanhamento diário de saúde e reabilitação. Ele reúne em um só lugar a adesão medicamentosa, as sessões de atividades físicas (fisioterapia), o diário de dor e sintomas e a agenda de consultas de saúde.

## 2. Objetivo

Permitir que o usuário registre e acompanhe sua rotina de cuidados no dia a dia e visualize a evolução clínica ao longo do tempo.

## 3. Escopo funcional

| Módulo | Documento | Capacidades principais |
| --- | --- | --- |
| Hoje (painel diário) | este documento | Card azul com data formatada, progresso diário, medicamentos do turno e acesso ao SOS Crise |
| Medicamentos | [PRD-0002](PRD-0002-MEDICAMENTOS.md) | Horários, registro de doses (pendente, tomada, pulada), alerta de estoque baixo |
| Fisioterapia | [PRD-0003](PRD-0003-FISIOTERAPIA.md) | Exercícios prescritos, séries, repetições, timer em tempo real |
| Dor e sintomas | [PRD-0004](PRD-0004-DOR-E-SINTOMAS.md) | Escala 0 a 10, localização, fatores desencadeantes, evolução e relatórios em PDF |
| Consultas | [PRD-0005](PRD-0005-CONSULTAS.md) | Agenda de consultas de saúde |
| Autenticação | este documento | Login com Google, e-mail e senha, e modo visitante (demonstração) |

## 4. Papéis de usuário

- **Paciente:** papel descrito no portal do projeto. Ver [PERSONAS-PACIENTE](../personas/PERSONAS-PACIENTE.md).
- **Cuidador:** o modelo de dados prevê o valor `caregiver` em `users.role`. Confirmar se o papel está no escopo e, se estiver, criar `PERSONAS-CUIDADOR`.

## 5. Fora do escopo

A definir.

## 6. Pontos em aberto

- Vincular cada requisito do catálogo do portal (REQ-001 a REQ-050) ao PRD correspondente.
- Definir o escopo do papel Cuidador.
- Definir regras de privacidade e LGPD (ver sugestão de política em [POL-000](../policies/POL-000-INDEX.md)).
