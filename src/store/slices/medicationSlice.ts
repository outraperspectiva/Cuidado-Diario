import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Medication, MedicationIntake } from '../../types';

interface MedicationState {
  medications: Medication[];
  todayIntakes: MedicationIntake[];
  isLoading: boolean;
  error: string | null;
}

const todayStr = new Date().toISOString().split('T')[0];

export const initialMedications: Medication[] = [
  {
    id: 'med-01',
    userId: 'serene-user-7841',
    name: 'Pregabalina',
    dosage: '75mg',
    category: 'neuropatico',
    scheduledTimes: ['08:00', '20:00'],
    instructions: 'Tomar com água após o café e antes de dormir.',
    isActive: true,
    prescribedBy: 'Dra. Helena Martins (Neurologista)',
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'med-02',
    userId: 'serene-user-7841',
    name: 'Duloxetina',
    dosage: '30mg',
    category: 'neuropatico',
    scheduledTimes: ['09:00'],
    instructions: 'Tomar pela manhã com alimento.',
    isActive: true,
    prescribedBy: 'Dr. Lucas Ribeiro (Reumatologista)',
    createdAt: '2026-02-01T09:00:00.000Z'
  },
  {
    id: 'med-03',
    userId: 'serene-user-7841',
    name: 'Ciclobenzaprina',
    dosage: '5mg',
    category: 'relaxante_muscular',
    scheduledTimes: ['22:00'],
    instructions: 'Uso em caso de contratura muscular noturna acentuada.',
    isActive: true,
    prescribedBy: 'Dra. Helena Martins',
    createdAt: '2026-02-10T11:00:00.000Z'
  },
  {
    id: 'med-04',
    userId: 'serene-user-7841',
    name: 'Magnésio Dimalato',
    dosage: '400mg',
    category: 'suplemento',
    scheduledTimes: ['21:30'],
    instructions: 'Suplementação noturna para relaxamento muscular e sono.',
    isActive: true,
    createdAt: '2026-01-20T10:00:00.000Z'
  }
];

export const initialIntakes: MedicationIntake[] = [
  {
    id: 'intake-01',
    userId: 'serene-user-7841',
    medicationId: 'med-01',
    medicationName: 'Pregabalina',
    dosage: '75mg',
    scheduledTime: '08:00',
    takenAt: `${todayStr}T08:05:00.000Z`,
    status: 'taken',
    date: todayStr
  },
  {
    id: 'intake-02',
    userId: 'serene-user-7841',
    medicationId: 'med-02',
    medicationName: 'Duloxetina',
    dosage: '30mg',
    scheduledTime: '09:00',
    takenAt: `${todayStr}T09:12:00.000Z`,
    status: 'taken',
    date: todayStr
  },
  {
    id: 'intake-03',
    userId: 'serene-user-7841',
    medicationId: 'med-01',
    medicationName: 'Pregabalina',
    dosage: '75mg',
    scheduledTime: '20:00',
    status: 'pending',
    date: todayStr
  },
  {
    id: 'intake-04',
    userId: 'serene-user-7841',
    medicationId: 'med-04',
    medicationName: 'Magnésio Dimalato',
    dosage: '400mg',
    scheduledTime: '21:30',
    status: 'pending',
    date: todayStr
  },
  {
    id: 'intake-05',
    userId: 'serene-user-7841',
    medicationId: 'med-03',
    medicationName: 'Ciclobenzaprina',
    dosage: '5mg',
    scheduledTime: '22:00',
    status: 'pending',
    date: todayStr
  }
];

const initialState: MedicationState = {
  medications: initialMedications,
  todayIntakes: initialIntakes,
  isLoading: false,
  error: null,
};

export const medicationSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    addMedication: (state, action: PayloadAction<Medication>) => {
      state.medications.push(action.payload);
      // Generate intake slots for today if active
      action.payload.scheduledTimes.forEach(time => {
        state.todayIntakes.push({
          id: `intake-${Date.now()}-${time}`,
          userId: action.payload.userId,
          medicationId: action.payload.id,
          medicationName: action.payload.name,
          dosage: action.payload.dosage,
          scheduledTime: time,
          status: 'pending',
          date: todayStr
        });
      });
    },
    updateMedication: (state, action: PayloadAction<Medication>) => {
      const idx = state.medications.findIndex(m => m.id === action.payload.id);
      if (idx !== -1) {
        state.medications[idx] = action.payload;
      }
    },
    deleteMedication: (state, action: PayloadAction<string>) => {
      state.medications = state.medications.filter(m => m.id !== action.payload);
      state.todayIntakes = state.todayIntakes.filter(i => i.medicationId !== action.payload);
    },
    setUserMedications: (
      state,
      action: PayloadAction<{ medications: Medication[]; todayIntakes?: MedicationIntake[] }>
    ) => {
      state.medications = action.payload.medications;
      state.todayIntakes = action.payload.todayIntakes || [];
    },
    resetMedications: (state) => {
      state.medications = [];
      state.todayIntakes = [];
    },
    toggleIntakeStatus: (state, action: PayloadAction<{ id: string; status?: 'taken' | 'skipped' | 'pending' }>) => {
      const intake = state.todayIntakes.find(i => i.id === action.payload.id);
      if (intake) {
        if (action.payload.status) {
          intake.status = action.payload.status;
          intake.takenAt = action.payload.status === 'taken' ? new Date().toISOString() : undefined;
        } else {
          // Toggle taken <-> pending
          if (intake.status === 'taken') {
            intake.status = 'pending';
            intake.takenAt = undefined;
          } else {
            intake.status = 'taken';
            intake.takenAt = new Date().toISOString();
          }
        }
      }
    }
  }
});

export const {
  addMedication,
  updateMedication,
  deleteMedication,
  setUserMedications,
  resetMedications,
  toggleIntakeStatus
} = medicationSlice.actions;
export default medicationSlice.reducer;
