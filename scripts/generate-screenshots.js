import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const docsDir = path.resolve('docs/screenshots');
const publicDir = path.resolve('public/screenshots');

fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

// Common SVG components
const phoneFrameStart = (title) => `
<svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#103557" />
      <stop offset="100%" stop-color="#2B4C6F" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#103557" />
      <stop offset="100%" stop-color="#2B4C6F" />
    </linearGradient>
    <linearGradient id="sosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DC2626" />
      <stop offset="100%" stop-color="#991B1B" />
    </linearGradient>
    <linearGradient id="painGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="70%" stop-color="#F97316" />
      <stop offset="100%" stop-color="#EF4444" />
    </linearGradient>
    <linearGradient id="greenBadge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>
    <filter id="cardGlow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#103557" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="750" height="1334" fill="#F8FAFC" />

  <!-- Top Mobile Status Bar -->
  <rect width="750" height="54" fill="#103557" />
  <text x="54" y="36" fill="#FFFFFF" font-size="20" font-weight="600">09:41</text>
  <circle cx="640" cy="30" r="4" fill="#FFFFFF" opacity="0.9" />
  <circle cx="654" cy="30" r="5" fill="#FFFFFF" opacity="0.9" />
  <circle cx="670" cy="30" r="6" fill="#FFFFFF" opacity="0.9" />
  <!-- Battery -->
  <rect x="690" y="22" width="34" height="16" rx="4" fill="none" stroke="#FFFFFF" stroke-width="2" />
  <rect x="694" y="25" width="22" height="10" rx="2" fill="#10B981" />
  <path d="M725 27 C727 27 728 28 728 30 L728 30 C728 32 727 33 725 33" stroke="#FFFFFF" stroke-width="2" />
`;

const bottomNav = (activeTab = 'hoje') => `
  <!-- Bottom Navigation Bar -->
  <g id="bottomNav">
    <rect x="0" y="1220" width="750" height="114" fill="#FFFFFF" filter="url(#shadow)" />
    <line x1="0" y1="1220" x2="750" y2="1220" stroke="#E2E8F0" stroke-width="1.5" />
    
    <!-- Tab 1: Hoje -->
    <g transform="translate(45, 1235)">
      <circle cx="35" cy="24" r="22" fill="${activeTab === 'hoje' ? '#EBF5FF' : 'transparent'}" />
      <path d="M25 28 L35 18 L45 28 M28 25 L28 33 L42 33 L42 25" stroke="${activeTab === 'hoje' ? '#103557' : '#94A3B8'}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <text x="35" y="52" text-anchor="middle" font-size="13" font-weight="${activeTab === 'hoje' ? '700' : '500'}" fill="${activeTab === 'hoje' ? '#103557' : '#94A3B8'}">Hoje</text>
    </g>

    <!-- Tab 2: Remédios -->
    <g transform="translate(190, 1235)">
      <circle cx="35" cy="24" r="22" fill="${activeTab === 'remedios' ? '#EBF5FF' : 'transparent'}" />
      <rect x="26" y="19" width="18" height="10" rx="5" transform="rotate(-45 35 24)" stroke="${activeTab === 'remedios' ? '#103557' : '#94A3B8'}" stroke-width="2.5" fill="none" />
      <text x="35" y="52" text-anchor="middle" font-size="13" font-weight="${activeTab === 'remedios' ? '700' : '500'}" fill="${activeTab === 'remedios' ? '#103557' : '#94A3B8'}">Remédios</text>
    </g>

    <!-- Tab 3: Dor -->
    <g transform="translate(340, 1235)">
      <circle cx="35" cy="24" r="22" fill="${activeTab === 'dor' ? '#EBF5FF' : 'transparent'}" />
      <path d="M35 16 C30 16 26 21 26 26 C26 34 35 40 35 40 C35 40 44 34 44 26 C44 21 40 16 35 16 Z" stroke="${activeTab === 'dor' ? '#103557' : '#94A3B8'}" stroke-width="2.2" fill="none" />
      <text x="35" y="52" text-anchor="middle" font-size="13" font-weight="${activeTab === 'dor' ? '700' : '500'}" fill="${activeTab === 'dor' ? '#103557' : '#94A3B8'}">Dor</text>
    </g>

    <!-- Tab 4: Fisio -->
    <g transform="translate(490, 1235)">
      <circle cx="35" cy="24" r="22" fill="${activeTab === 'fisio' ? '#EBF5FF' : 'transparent'}" />
      <path d="M27 30 L32 20 L38 28 L43 23" stroke="${activeTab === 'fisio' ? '#103557' : '#94A3B8'}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <text x="35" y="52" text-anchor="middle" font-size="13" font-weight="${activeTab === 'fisio' ? '700' : '500'}" fill="${activeTab === 'fisio' ? '#103557' : '#94A3B8'}">Fisio</text>
    </g>

    <!-- Tab 5: Evolução -->
    <g transform="translate(635, 1235)">
      <circle cx="35" cy="24" r="22" fill="${activeTab === 'evolucao' ? '#EBF5FF' : 'transparent'}" />
      <path d="M26 33 L32 26 L38 30 L44 20" stroke="${activeTab === 'evolucao' ? '#103557' : '#94A3B8'}" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <text x="35" y="52" text-anchor="middle" font-size="13" font-weight="${activeTab === 'evolucao' ? '700' : '500'}" fill="${activeTab === 'evolucao' ? '#103557' : '#94A3B8'}">Evolução</text>
    </g>

    <!-- Home Indicator bar -->
    <rect x="285" y="1312" width="180" height="5" rx="2.5" fill="#CBD5E1" />
  </g>
</svg>
`;

