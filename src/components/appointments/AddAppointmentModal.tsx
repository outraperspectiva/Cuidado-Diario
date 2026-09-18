import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setAddAppointmentOpen, showToast } from '../../store/slices/uiSlice';
import { addAppointment } from '../../store/slices/appointmentSlice';
import { AppointmentService } from '../../services/appointmentService';
import { Calendar, Clock, MapPin, Video, User, FileText, X, Check, Stethoscope } from 'lucide-react';

const SPECIALTY_OPTIONS = [
  'Neurologia / Especialista em Dor',
  'Fisiatria & Reabilitação',
  'Ortopedia & Traumatologia',
  'Reumatologia',
  'Fisioterapia Especializada',
  'Clínica Médica / Geral',
  'Psiquiatria / Psicologia da Dor',
  'Outro Especialista'
];

export const AddAppointmentModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isAddAppointmentOpen);
  const user = useAppSelector((state) => state.auth.user);

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [doctorName, setDoctorName] = useState('Dr. Roberto Silva');
  const [specialty, setSpecialty] = useState('Neurologia / Especialista em Dor');
  const [date, setDate] = useState(tomorrowStr);
  const [time, setTime] = useState('14:00');
  const [locationType, setLocationType] = useState<'presencial' | 'telemedicina'>('presencial');
  const [clinicOrHospital, setClinicOrHospital] = useState('Clínica Integrada de Dor & Neuro');
  const [reason, setReason] = useState('Avaliação de controle de dor e ajuste terapêutico');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !date) {
      dispatch(showToast({ message: 'Preencha o nome do médico e a data da consulta.', type: 'error' }));
      return;
    }

    try {
      const newApp = await AppointmentService.createAppointment(user?.uid || 'melhora-user-7841', {
        doctorName: doctorName.trim(),
        specialty,
        date,
        time: time || '09:00',
        locationType,
        clinicOrHospital: clinicOrHospital.trim() || undefined,
        reason: reason.trim() || undefined,
        status: 'agendada',
        notes: notes.trim() || undefined
      });

      dispatch(addAppointment(newApp));
      dispatch(setAddAppointmentOpen(false));
      dispatch(showToast({ message: `Consulta com ${doctorName} agendada com sucesso!` }));
    } catch {
      dispatch(showToast({ message: 'Erro ao agendar consulta.', type: 'error' }));
    }
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
              <h2 className="text-base font-bold tracking-tight">Marcar / Agendar Consulta</h2>
              <p className="text-xs text-[#E2F0FD]/80">Acompanhamento com médicos e especialistas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setAddAppointmentOpen(false))}
            className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Doctor Name & Specialty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
                Profissional / Médico(a) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#73777F] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Ex: Dr. Roberto Silva"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#DCE3E8] rounded-xl focus:outline-none focus:border-[#103557] bg-[#F6F8FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
                Especialidade
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#DCE3E8] rounded-xl focus:outline-none focus:border-[#103557] bg-[#F6F8FA]"
              >
                {SPECIALTY_OPTIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
                Data da Consulta *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#73777F] absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#DCE3E8] rounded-xl focus:outline-none focus:border-[#103557] bg-[#F6F8FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
                Horário
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#73777F] absolute left-3 top-3" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#DCE3E8] rounded-xl focus:outline-none focus:border-[#103557] bg-[#F6F8FA]"
                />
              </div>
            </div>
          </div>

          {/* Location Type (Presencial vs Telemedicina) */}
          <div>
            <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
              Modalidade de Atendimento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocationType('presencial')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                  locationType === 'presencial'
                    ? 'bg-[#103557] text-white border-[#103557]'
                    : 'bg-[#F6F8FA] text-[#53606B] border-[#DCE3E8] hover:bg-[#EEF2F5]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Presencial</span>
              </button>

              <button
                type="button"
                onClick={() => setLocationType('telemedicina')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                  locationType === 'telemedicina'
                    ? 'bg-[#103557] text-white border-[#103557]'
                    : 'bg-[#F6F8FA] text-[#53606B] border-[#DCE3E8] hover:bg-[#EEF2F5]'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Telemedicina</span>
              </button>
            </div>
          </div>

          {/* Clinic / Location Name */}
          <div>
            <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
              {locationType === 'presencial' ? 'Clínica / Hospital / Endereço' : 'Plataforma / Link da Teleconsulta'}
            </label>
            <input
              type="text"
              value={clinicOrHospital}
              onChange={(e) => setClinicOrHospital(e.target.value)}
              placeholder={locationType === 'presencial' ? 'Ex: Clínica São Lucas, Sala 402' : 'Ex: Plataforma ConectaSaúde'}
              className="w-full px-3 py-2 text-xs border border-[#DCE3E8] rounded-xl focus:outline-none focus:border-[#103557] bg-[#F6F8FA]"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
              Motivo da Consulta
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Retorno semestral, Avaliação de Crise, Ajuste de medicação"
              className="w-full px-3 py-2 text-xs border border-[#DCE3E8] rounded-xl focus:outline-none focus:border-[#103557] bg-[#F6F8FA]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
              Orientações ou Lembretes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex: Levar exames recentes de ressonância e o relatório de evolução de dor..."
              className="w-full px-3 py-2 text-xs border border-[#DCE3E8] rounded-xl focus:outline-none focus:border-[#103557] bg-[#F6F8FA]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#EEF2F5]">
            <button
              type="button"
              onClick={() => dispatch(setAddAppointmentOpen(false))}
              className="px-4 py-2 text-xs font-bold text-[#53606B] hover:bg-[#EEF2F5] rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#103557] hover:bg-[#2B4C6F] text-white rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Agendamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
