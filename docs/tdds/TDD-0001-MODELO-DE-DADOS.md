# TDD-0001: Modelo de Dados

| Campo | Valor |
| --- | --- |
| ID | TDD-0001 |
| Status | Rascunho |
| Data | 2026-10-07 |
| Responsável | Mantenedores do projeto |
| Substitui / Substituído por | n/a |
| Relacionados | [ADR-0004](../architecture/ADR-0004-PERSISTENCIA-ADAPTAVEL.md), [PRD-0002](../products/PRD-0002-MEDICAMENTOS.md), [PRD-0003](../products/PRD-0003-FISIOTERAPIA.md), [PRD-0004](../products/PRD-0004-DOR-E-SINTOMAS.md), [PRD-0005](../products/PRD-0005-CONSULTAS.md) |

O modelo está em `firebase-blueprint.json` e pode ser mapeado para coleções (Firestore) ou tabelas SQL.

| Entidade | Chave | Campos | Relação |
| --- | --- | --- | --- |
| `users` | `uid` | `email`, `name`, `role` (`patient` / `caregiver`), `createdAt` | n/a |
| `medications` | `id` | `userId`, `name`, `dosage`, `form`, `times` (lista), `stock`, `instructions` | `userId` → `users` |
| `medicationIntakes` | `id` | `medicationId`, `scheduledTime`, `takenTime`, `status` (`taken` / `skipped` / `pending`), `date` | `medicationId` → `medications` |
| `physiotherapyPrescriptions` | `id` | `userId`, `title`, `scheduledTimes` (lista), `sets`, `repetitions`, `holdTimeSeconds` | `userId` → `users` |
| `physiotherapyExecutions` | `id` | `prescriptionId`, `sessionNumber`, `totalSessions`, `scheduledTime`, `completedAt`, `status` (`completed` / `pending`), `date` | `prescriptionId` → `physiotherapyPrescriptions` |
| `painLogs` | `id` | `userId`, `level` (0 a 10), `location`, `type`, `isCrisis`, `timestamp` | `userId` → `users` |
| `appointments` | `id` | `userId`, `doctorName`, `specialty`, `date`, `time`, `location`, `status` (`scheduled` / `completed` / `canceled`) | `userId` → `users` |

## Pontos em aberto

- Onde ficam armazenados os fatores desencadeantes da dor, citados em [PRD-0004](../products/PRD-0004-DOR-E-SINTOMAS.md), já que `painLogs` não os lista.
- Regras de segurança por usuário (arquivo `firestore.rules`) e equivalente em SQL.