// Screen 1: HomeScreen (Hoje) with Blue Card, Date, SOS, Medications, Pain
function generateHomeScreenSvg() {
  return `${phoneFrameStart('Hoje')}
  <!-- App Header -->
  <g transform="translate(0, 54)">
    <rect width="750" height="85" fill="#103557" />
    <circle cx="65" cy="42" r="22" fill="#2B4C6F" />
    <path d="M57 42 C57 38 60 35 65 35 C70 35 73 38 73 42 C73 47 65 52 65 52 C65 52 57 47 57 42 Z" fill="#88C6B0" />
    <text x="100" y="38" fill="#FFFFFF" font-size="22" font-weight="700">Cuidado Diário</text>
    <text x="100" y="58" fill="#93C5FD" font-size="14" font-weight="500">Olá, Fábio Fernandez</text>

    <!-- Notification & SOS header buttons -->
    <rect x="635" y="24" width="75" height="38" rx="19" fill="#DC2626" />
    <text x="672" y="48" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">SOS</text>
  </g>

  <!-- Scroll Container Body -->
  <g transform="translate(32, 160)">
    <!-- THE PROMINENT BLUE CARD: Solicitado explicitamente com dia da semana e mês -->
    <g id="card-hoje-destaque-data" filter="url(#cardGlow)">
      <rect x="0" y="0" width="686" height="240" rx="24" fill="url(#cardGrad)" />
      
      <!-- Date Header with Icon -->
      <g transform="translate(24, 24)">
        <rect x="0" y="0" width="46" height="46" rx="14" fill="#FFFFFF" fill-opacity="0.15" />
        <!-- Calendar SVG Icon -->
        <rect x="13" y="13" width="20" height="20" rx="4" fill="none" stroke="#88C6B0" stroke-width="2" />
        <line x1="13" y1="19" x2="33" y2="19" stroke="#88C6B0" stroke-width="2" />
        <line x1="18" y1="10" x2="18" y2="14" stroke="#88C6B0" stroke-width="2" stroke-linecap="round" />
        <line x1="28" y1="10" x2="28" y2="14" stroke="#88C6B0" stroke-width="2" stroke-linecap="round" />

        <text x="58" y="22" fill="#FFFFFF" font-size="19" font-weight="700">Sexta-feira, 2 de Outubro</text>
        <text x="58" y="42" fill="#93C5FD" font-size="14" font-weight="500">Plano de Saúde Diário &amp; Cuidados</text>

        <!-- SOS Action pill button -->
        <g transform="translate(510, 4)">
          <rect x="0" y="0" width="128" height="38" rx="19" fill="url(#sosGrad)" />
          <circle cx="20" cy="19" r="6" fill="#FFFFFF" />
          <text x="70" y="24" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">SOS Crise</text>
        </g>
      </g>

      <!-- Divider line -->
      <line x1="24" y1="90" x2="662" y2="90" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1" />

      <!-- Summary metrics inside Blue Card -->
      <g transform="translate(24, 110)">
        <rect x="0" y="0" width="200" height="105" rx="16" fill="#FFFFFF" fill-opacity="0.10" />
        <text x="20" y="32" fill="#93C5FD" font-size="13" font-weight="500">Medicamentos</text>
        <text x="20" y="65" fill="#FFFFFF" font-size="28" font-weight="800">3 <tspan font-size="18" font-weight="500" fill="#93C5FD">/ 4</tspan></text>
        <rect x="20" y="78" width="160" height="8" rx="4" fill="#FFFFFF" fill-opacity="0.2" />
        <rect x="20" y="78" width="120" height="8" rx="4" fill="#10B981" />

        <rect x="218" y="0" width="200" height="105" rx="16" fill="#FFFFFF" fill-opacity="0.10" />
        <text x="238" y="32" fill="#93C5FD" font-size="13" font-weight="500">Nível de Dor</text>
        <text x="238" y="65" fill="#34D399" font-size="28" font-weight="800">3 <tspan font-size="16" font-weight="600" fill="#A7F3D0">Leve</tspan></text>
        <text x="238" y="90" fill="#93C5FD" font-size="12">Estável nas últimas 24h</text>

        <rect x="438" y="0" width="200" height="105" rx="16" fill="#FFFFFF" fill-opacity="0.10" />
        <text x="458" y="32" fill="#93C5FD" font-size="13" font-weight="500">Fisioterapia</text>
        <text x="458" y="65" fill="#FFFFFF" font-size="28" font-weight="800">1 <tspan font-size="18" font-weight="500" fill="#93C5FD">/ 2</tspan></text>
        <text x="458" y="90" fill="#88C6B0" font-size="12" font-weight="600">✓ Lombar concluído</text>
      </g>
    </g>

    <!-- Seção Medicamentos Próximos -->
    <g transform="translate(0, 270)">
      <text x="4" y="24" fill="#103557" font-size="20" font-weight="700">Medicamentos do Dia</text>
      <text x="590" y="22" fill="#2563EB" font-size="15" font-weight="600">Ver todos</text>

      <!-- Med 1: Tomado -->
      <g transform="translate(0, 42)" filter="url(#shadow)">
        <rect x="0" y="0" width="686" height="96" rx="18" fill="#FFFFFF" />
        <rect x="20" y="22" width="52" height="52" rx="16" fill="#DCFCE7" />
        <!-- Checkmark icon -->
        <path d="M38 48 L44 54 L54 42" stroke="#16A34A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        
        <text x="88" y="44" fill="#0F172A" font-size="18" font-weight="700">Dipirona Monoidratada 500mg</text>
        <text x="88" y="68" fill="#64748B" font-size="14">Horário: 08:00 • 1 comprimido • Com água</text>
        
        <rect x="546" y="30" width="118" height="36" rx="18" fill="#DCFCE7" />
        <text x="605" y="53" fill="#15803D" font-size="13" font-weight="700" text-anchor="middle">✓ Tomado</text>
      </g>

      <!-- Med 2: Pendente -->
      <g transform="translate(0, 154)" filter="url(#shadow)">
        <rect x="0" y="0" width="686" height="96" rx="18" fill="#FFFFFF" />
        <rect x="20" y="22" width="52" height="52" rx="16" fill="#FEF3C7" />
        <!-- Clock icon -->
        <circle cx="46" cy="48" r="14" fill="none" stroke="#D97706" stroke-width="2.5" />
        <polyline points="46,40 46,48 52,48" fill="none" stroke="#D97706" stroke-width="2.5" stroke-linecap="round" />
        
        <text x="88" y="44" fill="#0F172A" font-size="18" font-weight="700">Pregabalina 75mg</text>
        <text x="88" y="68" fill="#64748B" font-size="14">Horário: 14:00 • 1 cápsula • Pós-almoço</text>
        
        <!-- Button Tomar Agora -->
        <rect x="526" y="28" width="138" height="40" rx="20" fill="#103557" />
        <text x="595" y="53" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">Tomar Agora</text>
      </g>
    </g>

    <!-- Seção Registro de Dor e Bem-estar -->
    <g transform="translate(0, 555)">
      <text x="4" y="24" fill="#103557" font-size="20" font-weight="700">Acompanhamento de Sintomas</text>
      
      <g transform="translate(0, 42)" filter="url(#shadow)">
        <rect x="0" y="0" width="686" height="150" rx="18" fill="#FFFFFF" />
        <text x="24" y="38" fill="#1E293B" font-size="16" font-weight="700">Como você está se sentindo agora?</text>
        <text x="24" y="60" fill="#64748B" font-size="14">Último registro: há 3 horas (Dor nível 3 - Lombar)</text>

        <!-- Slider Bar Visual -->
        <rect x="24" y="82" width="638" height="14" rx="7" fill="url(#painGrad)" />
        <circle cx="215" cy="89" r="16" fill="#FFFFFF" stroke="#103557" stroke-width="4" filter="url(#shadow)" />

        <g transform="translate(24, 118)">
          <text x="0" y="16" fill="#10B981" font-size="13" font-weight="700">0 Sem dor</text>
          <text x="319" y="16" fill="#F59E0B" font-size="13" font-weight="700" text-anchor="middle">5 Moderada</text>
          <text x="638" y="16" fill="#EF4444" font-size="13" font-weight="700" text-anchor="end">10 Intensa</text>
        </g>
      </g>
    </g>

    <!-- Acesso Rápido a Fisioterapia & Consulta -->
    <g transform="translate(0, 780)">
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect x="0" y="0" width="330" height="120" rx="18" fill="#FFFFFF" />
        <rect x="20" y="20" width="46" height="46" rx="14" fill="#E0F2FE" />
        <path d="M35 32 L43 43 L52 35" stroke="#0284C7" stroke-width="3" fill="none" stroke-linecap="round" />
        <text x="76" y="44" fill="#0F172A" font-size="17" font-weight="700">Fisioterapia</text>
        <text x="76" y="64" fill="#64748B" font-size="13">1 sessão pendente</text>
        <text x="20" y="100" fill="#0284C7" font-size="14" font-weight="700">Abrir exercícios →</text>
      </g>

      <g transform="translate(356, 0)" filter="url(#shadow)">
        <rect x="0" y="0" width="330" height="120" rx="18" fill="#FFFFFF" />
        <rect x="20" y="20" width="46" height="46" rx="14" fill="#FCE7F3" />
        <!-- Stethoscope icon -->
        <circle cx="43" cy="43" r="12" fill="none" stroke="#BE185D" stroke-width="2.5" />
        <text x="76" y="44" fill="#0F172A" font-size="17" font-weight="700">Consulta</text>
        <text x="76" y="64" fill="#64748B" font-size="13">Qui, 08/10 às 15:30</text>
        <text x="20" y="100" fill="#BE185D" font-size="14" font-weight="700">Ver detalhes →</text>
      </g>
    </g>
  </g>

  ${bottomNav('hoje')}
`;
}

