# Cuidado Diário — Gestão de Saúde e Reabilitação

Aplicativo web para acompanhamento diário de saúde da adesão medicamentosa, sessões de atividades físicas, diário de dor/sintomas e agenda de consultas de saúde.

---
## Portal do Projeto (Documentação, Regras & Design)

O projeto conta com um **Portal de Gestão**:

- 🌐 **Acompanhamento para Stakeholders**: [Projeto e Regras de Negócio](https://outraperspectiva.github.io/Cuidado-Diario/portal.html)
- 🚀 **App Publicado**: [cuidado-diario.app](https://cuidado-diario.vercel.app)
- 📋 **Desenvolvimento do Projeto no GitHub**: planejamento e gerenciamento de trabalho [Kanban e Roadmap](https://github.com/users/outraperspectiva/projects/6/views/1)
- 📐 **Diagramas UML**: diagramas de arquitetura e fluxo salvos em [`docs/uml/`](./docs/uml/)


### Conteúdo do Portal:
1. **Visão Geral & Simulador Diário**:
   - Status atual da aplicação, mapa de módulos e papéis de usuário (*Paciente* ).
   - **Simulador interativo "Um dia no app"**: teste em tempo real de alteração de estados de doses (Pendente → Tomada → Pulada) e fisioterapia.
2. **Análise de Requisitos**:
   - **Identidade Visual & Escalas**: paleta de cores oficial (Petróleo `#103557`, Verde Paciente `#88C6B0`, Névoa `#F8FAFC`, Alerta/Crise `#DC2626`) com botão de clique para copiar HEX, régua da escala analógica visual de dor de 0 a 10 com cálculo HSL dinâmico, especificação tipográfica (Bricolage Grotesque e Public Sans) e galeria das telas oficiais do app.
   - **Catálogo de Regras de Negócio (REQ-001 a REQ-050)**: filtros por categoria (*Contas*, *Medicamentos*, *Fisioterapia*, *Dor e Sintomas*, *Consultas* e *Privacidade/LGPD*), fluxos de decisão (confirmação de dose e acionamento de SOS Crise) e mapeamento de pontos em aberto.
3. **Desenvolvimento**:
   - **Projeto (Kanban/Roadmap)**: acompanhamento de novas ideias, subtarefas, documentação e correção de erros (bugs) do projeto no quadro do GitHub.
   - **Diagramas UML**: diagramas de arquitetura e de fluxo do sistema.
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

## 🚀 Implementação e Deploy

Guia de implantação nos três provedores suportados, além da estrutura do banco de dados e das variáveis de ambiente:

1. [Google Cloud (GCP)](#1-implementação-no-google-cloud-gcp)
2. [Plataforma Vercel](#2-implementação-na-plataforma-vercel)
3. [Oracle Cloud Infrastructure (OCI)](#3-implementação-no-oracle-cloud-oci)
4. [Estrutura do Banco de Dados](#4-estrutura-do-modelo-de-dados)
5. [Variáveis de Ambiente](#5-variáveis-de-ambiente)

### 1. Implementação no Google Cloud (GCP)

Há duas abordagens recomendadas conforme a arquitetura escolhida:

- **Opção 1.1 (Padrão Serverless NoSQL)**: Firebase Firestore + Cloud Run / Firebase Hosting.
- **Opção 1.2 (Relacional)**: Google Cloud SQL (PostgreSQL) + Google Cloud Run.

#### 1.1. Firebase Firestore + Cloud Run

**Passo 1: Criar o Projeto no Google Cloud / Firebase Console**
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) ou o [Firebase Console](https://console.firebase.google.com/).
2. Crie um novo projeto (ex: `cuidado-diario-prod`).
3. Ative o **Firestore Database** no modo *Native*.
4. Ative a autenticação em **Firebase Authentication** (Provedor Google e E-mail/Senha).

**Passo 2: Aplicar Regras de Segurança**

O projeto já conta com o arquivo `firestore.rules` pronto para produção:

```bash
npm install -g firebase-tools
firebase login
firebase use --add cuidado-diario-prod
firebase deploy --only firestore:rules
```

**Passo 3: Deploy no Google Cloud Run**

Crie o `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

Crie o `nginx.conf` para redirecionamento de rotas SPA:

```nginx
server {
    listen 3000;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

Build e deploy via `gcloud`:

```bash
gcloud config set project cuidado-diario-prod
gcloud builds submit --tag gcr.io/cuidado-diario-prod/cuidado-diario-app
gcloud run deploy cuidado-diario-app \
  --image gcr.io/cuidado-diario-prod/cuidado-diario-app \
  --platform managed \
  --region us-east1 \
  --port 3000 \
  --allow-unauthenticated
```

#### 1.2. Google Cloud SQL (PostgreSQL) + Cloud Run

Caso utilize um backend Node.js/Express intermediário para queries SQL:

```bash
# Criar instância Cloud SQL
gcloud sql instances create cuidado-diario-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-east1

# Criar o banco e usuário
gcloud sql databases create cuidado_diario --instance=cuidado-diario-db
gcloud sql users create appuser --instance=cuidado-diario-db --password='SENHA_SEGURA_AQUI'
```

Conecte via Cloud Run Cloud SQL Proxy, adicionando a flag `--set-cloudsql-instances` no deploy e injetando a variável de conexão:

```
DATABASE_URL="postgresql://appuser:SENHA_SEGURA_AQUI@/cuidado_diario?host=/cloudsql/cuidado-diario-prod:us-east1:cuidado-diario-db"
```

### 2. Implementação na Plataforma Vercel

A Vercel oferece suporte nativo para aplicações React/Vite com roteamento SPA e conexão simplificada com bancos de dados serverless.

**2.1. Configuração do Projeto**
1. Suba o código para um repositório no **GitHub**, **GitLab** ou **Bitbucket**.
2. Acesse [vercel.com](https://vercel.com/) → **"Add New Project"** → **"Import"**.
3. Framework preset: **Vite**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Crie o `vercel.json` na raiz do projeto para o fallback de rotas SPA:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**2.2. Integração de Banco de Dados**

- **Opção A — Vercel Storage (Neon Serverless PostgreSQL)**: aba **Storage** → **Create Database** → **Postgres (Neon)**. A Vercel injeta automaticamente `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD` e `POSTGRES_DATABASE`.
- **Opção B — Supabase (PostgreSQL)**: crie um projeto em [supabase.com](https://supabase.com/), conecte a integração oficial na Vercel Marketplace e configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Settings > Environment Variables**.
- **Opção C — Firebase Firestore**: gere a configuração Web SDK do Firebase e adicione as credenciais (`VITE_FIREBASE_*`) nas variáveis de ambiente da Vercel.

### 3. Implementação no Oracle Cloud (OCI)

O Oracle Cloud oferece uma camada gratuita (*Always Free Tier*) completa, permitindo rodar bancos NoSQL/PostgreSQL ou **Autonomous Database**.

**3.1. Provisionamento do Banco de Dados**

- **Opção A — OCI Autonomous Database (Always Free)**: console [Oracle Cloud (OCI)](https://cloud.oracle.com/) → **Oracle Database** → **Autonomous Databases** → **Create Autonomous Database** (Workload Type: *Transaction Processing*, marque **Always Free**, defina nome e senha do `ADMIN`, acesso via *Secure access from everywhere* ou por VCN). Baixe o **Client Credentials (Wallet)** ou conecte via ORDS / driver Node.js `oracledb`.
- **Opção B — OCI Database with PostgreSQL**: **Databases** → **PostgreSQL** → crie um sistema gerenciado na sua VCN/Subnet privada e libere a porta `5432` na *Security List* para acesso interno da VM de aplicação.

**3.2. Deploy da Aplicação no OCI Compute (Always Free)**

1. **Criar a VM**: **Compute** → **Instances** → **Create Instance**. Imagem **Ubuntu 22.04 LTS** ou **Oracle Linux 8/9**; shape **VM.Standard.E2.1.Micro** (Always Free) ou **VM.Standard.A1.Flex** (Ampere ARM, até 4 OCPUs e 24GB RAM gratuitos). Baixe a chave SSH privada.
2. **Rede (VCN & Ingress Rules)**: na *Default Security List*, adicione uma regra de entrada com `Source CIDR 0.0.0.0/0`, protocolo `TCP`, portas `80, 443, 3000`.
3. **Instalação no servidor**:

```bash
ssh -i sua-chave.key ubuntu@IP_PUBLICO_OCI
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git nginx certbot python3-certbot-nginx
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

4. **Clonar e buildar**:

```bash
git clone https://github.com/outraperspectiva/Cuidado-Diario.git
cd Cuidado-Diario
npm install
npm run build
```

5. **Nginx como reverse proxy** — crie `/etc/nginx/sites-available/cuidado-diario`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;

    location / {
        root /home/ubuntu/Cuidado-Diario/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cuidado-diario /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d seu-dominio.com.br
```

### 4. Estrutura do Modelo de Dados

O modelo de dados está especificado em `firebase-blueprint.json` e pode ser mapeado tanto para NoSQL (Firestore) quanto para tabelas SQL relacionais:

1. **`users`**: `uid` (PK), `email`, `name`, `role` (`patient` | `caregiver`), `createdAt`.
2. **`medications`**: `id` (PK), `userId` (FK), `name`, `dosage`, `form`, `times` (array), `stock`, `instructions`.
3. **`medicationIntakes`**: `id` (PK), `medicationId` (FK), `scheduledTime`, `takenTime`, `status` (`taken` | `skipped` | `pending`), `date`.
4. **`physiotherapyPrescriptions`**: `id` (PK), `userId` (FK), `title`, `scheduledTimes` (array), `sets`, `repetitions`, `holdTimeSeconds`.
5. **`physiotherapyExecutions`**: `id` (PK), `prescriptionId` (FK), `sessionNumber`, `totalSessions`, `scheduledTime`, `completedAt`, `status` (`completed` | `pending`), `date`.
6. **`painLogs`**: `id` (PK), `userId` (FK), `level` (0–10), `location`, `type`, `isCrisis` (boolean), `timestamp`.
7. **`appointments`**: `id` (PK), `userId` (FK), `doctorName`, `specialty`, `date`, `time`, `location`, `status` (`scheduled` | `completed` | `canceled`).

### 5. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (veja `.env.example`):

```bash
# Firebase / Firestore
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id

# (Opcional) API REST / PostgreSQL (Vercel Postgres, Supabase ou Cloud SQL)
VITE_API_BASE_URL=https://api.seudominio.com.br
VITE_SUPABASE_URL=https://sua-instancia.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_key
```

---

## ⚡ Comandos Rápidos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Verificar validação de tipos TypeScript
npm run lint

# Gerar build de produção
npm run build
```
