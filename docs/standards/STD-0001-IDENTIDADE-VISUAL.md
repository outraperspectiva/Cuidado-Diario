# STD-0001: Identidade Visual e Escalas

| Campo | Valor |
| --- | --- |
| ID | STD-0001 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [ADR-0003](../architecture/ADR-0003-USAR-TAILWIND-CSS.md), [PRD-0004](../products/PRD-0004-DOR-E-SINTOMAS.md) |

## 1. Paleta oficial

| Nome | HEX | Uso |
| --- | --- | --- |
| Petróleo | `#103557` | Cor principal |
| Verde Paciente | `#88C6B0` | Identidade do papel Paciente |
| Névoa | `#F8FAFC` | Fundo |
| Alerta/Crise | `#DC2626` | Alertas e crise |

## 2. Tipografia

- **Bricolage Grotesque** e **Public Sans**. Definir o uso de cada uma (títulos e texto) neste documento.

## 3. Escala visual de dor

Régua de 0 a 10, com cor calculada dinamicamente em HSL conforme o nível.

## 4. Telas oficiais

As capturas versionadas ficam em `docs/screenshots/` e `public/screenshots/`.

## 5. Regra

Telas e componentes novos devem usar apenas as cores e fontes acima, configuradas como tokens do Tailwind.