// Screen 2: MedicationScreen
function generateMedicationScreenSvg() {
  return `${phoneFrameStart('Medicamentos')}
  <!-- Top App Bar -->
  <g transform="translate(0, 54)">
    <rect width="750" height="85" fill="#103557" />
    <text x="32" y="52" fill="#FFFFFF" font-size="24" font-weight="700">Medicamentos &amp; Tratamentos</text>
    
    <rect x="520" y="24" width="198" height="42" rx="21" fill="#88C6B0" />
    <text x="619" y="50" fill="#103557" font-size="15" font-weight="800" text-anchor="middle">+ Novo Remédio</text>
  </g>

  <!-- Filter chips -->
  <g transform="translate(32, 160)">
    <rect x="0" y="0" width="110" height="42" rx="21" fill="#103557" />
    <text x="55" y="26" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">Todos (4)</text>

    <rect x="122" y="0" width="130" height="42" rx="21" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    <text x="187" y="26" fill="#64748B" font-size="14" font-weight="600" text-anchor="middle">Manhã (2)</text>

    <rect x="264" y="0" width="130" height="42" rx="21" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    <text x="329" y="26" fill="#64748B" font-size="14" font-weight="600" text-anchor="middle">Tarde (1)</text>

    <rect x="406" y="0" width="130" height="42" rx="21" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    <text x="471" y="26" fill="#64748B" font-size="14" font-weight="600" text-anchor="middle">Noite (1)</text>
  </g>

  <!-- Cards List -->
  <g transform="translate(32, 226)">
    <!-- Med Card 1 -->
    <g transform="translate(0, 0)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="154" rx="20" fill="#FFFFFF" />
      <rect x="24" y="24" width="56" height="56" rx="16" fill="#DCFCE7" />
      <path d="M42 52 L50 60 L62 46" stroke="#16A34A" stroke-width="3.5" fill="none" stroke-linecap="round" />

      <text x="96" y="50" fill="#0F172A" font-size="20" font-weight="700">Dipirona Monoidratada</text>
      <text x="96" y="74" fill="#64748B" font-size="15">500mg • Comprimido • A cada 8 horas</text>

      <rect x="96" y="94" width="105" height="32" rx="8" fill="#F1F5F9" />
      <text x="148" y="115" fill="#334155" font-size="13" font-weight="600" text-anchor="middle">⏰ 08:00, 16:00</text>

      <rect x="212" y="94" width="125" height="32" rx="8" fill="#F0FDF4" />
      <text x="274" y="115" fill="#16A34A" font-size="13" font-weight="600" text-anchor="middle">✓ Estoque: 24 cp</text>

      <rect x="526" y="32" width="136" height="40" rx="20" fill="#DCFCE7" />
      <text x="594" y="57" fill="#15803D" font-size="14" font-weight="700" text-anchor="middle">Tomado 08:00</text>
    </g>

    <!-- Med Card 2: Low Stock Warning -->
    <g transform="translate(0, 174)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="180" rx="20" fill="#FFFFFF" />
      <rect x="24" y="24" width="56" height="56" rx="16" fill="#FEF3C7" />
      <circle cx="52" cy="52" r="16" fill="none" stroke="#D97706" stroke-width="3" />
      <text x="52" y="58" fill="#D97706" font-size="20" font-weight="800" text-anchor="middle">!</text>

      <text x="96" y="50" fill="#0F172A" font-size="20" font-weight="700">Pregabalina</text>
      <text x="96" y="74" fill="#64748B" font-size="15">75mg • Cápsula • Às 14:00 e 22:00</text>

      <!-- Low Stock Banner Inside Card -->
      <rect x="24" y="94" width="638" height="36" rx="10" fill="#FEF2F2" />
      <text x="44" y="117" fill="#B91C1C" font-size="13" font-weight="700">⚠️ Estoque Baixo: Apenas 4 cápsulas restantes (Acaba em 2 dias)</text>
      <text x="590" y="117" fill="#DC2626" font-size="13" font-weight="700">Repor →</text>

      <rect x="526" y="32" width="136" height="44" rx="22" fill="#103557" />
      <text x="594" y="59" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">Registrar Dose</text>
    </g>

    <!-- Med Card 3 -->
    <g transform="translate(0, 374)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="154" rx="20" fill="#FFFFFF" />
      <rect x="24" y="24" width="56" height="56" rx="16" fill="#E0F2FE" />
      <path d="M42 52 L50 60 L62 46" stroke="#0284C7" stroke-width="3.5" fill="none" stroke-linecap="round" />

      <text x="96" y="50" fill="#0F172A" font-size="20" font-weight="700">Omeprazol</text>
      <text x="96" y="74" fill="#64748B" font-size="15">20mg • Cápsula em jejum</text>

      <rect x="96" y="94" width="125" height="32" rx="8" fill="#F1F5F9" />
      <text x="158" y="115" fill="#334155" font-size="13" font-weight="600" text-anchor="middle">⏰ 07:00 (Jejum)</text>

      <rect x="526" y="32" width="136" height="40" rx="20" fill="#DCFCE7" />
      <text x="594" y="57" fill="#15803D" font-size="14" font-weight="700" text-anchor="middle">Tomado 07:02</text>
    </g>

    <!-- Med Card 4 -->
    <g transform="translate(0, 548)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="154" rx="20" fill="#FFFFFF" />
      <rect x="24" y="24" width="56" height="56" rx="16" fill="#F3E8FF" />
      <circle cx="52" cy="52" r="16" fill="none" stroke="#7E22CE" stroke-width="3" />

      <text x="96" y="50" fill="#0F172A" font-size="20" font-weight="700">Melatonina Gotas</text>
      <text x="96" y="74" fill="#64748B" font-size="15">3 gotas • Ao deitar para sono reparador</text>

      <rect x="96" y="94" width="130" height="32" rx="8" fill="#F1F5F9" />
      <text x="161" y="115" fill="#334155" font-size="13" font-weight="600" text-anchor="middle">⏰ 22:30 (Agendado)</text>

      <rect x="526" y="32" width="136" height="40" rx="20" fill="#F1F5F9" />
      <text x="594" y="57" fill="#475569" font-size="14" font-weight="600" text-anchor="middle">Agendado</text>
    </g>
  </g>

  ${bottomNav('remedios')}
`;
}

