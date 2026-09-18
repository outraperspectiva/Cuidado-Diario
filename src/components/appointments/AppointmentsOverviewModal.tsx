import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setAppointmentsModalOpen, setAddAppointmentOpen, setActiveTab, showToast } from '../../store/slices/uiSlice';
import { updateAppointmentStatus, deleteAppointment } from '../../store/slices/appointmentSlice';
import { AppointmentService } from '../../services/appointmentService';
import { Calendar, Clock, MapPin, Video, User, Plus, X, CheckCircle2, ChevronRight, AlertCircle, Stethoscope } from 'lucide-react';

export const AppointmentsOverviewModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isAppointmentsModalOpen);
  const appointments = useAppSelector((state) => state.appointments.appointments);
  const user = useAppSelector((state) => state.auth.user);

  if (!isOpen) return null;

  const upcoming = appointments.filter((a) => a.status === 'agendada');
  const past = appointments.filter((a) => a.status !== 'agendada');

  const handleMarkCompleted = async (id: string, docName: string) => {
    dispatch(updateAppointmentStatus({ id, status: 'realizada' }));
    await AppointmentService.updateStatus(user?.uid || 'melhora-user-7841', id, 'realizada');
    dispatch(showToast({ message: `Consulta com ${docName} marcada como realizada!` }));
  };

  const handleDelete = async (id: string, docName: string) => {
    dispatch(deleteAppointment(id));
    await AppointmentService.deleteAppointment(user?.uid || 'melhora-user-7841', id);
    dispatch(showToast({ message: `Consulta com ${docName} removida da agenda.` }));
  };

  const handleGoToEvolution = () => {
    dispatch(setAppointmentsModalOpen(false));
    dispatch(setActiveTab('evolucao'));
  };

  const handleOpenAdd = () => {
    dispatch(setAppointmentsModalOpen(false));
    dispatch(setAddAppointmentOpen(true));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#103557] to-[#2B4C6F] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Consultas & Especialistas</h2>
              <p className="text-xs text-[#E2F0FD]/80">Próximas consultas agendadas e histórico</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setAppointmentsModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action bar */}
        <div className="bg-[#F6F8FA] px-5 py-3 border-b border-[#DCE3E8] flex items-center justify-between">
          <span className="text-xs font-bold text-[#103557]">
            {upcoming.length} {upcoming.length === 1 ? 'consulta agendada' : 'consultas agendadas'}
          </span>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#103557] text-white text-xs font-bold rounded-xl hover:bg-[#2B4C6F] transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Marcar Consulta</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-[#53606B]">
              <Calendar className="w-10 h-10 text-[#73777F] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[#103557]">Nenhuma consulta futura agendada</p>
              <p className="text-[11px] text-[#53606B] mt-1">
                Agende retornos com seus médicos e terapeutas para acompanhar sua reabilitação.
              </p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-[#103557] text-white text-xs font-bold rounded-xl hover:bg-[#2B4C6F] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agendar Primeira Consulta</span>
              </button>
            </div>
          ) : (
            upcoming.map((app) => {
              const [year, month, day] = app.date.split('-');
              const formattedDate = `${day}/${month}/${year}`;

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl border border-[#DCE3E8] bg-white hover:border-[#2B4C6F] transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#E2F0FD] flex flex-col items-center justify-center text-[#103557] shrink-0 font-bold">
                        <span className="text-xs">{day}</span>
                        <span className="text-[9px] uppercase font-extrabold -mt-1 text-[#2B4C6F]">{month}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#103557]">{app.doctorName}</h4>
                        <p className="text-[11px] font-semibold text-[#2B4C6F]">{app.specialty}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        app.locationType === 'telemedicina'
                          ? 'bg-[#E2F0FD] text-[#103557]'
                          : 'bg-[#AFF0D8] text-[#003B2E]'
                      }`}
                    >
                      {app.locationType === 'telemedicina' ? (
                        <>
                          <Video className="w-3 h-3" />
                          <span>Telemedicina</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3" />
                          <span>Presencial</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="text-[11px] text-[#53606B] space-y-1 bg-[#F6F8FA] p-2.5 rounded-xl border border-[#EEF2F5]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#73777F]" />
                      <span className="font-semibold text-[#101D26]">
                        {formattedDate} às {app.time}
                      </span>
                    </div>

                    {app.clinicOrHospital && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#73777F]" />
                        <span>{app.clinicOrHospital}</span>
                      </div>
                    )}

                    {app.reason && (
                      <p className="text-[11px] text-[#103557] font-medium pt-0.5">
                        <span className="font-semibold">Motivo:</span> {app.reason}
                      </p>
                    )}

                    {app.isUrgent && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#93000A] bg-[#FFDAD6] px-2 py-0.5 rounded-md mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Agendamento vinculado a Crise Aguda</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(app.id, app.doctorName)}
                      className="text-[11px] text-[#D96B5B] hover:text-[#93000A] font-semibold"
                    >
                      Desmarcar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMarkCompleted(app.id, app.doctorName)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#E2F0FD] hover:bg-[#D0E5FC] text-[#103557] rounded-xl text-xs font-bold transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A]" />
                      <span>Marcar Realizada</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Past / Completed Section */}
          {past.length > 0 && (
            <div className="pt-3 border-t border-[#EEF2F5]">
              <h5 className="text-[11px] font-bold text-[#73777F] uppercase tracking-wider mb-2">
                Consultas Anteriores ({past.length})
              </h5>
              <div className="space-y-1.5">
                {past.slice(0, 2).map((app) => (
                  <div
                    key={app.id}
                    className="p-2.5 rounded-xl bg-[#F6F8FA] border border-[#EEF2F5] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#103557]">{app.doctorName}</span>
                      <span className="text-[#53606B] text-[11px] block">{app.specialty} • {app.date}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#00875A] bg-[#AFF0D8] px-2 py-0.5 rounded-md">
                      Realizada
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F6F8FA] border-t border-[#DCE3E8] flex items-center justify-between">
          <button
            type="button"
            onClick={handleGoToEvolution}
            className="flex items-center gap-1 text-xs font-bold text-[#2B4C6F] hover:text-[#103557]"
          >
            <span>Ver Agenda Completa na Evolução</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => dispatch(setAppointmentsModalOpen(false))}
            className="px-4 py-2 text-xs font-bold bg-[#103557] text-white rounded-xl hover:bg-[#2B4C6F]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
