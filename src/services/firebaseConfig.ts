/**
 * Firebase Client & Data Persistence Layer
 * Provides seamless connection to Firebase Firestore & Auth,
 * with local offline caching and fallback repository for sandbox preview.
 */

import { UserProfile } from '../types';

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

// Check for runtime config or env
export const getFirebaseConfig = (): FirebaseClientConfig => {
  return {
    apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || 'AIzaSyCuidadoDiarioKey',
    authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'cuidado-diario-app.firebaseapp.com',
    projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'cuidado-diario-app',
    storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'cuidado-diario-app.appspot.com',
    messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
    appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
    firestoreDatabaseId: '(default)'
  };
};

// Generic Local Storage Persistence Repository
export class LocalPersistenceRepository {
  private static USERS_DB_KEY = 'melhora_users_registered_db';
  private static ACTIVE_USER_KEY = 'melhora_active_session_profile';

  private static getKey(collection: string, userId: string): string {
    return `melhora_${userId}_${collection}`;
  }

  static get<T>(collection: string, userId: string, fallback: T[]): T[] {
    try {
      const primaryKey = this.getKey(collection, userId);
      const data = localStorage.getItem(primaryKey);
      if (data !== null) {
        return JSON.parse(data);
      }
      const legacy = localStorage.getItem(`serene_${userId}_${collection}`);
      if (legacy !== null) {
        return JSON.parse(legacy);
      }
      return fallback;
    } catch {
      return fallback;
    }
  }

  static save<T>(collection: string, userId: string, items: T[]): void {
    try {
      localStorage.setItem(this.getKey(collection, userId), JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  static clearUserCollections(userId: string): void {
    try {
      localStorage.removeItem(this.getKey('pain_logs', userId));
      localStorage.removeItem(this.getKey('medications', userId));
      localStorage.removeItem(this.getKey('intakes', userId));
      localStorage.removeItem(this.getKey('sleep_logs', userId));
      localStorage.removeItem(this.getKey('exercise_logs', userId));
    } catch (e) {
      console.warn('Error clearing user collections:', e);
    }
  }

  /**
   * Obtém todos os perfis de usuários cadastrados no banco
   */
  static getAllUsers(): UserProfile[] {
    try {
      const raw = localStorage.getItem(this.USERS_DB_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Busca usuário por e-mail no banco de dados
   */
  static getUserByEmail(email: string): UserProfile | null {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getAllUsers();
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  }

  /**
   * Busca usuário por UID no banco de dados
   */
  static getUserById(uid: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find((u) => u.uid === uid) || null;
  }

  /**
   * Salva ou atualiza perfil de usuário no banco de dados
   */
  static saveUserProfile(profile: UserProfile): void {
    try {
      const users = this.getAllUsers();
      const existingIdx = users.findIndex(
        (u) => u.uid === profile.uid || u.email.toLowerCase() === profile.email.toLowerCase()
      );
      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...profile, updatedAt: new Date().toISOString() };
      } else {
        users.push(profile);
      }
      localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
      this.setActiveUser(profile);
    } catch (e) {
      console.warn('Error saving user profile:', e);
    }
  }

  /**
   * Retorna o usuário da sessão ativa atual
   */
  static getActiveUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(this.ACTIVE_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Define o usuário da sessão ativa atual
   */
  static setActiveUser(profile: UserProfile | null): void {
    try {
      if (profile) {
        localStorage.setItem(this.ACTIVE_USER_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(this.ACTIVE_USER_KEY);
      }
    } catch (e) {
      console.warn('Error setting active user:', e);
    }
  }

  /**
   * Garante a criação de um novo perfil no banco de dados SEM REGISTROS.
   * Se o usuário já existir no banco, recupera seu perfil e seus registros existentes.
   * Se for uma nova conta:
   *  - Cria e persiste o novo UserProfile
   *  - Inicializa as coleções de dor, medicamentos, sono e exercícios vazias ([])
   */
  static getOrCreateUserProfile(data: {
    email: string;
    name?: string;
    authProvider?: 'google' | 'email' | 'demo';
    avatarUrl?: string;
  }): { profile: UserProfile; isNewAccount: boolean } {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = this.getUserByEmail(cleanEmail);

    if (existing) {
      this.setActiveUser(existing);
      return { profile: existing, isNewAccount: false };
    }

    // Identificação do nome: garantir nome acolhedor sem fragmentos de e-mail
    let displayName = 'Fábio Fernandez';
    if (
      data.name &&
      data.name.trim() &&
      !data.name.toLowerCase().includes('outraperspectiva') &&
      data.name.toLowerCase() !== 'outra' &&
      !data.name.includes('@')
    ) {
      displayName = data.name.trim();
    }

    const uid =
      data.authProvider === 'google'
        ? `google_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
        : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newProfile: UserProfile = {
      uid,
      name: displayName,
      email: cleanEmail,
      avatarUrl:
        data.avatarUrl ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=103557,2b4c6f,356572`,
      authProvider: data.authProvider || 'email',
      birthDate: '',
      diagnosis: [], // Novo perfil sem diagnósticos prévios
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Salva o perfil novo no banco de dados
    this.saveUserProfile(newProfile);

    // 2. CRÍTICO: Cria no banco de dados um novo perfil SEM REGISTROS (coleções limpas)
    this.save('pain_logs', uid, []);
    this.save('medications', uid, []);
    this.save('intakes', uid, []);
    this.save('sleep_logs', uid, []);
    this.save('exercise_logs', uid, []);

    this.setActiveUser(newProfile);
    return { profile: newProfile, isNewAccount: true };
  }
}