// Screen 3: PainScreen (Escala de Dor, Regiões Anatômicas, Sintomas)
function generatePainScreenSvg() {
  return `${phoneFrameStart('Registro de Dor')}
  <!-- Top App Bar -->
  <g transform="translate(0, 54)">
    <rect width="750" height="85" fill="#103557" />
    <text x="32" y="52" fill="#FFFFFF" font-size="24" font-weight="700">Registro de Dor &amp; Sintomas</text>
    <text x="640" y="52" fill="#93C5FD" font-size="15" font-weight="600">Histórico</text>
  </g>

  <g transform="translate(32, 160)">
    <!-- Pain Intensity Card -->
    <g filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="240" rx="22" fill="#FFFFFF" />
      <text x="24" y="38" fill="#0F172A" font-size="18" font-weight="700">Intensidade da Dor (Escala EVA 0 a 10)</text>
      <text x="24" y="62" fill="#64748B" font-size="14">Deslize para selecionar o nível que você sente agora</text>

      <!-- Large Score Display -->
      <g transform="translate(300, 75)">
        <circle cx="43" cy="35" r="35" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3" />
        <text x="43" y="44" fill="#B45309" font-size="28" font-weight="800" text-anchor="middle">4</text>
        <text x="43" y="90" fill="#D97706" font-size="15" font-weight="700" text-anchor="middle">Moderada</text>
      </g>

      <!-- Color Gradient Slider -->
      <rect x="30" y="180" width="626" height="16" rx="8" fill="url(#painGrad)" />
      <!-- Indicator Knob at Level 4 (around 40%) -->
      <circle cx="280" cy="188" r="18" fill="#FFFFFF" stroke="#103557" stroke-width="5" filter="url(#shadow)" />

      <g transform="translate(30, 215)">
        <text x="0" y="10" fill="#10B981" font-size="12" font-weight="700">0 (Sem Dor)</text>
        <text x="313" y="10" fill="#F59E0B" font-size="12" font-weight="700" text-anchor="middle">5 (Moderada)</text>
        <text x="626" y="10" fill="#EF4444" font-size="12" font-weight="700" text-anchor="end">10 (Insuportável)</text>
      </g>
    </g>

    <!-- Body Location Selector -->
    <g transform="translate(0, 260)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="230" rx="22" fill="#FFFFFF" />
      <text x="24" y="38" fill="#0F172A" font-size="18" font-weight="700">Localização do Corpo</text>
      <text x="24" y="62" fill="#64748B" font-size="14">Selecione onde a dor está concentrada:</text>

      <!-- Selected Chips -->
      <g transform="translate(24, 85)">
        <rect x="0" y="0" width="180" height="44" rx="22" fill="#103557" />
        <text x="90" y="27" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">✓ Coluna Lombar</text>

        <rect x="195" y="0" width="165" height="44" rx="22" fill="#103557" />
        <text x="277" y="27" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">✓ Joelho Direito</text>

        <rect x="375" y="0" width="140" height="44" rx="22" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
        <text x="445" y="27" fill="#475569" font-size="14" font-weight="600" text-anchor="middle">Cervical</text>

        <rect x="530" y="0" width="105" height="44" rx="22" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
        <text x="582" y="27" fill="#475569" font-size="14" font-weight="600" text-anchor="middle">Ombro</text>

        <!-- Line 2 chips -->
        <rect x="0" y="60" width="145" height="44" rx="22" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
        <text x="72" y="87" fill="#475569" font-size="14" font-weight="600" text-anchor="middle">Quadril</text>

        <rect x="160" y="60" width="150" height="44" rx="22" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
        <text x="235" y="87" fill="#475569" font-size="14" font-weight="600" text-anchor="middle">Tornozelo</text>

        <rect x="325" y="60" width="170" height="44" rx="22" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
        <text x="410" y="87" fill="#475569" font-size="14" font-weight="600" text-anchor="middle">Cabeça / Enxaqueca</text>
      </g>
    </g>

    <!-- Characteristics & Triggers -->
    <g transform="translate(0, 510)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="210" rx="22" fill="#FFFFFF" />
      <text x="24" y="38" fill="#0F172A" font-size="18" font-weight="700">Tipo de Sensação &amp; Fatores</text>

      <g transform="translate(24, 60)">
        <rect x="0" y="0" width="135" height="38" rx="19" fill="#EBF5FF" stroke="#3B82F6" stroke-width="1.5" />
        <text x="67" y="24" fill="#1D4ED8" font-size="13" font-weight="700" text-anchor="middle">✓ Latejante</text>

        <rect x="150" y="0" width="135" height="38" rx="19" fill="#EBF5FF" stroke="#3B82F6" stroke-width="1.5" />
        <text x="217" y="24" fill="#1D4ED8" font-size="13" font-weight="700" text-anchor="middle">✓ Rigidez</text>

        <rect x="300" y="0" width="130" height="38" rx="19" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="365" y="24" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Queimação</text>

        <rect x="445" y="0" width="120" height="38" rx="19" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="505" y="24" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Pontada</text>

        <!-- Triggers -->
        <text x="0" y="75" fill="#475569" font-size="14" font-weight="600">Gatilho provável:</text>
        <rect x="0" y="90" width="190" height="38" rx="19" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" />
        <text x="95" y="114" fill="#B45309" font-size="13" font-weight="700" text-anchor="middle">✓ Posição Sentada Longa</text>

        <rect x="205" y="90" width="150" height="38" rx="19" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="280" y="114" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Clima Frio</text>

        <rect x="370" y="90" width="150" height="38" rx="19" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="445" y="114" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Esforço Físico</text>
      </g>
    </g>

    <!-- Save Button -->
    <g transform="translate(0, 740)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="64" rx="20" fill="#103557" />
      <text x="343" y="39" fill="#FFFFFF" font-size="18" font-weight="700" text-anchor="middle">Salvar Registro de Dor</text>
    </g>
  </g>

  ${bottomNav('dor')}
`;
}

