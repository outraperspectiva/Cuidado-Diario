import {
  PainLog,
  SleepLog,
  ExerciseLog,
  MedicationIntake,
  ClinicalEvolutionSummary,
  BodyPart,
  PhysiotherapyPrescription,
  PhysiotherapyExecution,
  DailyPhysioAdherence,
  PhysioPeriodSummary
} from '../types';

export class AnalyticsService {
  static computeSummary(
    painLogs: PainLog[],
    sleepLogs: SleepLog[],
    exerciseLogs: ExerciseLog[],
    intakes: MedicationIntake[],
    todayExecutions: PhysiotherapyExecution[] = [],
    historyExecutions: PhysiotherapyExecution[] = [],
    prescriptions: PhysiotherapyPrescription[] = []
  ): ClinicalEvolutionSummary {
    const avgPain = painLogs.length > 0
      ? Number((painLogs.reduce((acc, curr) => acc + curr.painLevel, 0) / painLogs.length).toFixed(1))
      : 0;

    const flareUps = painLogs.filter(p => p.isFlareUp || p.painLevel >= 7).length;

    // Trigger counts
    const triggerMap: Record<string, number> = {};
    painLogs.forEach(p => {
      p.triggers.forEach(t => {
        triggerMap[t] = (triggerMap[t] || 0) + 1;
      });
    });
    const topTriggers = Object.entries(triggerMap)
      .map(([trigger, count]) => ({ trigger, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Body location counts
    const locationMap: Record<string, number> = {};
    painLogs.forEach(p => {
      p.bodyLocations.forEach(loc => {
        locationMap[loc] = (locationMap[loc] || 0) + 1;
      });
    });
    const mostAffectedAreas = Object.entries(locationMap)
      .map(([bodyPart, count]) => ({ bodyPart: bodyPart as BodyPart, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Sleep avg
    const avgSleepHours = sleepLogs.length > 0
      ? Number((sleepLogs.reduce((acc, s) => acc + s.durationHours + (s.durationMinutes / 60), 0) / sleepLogs.length).toFixed(1))
      : 0;

    // Exercise total
    const exerciseMinutesTotal = exerciseLogs.reduce((acc, e) => acc + e.durationMinutes, 0);

    // Medication adherence
    const takenCount = intakes.filter(i => i.status === 'taken').length;
    const adherence = intakes.length > 0
      ? Math.round((takenCount / intakes.length) * 100)
      : 100;

    // Physiotherapy adherence in period (last 7 days)
    const physioSummary = this.computePhysioAdherence(
      prescriptions,
      todayExecutions,
      historyExecutions,
      exerciseLogs,
      7
    );

    let painTrend: 'diminuindo' | 'estavel' | 'aumentando' = 'estavel';
    if (painLogs.length >= 2) {
      const recent = painLogs[0].painLevel;
      const older = painLogs[painLogs.length - 1].painLevel;
      if (recent < older) painTrend = 'diminuindo';
      else if (recent > older) painTrend = 'aumentando';
    }

    return {
      weekPeriod: 'Últimos 7 dias',
      averagePain: avgPain,
      painTrend,
      totalFlareUps: flareUps,
      avgSleepHours,
      exerciseMinutesTotal,
      medicationAdherencePercent: adherence,
      physioAdherencePercent: physioSummary.overallPercentage,
      topTriggers,
      mostAffectedAreas
    };
  }

  static computePhysioAdherence(
    prescriptions: PhysiotherapyPrescription[] = [],
    todayExecutions: PhysiotherapyExecution[] = [],
    historyExecutions: PhysiotherapyExecution[] = [],
    exerciseLogs: ExerciseLog[] = [],
    periodDays: number = 7
  ): PhysioPeriodSummary {
    const dailyData: DailyPhysioAdherence[] = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    for (let i = periodDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      let plannedCount = 0;
      let completedCount = 0;

      if (dateStr === todayStr) {
        plannedCount = todayExecutions.length;
        completedCount = todayExecutions.filter(e => e.status === 'completed').length;
      } else {
        const fromHistory = historyExecutions.filter(e => e.date === dateStr);
        if (fromHistory.length > 0) {
          plannedCount = fromHistory.length;
          completedCount = fromHistory.filter(e => e.status === 'completed').length;
        } else {
          // Check active prescriptions for that day
          const activeRxs = prescriptions.filter(rx => 
            rx.isActive && 
            (!rx.startDate || dateStr >= rx.startDate) && 
            (!rx.endDate || dateStr <= rx.endDate)
          );
          plannedCount = activeRxs.reduce((acc, rx) => acc + (rx.timesPerDay || rx.scheduledTimes?.length || 1), 0);
          // Check exercise logs for that day
          const dayLogs = exerciseLogs.filter(e => e.date.startsWith(dateStr));
          completedCount = dayLogs.length;
        }
      }

      // Check exercise logs on dateStr for total minutes
      const dayLogs = exerciseLogs.filter(e => e.date.startsWith(dateStr));
      const exerciseMinutes = dayLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);

      let percentage = 0;
      let status: 'completo' | 'parcial' | 'nao_realizado' | 'sem_prescricao' = 'sem_prescricao';

      if (plannedCount > 0) {
        percentage = Math.min(100, Math.round((completedCount / plannedCount) * 100));
        if (completedCount >= plannedCount) status = 'completo';
        else if (completedCount > 0) status = 'parcial';
        else status = 'nao_realizado';
      } else if (completedCount > 0) {
        percentage = 100;
        status = 'completo';
      }

      let dayLabel = '';
      if (i === 0) dayLabel = 'Hoje';
      else if (i === 1) dayLabel = 'Ontem';
      else {
        const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayLabel = weekdays[d.getDay()];
      }

      const dayNum = String(d.getDate()).padStart(2, '0');
      const monthNum = String(d.getMonth() + 1).padStart(2, '0');
      const shortDate = `${dayNum}/${monthNum}`;

      dailyData.push({
        date: dateStr,
        dayLabel,
        shortDate,
        plannedCount,
        completedCount,
        percentage,
        exerciseMinutes,
        status
      });
    }

    const totalPlanned = dailyData.reduce((acc, d) => acc + d.plannedCount, 0);
    const totalCompleted = dailyData.reduce((acc, d) => acc + d.completedCount, 0);
    const overallPercentage = totalPlanned > 0
      ? Math.min(100, Math.round((totalCompleted / totalPlanned) * 100))
      : (dailyData.filter(d => d.completedCount > 0).length > 0 ? 100 : 0);

    const daysWithFullAdherence = dailyData.filter(d => d.status === 'completo' && (d.plannedCount > 0 || d.completedCount > 0)).length;
    const totalExerciseMinutes = dailyData.reduce((acc, d) => acc + d.exerciseMinutes, 0);

    let adherenceRating: 'excelente' | 'boa' | 'moderada' | 'baixa' = 'excelente';
    if (overallPercentage >= 85) adherenceRating = 'excelente';
    else if (overallPercentage >= 70) adherenceRating = 'boa';
    else if (overallPercentage >= 50) adherenceRating = 'moderada';
    else adherenceRating = 'baixa';

    return {
      periodDays,
      dailyData,
      overallPercentage,
      totalPlanned,
      totalCompleted,
      daysWithFullAdherence,
      totalExerciseMinutes,
      adherenceRating
    };
  }
}
