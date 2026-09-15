export type PainLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type SeverityCategory = 'mild' | 'moderate' | 'severe' | 'intense';

export type BodyPart = 
  | 'cabeca'
  | 'cervical'
  | 'ombro_esquerdo'
  | 'ombro_direito'
  | 'torax'
  | 'lombar'
  | 'quadril'
  | 'braco_esquerdo'
  | 'braco_direito'
  | 'mao_esquerda'
  | 'mao_direita'
  | 'joelho_esquerdo'
  | 'joelho_direito'
  | 'tornozelo_esquerdo'
  | 'tornozelo_direito';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider?: 'google' | 'email' | 'demo';
  birthDate?: string;
  diagnosis?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PainLog {
  id: string;
  userId: string;
  timestamp: string; // ISO 8601
  painLevel: PainLevel;
  severityCategory: SeverityCategory;
  painType: 'pulsatil' | 'em_pontada' | 'queimacao' | 'constante' | 'latejante' | 'pressao';
  bodyLocations: BodyPart[];
  triggers: string[];
  reliefActions: string[];
  notes?: string;
  associatedMedications?: string[];
  isFlareUp?: boolean;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string; // ex: "50mg", "1 comprimido"
  category: 'analgesico' | 'antiinflamatorio' | 'neuropatico' | 'relaxante_muscular' | 'suplemento' | 'outro';
  scheduledTimes: string[]; // ex: ["08:00", "20:00"]
  instructions?: string; // ex: "Após refeição"
  isActive: boolean;
  prescribedBy?: string;
  createdAt: string;
  isChronic?: boolean; // true = contínuo, false = uso não crônico / temporário
  dosesPerDay?: number; // número de doses diárias (ex: 1, 2, 3)
  durationDays?: number; // período de utilização em dias (ex: 5, 7, 10, 14)
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface MedicationIntake {
  id: string;
  userId: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  takenAt?: string;
  status: 'taken' | 'skipped' | 'pending';
  date: string; // YYYY-MM-DD
}

export interface PhysiotherapyPrescription {
  id: string;
  userId: string;
  title: string;
  isChronic?: boolean;
  timesPerDay: number; // número de execuções diárias
  durationDays: number; // período de dias indicado
  scheduledTimes: string[]; // ex: ["09:00", "16:00"]
  instructions?: string;
  prescribedBy?: string;
  isActive: boolean;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  createdAt: string;
  physiotherapyDetails?: Partial<PhysiotherapyDetails>;
}

export interface PhysiotherapyExecution {
  id: string;
  userId: string;
  prescriptionId: string;
  prescriptionTitle: string;
  scheduledTime: string;
  sessionNumber: number; // 1ª, 2ª do dia
  totalSessions: number; // total do dia
  status: 'pending' | 'completed';
  completedAt?: string;
  date: string; // YYYY-MM-DD
  exerciseLogId?: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  durationHours: number;
  durationMinutes: number;
  qualityRating: 1 | 2 | 3 | 4 | 5; // 1=Péssimo, 5=Excelente
  wakeUpsCount: number;
  sleepTime: string; // "23:00"
  wakeTime: string; // "07:00"
  disruptions: string[]; // ['dor_noturna', 'insonia', 'apneia', 'ansiedade']
  restedScore: number; // 0 a 100
  notes?: string;
}

export type PhysiotherapyUpperLimbExercise =
  | 'ulnt_1'
  | 'ulnt_2a'
  | 'ulnt_2b'
  | 'ulnt_3';

export type PhysiotherapyLaterality = 'bilateral' | 'direito' | 'esquerdo';

export type PhysiotherapySensation =
  | 'formigamento_parestesia'
  | 'pontada_fisgada'
  | 'tensao_muscular_suave'
  | 'queimacao_trajeto'
  | 'alivio_imediato';

export type PhysiotherapyPerceivedEffort =
  | 'muito_facil'
  | 'moderado'
  | 'dificil'
  | 'no_limite';

export interface PhysiotherapyDetails {
  upperLimbExercises: PhysiotherapyUpperLimbExercise[]; // até 4 opções simultâneas
  laterality: PhysiotherapyLaterality; // bilateral, direito, esquerdo
  sets: number; // Séries
  repetitions: number; // Repetições
  holdTimeSeconds: number; // Tempo de sustentação (em segundos)
  painDuring: number; // EVA 0 a 10 durante
  painAfter: number; // EVA 0 a 10 pós
  sensationType: PhysiotherapySensation; // Tipo de Resposta / Sensação Sentida
  perceivedEffort: PhysiotherapyPerceivedEffort; // Muito Fácil, Moderado, Difícil ou No Limite
  comments?: string; // Comentários (Opcional)
}

export interface ExerciseLog {
  id: string;
  userId: string;
  date: string;
  activityType: 'caminhada' | 'alongamento' | 'fisioterapia' | 'yoga' | 'pilates' | 'hidroginastica' | 'musculacao' | 'outro';
  durationMinutes: number;
  intensity: 'leve' | 'moderada' | 'intensa';
  painImpact: 'aliviou' | 'neutro' | 'aumentou_dor';
  notes?: string;
  physiotherapyDetails?: PhysiotherapyDetails;
}

export interface ClinicalEvolutionSummary {
  weekPeriod: string;
  averagePain: number;
  painTrend: 'diminuindo' | 'estavel' | 'aumentando';
  totalFlareUps: number;
  avgSleepHours: number;
  exerciseMinutesTotal: number;
  medicationAdherencePercent: number;
  physioAdherencePercent: number;
  topTriggers: { trigger: string; count: number }[];
  mostAffectedAreas: { bodyPart: BodyPart; count: number }[];
}

export interface DailyPhysioAdherence {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Seg", "Ter", "Hoje"
  shortDate: string; // e.g. "14/09"
  plannedCount: number;
  completedCount: number;
  percentage: number; // 0 to 100
  exerciseMinutes: number;
  status: 'completo' | 'parcial' | 'nao_realizado' | 'sem_prescricao';
}

export interface PhysioPeriodSummary {
  periodDays: number;
  dailyData: DailyPhysioAdherence[];
  overallPercentage: number;
  totalPlanned: number;
  totalCompleted: number;
  daysWithFullAdherence: number;
  totalExerciseMinutes: number;
  adherenceRating: 'excelente' | 'boa' | 'moderada' | 'baixa';
}