// Screen 4: EvolutionScreen (Gráficos, KPIs, Relatórios)
function generateEvolutionScreenSvg() {
  return `${phoneFrameStart('Evolução')}
  <!-- Top App Bar -->
  <g transform="translate(0, 54)">
    <rect width="750" height="85" fill="#103557" />
    <text x="32" y="52" fill="#FFFFFF" font-size="24" font-weight="700">Evolução &amp; Relatórios</text>
    
    <rect x="520" y="24" width="198" height="42" rx="21" fill="#FFFFFF" />
    <text x="619" y="50" fill="#103557" font-size="14" font-weight="700" text-anchor="middle">📄 Exportar PDF</text>
  </g>

  <g transform="translate(32, 160)">
    <!-- Summary KPI cards -->
    <g>
      <rect x="0" y="0" width="215" height="110" rx="18" fill="#FFFFFF" filter="url(#shadow)" />
      <text x="20" y="32" fill="#64748B" font-size="13" font-weight="600">Média Dor (7d)</text>
      <text x="20" y="68" fill="#10B981" font-size="30" font-weight="800">3.2</text>
      <text x="20" y="92" fill="#10B981" font-size="12" font-weight="600">↓ 28% menor que ant.</text>

      <rect x="235" y="0" width="215" height="110" rx="18" fill="#FFFFFF" filter="url(#shadow)" />
      <text x="255" y="32" fill="#64748B" font-size="13" font-weight="600">Adesão Remédios</text>
      <text x="255" y="68" fill="#2563EB" font-size="30" font-weight="800">96%</text>
      <text x="255" y="92" fill="#2563EB" font-size="12" font-weight="600">Excelente disciplina</text>

      <rect x="470" y="0" width="216" height="110" rx="18" fill="#FFFFFF" filter="url(#shadow)" />
      <text x="490" y="32" fill="#64748B" font-size="13" font-weight="600">Sono Médio</text>
      <text x="490" y="68" fill="#7C3AED" font-size="30" font-weight="800">7.4h</text>
      <text x="490" y="92" fill="#7C3AED" font-size="12" font-weight="600">Qualidade Boa</text>
    </g>

    <!-- Weekly Pain Trend Chart -->
    <g transform="translate(0, 134)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="300" rx="22" fill="#FFFFFF" />
      <text x="24" y="38" fill="#0F172A" font-size="18" font-weight="700">Histórico de Nível de Dor (Últimos 7 Dias)</text>
      <text x="24" y="60" fill="#64748B" font-size="13">Tendência decrescente com fisioterapia e medicação regular</text>

      <!-- Chart grid lines -->
      <line x1="60" y1="90" x2="640" y2="90" stroke="#F1F5F9" stroke-width="1.5" />
      <line x1="60" y1="140" x2="640" y2="140" stroke="#F1F5F9" stroke-width="1.5" />
      <line x1="60" y1="190" x2="640" y2="190" stroke="#F1F5F9" stroke-width="1.5" />
      <line x1="60" y1="240" x2="640" y2="240" stroke="#E2E8F0" stroke-width="1.5" />

      <!-- Y Axis labels -->
      <text x="40" y="95" fill="#94A3B8" font-size="12" text-anchor="end">8</text>
      <text x="40" y="145" fill="#94A3B8" font-size="12" text-anchor="end">5</text>
      <text x="40" y="195" fill="#94A3B8" font-size="12" text-anchor="end">2</text>
      <text x="40" y="245" fill="#94A3B8" font-size="12" text-anchor="end">0</text>

      <!-- Gradient Area Under Curve -->
      <path d="M90 120 L180 145 L270 110 L360 160 L450 170 L540 190 L610 185 L610 240 L90 240 Z" fill="#88C6B0" fill-opacity="0.25" />
      <!-- Line Chart -->
      <path d="M90 120 L180 145 L270 110 L360 160 L450 170 L540 190 L610 185" fill="none" stroke="#103557" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Data point nodes -->
      <circle cx="90" cy="120" r="6" fill="#EF4444" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="180" cy="145" r="6" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="270" cy="110" r="6" fill="#EF4444" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="360" cy="160" r="6" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="450" cy="170" r="6" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="540" cy="190" r="6" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="610" cy="185" r="7" fill="#10B981" stroke="#FFFFFF" stroke-width="3" />

      <!-- X Axis Days -->
      <text x="90" y="268" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Sáb</text>
      <text x="180" y="268" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Dom</text>
      <text x="270" y="268" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Seg</text>
      <text x="360" y="268" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Ter</text>
      <text x="450" y="268" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Qua</text>
      <text x="540" y="268" fill="#64748B" font-size="13" font-weight="600" text-anchor="middle">Qui</text>
      <text x="610" y="268" fill="#103557" font-size="13" font-weight="800" text-anchor="middle">Hoje (Sex)</text>
    </g>

    <!-- Insights & Clinical Feedback Card -->
    <g transform="translate(0, 455)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="160" rx="22" fill="#FFFFFF" />
      <rect x="24" y="24" width="48" height="48" rx="14" fill="#EBF5FF" />
      <!-- Sparkle/Brain icon -->
      <path d="M48 36 L52 48 L48 60 L44 48 Z" fill="#2563EB" />
      <circle cx="48" cy="48" r="4" fill="#FFFFFF" />

      <text x="86" y="44" fill="#0F172A" font-size="18" font-weight="700">Destaque Clínico da Semana</text>
      <text x="86" y="68" fill="#16A34A" font-size="14" font-weight="700">✓ Redução de 45% nos picos agudos de dor</text>

      <text x="24" y="110" fill="#475569" font-size="14" font-weight="500">
        A combinação de pregabalina em dose contínua com as sessões diárias
      </text>
      <text x="24" y="132" fill="#475569" font-size="14" font-weight="500">
        de fisioterapia lombar proporcionou 5 dias consecutivos sem crises SOS.
      </text>
    </g>

    <!-- Physiological correlations -->
    <g transform="translate(0, 635)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="150" rx="22" fill="#FFFFFF" />
      <text x="24" y="38" fill="#0F172A" font-size="17" font-weight="700">Adesão aos Tratamentos</text>

      <g transform="translate(24, 60)">
        <text x="0" y="18" fill="#334155" font-size="14" font-weight="600">Medicamentos prescritos</text>
        <text x="638" y="18" fill="#103557" font-size="14" font-weight="800" text-anchor="end">27 de 28 doses (96%)</text>
        <rect x="0" y="28" width="638" height="10" rx="5" fill="#E2E8F0" />
        <rect x="0" y="28" width="612" height="10" rx="5" fill="#10B981" />

        <text x="0" y="65" fill="#334155" font-size="14" font-weight="600">Exercícios de Fisioterapia</text>
        <text x="638" y="65" fill="#103557" font-size="14" font-weight="800" text-anchor="end">6 de 7 dias (86%)</text>
        <rect x="0" y="75" width="638" height="10" rx="5" fill="#E2E8F0" />
        <rect x="0" y="75" width="548" height="10" rx="5" fill="#3B82F6" />
      </g>
    </g>
  </g>

  ${bottomNav('evolucao')}
`;
}

