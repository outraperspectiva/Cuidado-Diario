import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab, AppTab } from '../../store/slices/uiSlice';
import { Home, HeartPulse, Pill, TrendingUp, User } from 'lucide-react';
import { ActivityTabIcon } from './ActivityTabIcon';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const todayIntakes = useAppSelector((state) => state.medications.todayIntakes);
  const todayExecutions = useAppSelector((state) => state.exercise.todayExecutions || []);

  const pendingMedsCount = todayIntakes.filter(i => i.status === 'pending').length;
  const pendingPhysioCount = todayExecutions.filter(e => e.status === 'pending').length;

  const navItems: NavItem[] = [
    { id: 'hoje', label: 'Hoje', icon: Home },
    { id: 'dor', label: 'Dor & Sintomas', icon: HeartPulse },
    { id: 'medicamentos', label: 'Medicamentos', icon: Pill, badge: pendingMedsCount },
    { id: 'atividades', label: 'Físio & Sono', icon: ActivityTabIcon, badge: pendingPhysioCount },
    { id: 'evolucao', label: 'Evolução', icon: TrendingUp },
  ];

  return (
    <nav className="bg-white border-t border-[#DCE3E8] px-2 py-1 sticky bottom-0 z-30 shadow-[0_-4px_16px_rgba(43,76,111,0.04)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              onClick={() => dispatch(setActiveTab(item.id))}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#2B4C6F] font-bold'
                  : 'text-[#53606B] hover:text-[#103557] font-medium'
              }`}
            >
              {/* Active subtle pill background */}
              {isActive && (
                <div className="absolute inset-x-1 top-0.5 bottom-0.5 bg-[#E2F0FD] rounded-xl -z-10 transition-all" />
              )}
              
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#103557]' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#2B4C6F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight leading-none ${isActive ? 'text-[#103557]' : 'text-[#53606B]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
