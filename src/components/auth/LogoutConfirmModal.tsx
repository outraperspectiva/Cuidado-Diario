import React from 'react';
import { LogOut, X, ShieldCheck } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  userName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  userName = 'Fábio Fernandez',
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#DCE3E8] relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-[#53606B] hover:text-[#101D26] hover:bg-[#F6F8FA] transition-colors"
          title="Cancelar e fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFDAD6] text-[#93000A] flex items-center justify-center shrink-0 shadow-xs">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#103557]">Sair do Sistema</h3>
            <p className="text-xs text-[#53606B]">Encerrar sessão atual</p>
          </div>
        </div>

        <p className="text-xs text-[#53606B] leading-relaxed mb-4">
          Deseja realmente sair da conta de <strong className="text-[#103557]">{userName}</strong>?
        </p>

        <div className="p-3 rounded-2xl bg-[#F6F8FA] border border-[#DCE3E8] mb-5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#3D8466] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#53606B] leading-tight">
            Todos os seus registros de dor, medicamentos e rotinas estão salvos e sincronizados com segurança.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#DCE3E8] text-xs font-bold text-[#53606B] hover:bg-[#F6F8FA] hover:text-[#101D26] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            id="btn-confirm-logout"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[#BA1A1A] hover:bg-[#93000A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sim, Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