// Screen 5: LoginScreen (Autenticação, Google, Visitante)
function generateLoginScreenSvg() {
  return `
<svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="loginBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#103557" />
      <stop offset="50%" stop-color="#1A446C" />
      <stop offset="100%" stop-color="#2B4C6F" />
    </linearGradient>
    <filter id="loginShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="750" height="1334" fill="url(#loginBg)" />

  <!-- Mobile Status Bar -->
  <text x="54" y="42" fill="#FFFFFF" font-size="20" font-weight="600">09:41</text>
  <circle cx="640" cy="36" r="4" fill="#FFFFFF" opacity="0.9" />
  <circle cx="654" cy="36" r="5" fill="#FFFFFF" opacity="0.9" />
  <circle cx="670" cy="36" r="6" fill="#FFFFFF" opacity="0.9" />
  <rect x="690" y="28" width="34" height="16" rx="4" fill="none" stroke="#FFFFFF" stroke-width="2" />
  <rect x="694" y="31" width="22" height="10" rx="2" fill="#88C6B0" />

  <!-- App Logo & Branding Header -->
  <g transform="translate(375, 180)">
    <!-- Logo Circle Icon -->
    <circle cx="0" cy="0" r="54" fill="#FFFFFF" fill-opacity="0.15" />
    <circle cx="0" cy="0" r="42" fill="#FFFFFF" />
    <!-- Heart / Cross icon -->
    <path d="M-14 -4 C-22 -14 -10 -24 0 -14 C10 -24 22 -14 14 -4 L0 12 Z" fill="#103557" />
    <path d="M-5 18 L5 18 M0 13 L0 23" stroke="#88C6B0" stroke-width="3" stroke-linecap="round" />

    <text x="0" y="95" fill="#FFFFFF" font-size="34" font-weight="800" text-anchor="middle">Cuidado Diário</text>
    <text x="0" y="128" fill="#93C5FD" font-size="17" font-weight="500" text-anchor="middle">Seu companheiro diário de saúde e reabilitação</text>
  </g>

  <!-- Login Card White Container -->
  <g transform="translate(45, 370)" filter="url(#loginShadow)">
    <rect x="0" y="0" width="660" height="740" rx="32" fill="#FFFFFF" />

    <g transform="translate(45, 45)">
      <text x="0" y="24" fill="#0F172A" font-size="24" font-weight="800">Bem-vindo(a)!</text>
      <text x="0" y="52" fill="#64748B" font-size="15">Acesse para acompanhar seus medicamentos e dores</text>

      <!-- Google Sign In Button -->
      <g transform="translate(0, 85)">
        <rect x="0" y="0" width="570" height="60" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.8" />
        <!-- Google G icon -->
        <g transform="translate(24, 18)">
          <path d="M12 0 C18 0 22 4 23 9 L17 9 C16 7 14 5 12 5 C8 5 5 8 5 12 C5 16 8 19 12 19 C15 19 17 17 18 14 L12 14 L12 10 L23 10 C24 16 20 24 12 24 C5 24 0 19 0 12 C0 5 5 0 12 0 Z" fill="#4285F4" />
        </g>
        <text x="285" y="37" fill="#1E293B" font-size="16" font-weight="700" text-anchor="middle">Continuar com Conta Google</text>
      </g>

      <!-- Divider OR -->
      <g transform="translate(0, 180)">
        <line x1="0" y1="12" x2="240" y2="12" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="285" y="18" fill="#94A3B8" font-size="14" font-weight="600" text-anchor="middle">ou com e-mail</text>
        <line x1="330" y1="12" x2="570" y2="12" stroke="#E2E8F0" stroke-width="1.5" />
      </g>

      <!-- Email Field -->
      <g transform="translate(0, 225)">
        <text x="4" y="0" fill="#334155" font-size="14" font-weight="700">E-mail</text>
        <rect x="0" y="12" width="570" height="56" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="20" y="47" fill="#0F172A" font-size="16">fabio.fernandez@exemplo.com</text>
      </g>

      <!-- Password Field -->
      <g transform="translate(0, 325)">
        <text x="4" y="0" fill="#334155" font-size="14" font-weight="700">Senha</text>
        <rect x="0" y="12" width="570" height="56" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="20" y="52" fill="#0F172A" font-size="22" letter-spacing="4">••••••••••••</text>
      </g>

      <!-- Sign In Button -->
      <g transform="translate(0, 430)">
        <rect x="0" y="0" width="570" height="60" rx="18" fill="#103557" />
        <text x="285" y="37" fill="#FFFFFF" font-size="17" font-weight="700" text-anchor="middle">Entrar no Aplicativo</text>
      </g>

      <!-- Visitor Demo Mode Button -->
      <g transform="translate(0, 510)">
        <rect x="0" y="0" width="570" height="58" rx="18" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.8" />
        <text x="285" y="36" fill="#166534" font-size="16" font-weight="700" text-anchor="middle">⚡ Acessar Modo Demonstração / Visitante</text>
      </g>

      <!-- Helper tip -->
      <text x="285" y="605" fill="#94A3B8" font-size="13" text-anchor="middle">Seus dados de saúde protegidos com criptografia ponta a ponta</text>
    </g>
  </g>

  <!-- Footer Indicator -->
  <rect x="285" y="1305" width="180" height="5" rx="2.5" fill="#FFFFFF" fill-opacity="0.4" />
</svg>
`;
}

