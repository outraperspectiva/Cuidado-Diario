/**
 * Utilitários de formatação de datas
 */

/**
 * Formata data e horário para o formato especificado: dd/mm/aa hh:mm
 * Exemplo: 12/09/26 15:30
 */
export function formatExerciseDateTime(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return '';

  // Se já estiver no formato dd/mm/aa hh:mm
  if (typeof dateInput === 'string' && /^\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}$/.test(dateInput)) {
    return dateInput;
  }

  let d: Date;
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, day] = dateInput.split('-').map(Number);
    // Caso venha só a data (ex: histórico anterior), usa horário padrão de treino
    d = new Date(y, m - 1, day, 9, 30);
  } else {
    d = new Date(dateInput);
  }

  if (isNaN(d.getTime())) {
    return String(dateInput);
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2); // 'aa' (ex: 26)
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Formata data para o formato: dd/mm/aa
 * Exemplo: 12/09/26
 */
export function formatSleepDate(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return '';

  // Se já estiver no formato dd/mm/aa
  if (typeof dateInput === 'string' && /^\d{2}\/\d{2}\/\d{2}$/.test(dateInput)) {
    return dateInput;
  }

  let d: Date;
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, day] = dateInput.split('-').map(Number);
    d = new Date(y, m - 1, day, 12, 0);
  } else {
    d = new Date(dateInput);
  }

  if (isNaN(d.getTime())) {
    return String(dateInput);
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2); // 'aa' (ex: 26)

  return `${day}/${month}/${year}`;
}

