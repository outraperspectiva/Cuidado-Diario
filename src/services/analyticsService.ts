import { PainLog, SleepLog, ExerciseLog, MedicationIntake, ClinicalEvolutionSummary, BodyPart } from '../types';

export class AnalyticsService {
  static computeSummary(
    painLogs: PainLog[],
    sleepLogs: SleepLog[],
    exerciseLogs: ExerciseLog[],
    intakes: MedicationIntake[]
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
      topTriggers,
      mostAffectedAreas
    };
  }
}