// Screen 6: PhysiotherapyScreen
function generatePhysioScreenSvg() {
  return `${phoneFrameStart('Fisioterapia')}
  <!-- Top App Bar -->
  <g transform="translate(0, 54)">
    <rect width="750" height="85" fill="#103557" />
    <text x="32" y="52" fill="#FFFFFF" font-size="24" font-weight="700">Fisioterapia &amp; Reabilitação</text>
    
    <rect x="530" y="24" width="188" height="42" rx="21" fill="#88C6B0" />
    <text x="624" y="50" fill="#103557" font-size="14" font-weight="800" text-anchor="middle">+ Prescrição</text>
  </g>

  <g transform="translate(32, 160)">
    <!-- Progress Card -->
    <g filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="130" rx="22" fill="#FFFFFF" />
      <text x="24" y="38" fill="#0F172A" font-size="18" font-weight="700">Meta Diária de Exercícios</text>
      <text x="24" y="62" fill="#64748B" font-size="14">1 de 3 exercícios realizados hoje (33%)</text>
      
      <rect x="24" y="80" width="638" height="12" rx="6" fill="#E2E8F0" />
      <rect x="24" y="80" width="210" height="12" rx="6" fill="#10B981" />
      <text x="638" y="112" fill="#10B981" font-size="13" font-weight="700" text-anchor="end">33% Concluído</text>
    </g>

    <!-- Exercise 1 (Concluído) -->
    <g transform="translate(0, 150)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="160" rx="22" fill="#FFFFFF" />
      <rect x="24" y="24" width="56" height="56" rx="16" fill="#DCFCE7" />
      <path d="M42 52 L50 60 L62 46" stroke="#16A34A" stroke-width="3.5" fill="none" stroke-linecap="round" />

      <text x="96" y="50" fill="#0F172A" font-size="20" font-weight="700">Alongamento de Coluna Lombar</text>
      <text x="96" y="74" fill="#64748B" font-size="15">Deitado de barriga para cima, abrace os joelhos</text>

      <rect x="96" y="96" width="130" height="34" rx="8" fill="#F1F5F9" />
      <text x="161" y="118" fill="#334155" font-size="13" font-weight="600" text-anchor="middle">3 séries de 30 seg</text>

      <rect x="526" y="32" width="136" height="42" rx="21" fill="#DCFCE7" />
      <text x="594" y="58" fill="#15803D" font-size="14" font-weight="700" text-anchor="middle">✓ Realizado</text>
    </g>

    <!-- Exercise 2 (Pendente com Timer) -->
    <g transform="translate(0, 330)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="180" rx="22" fill="#FFFFFF" />
      <rect x="24" y="24" width="56" height="56" rx="16" fill="#E0F2FE" />
      <!-- Dumbbell/activity icon -->
      <circle cx="52" cy="52" r="14" fill="none" stroke="#0284C7" stroke-width="3" />
      <line x1="42" y1="52" x2="62" y2="52" stroke="#0284C7" stroke-width="3" />

      <text x="96" y="50" fill="#0F172A" font-size="20" font-weight="700">Ponte para Glúteos &amp; Core</text>
      <text x="96" y="74" fill="#64748B" font-size="15">Elevação pélvica isométrica com contração de 3s</text>

      <rect x="96" y="96" width="145" height="34" rx="8" fill="#F1F5F9" />
      <text x="168" y="118" fill="#334155" font-size="13" font-weight="600" text-anchor="middle">3 séries de 12 reps</text>

      <!-- Timer Start Button -->
      <rect x="506" y="30" width="156" height="44" rx="22" fill="#103557" />
      <text x="584" y="57" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">▶ Iniciar Timer (45s)</text>

      <rect x="24" y="142" width="638" height="26" rx="6" fill="#F8FAFC" />
      <text x="36" y="160" fill="#64748B" font-size="12">Orientação: Não prenda a respiração. Mantenha os calcanhares firmes.</text>
    </g>

    <!-- Exercise 3 (Pendente) -->
    <g transform="translate(0, 530)" filter="url(#shadow)">
      <rect x="0" y="0" width="686" height="160" rx="22" fill="#FFFFFF" />
      <rect x="24" y="24" width="56" height="56" rx="16" fill="#F3E8FF" />
      <circle cx="52" cy="52" r="14" fill="none" stroke="#7E22CE" stroke-width="3" />

      <text x="96" y="50" fill="#0F172A" font-size="20" font-weight="700">Mobilidade Cervical Suave</text>
      <text x="96" y="74" fill="#64748B" font-size="15">Inclinação lateral e rotação suave do pescoço</text>

      <rect x="96" y="96" width="130" height="34" rx="8" fill="#F1F5F9" />
      <text x="161" y="118" fill="#334155" font-size="13" font-weight="600" text-anchor="middle">2 séries de 10 reps</text>

      <rect x="526" y="32" width="136" height="42" rx="21" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
      <text x="594" y="58" fill="#475569" font-size="14" font-weight="700" text-anchor="middle">Concluir</text>
    </g>
  </g>

  ${bottomNav('fisio')}
`;
}

