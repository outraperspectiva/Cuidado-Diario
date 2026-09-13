import { PainLog, PainLevel, SeverityCategory } from '../types';
import { LocalPersistenceRepository } from './firebaseConfig';

export class PainService {
  private static COLLECTION = 'pain_logs';

  static getSeverityCategory(level: number): SeverityCategory {
    const clamped = Math.max(0, Math.min(10, Math.round(level)));
    if (clamped <= 2) return 'mild';
    if (clamped <= 5) return 'moderate';
    if (clamped <= 8) return 'severe';
    return 'intense';
  }

  static getSeverityColor(category: SeverityCategory): string {
    switch (category) {
      case 'mild':
        return '#5E9E87'; // Soft Sage
      case 'moderate':
        return '#D99B4E'; // Muted Warm Amber
      case 'severe':
        return '#D96B5B'; // Softened Terracotta Coral
      case 'intense':
        return '#B34045'; // Deep Crimson Rose
    }
  }

  static getSeverityLabel(category: SeverityCategory): string {
    switch (category) {
      case 'mild':
        return 'Leve / Linha de Base (0-2)';
      case 'moderate':
        return 'Moderada (3-5)';
      case 'severe':
        return 'Severa / Aguda (6-8)';
      case 'intense':
        return 'Intensa / Emergência (9-10)';
    }
  }

  static async createLog(userId: string, data: Omit<PainLog, 'id' | 'userId'>): Promise<PainLog> {
    const newLog: PainLog = {
      ...data,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      severityCategory: this.getSeverityCategory(data.painLevel),
    };

    const currentLogs = LocalPersistenceRepository.get<PainLog>(this.COLLECTION, userId, []);
    const updated = [newLog, ...currentLogs];
    LocalPersistenceRepository.save(this.COLLECTION, userId, updated);

    return newLog;
  }

  static async getLogs(userId: string, fallbackLogs: PainLog[]): Promise<PainLog[]> {
    return LocalPersistenceRepository.get<PainLog>(this.COLLECTION, userId, fallbackLogs);
  }

  static async updateLog(userId: string, logId: string, updates: Partial<PainLog>): Promise<PainLog> {
    const currentLogs = LocalPersistenceRepository.get<PainLog>(this.COLLECTION, userId, []);
    const index = currentLogs.findIndex(l => l.id === logId);
    if (index === -1) throw new Error('Registro não encontrado');

    const updatedLog = {
      ...currentLogs[index],
      ...updates,
      severityCategory: updates.painLevel !== undefined ? this.getSeverityCategory(updates.painLevel) : currentLogs[index].severityCategory
    };

    currentLogs[index] = updatedLog;
    LocalPersistenceRepository.save(this.COLLECTION, userId, currentLogs);
    return updatedLog;
  }

  static async deleteLog(userId: string, logId: string): Promise<boolean> {
    const currentLogs = LocalPersistenceRepository.get<PainLog>(this.COLLECTION, userId, []);
    const filtered = currentLogs.filter(l => l.id !== logId);
    LocalPersistenceRepository.save(this.COLLECTION, userId, filtered);
    return true;
  }
}
