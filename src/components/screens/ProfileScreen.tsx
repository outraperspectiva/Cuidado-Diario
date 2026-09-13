import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout, updateProfile } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';
import { User, Phone, ShieldCheck, Database, LogOut, Heart, Plus, Check } from 'lucide-react';

interface ProfileScreenProps {
  onOpenAuth: () => void;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenAuth, onLogout }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [isAddingDiag, setIsAddingDiag] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      dispatch(logout());
      dispatch(showToast({ message: 'Sessão encerrada com segurança.', type: 'info' }));
      onOpenAuth();
    }
  };

  const patientName =
    user?.name &&
    !user.name.toLowerCase().includes('outraperspectiva') &&
    user.name.toLowerCase() !== 'outra' &&
    !user.name.includes('@')
      ? user.name
      : 'Fábio Fernandez';

  const handleAddDiagnosis = () => {
    if (!newDiagnosis.trim() || !user) return;
    const updated = [...(user.diagnosis || []), newDiagnosis.trim()];
    dispatch(updateProfile({ diagnosis: updated }));
    dispatch(showToast({ message: 'Diagnóstico adicionado.' }));
    setNewDiagnosis('');
    setIsAddingDiag(false);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#DCE3E8] elevation-1 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#103557] to-[#2B4C6F] text-white flex items-center justify-center font-bold text-xl shadow-xs">
          {patientName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#103557] truncate">{patientName}</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#AFF0D8] text-[#003B2E]">
              Ativo
            </span>
            {user?.authProvider === 'google' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2F0FD] text-[#2B4C6F] border border-[#B7E7F7]">
                Google
              </span>
            )}
          </div>
          <p className="text-xs text-[#53606B] truncate mt-0.5">{user?.email || 'email@exemplo.com'}</p>
          <div className="text-[11px] text-[#73777F] mt-1">
            {user?.authProvider === 'google' ? 'Autenticado com a Conta Google' : `Nascimento: ${user?.birthDate || '14/05/1992'}`}
          </div>
        </div>
      </div>

      {/* Diagnoses and Conditions */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#D96B5B]" />
            <h3 className="text-xs font-bold text-[#103557] uppercase tracking-wider">
              Condições & Diagnósticos Médicos
            </h3>
          </div>
          <button
            onClick={() => setIsAddingDiag(!isAddingDiag)}
            className="text-xs font-bold text-[#2B4C6F] hover:text-[#103557] flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>

        {isAddingDiag && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newDiagnosis}
              onChange={(e) => setNewDiagnosis(e.target.value)}
              placeholder="Ex: Hérnia de Disco, Artrite..."
              className="flex-1 px-3 py-1.5 rounded-xl border border-[#DCE3E8] text-xs focus:outline-hidden focus:border-[#2B4C6F]"
            />
            <button
              onClick={handleAddDiagnosis}
              className="px-3 py-1.5 rounded-xl bg-[#103557] text-white text-xs font-bold"
            >
              Salvar
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {user?.diagnosis && user.diagnosis.length > 0 ? (
            user.diagnosis.map((diag) => (
              <span
                key={diag}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E2F0FD] text-[#2B4C6F] border border-[#B7E7F7]"
              >
                {diag}
              </span>
            ))
          ) : (
            <p className="text-xs text-[#73777F] italic py-1">
              Nenhuma condição cadastrada. Toque em "Adicionar" para registrar seu diagnóstico.
            </p>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1">
        <div className="flex items-center gap-2 mb-2 text-[#103557]">
          <Phone className="w-4 h-4 text-[#356572]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Contato de Apoio / Emergência
          </h3>
        </div>
        <div className="text-xs space-y-1 text-[#53606B]">
          <div className="font-bold text-[#103557]">
            {user?.emergencyContact?.name || 'Não configurado'}
          </div>
          <div className="text-[11px]">
            Parentesco: {user?.emergencyContact?.relationship || 'Não informado'}
          </div>
          <div className="text-[11px] text-[#2B4C6F] font-semibold">
            {user?.emergencyContact?.phone || 'Não informado'}
          </div>
        </div>
      </div>

      {/* Backend & Architecture Status */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 space-y-2">
        <div className="flex items-center gap-2 text-[#103557]">
          <Database className="w-4 h-4 text-[#356572]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Arquitetura & Conexão Backend
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-[#F6F8FA] border border-[#DCE3E8]">
            <span className="text-[#73777F] block">Banco de Dados</span>
            <strong className="text-[#003B2E] flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#68A691]" /> Firebase Firestore
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F6F8FA] border border-[#DCE3E8]">
            <span className="text-[#73777F] block">Gerenciamento Estado</span>
            <strong className="text-[#103557] flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2B4C6F]" /> Redux Toolkit
            </strong>
          </div>
        </div>
        <p className="text-[10px] text-[#73777F] leading-relaxed pt-1">
          Regras de segurança zero-trust ativas em <code>firestore.rules</code> com isolamento por UID de paciente.
        </p>
      </div>

      {/* Switch / Logout */}
      <div className="pt-2 space-y-2">
        {user?.authProvider !== 'google' && (
          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#F6F8FA] border-2 border-[#DCE3E8] hover:border-[#103557] text-[#101D26] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Conectar com Conta Google</span>
          </button>
        )}

        <button
          id="btn-profile-logout"
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl bg-[#FFDAD6]/40 hover:bg-[#FFDAD6] border border-[#D96B5B]/30 text-[#BA1A1A] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema (Logout)</span>
        </button>
      </div>
    </div>
  );
};
