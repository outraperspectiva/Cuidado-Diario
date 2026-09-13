import { Medication, MedicationIntake } from '../types';
import { LocalPersistenceRepository } from './firebaseConfig';

export class MedicationService {
  private static MED_COLLECTION = 'medications';
  private static INTAKE_COLLECTION = 'medication_intakes';

  static async getMedications(userId: string, fallback: Medication[]): Promise<Medication[]> {
    return LocalPersistenceRepository.get<Medication>(this.MED_COLLECTION, userId, fallback);
  }

  static async createMedication(userId: string, data: Omit<Medication, 'id' | 'userId' | 'createdAt'>): Promise<Medication> {
    const newMed: Medication = {
      ...data,
      id: `med_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString()
    };
    const meds = LocalPersistenceRepository.get<Medication>(this.MED_COLLECTION, userId, []);
    LocalPersistenceRepository.save(this.MED_COLLECTION, userId, [...meds, newMed]);
    return newMed;
  }

  static async deleteMedication(userId: string, medId: string): Promise<void> {
    const meds = LocalPersistenceRepository.get<Medication>(this.MED_COLLECTION, userId, []);
    LocalPersistenceRepository.save(this.MED_COLLECTION, userId, meds.filter(m => m.id !== medId));

    // Also remove associated scheduled intakes for this medication
    const intakes = LocalPersistenceRepository.get<MedicationIntake>(this.INTAKE_COLLECTION, userId, []);
    LocalPersistenceRepository.save(this.INTAKE_COLLECTION, userId, intakes.filter(i => i.medicationId !== medId));
  }

  static async toggleIntake(userId: string, intakeId: string, currentStatus: MedicationIntake['status']): Promise<MedicationIntake['status']> {
    const nextStatus: MedicationIntake['status'] = currentStatus === 'taken' ? 'pending' : 'taken';
    const intakes = LocalPersistenceRepository.get<MedicationIntake>(this.INTAKE_COLLECTION, userId, []);
    const idx = intakes.findIndex(i => i.id === intakeId);
    if (idx !== -1) {
      intakes[idx].status = nextStatus;
      intakes[idx].takenAt = nextStatus === 'taken' ? new Date().toISOString() : undefined;
      LocalPersistenceRepository.save(this.INTAKE_COLLECTION, userId, intakes);
    }
    return nextStatus;
  }
}
