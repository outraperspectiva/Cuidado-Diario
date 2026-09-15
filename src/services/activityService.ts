import { SleepLog, ExerciseLog, PhysiotherapyPrescription, PhysiotherapyExecution } from '../types';
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

export class PhysiotherapyService {
  private static RX_COLLECTION = 'physio_prescriptions';
  private static EXEC_COLLECTION = 'physio_executions';

  static async getPrescriptions(userId: string, fallback: PhysiotherapyPrescription[]): Promise<PhysiotherapyPrescription[]> {
    return LocalPersistenceRepository.get<PhysiotherapyPrescription>(this.RX_COLLECTION, userId, fallback);
  }

  static async createPrescription(
    userId: string,
    data: Omit<PhysiotherapyPrescription, 'id' | 'userId' | 'createdAt'>
  ): Promise<PhysiotherapyPrescription> {
    const newRx: PhysiotherapyPrescription = {
      ...data,
      id: `physio_rx_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString()
    };
    const list = LocalPersistenceRepository.get<PhysiotherapyPrescription>(this.RX_COLLECTION, userId, []);
    LocalPersistenceRepository.save(this.RX_COLLECTION, userId, [...list, newRx]);
    return newRx;
  }

  static async deletePrescription(userId: string, id: string): Promise<void> {
    const list = LocalPersistenceRepository.get<PhysiotherapyPrescription>(this.RX_COLLECTION, userId, []);
    const updated = list.filter(p => p.id !== id);
    LocalPersistenceRepository.save(this.RX_COLLECTION, userId, updated);

    // Also delete associated executions
    const execs = LocalPersistenceRepository.get<PhysiotherapyExecution>(this.EXEC_COLLECTION, userId, []);
    const updatedExecs = execs.filter(e => e.prescriptionId !== id);
    LocalPersistenceRepository.save(this.EXEC_COLLECTION, userId, updatedExecs);
  }

  static async getExecutions(userId: string, fallback: PhysiotherapyExecution[]): Promise<PhysiotherapyExecution[]> {
    return LocalPersistenceRepository.get<PhysiotherapyExecution>(this.EXEC_COLLECTION, userId, fallback);
  }

  static async saveExecutions(userId: string, executions: PhysiotherapyExecution[]): Promise<void> {
    LocalPersistenceRepository.save(this.EXEC_COLLECTION, userId, executions);
  }

  static async toggleExecution(userId: string, executionId: string): Promise<PhysiotherapyExecution | null> {
    const execs = LocalPersistenceRepository.get<PhysiotherapyExecution>(this.EXEC_COLLECTION, userId, []);
    let modified: PhysiotherapyExecution | null = null;
    const updated = execs.map(e => {
      if (e.id === executionId) {
        const nextStatus = e.status === 'completed' ? 'pending' : 'completed';
        modified = {
          ...e,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined
        };
        return modified;
      }
      return e;
    });
    LocalPersistenceRepository.save(this.EXEC_COLLECTION, userId, updated);
    return modified;
  }
}
