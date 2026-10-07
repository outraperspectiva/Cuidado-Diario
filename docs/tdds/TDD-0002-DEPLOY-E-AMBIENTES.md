# TDD-0002: Deploy e Ambientes

| Campo | Valor |
| --- | --- |
| ID | TDD-0002 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [ADR-0005](../architecture/ADR-0005-DEPLOY-MULTINUVEM.md) |

Os passos detalhados de cada provedor estão no `README.md` da raiz. Este documento resume as decisões.

| Provedor | Aplicação | Banco | Observações |
| --- | --- | --- | --- |
| Google Cloud | Cloud Run com imagem Nginx (ou Firebase Hosting) | Firestore, ou Cloud SQL (PostgreSQL 15) | `Dockerfile` multi-stage e `nginx.conf` com `try_files` para a SPA, porta 3000 |
| Vercel | Preset Vite (`npm run build`, saída `dist`) | Vercel Postgres (Neon), Supabase ou Firestore | `vercel.json` com rewrite de todas as rotas para `/index.html` |
| Oracle Cloud (OCI) | VM Always Free com Nginx e Certbot | Autonomous Database ou PostgreSQL gerenciado | Regras de entrada para as portas 80, 443 e 3000 |

## Variáveis de ambiente

Definidas em `.env` (modelo em `.env.example`):

- Firebase: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
- Opcionais: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

Nunca versionar o arquivo `.env` nem senhas de banco.

## Pontos em aberto

- Escolher o ambiente de produção principal (hoje, Vercel).
- Definir ambientes de homologação e desenvolvimento.