// Master Overview Banner (Multi-device Mockup Showcase)
function generateOverviewMockupSvg() {
  return `
<svg width="1400" height="788" viewBox="0 0 1400 788" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1F33" />
      <stop offset="50%" stop-color="#103557" />
      <stop offset="100%" stop-color="#1B4670" />
    </linearGradient>
    <filter id="phoneShadow" x="-20%" y="-20%" width="140%" height="145%">
      <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="1400" height="788" fill="url(#bgGrad)" />

  <!-- Showcase Header -->
  <g transform="translate(700, 75)" text-anchor="middle">
    <rect x="-140" y="-36" width="280" height="34" rx="17" fill="#88C6B0" fill-opacity="0.2" stroke="#88C6B0" stroke-width="1.5" />
    <text x="0" y="-14" fill="#88C6B0" font-size="14" font-weight="700" letter-spacing="1">CUIDADO DIÁRIO (MELHORA)</text>
    <text x="0" y="32" fill="#FFFFFF" font-size="36" font-weight="800">Interface &amp; Telas do Aplicativo</text>
    <text x="0" y="62" fill="#93C5FD" font-size="18">Gestão de Saúde, Controle Medicamentoso, Registro de Dores e Reabilitação</text>
  </g>

  <!-- 3 Phones in Showcase Layout -->
  
  <!-- Left Phone: Medicamentos -->
  <g transform="translate(110, 185) scale(0.42)" filter="url(#phoneShadow)">
    <rect x="-16" y="-16" width="782" height="1366" rx="56" fill="#1E293B" stroke="#475569" stroke-width="4" />
    <rect x="0" y="0" width="750" height="1334" rx="42" fill="#F8FAFC" />
    <!-- Screen Header content -->
    <rect width="750" height="110" fill="#103557" />
    <text x="32" y="70" fill="#FFFFFF" font-size="28" font-weight="700">Medicamentos &amp; Doses</text>
    <!-- Med Cards mini -->
    <rect x="32" y="150" width="686" height="160" rx="20" fill="#FFFFFF" />
    <text x="60" y="210" fill="#0F172A" font-size="26" font-weight="700">Dipirona 500mg</text>
    <text x="60" y="250" fill="#16A34A" font-size="20" font-weight="700">✓ Tomado 08:00</text>

    <rect x="32" y="340" width="686" height="180" rx="20" fill="#FFFFFF" />
    <text x="60" y="400" fill="#0F172A" font-size="26" font-weight="700">Pregabalina 75mg</text>
    <rect x="60" y="440" width="240" height="40" rx="20" fill="#FEF2F2" />
    <text x="80" y="468" fill="#DC2626" font-size="18" font-weight="700">Alerta: Estoque Baixo</text>

    <rect x="32" y="550" width="686" height="160" rx="20" fill="#FFFFFF" />
    <text x="60" y="610" fill="#0F172A" font-size="26" font-weight="700">Omeprazol 20mg</text>
    <text x="60" y="650" fill="#16A34A" font-size="20" font-weight="700">✓ Em Jejum 07:00</text>
  </g>

  <!-- Center Phone: Hoje (Main Screen with Blue Card) - Elevated -->
  <g transform="translate(525, 145) scale(0.48)" filter="url(#phoneShadow)">
    <rect x="-18" y="-18" width="786" height="1370" rx="58" fill="#0F172A" stroke="#88C6B0" stroke-width="5" />
    <rect x="0" y="0" width="750" height="1334" rx="44" fill="#F8FAFC" />
    
    <!-- Top Bar -->
    <rect width="750" height="120" fill="#103557" />
    <text x="40" y="75" fill="#FFFFFF" font-size="30" font-weight="800">Cuidado Diário</text>
    
    <!-- The Famous Blue Card -->
    <rect x="32" y="145" width="686" height="260" rx="28" fill="#103557" />
    <text x="60" y="210" fill="#FFFFFF" font-size="26" font-weight="800">📅 Sexta-feira, 2 de Outubro</text>
    <text x="60" y="245" fill="#93C5FD" font-size="18">Plano de Saúde Diário</text>
    <rect x="520" y="175" width="160" height="48" rx="24" fill="#DC2626" />
    <text x="600" y="206" fill="#FFFFFF" font-size="18" font-weight="800" text-anchor="middle">🚨 SOS Crise</text>
    
    <!-- Inner pill stats -->
    <rect x="60" y="280" width="180" height="90" rx="16" fill="#FFFFFF" fill-opacity="0.12" />
    <text x="80" y="315" fill="#93C5FD" font-size="15">Medicamentos</text>
    <text x="80" y="352" fill="#FFFFFF" font-size="28" font-weight="800">3 / 4</text>

    <rect x="260" y="280" width="180" height="90" rx="16" fill="#FFFFFF" fill-opacity="0.12" />
    <text x="280" y="315" fill="#93C5FD" font-size="15">Dor Atual</text>
    <text x="280" y="352" fill="#34D399" font-size="28" font-weight="800">3 Leve</text>

    <rect x="460" y="280" width="180" height="90" rx="16" fill="#FFFFFF" fill-opacity="0.12" />
    <text x="480" y="315" fill="#93C5FD" font-size="15">Fisio</text>
    <text x="480" y="352" fill="#FFFFFF" font-size="28" font-weight="800">1 / 2</text>

    <!-- Daily Items below -->
    <rect x="32" y="435" width="686" height="150" rx="20" fill="#FFFFFF" />
    <text x="60" y="490" fill="#0F172A" font-size="24" font-weight="700">Dipirona Monoidratada</text>
    <text x="60" y="530" fill="#16A34A" font-size="20" font-weight="700">✓ Tomado às 08:00</text>

    <!-- Pain scale widget -->
    <rect x="32" y="615" width="686" height="180" rx="20" fill="#FFFFFF" />
    <text x="60" y="665" fill="#0F172A" font-size="24" font-weight="700">Escala de Dor EVA</text>
    <rect x="60" y="700" width="626" height="20" rx="10" fill="#10B981" />
  </g>

  <!-- Right Phone: Evolução & Relatórios -->
  <g transform="translate(970, 185) scale(0.42)" filter="url(#phoneShadow)">
    <rect x="-16" y="-16" width="782" height="1366" rx="56" fill="#1E293B" stroke="#475569" stroke-width="4" />
    <rect x="0" y="0" width="750" height="1334" rx="42" fill="#F8FAFC" />
    <!-- Screen Header content -->
    <rect width="750" height="110" fill="#103557" />
    <text x="32" y="70" fill="#FFFFFF" font-size="28" font-weight="700">Evolução &amp; Relatórios</text>
    
    <!-- Mini Chart Card -->
    <rect x="32" y="150" width="686" height="340" rx="22" fill="#FFFFFF" />
    <text x="60" y="210" fill="#0F172A" font-size="24" font-weight="700">Histórico de Dor (7 Dias)</text>
    <text x="60" y="245" fill="#10B981" font-size="20" font-weight="700">↓ Tendência Decrescente (-28%)</text>
    <path d="M80 340 L160 380 L240 330 L320 400 L400 420 L480 440 L560 435" fill="none" stroke="#103557" stroke-width="6" stroke-linecap="round" />

    <rect x="32" y="520" width="686" height="180" rx="22" fill="#FFFFFF" />
    <text x="60" y="580" fill="#0F172A" font-size="24" font-weight="700">Adesão Medicamentosa: 96%</text>
    <rect x="60" y="615" width="620" height="24" rx="12" fill="#10B981" />
  </g>
</svg>
`;
}

const screens = [
  { id: '01-tela-hoje-dashboard', name: 'Tela Hoje (Dashboard Principal)', svg: generateHomeScreenSvg() },
  { id: '02-tela-medicamentos', name: 'Tela de Medicamentos', svg: generateMedicationScreenSvg() },
  { id: '03-tela-registro-dor', name: 'Tela de Registro de Dor', svg: generatePainScreenSvg() },
  { id: '04-tela-evolucao-relatorios', name: 'Tela de Relatórios e Evolução', svg: generateEvolutionScreenSvg() },
  { id: '05-tela-login-autenticacao', name: 'Tela de Autenticação e Login', svg: generateLoginScreenSvg() },
  { id: '06-tela-fisioterapia-exercicios', name: 'Tela de Fisioterapia & Exercícios', svg: generatePhysioScreenSvg() },
  { id: 'app-mockup-overview', name: 'Visão Geral do Aplicativo', svg: generateOverviewMockupSvg() }
];

async function run() {
  console.log('Gerando imagens das telas do aplicativo...');
  
  for (const s of screens) {
    const svgPathDocs = path.join(docsDir, `${s.id}.svg`);
    const pngPathDocs = path.join(docsDir, `${s.id}.png`);
    const svgPathPublic = path.join(publicDir, `${s.id}.svg`);
    const pngPathPublic = path.join(publicDir, `${s.id}.png`);

    // Write SVG
    fs.writeFileSync(svgPathDocs, s.svg, 'utf-8');
    fs.writeFileSync(svgPathPublic, s.svg, 'utf-8');

    // Convert to PNG with Sharp
    const pngBuffer = await sharp(Buffer.from(s.svg))
      .png({ quality: 95 })
      .toBuffer();

    fs.writeFileSync(pngPathDocs, pngBuffer);
    fs.writeFileSync(pngPathPublic, pngBuffer);

    console.log(`✓ Gerado: ${s.id}.png (${pngBuffer.length} bytes) e ${s.id}.svg`);
  }

  console.log('Todas as imagens das telas foram salvas com sucesso em docs/screenshots/ e public/screenshots/!');
}

run().catch((err) => {
  console.error('Erro gerando imagens:', err);
  process.exit(1);
});
