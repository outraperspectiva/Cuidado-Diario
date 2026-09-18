import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setAddAppointmentOpen, showToast } from '../../store/slices/uiSlice';
import { updateAppointmentStatus, deleteAppointment } from '../../store/slices/appointmentSlice';
import { AppointmentService } from '../../services/appointmentService';
import { MedicalAppointment } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Plus,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Trash2,
  Filter
} from 'lucide-react';

export const AppointmentsAgendaSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const appointments = useAppSelector((state) => state.appointments?.appointments || []);
  const user = useAppSelector((state) => state.auth.user);

  const [activeFilter, setActiveFilter] = useState<'agendadas' | 'realizadas' | 'todas'>('agendadas');

  const filteredAppointments = appointments.filter((app) => {
    if (activeFilter === 'agendadas') return app.status === 'agendada';
    if (activeFilter === 'realizadas') return app.status === 'realizada';
    return true;
  });

  const handleMarkCompleted = async (id: string, docName: string) => {
    dispatch(updateAppointmentStatus({ id, status: 'realizada' }));
    await AppointmentService.updateStatus(user?.uid || 'melhora-user-7841', id, 'realizada');
    dispatch(showToast({ message: `Consulta com ${docName} marcada como realizada!` }));
  };

  const handleDelete = async (id: string, docName: string) => {
    dispatch(deleteAppointment(id));
    await AppointmentService.deleteAppointment(user?.uid || 'melhora-user-7841', id);
    dispatch(showToast({ message: `Consulta com ${docName} removida.` }));
  };

  const upcomingCount = appointments.filter((a) => a.status === 'agendada').length;
  const completedCount = appointments.filter((a) => a.status === 'realizada').length;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE3E8] elevation-1 space-y-4" id="section-agenda-consultas">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E2F0FD] flex items-center justify-center text-[#103557]">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#103557]">Agenda de Consultas Marcadas</h3>
            <p className="text-[11px] text-[#53606B]">Acompanhamento com médicos e profissionais de saúde</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch(setAddAppointmentOpen(true))}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#103557] hover:bg-[#2B4C6F] text-white rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Marcar Consulta</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F6F8FA] rounded-xl border border-[#EEF2F5] text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('agendadas')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all ${
            activeFilter === 'agendadas'
              ? 'bg-white text-[#103557] shadow-xs'
              : 'text-[#53606B] hover:text-[#103557]'
          }`}
        >
          Próximas Agendadas ({upcomingCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('realizadas')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all ${
            activeFilter === 'realizadas'
              ? 'bg-white text-[#103557] shadow-xs'
              : 'text-[#53606B] hover:text-[#103557]'
          }`}
        >
          Realizadas ({completedCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('todas')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all ${
            activeFilter === 'todas'
              ? 'bg-white text-[#103557] shadow-xs'
              : 'text-[#53606B] hover:text-[#103557]'
          }`}
        >
          Todas ({appointments.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#DCE3E8] rounded-2xl bg-[#F6F8FA] space-y-2">
            <Calendar className="w-8 h-8 text-[#73777F] mx-auto opacity-50" />
            <p className="text-xs font-bold text-[#103557]">
              {activeFilter === 'agendadas'
                ? 'Nenhuma consulta futura agendada no momento.'
                : 'Nenhuma consulta encontrada nesta categoria.'}
            </p>
            <p className="text-[11px] text-[#53606B] max-w-sm mx-auto">
              Registre retornos regulares com sua equipe de saúde para manter o plano terapêutico alinhado.
            </p>
            <button
              type="button"
              onClick={() => dispatch(setAddAppointmentOpen(true))}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#103557] text-white text-xs font-bold rounded-xl hover:bg-[#2B4C6F] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agendar Consulta</span>
            </button>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const [year, month, day] = app.date.split('-');
            const formattedDate = `${day}/${month}/${year}`;
            const isAgendada = app.status === 'agendada';

            return (
              <div
                key={app.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isAgendada
                    ? 'bg-white border-[#DCE3E8] hover:border-[#2B4C6F]'
                    : 'bg-[#F6F8FA] border-[#EEF2F5] opacity-90'
                }`}
              >
                {/* Top Row: Doctor, Specialty & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-extrabold shrink-0 ${
                        isAgendada
                          ? 'bg-[#E2F0FD] text-[#103557]'
                          : 'bg-[#AFF0D8] text-[#003B2E]'
                      }`}
                    >
                      <span className="text-xs">{day}</span>
                      <span className="text-[9px] uppercase -mt-1">{month}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#103557]">{app.doctorName}</h4>
                      <p className="text-[11px] font-semibold text-[#2B4C6F]">{app.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
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

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'agendada'
                          ? 'bg-[#103557] text-white'
                          : app.status === 'realizada'
                          ? 'bg-[#AFF0D8] text-[#003B2E]'
                          : 'bg-[#EEF2F5] text-[#73777F]'
                      }`}
                    >
                      {app.status === 'agendada' ? 'Agendada' : app.status === 'realizada' ? 'Realizada' : 'Cancelada'}
                    </span>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-[#F6F8FA] p-3 rounded-xl border border-[#EEF2F5] text-xs space-y-1.5 text-[#53606B]">
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
                    <p className="text-[11px] text-[#103557] pt-0.5">
                      <span className="font-bold">Motivo:</span> {app.reason}
                    </p>
                  )}

                  {app.notes && (
                    <p className="text-[11px] text-[#53606B] italic pt-0.5 border-t border-[#DCE3E8]/50 mt-1">
                      "{app.notes}"
                    </p>
                  )}

                  {app.isUrgent && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#93000A] bg-[#FFDAD6] px-2 py-0.5 rounded-md mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Consulta originada em Registro de Crise (SOS)</span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                {isAgendada && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(app.id, app.doctorName)}
                      className="text-[11px] font-semibold text-[#D96B5B] hover:text-[#93000A] flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Desmarcar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMarkCompleted(app.id, app.doctorName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E2F0FD] hover:bg-[#D0E5FC] text-[#103557] rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A]" />
                      <span>Marcar como Realizada</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
