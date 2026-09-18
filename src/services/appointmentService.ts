import { MedicalAppointment } from '../types';
import { LocalPersistenceRepository } from './firebaseConfig';

export class AppointmentService {
  private static COLLECTION = 'appointments';

  static async getAppointments(userId: string, fallback: MedicalAppointment[]): Promise<MedicalAppointment[]> {
    return LocalPersistenceRepository.get<MedicalAppointment>(this.COLLECTION, userId, fallback);
  }

  static async createAppointment(
    userId: string,
    data: Omit<MedicalAppointment, 'id' | 'userId' | 'createdAt'>
  ): Promise<MedicalAppointment> {
    const newAppointment: MedicalAppointment = {
      ...data,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString()
    };
    const current = LocalPersistenceRepository.get<MedicalAppointment>(this.COLLECTION, userId, []);
    LocalPersistenceRepository.save(this.COLLECTION, userId, [newAppointment, ...current]);
    return newAppointment;
  }

  static async updateStatus(
    userId: string,
    appointmentId: string,
    status: MedicalAppointment['status']
  ): Promise<void> {
    const current = LocalPersistenceRepository.get<MedicalAppointment>(this.COLLECTION, userId, []);
    const idx = current.findIndex((a) => a.id === appointmentId);
    if (idx !== -1) {
      current[idx].status = status;
      LocalPersistenceRepository.save(this.COLLECTION, userId, current);
    }
  }

  static async deleteAppointment(userId: string, appointmentId: string): Promise<void> {
    const current = LocalPersistenceRepository.get<MedicalAppointment>(this.COLLECTION, userId, []);
    const filtered = current.filter((a) => a.id !== appointmentId);
    LocalPersistenceRepository.save(this.COLLECTION, userId, filtered);
  }
}
