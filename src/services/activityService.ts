import { SleepLog, ExerciseLog } from '../types';
import { LocalPersistenceRepository } from './firebaseConfig';

export class SleepService {
  private static COLLECTION = 'sleep_logs';

  static async getSleepLogs(userId: string, fallback: SleepLog[]): Promise<SleepLog[]> {
    return LocalPersistenceRepository.get<SleepLog>(this.COLLECTION, userId, fallback);
  }

  static async createSleepLog(userId: string, data: Omit<SleepLog, 'id' | 'userId'>): Promise<SleepLog> {
    const newSleep: SleepLog = {
      ...data,
      id: `sleep_${Date.now()}`,
      userId
    };
    const logs = LocalPersistenceRepository.get<SleepLog>(this.COLLECTION, userId, []);
    LocalPersistenceRepository.save(this.COLLECTION, userId, [newSleep, ...logs]);
    return newSleep;
  }

  static async deleteSleepLog(userId: string, id: string): Promise<void> {
    const logs = LocalPersistenceRepository.get<SleepLog>(this.COLLECTION, userId, []);
    const updated = logs.filter(l => l.id !== id);
    LocalPersistenceRepository.save(this.COLLECTION, userId, updated);
  }
}

export class ExerciseService {
  private static COLLECTION = 'exercise_logs';

  static async getExerciseLogs(userId: string, fallback: ExerciseLog[]): Promise<ExerciseLog[]> {
    return LocalPersistenceRepository.get<ExerciseLog>(this.COLLECTION, userId, fallback);
  }

  static async createExerciseLog(userId: string, data: Omit<ExerciseLog, 'id' | 'userId'>): Promise<ExerciseLog> {
    const newEx: ExerciseLog = {
      ...data,
      id: `ex_${Date.now()}`,
      userId
    };
    const logs = LocalPersistenceRepository.get<ExerciseLog>(this.COLLECTION, userId, []);
    LocalPersistenceRepository.save(this.COLLECTION, userId, [newEx, ...logs]);
    return newEx;
  }

  static async deleteExerciseLog(userId: string, id: string): Promise<void> {
    const logs = LocalPersistenceRepository.get<ExerciseLog>(this.COLLECTION, userId, []);
    const updated = logs.filter(l => l.id !== id);
    LocalPersistenceRepository.save(this.COLLECTION, userId, updated);
  }
}
