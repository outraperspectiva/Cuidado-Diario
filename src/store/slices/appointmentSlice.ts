import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MedicalAppointment } from '../../types';

export const initialAppointments: MedicalAppointment[] = [
  {
    id: 'app-demo-01',
    userId: 'melhora-user-7841',
    doctorName: 'Dr. Roberto Silva',
    specialty: 'Neurologia / Especialista em Dor',
    date: '2026-09-22',
    time: '14:30',
    locationType: 'presencial',
    clinicOrHospital: 'Clínica Integrada de Dor & Neuro - Sala 402',
    reason: 'Avaliação da resposta ao esquema analgésico e mobilização neural',
    status: 'agendada',
    isUrgent: false,
    notes: 'Levar diário de intensidade de dor dos últimos 14 dias.',
    createdAt: '2026-09-10T10:00:00.000Z'
  },
  {
    id: 'app-demo-02',
    userId: 'melhora-user-7841',
    doctorName: 'Dra. Patrícia Lima',
    specialty: 'Fisiatria & Reabilitação',
    date: '2026-09-29',
    time: '10:00',
    locationType: 'telemedicina',
    clinicOrHospital: 'Plataforma ConectaSaúde (Teleconsulta)',
    reason: 'Ajuste de volume e amplitude das sessões de neurodinâmica (ULNT)',
    status: 'agendada',
    isUrgent: false,
    notes: 'Avaliar evolução do score EVA durante a sustentação dos membros superiores.',
    createdAt: '2026-09-12T14:30:00.000Z'
  },
  {
    id: 'app-demo-03',
    userId: 'melhora-user-7841',
    doctorName: 'Dr. Roberto Silva',
    specialty: 'Neurologia / Especialista em Dor',
    date: '2026-09-04',
    time: '09:00',
    locationType: 'presencial',
    clinicOrHospital: 'Clínica Integrada de Dor & Neuro',
    reason: 'Consulta inicial de mapeamento da dor e introdução de medidas profiláticas',
    status: 'realizada',
    isUrgent: false,
    notes: 'Definido protocolo inicial e prescrições de resgate.',
    createdAt: '2026-08-25T11:00:00.000Z'
  }
];

interface AppointmentState {
  appointments: MedicalAppointment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: initialAppointments,
  isLoading: false,
  error: null
};

export const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setUserAppointments: (state, action: PayloadAction<MedicalAppointment[]>) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action: PayloadAction<MedicalAppointment>) => {
      state.appointments.unshift(action.payload);
    },
    updateAppointmentStatus: (
      state,
      action: PayloadAction<{ id: string; status: MedicalAppointment['status'] }>
    ) => {
      const app = state.appointments.find((a) => a.id === action.payload.id);
      if (app) {
        app.status = action.payload.status;
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter((a) => a.id !== action.payload);
    },
    resetAppointments: (state) => {
      state.appointments = [];
    }
  }
});

export const {
  setUserAppointments,
  addAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  resetAppointments
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
