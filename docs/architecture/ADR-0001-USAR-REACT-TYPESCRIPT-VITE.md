# ADR-0001: Usar React 18, TypeScript e Vite no frontend

| Campo | Valor |
| --- | --- |
| ID | ADR-0001 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [ADR-000](ADR-000-INDEX.md) |

> Texto sugerido a partir do README. Se esta decisão já existe no portal (ADR-001 a ADR-007), alinhe o conteúdo e a numeração antes de aceitá-la.

## Contexto

O produto é um aplicativo web com várias telas interativas (painel diário, doses, timer de exercícios, gráficos) e precisa de código tipado e build rápido.

## Decisão

Adotar **React 18** com **TypeScript**, empacotado com **Vite**. Ícones com Lucide React.

## Consequências

- Tipagem estática reduz erros em tempo de desenvolvimento (verificada com `npm run lint`).
- Vite fornece servidor de desenvolvimento e build de produção (`npm run build`).
- O app é uma SPA, então os hosts precisam redirecionar todas as rotas para `index.html`.

## Alternativas consideradas

A registrar.
