import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppTab = 'hoje' | 'dor' | 'medicamentos' | 'atividades' | 'evolucao' | 'perfil';

interface UiState {
  activeTab: AppTab;
  isMobileFrame: boolean;
  isQuickSosOpen: boolean;
  isAddMedicationOpen: boolean;
  isAddPainLogOpen: boolean;
  isAddSleepOpen: boolean;
  isAddExerciseOpen: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'warning' | 'error';
}

const initialState: UiState = {
  activeTab: 'hoje',
  isMobileFrame: true, // Default to simulated mobile frame
  isQuickSosOpen: false,
  isAddMedicationOpen: false,
  isAddPainLogOpen: false,
  isAddSleepOpen: false,
  isAddExerciseOpen: false,
  toastMessage: null,
  toastType: 'success',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<AppTab>) => {
      state.activeTab = action.payload;
    },
    toggleMobileFrame: (state) => {
      state.isMobileFrame = !state.isMobileFrame;
    },
    setMobileFrame: (state, action: PayloadAction<boolean>) => {
      state.isMobileFrame = action.payload;
    },
    setQuickSosOpen: (state, action: PayloadAction<boolean>) => {
      state.isQuickSosOpen = action.payload;
    },
    setAddMedicationOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddMedicationOpen = action.payload;
    },
    setAddPainLogOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddPainLogOpen = action.payload;
    },
    setAddSleepOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddSleepOpen = action.payload;
    },
    setAddExerciseOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddExerciseOpen = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type?: UiState['toastType'] }>) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type || 'success';
    },
    hideToast: (state) => {
      state.toastMessage = null;
    }
  }
});

export const {
  setActiveTab,
  toggleMobileFrame,
  setMobileFrame,
  setQuickSosOpen,
  setAddMedicationOpen,
  setAddPainLogOpen,
  setAddSleepOpen,
  setAddExerciseOpen,
  showToast,
  hideToast
} = uiSlice.actions;

export default uiSlice.reducer;
