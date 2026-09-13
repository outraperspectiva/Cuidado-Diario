import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types';
import { LocalPersistenceRepository } from '../../services/firebaseConfig';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialDemoUser: UserProfile = {
  uid: 'serene-user-7841',
  name: 'Fábio Fernandez',
  email: 'fabio.fernandez@clinica.com.br',
  birthDate: '1988-08-20',
  diagnosis: ['Fibromialgia', 'Enxaqueca Crônica', 'Lombalgia Mecânica'],
  emergencyContact: {
    name: 'Mariana Fernandez (Esposa)',
    phone: '+55 11 98765-4321',
    relationship: 'Esposa'
  },
  authProvider: 'demo',
  createdAt: '2026-01-10T10:00:00.000Z',
  updatedAt: '2026-09-12T14:00:00.000Z'
};

// Clear previous active session so the application always opens directly on the login screen
if (typeof window !== 'undefined') {
  LocalPersistenceRepository.setActiveUser(null);
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      const incomingUser = action.payload;
      let cleanName = incomingUser.name;
      if (
        !cleanName ||
        cleanName.toLowerCase().includes('outraperspectiva') ||
        cleanName.toLowerCase() === 'outra' ||
        cleanName.includes('@')
      ) {
        cleanName = 'Fábio Fernandez';
      }
      const updatedUser: UserProfile = {
        ...incomingUser,
        name: cleanName
      };
      state.user = updatedUser;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      LocalPersistenceRepository.setActiveUser(updatedUser);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      LocalPersistenceRepository.setActiveUser(null);
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload, updatedAt: new Date().toISOString() };
        LocalPersistenceRepository.saveUserProfile(state.user);
      }
    }
  },
});

export const { setLoading, setError, loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
