import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { hideToast } from '../../store/slices/uiSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toastMessage, toastType } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  if (!toastMessage) return null;

  const getStyle = () => {
    switch (toastType) {
      case 'warning':
        return 'bg-[#FFDAD6] border-[#D96B5B] text-[#93000A]';
      case 'error':
        return 'bg-[#BA1A1A] border-[#BA1A1A] text-white';
      case 'info':
        return 'bg-[#103557] border-[#2B4C6F] text-white';
      default:
        return 'bg-[#003B2E] border-[#0F5443] text-white';
    }
  };

  const getIcon = () => {
    switch (toastType) {
      case 'warning':
      case 'error':
        return <AlertCircle className="w-4 h-4 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 shrink-0" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#88C6B0] shrink-0" />;
    }
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-2.5 p-3 rounded-2xl border elevation-2 text-xs font-semibold shadow-lg ${getStyle()}`}
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          <span>{toastMessage}</span>
        </div>
        <button
          onClick={() => dispatch(hideToast())}
          className="p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
