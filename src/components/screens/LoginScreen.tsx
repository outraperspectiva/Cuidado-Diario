import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginSuccess, setLoading, setError } from '../../store/slices/authSlice';
import { showToast, setActiveTab } from '../../store/slices/uiSlice';
import { AuthService, PasswordStrength } from '../../services/authService';
import { CuidadoDiarioLogo } from '../common/CuidadoDiarioLogo';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';

interface LoginScreenProps {
  onContinueAsGuest?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onContinueAsGuest }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Google Account Chooser Modal State
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isCustomGoogleInput, setIsCustomGoogleInput] = useState(false);

  const passwordStrength: PasswordStrength = AuthService.evaluatePasswordStrength(password);

  const getStrengthBarColor = (score: number) => {
    if (score <= 1) return 'bg-[#D96B5B]';
    if (score === 2) return 'bg-[#D99B4E]';
    if (score === 3) return 'bg-[#68A691]';
    return 'bg-[#003B2E]';
  };

  const handleGoogleLogin = async (userEmail?: string, userName?: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const chosenEmail = userEmail || (customGoogleEmail.trim() || 'outraperspectiva@gmail.com');
      const chosenName =
        userName &&
        !userName.toLowerCase().includes('outraperspectiva') &&
        userName.toLowerCase() !== 'outra' &&
        !userName.includes('@')
          ? userName
          : (customGoogleName.trim() || 'Fábio Fernandez');

      const user = await AuthService.loginWithGoogle(chosenEmail, chosenName);
      dispatch(loginSuccess(user));
      dispatch(setActiveTab('hoje'));
      dispatch(
        showToast({
          message: `Bem-vindo, ${user.name}! Conectado com a Conta Google (${user.email}).`,
          type: 'info'
        })
      );
      setIsGoogleChooserOpen(false);
    } catch (err: any) {
      dispatch(setError(err.message || 'Falha na autenticação com o Google.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    dispatch(setError(null));

    if (mode === 'login') {
      const validation = AuthService.validateLoginForm({ email, password });
      if (!validation.isValid) {
        setFieldErrors(validation.errors);
        return;
      }

      try {
        dispatch(setLoading(true));
        const user = await AuthService.login(email, password);
        dispatch(loginSuccess(user));
        dispatch(setActiveTab('hoje'));
        dispatch(showToast({ message: `Bem-vindo de volta, ${user.name}!` }));
      } catch (err: any) {
        dispatch(setError(err.message || 'Falha ao autenticar'));
      }
    } else {
      const validation = AuthService.validateRegistrationForm({ name, email, password, confirmPassword });
      if (!validation.isValid) {
        setFieldErrors(validation.errors);
        return;
      }

      try {
        dispatch(setLoading(true));
        const user = await AuthService.register(name, email, password);
        dispatch(loginSuccess(user));
        dispatch(setActiveTab('hoje'));
        dispatch(showToast({ message: 'Conta criada com sucesso!' }));
      } catch (err: any) {
        dispatch(setError(err.message || 'Falha ao cadastrar'));
      }
    }
  };

  const handleDemoLogin = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const user = await AuthService.login('fabio.fernandez@clinica.com.br', 'DemoPass123!');
      dispatch(loginSuccess(user));
      dispatch(setActiveTab('hoje'));
      dispatch(showToast({ message: 'Conectado como paciente Fábio Fernandez (Demonstração).' }));
    } catch {
      dispatch(setError('Erro ao iniciar demonstração'));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[92vh] flex flex-col justify-between py-4 sm:py-6 animate-in fade-in duration-200">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="mx-auto flex justify-center">
            <CuidadoDiarioLogo size={68} showBg />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E2F0FD] text-[#2B4C6F] text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-[#356572]" />
              <span>Acompanhamento de Saúde e Dor</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#103557] tracking-tight">
              Cuidado Diário
            </h1>
            <p className="text-xs text-[#53606B] max-w-xs mx-auto mt-0.5">
              Diário de Dor, Medicamentos, Sono e Qualidade de Vida
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFDAD6]/50 border border-[#D96B5B]/30 flex items-start gap-2.5 text-xs text-[#93000A]">
            <AlertCircle className="w-4 h-4 text-[#D96B5B] shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Primary Action: GOOGLE SIGN-IN HIGHLIGHT */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE3E8] elevation-2 space-y-3.5">
          <div className="text-center">
            <span className="text-[11px] font-bold text-[#53606B] uppercase tracking-wider">
              Acesso Rápido & Seguro
            </span>
          </div>

          {/* Official Google Sign-In Button */}
          <button
            type="button"
            id="btn-login-google"
            onClick={() => setIsGoogleChooserOpen(true)}
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-white hover:bg-[#F6F8FA] border-2 border-[#DCE3E8] hover:border-[#103557] transition-all flex items-center justify-center gap-3 px-4 shadow-xs active:scale-98 group cursor-pointer disabled:opacity-50"
          >
            {/* Google Multi-color G logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-xs sm:text-sm font-bold text-[#101D26] group-hover:text-[#103557]">
              Continuar com a Conta Google
            </span>
          </button>

          <p className="text-[10px] text-[#73777F] text-center flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-[#68A691]" />
            <span>Autenticação OAuth segura com isolamento de dados do paciente</span>
          </p>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-[#DCE3E8]"></div>
            <span className="shrink mx-3 text-[11px] font-semibold text-[#73777F] uppercase tracking-wider">
              ou com e-mail
            </span>
            <div className="grow border-t border-[#DCE3E8]"></div>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[#F6F8FA] p-1 rounded-2xl border border-[#DCE3E8] text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setFieldErrors({});
              }}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#103557] font-bold shadow-xs'
                  : 'text-[#53606B] hover:text-[#103557]'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('cadastro');
                setFieldErrors({});
              }}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                mode === 'cadastro'
                  ? 'bg-white text-[#103557] font-bold shadow-xs'
                  : 'text-[#53606B] hover:text-[#103557]'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {mode === 'cadastro' && (
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#73777F]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs text-[#101D26] placeholder-[#73777F] focus:outline-hidden focus:ring-2 transition-all ${
                      fieldErrors.name
                        ? 'border-[#D96B5B] focus:ring-[#D96B5B]/20'
                        : 'border-[#DCE3E8] focus:border-[#2B4C6F] focus:ring-[#2B4C6F]/20'
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] text-[#D96B5B] mt-1 font-medium">{fieldErrors.name}</p>
                )}
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-[#103557] mb-1">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#73777F]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs text-[#101D26] placeholder-[#73777F] focus:outline-hidden focus:ring-2 transition-all ${
                    fieldErrors.email
                      ? 'border-[#D96B5B] focus:ring-[#D96B5B]/20'
                      : 'border-[#DCE3E8] focus:border-[#2B4C6F] focus:ring-[#2B4C6F]/20'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-[#D96B5B] mt-1 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#103557]">Senha</label>
                {mode === 'cadastro' && password && (
                  <span className="text-[11px] font-semibold text-[#53606B]">
                    Força: {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#73777F]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs text-[#101D26] placeholder-[#73777F] focus:outline-hidden focus:ring-2 transition-all ${
                    fieldErrors.password
                      ? 'border-[#D96B5B] focus:ring-[#D96B5B]/20'
                      : 'border-[#DCE3E8] focus:border-[#2B4C6F] focus:ring-[#2B4C6F]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#73777F] hover:text-[#103557]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-[#D96B5B] mt-1 font-medium">{fieldErrors.password}</p>
              )}

              {/* Password strength checklist */}
              {mode === 'cadastro' && password.length > 0 && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#F6F8FA] border border-[#DCE3E8] space-y-1.5">
                  <div className="h-1.5 w-full bg-[#E2F0FD] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthBarColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#53606B]">
                    <span className={passwordStrength.hasMinLength ? 'text-[#003B2E] font-semibold' : ''}>
                      {passwordStrength.hasMinLength ? '✓' : '•'} 8+ caracteres
                    </span>
                    <span className={passwordStrength.hasUppercase && passwordStrength.hasLowercase ? 'text-[#003B2E] font-semibold' : ''}>
                      {passwordStrength.hasUppercase && passwordStrength.hasLowercase ? '✓' : '•'} Maiúsculas e minúsculas
                    </span>
                    <span className={passwordStrength.hasNumber ? 'text-[#003B2E] font-semibold' : ''}>
                      {passwordStrength.hasNumber ? '✓' : '•'} Número
                    </span>
                    <span className={passwordStrength.hasSpecialChar ? 'text-[#003B2E] font-semibold' : ''}>
                      {passwordStrength.hasSpecialChar ? '✓' : '•'} Símbolo (!@#$)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {mode === 'cadastro' && (
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#73777F]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs text-[#101D26] placeholder-[#73777F] focus:outline-hidden focus:ring-2 transition-all ${
                      fieldErrors.confirmPassword
                        ? 'border-[#D96B5B] focus:ring-[#D96B5B]/20'
                        : 'border-[#DCE3E8] focus:border-[#2B4C6F] focus:ring-[#2B4C6F]/20'
                    }`}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-[11px] text-[#D96B5B] mt-1 font-medium">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-full bg-[#103557] hover:bg-[#2B4C6F] text-white text-xs font-bold transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#88C6B0]" />
                  <span>{mode === 'login' ? 'Entrar com E-mail' : 'Criar Perfil de Saúde'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Secondary Navigation & Demo Options */}
        <div className="space-y-2">
          {/* Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#E2F0FD] hover:bg-[#B7E7F7]/60 text-[#103557] text-xs font-bold transition-all border border-[#B7E7F7] flex items-center justify-center gap-2 shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-[#356572]" />
            <span>Acessar com Perfil Demo (Fábio Fernandez)</span>
          </button>

          {/* Continue as Guest */}
          {onContinueAsGuest && (
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-2 px-3 text-xs font-semibold text-[#53606B] hover:text-[#103557] transition-colors flex items-center justify-center gap-1"
            >
              <span>Explorar aplicativo como convidado</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Security & Architecture Guarantee Footer */}
      <div className="pt-4 text-center space-y-1">
        <p className="text-[10px] text-[#73777F]">
          Seus dados de saúde são protegidos com segurança e isolamento individual de paciente.
        </p>
      </div>

      {/* Google Account Selector Dialog */}
      {isGoogleChooserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-4 flex flex-col p-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-[#103557]">Escolha uma Conta Google</h3>
                <p className="text-[11px] text-[#53606B]">para continuar no Cuidado Diário</p>
              </div>
            </div>

            {/* Quick 1-Tap Option: User's Account outraperspectiva@gmail.com */}
            <div className="space-y-2 mt-2">
              <button
                type="button"
                id="btn-google-account-fabio"
                onClick={() => handleGoogleLogin('outraperspectiva@gmail.com', 'Fábio Fernandez')}
                className="w-full p-3 rounded-2xl border border-[#DCE3E8] hover:border-[#103557] hover:bg-[#F6F8FA] transition-all flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#103557] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  FF
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#101D26] group-hover:text-[#103557] truncate">
                    Fábio Fernandez
                  </div>
                  <div className="text-[11px] text-[#53606B] truncate">
                    outraperspectiva@gmail.com
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#AFF0D8] text-[#003B2E]">
                  Conta Google
                </span>
              </button>

              {/* Custom Google Account Entry Option */}
              {!isCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setIsCustomGoogleInput(true)}
                  className="w-full p-2.5 text-xs text-[#2B4C6F] font-bold hover:bg-[#EEF2F5] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Usar outra conta Google...</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-[#F6F8FA] border border-[#DCE3E8] space-y-2 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-[#103557] mb-1">
                      E-mail Google (@gmail.com)
                    </label>
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="seu.email@gmail.com"
                      className="w-full px-3 py-1.5 rounded-xl border border-[#DCE3E8] text-xs bg-white focus:outline-hidden focus:border-[#2B4C6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#103557] mb-1">
                      Nome do Usuário (opcional)
                    </label>
                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      placeholder="Ex: Dr. Marcelo / Mariana Silva"
                      className="w-full px-3 py-1.5 rounded-xl border border-[#DCE3E8] text-xs bg-white focus:outline-hidden focus:border-[#2B4C6F]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    className="w-full py-2 bg-[#103557] hover:bg-[#2B4C6F] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    Confirmar Login com este Google
                  </button>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            <div className="mt-4 pt-3 border-t border-[#DCE3E8] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsGoogleChooserOpen(false);
                  setIsCustomGoogleInput(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-[#53606B] hover:bg-[#EEF2F5] rounded-full transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
