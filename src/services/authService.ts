import { UserProfile } from '../types';
import { LocalPersistenceRepository } from './firebaseConfig';

export interface ValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
    name?: string;
    confirmPassword?: string;
  };
}

export interface PasswordStrength {
  score: number; // 0 to 4
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  label: string;
}

export class AuthService {
  /**
   * Valida formato do email
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Avalia força e critérios da senha
   */
  static evaluatePasswordStrength(password: string): PasswordStrength {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase && hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    let label = 'Muito fraca';
    if (score === 1) label = 'Fraca';
    else if (score === 2) label = 'Média';
    else if (score === 3) label = 'Boa';
    else if (score >= 4) label = 'Forte e segura';

    return {
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      label
    };
  }

  /**
   * Valida formulário de cadastro
   */
  static validateRegistrationForm(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }): ValidationResult {
    const errors: ValidationResult['errors'] = {};

    if (!data.name.trim() || data.name.trim().length < 3) {
      errors.name = 'Por favor, informe seu nome completo (mínimo 3 caracteres).';
    }

    if (!data.email.trim()) {
      errors.email = 'O e-mail é obrigatório.';
    } else if (!this.validateEmail(data.email)) {
      errors.email = 'Insira um formato de e-mail válido (ex: seu.nome@email.com).';
    }

    const strength = this.evaluatePasswordStrength(data.password);
    if (!data.password) {
      errors.password = 'A senha é obrigatória.';
    } else if (!strength.hasMinLength) {
      errors.password = 'A senha deve conter no mínimo 8 caracteres.';
    } else if (!strength.hasUppercase || !strength.hasLowercase) {
      errors.password = 'A senha deve conter letras maiúsculas e minúsculas.';
    } else if (!strength.hasNumber) {
      errors.password = 'A senha deve incluir pelo menos um número.';
    }

    if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
      errors.confirmPassword = 'As senhas informadas não coincidem.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Valida formulário de login
   */
  static validateLoginForm(data: { email: string; password: string }): ValidationResult {
    const errors: ValidationResult['errors'] = {};

    if (!data.email.trim()) {
      errors.email = 'Informe o seu e-mail.';
    } else if (!this.validateEmail(data.email)) {
      errors.email = 'E-mail com formato inválido.';
    }

    if (!data.password) {
      errors.password = 'Informe sua senha.';
    } else if (data.password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Realiza login com Conta Google
   * Garante a criação de um novo perfil no banco de dados SEM REGISTROS prévios
   */
  static async loginWithGoogle(customEmail?: string, customName?: string, customAvatar?: string): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const email = (customEmail && customEmail.trim()) || 'outraperspectiva@gmail.com';
    
    // O nome padrão do paciente é sempre Fábio Fernandez e nunca uma abreviação ou fragmento do e-mail
    let name = 'Fábio Fernandez';
    if (
      customName &&
      customName.trim() &&
      !customName.toLowerCase().includes('outraperspectiva') &&
      customName.toLowerCase() !== 'outra' &&
      !customName.includes('@')
    ) {
      name = customName.trim();
    }

    // Cria ou recupera o perfil no banco de dados. Para novas contas, inicializa SEM REGISTROS.
    const { profile } = LocalPersistenceRepository.getOrCreateUserProfile({
      email,
      name,
      authProvider: 'google',
      avatarUrl: customAvatar
    });

    return profile;
  }

  /**
   * Realiza login do usuário com tratamento de erros clínicos
   */
  static async login(email: string, password: string): Promise<UserProfile> {
    const validation = this.validateLoginForm({ email, password });
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    const isDemo = (email.includes('fabio') && email.includes('clinica')) || email === 'demo@cuidado.com';
    if (isDemo) {
      const demoProfile: UserProfile = {
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
        updatedAt: new Date().toISOString()
      };
      LocalPersistenceRepository.saveUserProfile(demoProfile);
      LocalPersistenceRepository.setActiveUser(demoProfile);
      return demoProfile;
    }

    // Para novas contas ou contas existentes: recupera do banco ou cria novo perfil SEM REGISTROS
    const { profile } = LocalPersistenceRepository.getOrCreateUserProfile({
      email,
      authProvider: 'email'
    });

    return profile;
  }

  /**
   * Cria cadastro de novo paciente
   * Garante a criação de um novo perfil no banco de dados SEM REGISTROS prévios
   */
  static async register(name: string, email: string, password: string): Promise<UserProfile> {
    const validation = this.validateRegistrationForm({ name, email, password });
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Cria novo perfil no banco de dados SEM REGISTROS
    const { profile } = LocalPersistenceRepository.getOrCreateUserProfile({
      name,
      email,
      authProvider: 'email'
    });

    return profile;
  }

  static async logout(): Promise<void> {
    LocalPersistenceRepository.setActiveUser(null);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}
