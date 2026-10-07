# DOC-000: Diretrizes de Arquitetura da Documentação

| Campo | Valor |
| --- | --- |
| ID | DOC-000 |
| Status | Ativo (temporário) |
| Tipo | DOC-XXXX |
| Responsável | Mantenedores do projeto |

## 1. Finalidade

Este documento é a **autoridade única** sobre como um documento é tipado e onde ele deve ficar neste repositório. Ele define as regras de classificação, nomenclatura e evolução de toda a documentação em `docs/`.

> **Temporário por definição.** Este documento será removido quando seu conhecimento e suas diretrizes tiverem sido distribuídos pelas documentações apropriadas (principalmente `standards/` e `governance/`).

## 2. Tipos de Documento

| Tipo | Pasta | Nomenclatura | Finalidade | Índice |
| --- | --- | --- | --- | --- |
| DOC | `docs/` (raiz) | `DOC-XXXX-<TITULO>.md` | Autoridade única sobre como um documento é tipado e onde ele deve ficar | n/a |
| ADR | `architecture/` | `ADR-XXXX-<TITULO>.md` | Decisão arquitetural aceita | [ADR-000](architecture/ADR-000-INDEX.md) |
| GLO | `glossary/` | `GLO-XXXX-<TITULO>.md` | Vocabulário compartilhado / linguagem ubíqua por domínio | [GLO-000](glossary/GLO-000-INDEX.md) |
| GOV | `governance/` | `GOV-XXXX-<TITULO>.md` | Registro de governança com valor de autoridade | [GOV-000](governance/GOV-000-INDEX.md) |
| PERSONAS | `personas/` | `PERSONAS-<NOME>.md` | Diferentes personas do projeto | [PERSONAS-INDEX](personas/PERSONAS-INDEX.md) |
| POL | `policies/` | `POL-XXXX-<TITULO>.md` | Restrição obrigatória de governança | [POL-000](policies/POL-000-INDEX.md) |
| PRD | `products/` | `PRD-XXXX-<TITULO>.md` | Requisito de produto ou de negócio | [PRD-000](products/PRD-000-INDEX.md) |
| RFC | `rfcs/` | `RFC-XXXX-<TITULO>.md` | Proposta antes da decisão | [RFC-000](rfcs/RFC-000-INDEX.md) |
| STD | `standards/` | `STD-XXXX-<TITULO>.md` | Padrão obrigatório de implementação | [STD-000](standards/STD-000-INDEX.md) |
| TDD | `tdds/` | `TDD-XXXX-<TITULO>.md` | Documento de design técnico | [TDD-000](tdds/TDD-000-INDEX.md) |

## 3. Guia de Classificação

Use a primeira pergunta cuja resposta seja "sim":

1. Define como os documentos são tipados ou organizados? → **DOC**
2. É uma proposta ainda aberta para discussão? → **RFC**
3. É uma decisão arquitetural já aceita? → **ADR**
4. Descreve um requisito de negócio ou de produto? → **PRD**
5. Descreve como uma funcionalidade ou componente será construído? → **TDD**
6. É uma restrição obrigatória sobre como o projeto é governado? → **POL**
7. É uma regra obrigatória sobre como as coisas são implementadas? → **STD**
8. É o registro de uma decisão, papel ou processo de governança? → **GOV**
9. Define termos da linguagem do domínio? → **GLO**
10. Descreve um tipo de usuário ou de parte interessada? → **PERSONAS**

    Uma ordem prática é começar por um glossário, um PRD com as regras de negócio principais e as personas, porque os outros tipos dependem deles.
    
## 4. Regras de Nomenclatura

- Os tipos numerados usam sequência de quatro dígitos com zeros à esquerda: `ADR-0001`, `POL-0012`.
- O número `000` é reservado ao índice da pasta (por exemplo, `ADR-000-INDEX.md`).
- Os números **nunca são reutilizados**, mesmo que o documento seja descontinuado ou removido.
- Nos nomes de arquivo, o título usa `MAIUSCULAS-COM-HIFEN`, sem acentos nem cedilha, por exemplo `ADR-0001-USAR-POSTGRESQL.md`.
- As personas usam o nome da persona: `PERSONAS-CUIDADOR.md`.
- Os prefixos de tipo (`ADR`, `GLO`, `GOV`, `POL`, `PRD`, `RFC`, `STD`, `TDD`, `DOC`, `PERSONAS`) e os nomes das pastas permanecem como definidos neste documento.
- Os documentos são escritos em português do Brasil. Termos técnicos consagrados em inglês podem ser mantidos, com explicação na primeira ocorrência ou no glossário.

## 5. Cabeçalho Obrigatório

Todo documento começa com:

```markdown
# <TIPO-XXXX>: <Título>

| Campo | Valor |
| --- | --- |
| ID | <TIPO-XXXX> |
| Status | Rascunho / Proposto / Aceito / Ativo / Substituído / Descontinuado |
| Data | AAAA-MM-DD |
| Responsável | <nome ou equipe> |
| Substitui / Substituído por | <ID ou n/a> |
| Relacionados | <links para documentos relacionados> |
```

## 6. Ciclo de Vida e Evolução

```text
RFC (Proposta) ──aceita──▶ ADR / POL / STD / TDD
                │
                └──rejeitada──▶ RFC (Rejeitada, mantida para histórico)
```

- **RFC → decisão:** uma RFC aceita gera um ou mais documentos ADR, POL, STD ou TDD que apontam de volta para ela.
- **Imutabilidade:** ADRs aceitos não são reescritos. Uma mudança é um novo ADR que substitui o anterior, e os dois são ligados por referência cruzada.
- **PRD → TDD:** cada TDD deve referenciar o PRD que implementa.
- **Mudanças de status** são registradas no cabeçalho do documento e no índice da pasta.
- **Manutenção dos índices:** todo documento novo deve ser adicionado ao índice da sua pasta no mesmo pull request.

## 7. Regras de Referência Cruzada

- Use links relativos (`../architecture/ADR-0001-...md`).
- Referencie documentos pelo ID no texto (por exemplo, "ver ADR-0003").
- Não duplique conteúdo; aponte para o documento que é a autoridade.

## 8. Retirada deste Documento

O DOC-000 deve ser removido quando:

1. As regras de classificação e nomenclatura forem movidas para `standards/`.
2. As regras de ciclo de vida e governança forem movidas para `governance/` e `policies/`.
3. O `docs/README.md` da raiz apontar para os novos locais.

A remoção deve ser registrada em um documento GOV.
