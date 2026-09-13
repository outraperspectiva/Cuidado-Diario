import { AppDispatch } from '../store';
import { UserProfile, PainLog, Medication, MedicationIntake, SleepLog, ExerciseLog } from '../types';
import { LocalPersistenceRepository } from './firebaseConfig';
import { setUserPainLogs, resetPainLogs, initialPainLogs } from '../store/slices/painSlice';
import { setUserMedications, resetMedications, initialMedications, initialIntakes } from '../store/slices/medicationSlice';
import { setUserExerciseLogs, resetExerciseLogs, initialExerciseLogs } from '../store/slices/exerciseSlice';
import { setUserSleepLogs, resetSleepLogs, initialSleepLogs } from '../store/slices/sleepSlice';

export class UserDataSync {
  /**
   * Sincroniza o Redux Store com o banco de dados do usuário autenticado.
   * - PARA CONTAS NOVAS: carrega o banco de dados criado limpo com 0 registros ([]).
   * - PARA CONTA DEMO: carrega os registros pré-populados clínicos de demonstração.
   */
  static syncUserDatabaseToStore(dispatch: AppDispatch, user: UserProfile | null): void {
    if (!user) {
      this.clearStore(dispatch);
      return;
    }

    const isDemoAccount =
      user.uid === 'serene-user-7841' ||
      user.authProvider === 'demo' ||
      user.email === 'fabio.fernandez@clinica.com.br';

    // Se for conta nova ou conta pessoal, o fallback é estritamente [] (sem registros)
    // Se for explicitamente o perfil de demonstração, usa os dados clínicos pré-populados
    const painFallback: PainLog[] = isDemoAccount ? initialPainLogs : [];
    const medFallback: Medication[] = isDemoAccount ? initialMedications : [];
    const intakeFallback: MedicationIntake[] = isDemoAccount ? initialIntakes : [];
    const sleepFallback: SleepLog[] = isDemoAccount ? initialSleepLogs : [];
    const exerciseFallback: ExerciseLog[] = isDemoAccount ? initialExerciseLogs : [];

    const painLogs = LocalPersistenceRepository.get<PainLog>('pain_logs', user.uid, painFallback);
    const medications = LocalPersistenceRepository.get<Medication>('medications', user.uid, medFallback);
    const intakes = LocalPersistenceRepository.get<MedicationIntake>('intakes', user.uid, intakeFallback);
    const sleepLogs = LocalPersistenceRepository.get<SleepLog>('sleep_logs', user.uid, sleepFallback);
    const exerciseLogs = LocalPersistenceRepository.get<ExerciseLog>('exercise_logs', user.uid, exerciseFallback);

    dispatch(setUserPainLogs(painLogs));
    dispatch(setUserMedications({ medications, todayIntakes: intakes }));
    dispatch(setUserSleepLogs(sleepLogs));
    dispatch(setUserExerciseLogs(exerciseLogs));
  }

  static clearStore(dispatch: AppDispatch): void {
    dispatch(resetPainLogs());
    dispatch(resetMedications());
    dispatch(resetSleepLogs());
    dispatch(resetExerciseLogs());
  }
}
