import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab } from '../../store/slices/uiSlice';
import { LogOut } from 'lucide-react';
import { CuidadoDiarioLogo } from './CuidadoDiarioLogo';

interface HeaderProps {
  onLogout?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeTab } = useAppSelector((state) => state.ui);
  const { logs } = useAppSelector((state) => state.pain);

  const latestLog = logs[0];
  const currentSeverityColor = latestLog
    ? latestLog.painLevel <= 2
      ? '#5E9E87'
      : latestLog.painLevel <= 5
      ? '#D99B4E'
      : latestLog.painLevel <= 8
      ? '#D96B5B'
      : '#B34045'
    : '#5E9E87';

  const patientCleanName =
    user?.name &&
    !user.name.toLowerCase().includes('outraperspectiva') &&
    user.name.toLowerCase() !== 'outra' &&
    !user.name.includes('@')
      ? user.name
      : 'Fábio Fernandez';

  const userInitials = patientCleanName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#DCE3E8] px-3.5 py-2.5 sticky top-0 z-30 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => dispatch(setActiveTab('hoje'))}
          className="rounded-2xl hover:scale-105 transition-transform shrink-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#356572]/30"
          title="Início - Cuidado Diário"
        >
          <CuidadoDiarioLogo size={38} showBg />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-extrabold text-[#103557] tracking-tight leading-tight truncate">
            Cuidado Diário
          </h1>
          <button
            onClick={() => dispatch(setActiveTab('perfil'))}
            className="text-xs text-[#53606B] hover:text-[#103557] font-medium truncate max-w-[130px] sm:max-w-xs text-left block transition-colors"
            title="Ver meu perfil"
          >
            {user ? `Olá, ${patientCleanName.split(' ')[0]}` : 'Diário de Saúde'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Pain Status Pill */}
        {latestLog && (
          <div 
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
            style={{ 
              borderColor: `${currentSeverityColor}40`,
              backgroundColor: `${currentSeverityColor}15`,
              color: currentSeverityColor 
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentSeverityColor }} />
            <span>Dor {latestLog.painLevel}/10</span>
          </div>
        )}

        {/* Profile Avatar Button */}
        <button
          id="btn-header-profile"
          onClick={() => dispatch(setActiveTab('perfil'))}
          className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all border ${
            activeTab === 'perfil'
              ? 'bg-[#103557] text-white border-[#103557] shadow-xs'
              : 'bg-[#E2F0FD] text-[#103557] border-[#B7E7F7] hover:bg-[#B7E7F7]/50'
          }`}
          title="Meu Perfil"
        >
          {userInitials}
        </button>

        {/* Logout (Sair) Button */}
        {onLogout && (
          <button
            id="btn-header-logout"
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#BA1A1A] bg-[#FFDAD6]/40 hover:bg-[#FFDAD6] border border-[#D96B5B]/30 transition-all hover:scale-102"
            title="Sair do sistema (Logout)"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Sair</span>
          </button>
        )}
      </div>
    </header>
  );
};
