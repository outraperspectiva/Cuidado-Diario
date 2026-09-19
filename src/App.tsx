import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { logout } from './store/slices/authSlice';
import { setActiveTab, showToast } from './store/slices/uiSlice';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { HomeScreen } from './components/screens/HomeScreen';
import { PainScreen } from './components/screens/PainScreen';
import { MedicationScreen } from './components/screens/MedicationScreen';
import { ActivitiesScreen } from './components/screens/ActivitiesScreen';
import { EvolutionScreen } from './components/screens/EvolutionScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AddPainLogModal } from './components/pain/AddPainLogModal';
import { QuickSosModal } from './components/pain/QuickSosModal';
import { AddAppointmentModal } from './components/appointments/AddAppointmentModal';
import { AppointmentsOverviewModal } from './components/appointments/AppointmentsOverviewModal';
import { QuickMedicationIntakeModal } from './components/medications/QuickMedicationIntakeModal';
import { QuickPhysioActivitiesModal } from './components/activities/QuickPhysioActivitiesModal';
import { AuthModal } from './components/auth/AuthModal';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';
import { LoginScreen } from './components/screens/LoginScreen';
import { UserDataSync } from './services/userDataSync';

export default function App() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const mainScrollRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    // Reset scroll to top on session start or navigation
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab, isAuthenticated, isGuestMode]);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      UserDataSync.syncUserDatabaseToStore(dispatch, user);
    } else {
      UserDataSync.clearStore(dispatch);
    }
  }, [user?.uid, isAuthenticated, dispatch]);

  const handleConfirmLogout = () => {
    dispatch(logout());
    setIsGuestMode(false);
    setIsLogoutModalOpen(false);
    dispatch(setActiveTab('hoje'));
    dispatch(
      showToast({
        message: 'Sessão encerrada com segurança. Até breve!',
        type: 'info'
      })
    );
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'hoje':
        return <HomeScreen />;
      case 'dor':
        return <PainScreen />;
      case 'medicamentos':
        return <MedicationScreen />;
      case 'atividades':
        return <ActivitiesScreen />;
      case 'evolucao':
        return <EvolutionScreen />;
      case 'perfil':
        return (
          <ProfileScreen
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={() => setIsLogoutModalOpen(true)}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] text-[#101D26] flex justify-center selection:bg-[#E2F0FD] selection:text-[#103557]">
      {/* Centered Mobile-App Shell Frame */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#F6F8FA] shadow-xl relative border-x border-[#DCE3E8]/60">
        {/* Global Toast Notification */}
        <Toast />

        {!isAuthenticated && !isGuestMode ? (
          <div className="p-4 flex-1 flex flex-col justify-start overflow-y-auto">
            <LoginScreen
              onContinueAsGuest={() => {
                setIsGuestMode(true);
                dispatch(setActiveTab('hoje'));
              }}
            />
          </div>
        ) : (
          <>
            {/* Clinical Application Header */}
            <Header
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onLogout={() => setIsLogoutModalOpen(true)}
            />

            {/* Dynamic Screen Viewport */}
            <main ref={mainScrollRef} className="flex-1 px-4 py-4 overflow-y-auto pb-24">
              {renderActiveScreen()}
            </main>

            {/* Bottom Navigation Bar */}
            <BottomNav />
          </>
        )}

        {/* Modals & Dialogs */}
        <AddPainLogModal />
        <QuickSosModal />
        <AddAppointmentModal />
        <AppointmentsOverviewModal />
        <QuickMedicationIntakeModal />
        <QuickPhysioActivitiesModal />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <LogoutConfirmModal
          isOpen={isLogoutModalOpen}
          userName={user?.name || (isGuestMode ? 'Visitante' : 'Fábio Fernandez')}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      </div>
    </div>
  );
}
