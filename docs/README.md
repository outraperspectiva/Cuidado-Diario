# Documentação do Cuidado-Diario

Ponto de entrada de toda a documentação do projeto e sumário dos documentos produzidos. Cada documento é tipado, numerado e armazenado conforme o [DOC-000](DOC-000-DOCUMENTATION-ARCHITECTURE-GUIDELINES.md).

## Como usar

1. Para saber **onde guardar ou como nomear** um documento, consulte o [DOC-000](DOC-000-DOCUMENTATION-ARCHITECTURE-GUIDELINES.md).
2. Para **localizar um documento**, use o sumário abaixo ou o índice de cada pasta.
3. Ao criar um documento novo, **adicione-o ao índice da pasta e a este sumário** no mesmo pull request.

## Tipos de documento

| Pasta | Descrição | Tipo | Finalidade |
| --- | --- | --- | --- |
| [...](DOC-000-DOCUMENTATION-ARCHITECTURE-GUIDELINES.md) | A classificação, a nomenclatura e a evolução dos documentos são definidas pela autoridade única sobre como um documento é tipado e onde ele deve ficar. | DOC-XXXX | Autoridade única sobre como um documento é tipado e onde ele deve ficar. É temporário e será removido quando seu conhecimento e suas diretrizes tiverem sido distribuídos pelas documentações apropriadas. |
| [architecture/](architecture/ADR-000-INDEX.md) | Registros de decisão de arquitetura aceitos | ADR-XXXX | Decisão arquitetural aceita |
| [glossary/](glossary/GLO-000-INDEX.md) | Vocabulário compartilhado e linguagem ubíqua por domínio | GLO-XXXX | Vocabulário compartilhado |
| [governance/](governance/GOV-000-INDEX.md) | Registros de governança | GOV-XXXX | Registro de governança com valor de autoridade |
| [personas/](personas/PERSONAS-INDEX.md) | Personas | PERSONAS-<NOME> | Diferentes personas do projeto |
| [policies/](policies/POL-000-INDEX.md) | Políticas válidas para todo o projeto | POL-XXXX | Restrição obrigatória de governança |
| [products/](products/PRD-000-INDEX.md) | Documentos de requisitos de produto e de domínio | PRD-XXXX | Requisito de produto ou de negócio |
| [rfcs/](rfcs/RFC-000-INDEX.md) | Propostas antes da decisão | RFC-XXXX | Proposta antes da decisão |
| [standards/](standards/STD-000-INDEX.md) | Padrões válidos para todo o projeto | STD-XXXX | Padrão obrigatório de implementação |
| [tdds/](tdds/TDD-000-INDEX.md) | Documentos de design técnico | TDD-XXXX | Documento de design técnico |

## Sumário dos documentos

Status: **Rascunho** (em revisão), **Aceito** ou **Ativo**.

### Raiz

| ID | Título | Status |
| --- | --- | --- |
| [DOC-000](DOC-000-DOCUMENTATION-ARCHITECTURE-GUIDELINES.md) | Diretrizes de Arquitetura da Documentação | Ativo (temporário) |

### Produtos (`products/`)

| ID | Título | Status |
| --- | --- | --- |
| [PRD-0001](products/PRD-0001-VISAO-GERAL-DO-PRODUTO.md) | Visão Geral do Produto | Rascunho |
| [PRD-0002](products/PRD-0002-MEDICAMENTOS.md) | Medicamentos | Rascunho |
| [PRD-0003](products/PRD-0003-FISIOTERAPIA.md) | Fisioterapia e Reabilitação | Rascunho |
| [PRD-0004](products/PRD-0004-DOR-E-SINTOMAS.md) | Dor, Sintomas e Evolução Clínica | Rascunho |
| [PRD-0005](products/PRD-0005-CONSULTAS.md) | Consultas | Rascunho |

### Personas (`personas/`)

| ID | Título | Status |
| --- | --- | --- |
| [PERSONAS-PACIENTE](personas/PERSONAS-PACIENTE.md) | Paciente | Rascunho |
| [PERSONAS-CUIDADOR](personas/PERSONAS-CUIDADOR.md) | Cuidador (escopo a confirmar) | Rascunho |

### Glossário (`glossary/`)

| ID | Título | Status |
| --- | --- | --- |
| [GLO-0001](glossary/GLO-0001-DOMINIO-SAUDE.md) | Glossário do Domínio de Saúde | Rascunho |

### Arquitetura (`architecture/`)

| ID | Título | Status |
| --- | --- | --- |
| [ADR-0001](architecture/ADR-0001-USAR-REACT-TYPESCRIPT-VITE.md) | Usar React 18, TypeScript e Vite no frontend | Rascunho |
| [ADR-0002](architecture/ADR-0002-USAR-REDUX-TOOLKIT.md) | Usar Redux Toolkit para estado global | Rascunho |
| [ADR-0003](architecture/ADR-0003-USAR-TAILWIND-CSS.md) | Usar Tailwind CSS para estilização | Rascunho |
| [ADR-0004](architecture/ADR-0004-PERSISTENCIA-ADAPTAVEL.md) | Persistência de dados adaptável (Firestore ou SQL) | Rascunho |
| [ADR-0005](architecture/ADR-0005-DEPLOY-MULTINUVEM.md) | Deploy multinuvem (GCP, Vercel e OCI) | Rascunho |

### Design técnico (`tdds/`)

| ID | Título | Status |
| --- | --- | --- |
| [TDD-0001](tdds/TDD-0001-MODELO-DE-DADOS.md) | Modelo de Dados | Rascunho |
| [TDD-0002](tdds/TDD-0002-DEPLOY-E-AMBIENTES.md) | Deploy e Ambientes | Rascunho |

### Padrões (`standards/`)

| ID | Título | Status |
| --- | --- | --- |
| [STD-0001](standards/STD-0001-IDENTIDADE-VISUAL.md) | Identidade Visual e Escalas | Rascunho |

### Governança (`governance/`)

| ID | Título | Status |
| --- | --- | --- |
| [GOV-0001](governance/GOV-0001-CANAIS-DO-PROJETO.md) | Canais e Artefatos do Projeto | Rascunho |

### Políticas (`policies/`) e RFCs (`rfcs/`)

Nenhum documento ainda. Ver [POL-000](policies/POL-000-INDEX.md) e [RFC-000](rfcs/RFC-000-INDEX.md).

## Outros artefatos em `docs/`

| Pasta | Conteúdo |
| --- | --- |
| `uml/` | Diagramas de arquitetura e de fluxo |
| `screenshots/` | Capturas oficiais das telas do app |
