import { useEffect, useMemo, useState, type Dispatch, type SetStateAction, type FormEvent, type ReactNode } from 'react'

type IconName =
  | 'activity'
  | 'admission'
  | 'alert'
  | 'balance'
  | 'bed'
  | 'bell'
  | 'check'
  | 'chevron'
  | 'clipboard'
  | 'clock'
  | 'close'
  | 'device'
  | 'document'
  | 'filter'
  | 'handoff'
  | 'medication'
  | 'more'
  | 'patients'
  | 'search'
  | 'shield'

const iconPaths: Record<IconName, ReactNode> = {
  activity: <><path d="M3 12h4l2-7 4 14 2-7h6" /></>,
  admission: <><path d="M12 4v16M4 12h16" /></>,
  alert: <><path d="M12 9v4m0 4h.01" /><path d="M10.3 3.8 2.5 17.3A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.7L13.7 3.8a2 2 0 0 0-3.4 0Z" /></>,
  balance: <><path d="M12 3v18M5 7h14M5 7l-3 6h6L5 7Zm14 0-3 6h6l-3-6ZM7 21h10" /></>,
  bed: <><path d="M3 5v14M21 19v-7a2 2 0 0 0-2-2H8V6a2 2 0 0 0-2-2H3M3 14h18M8 10H3" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  chevron: <><path d="m9 18 6-6-6-6" /></>,
  clipboard: <><path d="M9 5H6a2 2 0 0 0-2 2v13h16V7a2 2 0 0 0-2-2h-3M9 3h6v4H9zM8 12h8M8 16h6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  device: <><path d="M9 3h6v4H9zM7 7h10v14H7zM10 11h4M10 15h4" /></>,
  document: <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6" /></>,
  filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
  handoff: <><path d="M4 8h12M12 4l4 4-4 4M20 16H8M12 12l-4 4 4 4" /></>,
  medication: <><path d="M10 4 4 10a4.2 4.2 0 0 0 6 6l6-6a4.2 4.2 0 0 0-6-6ZM7 7l6 6M17 14v7M13.5 17.5h7" /></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  patients: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M9 12h6M12 9v6" /></>,
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" width={size} height={size}>
      {iconPaths[name]}
    </svg>
  )
}

type Patient = {
  id: number
  bed: string
  initials: string
  name: string
  age: number
  sex: string
  admission: string
  diagnosis: string
  stay: string
  status: 'critical' | 'warning' | 'stable'
  vitals: { label: string; value: string; unit?: string; alert?: boolean }[]
  alerts: { type: 'danger' | 'warning' | 'neutral'; icon: IconName; text: string }[]
}

type PatientClinicalRisk = { allergies: { substance: string; reaction: string; severity: string; recordedAt: string; recordedBy: string }[]; comorbidities: { condition: string; notes: string; status: string; recordedAt: string; recordedBy: string }[] }
type PatientRisksByAdmission = Record<string, PatientClinicalRisk>
type ProfessionalRole = 'medico' | 'enfermeiro' | 'tecnico'

const professionals: Record<ProfessionalRole, { initials: string; name: string; title: string; registry: string }> = {
  medico: { initials: 'LM', name: 'Dra. Larissa Menezes', title: 'Médica intensivista', registry: 'CRM-SP 145829' },
  enfermeiro: { initials: 'CT', name: 'Enf. Camila Torres', title: 'Enfermeira assistencial', registry: 'COREN-SP 598214' },
  tecnico: { initials: 'AL', name: 'Tec. André Lima', title: 'Técnico de enfermagem', registry: 'COREN-SP 1274058' },
}

const patients: Patient[] = [
  {
    id: 1, bed: '01', initials: 'MLS', name: 'Marina L. Souza', age: 68, sex: 'Feminino',
    admission: 'AI-2025-04821', diagnosis: 'Choque séptico de foco pulmonar', stay: '3º dia de UTI', status: 'critical',
    vitals: [
      { label: 'FC', value: '118', unit: 'bpm', alert: true }, { label: 'PA', value: '86/52', unit: 'mmHg', alert: true },
      { label: 'FR', value: '28', unit: 'irpm', alert: true }, { label: 'SpO₂', value: '91', unit: '%', alert: true },
      { label: 'T°C', value: '38,7', unit: '°C', alert: true },
    ],
    alerts: [
      { type: 'danger', icon: 'alert', text: 'Alergia: Dipirona' },
      { type: 'warning', icon: 'clock', text: 'Noradrenalina — checagem atrasada 18 min' },
    ],
  },
  {
    id: 2, bed: '02', initials: 'CAR', name: 'Carlos A. Ribeiro', age: 54, sex: 'Masculino',
    admission: 'AI-2025-04798', diagnosis: 'Pós-operatório de revascularização', stay: '1º dia de UTI', status: 'warning',
    vitals: [
      { label: 'FC', value: '96', unit: 'bpm' }, { label: 'PA', value: '102/64', unit: 'mmHg' },
      { label: 'FR', value: '22', unit: 'irpm' }, { label: 'SpO₂', value: '94', unit: '%' },
      { label: 'T°C', value: '37,2', unit: '°C' },
    ],
    alerts: [{ type: 'warning', icon: 'document', text: 'Evolução médica sem assinatura' }],
  },
  {
    id: 3, bed: '03', initials: 'JPF', name: 'João P. Ferreira', age: 76, sex: 'Masculino',
    admission: 'AI-2025-04667', diagnosis: 'Insuficiência respiratória aguda', stay: '6º dia de UTI', status: 'stable',
    vitals: [
      { label: 'FC', value: '82', unit: 'bpm' }, { label: 'PA', value: '118/72', unit: 'mmHg' },
      { label: 'FR', value: '18', unit: 'irpm' }, { label: 'SpO₂', value: '97', unit: '%' },
      { label: 'T°C', value: '36,5', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'check', text: 'Sem pendências críticas' }],
  },
  {
    id: 4, bed: '05', initials: 'ASP', name: 'Ana S. Pereira', age: 43, sex: 'Feminino',
    admission: 'AI-2025-04806', diagnosis: 'Pancreatite aguda grave', stay: '2º dia de UTI', status: 'warning',
    vitals: [
      { label: 'FC', value: '106', unit: 'bpm', alert: true }, { label: 'PA', value: '110/68', unit: 'mmHg' },
      { label: 'FR', value: '25', unit: 'irpm', alert: true }, { label: 'SpO₂', value: '95', unit: '%' },
      { label: 'T°C', value: '37,8', unit: '°C', alert: true },
    ],
    alerts: [
      { type: 'danger', icon: 'alert', text: 'Alergia: Penicilina' },
      { type: 'warning', icon: 'balance', text: 'Balanço hídrico pendente há 1h' },
    ],
  },
  {
    id: 5, bed: '06', initials: 'RMO', name: 'Roberto M. Oliveira', age: 61, sex: 'Masculino',
    admission: 'AI-2025-04589', diagnosis: 'Acidente vascular cerebral hemorrágico', stay: '8º dia de UTI', status: 'stable',
    vitals: [
      { label: 'FC', value: '74', unit: 'bpm' }, { label: 'PA', value: '132/78', unit: 'mmHg' },
      { label: 'FR', value: '16', unit: 'irpm' }, { label: 'SpO₂', value: '98', unit: '%' },
      { label: 'T°C', value: '36,3', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'check', text: 'Sem pendências críticas' }],
  },
  {
    id: 6, bed: '08', initials: 'ECS', name: 'Elisa C. Santos', age: 35, sex: 'Feminino',
    admission: 'AI-2025-04817', diagnosis: 'Pneumonia bacteriana grave', stay: '2º dia de UTI', status: 'warning',
    vitals: [
      { label: 'FC', value: '101', unit: 'bpm', alert: true }, { label: 'PA', value: '108/66', unit: 'mmHg' },
      { label: 'FR', value: '24', unit: 'irpm', alert: true }, { label: 'SpO₂', value: '92', unit: '%', alert: true },
      { label: 'T°C', value: '38,1', unit: '°C', alert: true },
    ],
    alerts: [{ type: 'warning', icon: 'medication', text: 'Antibiótico vence em 12 min' }],
  },
]

const navItems: { label: string; icon: IconName }[] = [
  { label: 'Painel da UTI', icon: 'activity' },
  { label: 'Pacientes', icon: 'patients' },
  { label: 'Admissão', icon: 'admission' },
  { label: 'Prescrições', icon: 'medication' },
  { label: 'Aprazamento', icon: 'clock' },
  { label: 'Checagem de enfermagem', icon: 'check' },
  { label: 'Balanço hídrico', icon: 'balance' },
  { label: 'Dispositivos invasivos', icon: 'device' },
  { label: 'Passagem de plantão', icon: 'handoff' },
]

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  }).format(date)
}

function formatLocalDateTime(date: Date) {
  return `${date.toLocaleDateString('pt-BR')} · ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

function maskBirthDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function parseBirthDate(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null
  const [day, month, year] = value.split('/').map(Number)
  const date = new Date(year, month - 1, day, 12)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  if (date > new Date()) return null
  return date
}

function Button({
  children, className = '', onClick, ariaLabel, title,
}: { children: ReactNode; className?: string; onClick?: () => void; ariaLabel?: string; title?: string }) {
  return <button className={className} onClick={onClick} aria-label={ariaLabel} title={title}>{children}</button>
}

function SummaryCard({ icon, label, value, detail, tone = '' }: {
  icon: IconName; label: string; value: string; detail: string; tone?: string
}) {
  return (
    <div className={`summary-card ${tone}`}>
      <div className="summary-icon"><Icon name={icon} size={20} /></div>
      <div>
        <div className="summary-label">{label}</div>
        <div className="summary-value">{value}</div>
        <div className="summary-detail">{detail}</div>
      </div>
    </div>
  )
}

function PatientCard({ patient, onOpen }: { patient: Patient; onOpen: () => void }) {
  return (
    <Button className={`patient-card status-${patient.status}`} onClick={onOpen} ariaLabel={`Abrir prontuário do leito ${patient.bed}`}>
      <div className="patient-card-head">
        <div className="bed-block">
          <span className="bed-label">LEITO</span>
          <strong>{patient.bed}</strong>
        </div>
        <div className="patient-identity">
          <div className="avatar">{patient.initials}</div>
          <div className="patient-copy">
            <div className="patient-name">{patient.name}</div>
            <div className="patient-meta">{patient.age} anos · {patient.admission}</div>
          </div>
        </div>
        <span className={`status-dot ${patient.status}`} />
        <Icon name="chevron" size={18} />
      </div>

      <div className="diagnosis">
        <span>HIPÓTESE DIAGNÓSTICA</span>
        <strong>{patient.diagnosis}</strong>
        <small>{patient.stay}</small>
      </div>

      <div className="vitals-grid">
        {patient.vitals.map((vital) => (
          <div className={`vital ${vital.alert ? 'abnormal' : ''}`} key={vital.label}>
            <span>{vital.label}</span>
            <strong>{vital.value}</strong>
            <small>{vital.unit}</small>
          </div>
        ))}
      </div>

      <div className="patient-alerts">
        {patient.alerts.map((alert) => (
          <div className={`patient-alert ${alert.type}`} key={alert.text}>
            <Icon name={alert.icon} size={15} />
            <span>{alert.text}</span>
          </div>
        ))}
      </div>
    </Button>
  )
}

function AvailableBedCard({ bed }: { bed: string }) {
  return (
    <div className="patient-card available-bed-card">
      <div className="available-bed-content">
        <div className="available-bed-icon"><Icon name="bed" size={22} /></div>
        <div><span>LEITO {bed}</span><strong>Disponível</strong><small>Higienizado e liberado para admissão</small></div>
      </div>
    </div>
  )
}

function SafetyHuddle() {
  return (
    <section className="safety-huddle">
      <div className="safety-huddle-title"><Icon name="shield" size={19} /><div><strong>Safety Huddle</strong><span>Visão compartilhada do turno</span></div></div>
      <div className="safety-huddle-section critical">
        <span>PACIENTES CRÍTICOS</span>
        <div><b>L01 · Choque</b><b>L03 · Ventilação mecânica</b><b>L08 · Dessaturação</b></div>
      </div>
      <div className="safety-huddle-section logistics">
        <span>LOGÍSTICA</span>
        <div><b>L01 · TC às 16:30</b><b>L05 · RX de leito pendente</b></div>
      </div>
      <div className="safety-huddle-section equipment">
        <span>UNIDADE E EQUIPAMENTOS</span>
        <div><b>Bombas: 2 em manutenção</b><b>Carro de emergência: Lacrado</b></div>
      </div>
    </section>
  )
}

const hourlyRecords = [
  { time: '09:00', fc: 118, pa: '86/52', fr: 28, spo2: 91, temp: '38,7', executor: 'Enf. Camila Torres · COREN-SP 598214', alert: true },
  { time: '08:00', fc: 112, pa: '92/58', fr: 26, spo2: 92, temp: '38,4', executor: 'Enf. Camila Torres · COREN-SP 598214', alert: true },
  { time: '07:00', fc: 104, pa: '98/61', fr: 24, spo2: 94, temp: '38,0', executor: 'Tec. André Lima · COREN-SP 1274058', alert: false },
  { time: '06:00', fc: 98, pa: '104/66', fr: 22, spo2: 95, temp: '37,8', executor: 'Tec. André Lima · COREN-SP 1274058', alert: false },
  { time: '05:00', fc: 94, pa: '108/68', fr: 21, spo2: 96, temp: '37,6', executor: 'Enf. Paula Nunes · COREN-SP 442018', alert: false },
]

function TrendChart({ values, tone = 'teal', min, max }: {
  values: number[]; tone?: 'teal' | 'red'; min: number; max: number
}) {
  const points = values.map((value, index) => {
    const x = 8 + index * (104 / Math.max(values.length - 1, 1))
    const y = 43 - ((value - min) / (max - min)) * 32
    return `${x},${Math.max(7, Math.min(43, y))}`
  }).join(' ')
  return (
    <svg className={`trend-chart ${tone}`} viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true">
      <path d="M8 42H112" className="chart-baseline" />
      <polyline points={points} />
      {points.split(' ').map((point) => {
        const [cx, cy] = point.split(',')
        return <circle key={point} cx={cx} cy={cy} r="2.2" />
      })}
    </svg>
  )
}

function PatientRecord({ patient, role, onBack, onNotify, risks }: {
  patient: Patient; role: ProfessionalRole; onBack: () => void; onNotify: (message: string) => void; risks: PatientClinicalRisk
}) {
  const [recorded, setRecorded] = useState(false)
  const [vitalInput, setVitalInput] = useState({ fc: '116', systolic: '90', diastolic: '56', fr: '27', spo2: '92', temp: '38,5', hgt: '142' })
  const [vitalHistory, setVitalHistory] = useState<Array<{ at: string; values: typeof vitalInput; executor: string }>>(() => {
    try { return JSON.parse(localStorage.getItem(`avicen-vitals-${patient.admission}`) || '[]') as Array<{ at: string; values: typeof vitalInput; executor: string }> } catch { return [] }
  })
  const [response, setResponse] = useState('')
  const [responseType, setResponseType] = useState('Médico comunicado')
  const [responseSaved, setResponseSaved] = useState(false)
  const [batchOpen, setBatchOpen] = useState(false)
  const [batchError, setBatchError] = useState(false)
  const [optionalParameters, setOptionalParameters] = useState<string[]>([])
  const [parameterToAdd, setParameterToAdd] = useState('Capnografia (EtCO₂)')
  const [batchRows, setBatchRows] = useState([
    { time: '10:00', pa: '', fc: '', fr: '', spo2: '', temp: '', hgt: '' },
    { time: '11:00', pa: '', fc: '', fr: '', spo2: '', temp: '', hgt: '' },
    { time: '12:00', pa: '', fc: '', fr: '', spo2: '', temp: '', hgt: '' },
  ])
  const [savedBatchRows, setSavedBatchRows] = useState<typeof batchRows>([])
  const professional = professionals[role]
  const numeric = (value: string) => Number(value.replace(',', '.'))
  const isAbnormal = (values: typeof vitalInput) => {
    const systolic = numeric(values.systolic)
    return numeric(values.fc) > 100 || numeric(values.fc) < 50 || systolic < 90 || numeric(values.fr) > 24 || numeric(values.spo2) < 92 || numeric(values.temp) >= 38 || numeric(values.temp) < 35.5
  }
  const isExtreme = (values: typeof vitalInput) => numeric(values.systolic) < 80 || numeric(values.spo2) < 85 || numeric(values.fc) > 140
  const baselineAbnormal = vitalHistory.length === 0 && patient.id === 1 ? [true, true] : vitalHistory.slice(-2).map((entry) => isAbnormal(entry.values))
  const recentAbnormal = [...baselineAbnormal, isAbnormal(vitalInput)].slice(-3)
  const requiresClinicalResponse = isExtreme(vitalInput) || (recentAbnormal.length === 3 && recentAbnormal.every(Boolean))
  const hasIsolatedAlert = isAbnormal(vitalInput) && !requiresClinicalResponse

  const saveVitals = () => {
    const required = Object.values(vitalInput).every((value) => value.trim() && Number.isFinite(numeric(value)) && numeric(value) > 0)
    if (!required || numeric(vitalInput.systolic) <= numeric(vitalInput.diastolic)) {
      onNotify('Revise os sinais vitais: informe valores numéricos válidos e PA sistólica maior que a diastólica.')
      return
    }
    const entry = { at: new Date().toLocaleString('pt-BR'), values: { ...vitalInput }, executor: `${professional.name} · ${professional.registry}` }
    const updated = [...vitalHistory, entry]
    setVitalHistory(updated)
    localStorage.setItem(`avicen-vitals-${patient.admission}`, JSON.stringify(updated))
    setRecorded(true)
    setResponseSaved(false)
    onNotify(requiresClinicalResponse ? 'Aferição registrada. Resposta clínica obrigatória gerada por persistência/valor crítico.' : hasIsolatedAlert ? 'Aferição registrada com alerta informativo no histórico.' : 'Sinais vitais registrados com sucesso.')
  }

  const saveResponse = () => {
    if (!response.trim()) {
      onNotify('Descreva a resposta clínica antes de registrar.')
      return
    }
    setResponseSaved(true)
    onNotify('Resposta clínica documentada no prontuário.')
  }

  const updateBatchCell = (rowIndex: number, field: keyof typeof batchRows[number], value: string) => {
    setBatchRows((current) => current.map((row, index) => index === rowIndex ? { ...row, [field]: value } : row))
  }

  const saveBatch = () => {
    const valid = batchRows.every((row) => row.pa.includes('/') && ['fc', 'fr', 'spo2', 'temp', 'hgt']
      .every((field) => Number(String(row[field as keyof typeof row]).replace(',', '.')) > 0))
    setBatchError(!valid)
    if (!valid) {
      onNotify('Revise os campos incompletos ou inválidos da grade rápida.')
      return
    }
    setSavedBatchRows(batchRows)
    const batchEntries = batchRows.map((row) => {
      const [systolic, diastolic] = row.pa.split('/')
      return { at: `${new Date().toLocaleDateString('pt-BR')} ${row.time}`, values: { fc: row.fc, systolic, diastolic, fr: row.fr, spo2: row.spo2, temp: row.temp, hgt: row.hgt }, executor: `${professional.name} · ${professional.registry}` }
    })
    const updatedHistory = [...vitalHistory, ...batchEntries]
    setVitalHistory(updatedHistory)
    localStorage.setItem(`avicen-vitals-${patient.admission}`, JSON.stringify(updatedHistory))
    setBatchOpen(false)
    onNotify('Três aferições horárias registradas em lote, vinculadas ao prontuário e consideradas na avaliação de alertas.')
  }

  const addOptionalParameter = () => {
    if (!optionalParameters.includes(parameterToAdd)) setOptionalParameters((current) => [...current, parameterToAdd])
  }

  return (
    <main className="record-page">
      <div className="record-warning">
        <div className="warning-primary"><Icon name="alert" size={21} /><div><span>ALERGIAS MEDICAMENTOSAS</span><strong>{risks.allergies.length ? risks.allergies.map((item) => `${item.substance} — ${item.reaction}`).join(' · ') : 'Nenhuma alergia registrada'}</strong></div></div>
        <div className="warning-separator" />
        <div className="warning-secondary"><Icon name="shield" size={20} /><div><span>COMORBIDADES RELEVANTES</span><strong>{risks.comorbidities.length ? risks.comorbidities.map((item) => item.condition).join(' · ') : 'Nenhuma comorbidade registrada'}</strong></div></div>
        <div className="warning-confirmed"><Icon name="check" size={14} /> Dados vinculados ao atendimento</div>
      </div>

      <div className="record-content">
        <div className="record-breadcrumb">
          <Button className="back-button" onClick={onBack}><Icon name="chevron" size={16} /> Painel da UTI</Button>
          <span>/</span><strong>Prontuário eletrônico</strong>
        </div>

        <section className="patient-hero">
          <div className="record-bed">
            <span>LEITO</span><strong>{patient.bed}</strong><small>UTI Adulto</small>
          </div>
          <div className="record-person">
            <div className="record-avatar">{patient.initials}</div>
            <div>
              <div className="record-name">{patient.name}</div>
              <div className="record-demographics">{patient.age} anos · {patient.sex} · Nascimento: 14/03/1957</div>
              <div className="record-identifiers">
                <span>Atendimento <strong>{patient.admission}</strong></span>
                <span>Prontuário <strong>PSA-0084721</strong></span>
                <span>Admissão <strong>{patient.admission}</strong></span>
              </div>
            </div>
          </div>
          <div className="record-diagnosis">
            <span>DIAGNÓSTICO PRINCIPAL</span><strong>{patient.diagnosis}</strong>
            <small>CID-10: A41.9 · {patient.stay}</small>
          </div>
        </section>

        <div className="record-tabs">
          <Button className="active">Visão geral</Button><Button>Prescrição</Button><Button>Enfermagem</Button>
          <Button>Balanço hídrico</Button><Button>Dispositivos</Button><Button>Evoluções</Button><Button>Exames</Button>
        </div>

        <section className="record-section">
          <div className="record-section-head">
            <div><div className="record-section-title">Sinais vitais e tendências</div><p>Últimas 5 aferições · Entrada Manual Beira-leito / Grade Matricial</p></div>
            <div className="last-update"><span /> Último registro manual · 09:42</div>
          </div>
          <div className="trend-grid">
            <div className="trend-card danger">
              <div className="trend-card-head"><span>Frequência cardíaca</span><b>FC</b></div>
              <div className="trend-reading"><strong>118</strong><small>bpm</small><em>↑ 6</em></div>
              <TrendChart values={[94, 98, 104, 112, 118]} tone="red" min={80} max={125} />
              <div className="trend-range">Referência: 60–100 bpm</div>
            </div>
            <div className="trend-card danger">
              <div className="trend-card-head"><span>Pressão arterial</span><b>PA</b></div>
              <div className="trend-reading"><strong>86/52</strong><small>mmHg</small><em>↓ 6</em></div>
              <TrendChart values={[108, 104, 98, 92, 86]} tone="red" min={80} max={120} />
              <div className="trend-range">PAM atual: 63 mmHg</div>
            </div>
            <div className="trend-card danger">
              <div className="trend-card-head"><span>Saturação de oxigênio</span><b>SpO₂</b></div>
              <div className="trend-reading"><strong>91</strong><small>%</small><em>↓ 1</em></div>
              <TrendChart values={[96, 95, 94, 92, 91]} tone="red" min={88} max={100} />
              <div className="trend-range">Meta prescrita: ≥ 94%</div>
            </div>
            <div className="trend-card">
              <div className="trend-card-head"><span>Temperatura</span><b>T°C</b></div>
              <div className="trend-reading"><strong>38,7</strong><small>°C</small><em className="warning">↑ 0,3</em></div>
              <TrendChart values={[37.6, 37.8, 38, 38.4, 38.7]} min={37} max={39} />
              <div className="trend-range">Referência: 35,5–37,7 °C</div>
            </div>
          </div>
          {requiresClinicalResponse ? <div className="critical-callout">
              <Icon name="alert" size={20} />
              <div><strong>{isExtreme(vitalInput) ? 'Valor crítico extremo identificado' : 'Alteração persistente por 3 aferições consecutivas'}</strong><span>Resposta clínica obrigatória conforme os limiares demonstrativos configurados. Não substitui avaliação profissional.</span></div>
              <span className="critical-chip">Resposta obrigatória</span>
            </div> : hasIsolatedAlert ? <div className="isolated-alert-badge"><Icon name="alert" size={16} /><span>Alteração isolada identificada. Resposta clínica não obrigatória; alerta informativo registrado no histórico.</span></div> : <div className="isolated-alert-badge"><Icon name="check" size={16} /><span>Sem critérios atuais para resposta clínica obrigatória.</span></div>}
        </section>

        <div className="record-columns">
          <section className="record-section hourly-section">
            <div className="record-section-head">
              <div><div className="record-section-title">Controle horário de sinais vitais</div><p>Registros assistenciais das últimas horas</p></div>
              <div className="hourly-head-actions"><Button className="secondary-button" onClick={() => setBatchOpen(!batchOpen)}>Lançamento em Lote / Grade Rápida</Button><Button className="secondary-button" onClick={() => onNotify('Histórico completo disponível no protótipo futuro.')}>Ver histórico completo</Button></div>
            </div>
            {batchOpen && <div className="batch-entry-panel">
              <div className="batch-entry-title"><div><strong>Grade rápida de aferições pendentes</strong><span>Use Tab ou Enter para avançar entre os campos</span></div><span>PA · FC · FR · SpO₂ · T°C · HGT</span></div>
              <div className="batch-grid batch-head"><span>HORÁRIO</span><span>PA</span><span>FC</span><span>FR</span><span>SpO₂</span><span>T°C</span><span>HGT</span></div>
              {batchRows.map((row, rowIndex) => <div className="batch-grid" key={row.time}>
                <strong>{row.time}</strong>
                {(['pa', 'fc', 'fr', 'spo2', 'temp', 'hgt'] as const).map((field) => <input
                  className={batchError && (!row[field] || (field === 'pa' ? !row[field].includes('/') : !(Number(row[field].replace(',', '.')) > 0))) ? 'invalid' : ''}
                  key={field}
                  value={row[field]}
                  placeholder={field === 'pa' ? '120/80' : '—'}
                  inputMode={field === 'pa' ? 'text' : 'decimal'}
                  onChange={(event) => updateBatchCell(rowIndex, field, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      const inputs = Array.from(event.currentTarget.closest('.batch-entry-panel')?.querySelectorAll('input') ?? [])
                      const next = inputs[inputs.indexOf(event.currentTarget) + 1] as HTMLInputElement | undefined
                      next?.focus()
                    }
                  }}
                />)}
              </div>)}
              {batchError && <div className="batch-validation"><Icon name="alert" size={14} />Preencha todos os campos com valores numéricos válidos. PA deve usar o formato sistólica/diastólica.</div>}
              <div className="batch-footer"><span>Executor: <strong>{professional.name} · {professional.registry}</strong></span><Button className="primary-button" onClick={saveBatch}><Icon name="check" size={15} /> Confirmar e salvar lote</Button></div>
            </div>}
            <div className="hourly-table">
              <div className="hourly-row table-head">
                <span>HORÁRIO</span><span>FC</span><span>PA</span><span>FR</span><span>SpO₂</span><span>T°C</span><span>HGT</span><span>EXECUTOR</span>
              </div>
              {recorded && (
                <div className="hourly-row new-record">
                  <strong>{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong><span>116</span><span>90/56</span><span>27</span><span>92%</span><span>38,5</span><span>142</span>
                  <div><b>Dra. Larissa Menezes</b><small>CRM-SP 145829 · agora</small></div>
                </div>
              )}
              {savedBatchRows.map((row) => <div className="hourly-row new-record" key={`batch-${row.time}`}>
                <strong>{row.time}</strong><span>{row.fc}</span><span>{row.pa}</span><span>{row.fr}</span><span>{row.spo2}%</span><span>{row.temp}</span><span>{row.hgt}</span>
                <div><b>{professional.name}</b><small>{professional.registry} · lote confirmado</small></div>
              </div>)}
              {vitalHistory.slice().reverse().map((entry, index) => (
                <div className={`hourly-row new-record ${isAbnormal(entry.values) ? 'has-alert' : ''}`} key={`${entry.at}-${index}`}>
                  <strong>{entry.at.split(' ')[1] || entry.at}</strong><span>{entry.values.fc}</span><span>{entry.values.systolic}/{entry.values.diastolic}</span><span>{entry.values.fr}</span><span>{entry.values.spo2}%</span><span>{entry.values.temp}</span><span>{entry.values.hgt}</span>
                  <div><b>{entry.executor.split(' · ')[0]}</b><small>{entry.executor.split(' · ')[1]} · registro salvo</small></div>
                </div>
              ))}
              {hourlyRecords.map((record) => (
                <div className={`hourly-row ${record.alert ? 'has-alert' : ''}`} key={record.time}>
                  <strong>{record.time}</strong><span>{record.fc}</span><span>{record.pa}</span><span>{record.fr}</span>
                  <span>{record.spo2}%</span><span>{record.temp}</span><span>{record.time === '08:00' ? '168' : '142'}</span>
                  <div><b>{record.executor.split(' · ')[0]}</b><small>{record.executor.split(' · ')[1]} · {record.time}</small></div>
                </div>
              ))}
            </div>

            <div className="entry-form">
              <div className="entry-form-head">
                <div><Icon name="admission" size={17} /><strong>Nova aferição horária</strong></div>
                <span>Horário de referência: <b>{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</b></span>
              </div>
              <div className="entry-fields">
                <label><span>FC (bpm)</span><input value={vitalInput.fc} onChange={(e) => setVitalInput((v) => ({ ...v, fc: e.target.value }))} /></label>
                <label><span>PA sistólica</span><input value={vitalInput.systolic} onChange={(e) => setVitalInput((v) => ({ ...v, systolic: e.target.value }))} /></label>
                <label><span>PA diastólica</span><input value={vitalInput.diastolic} onChange={(e) => setVitalInput((v) => ({ ...v, diastolic: e.target.value }))} /></label>
                <label><span>FR (irpm)</span><input value={vitalInput.fr} onChange={(e) => setVitalInput((v) => ({ ...v, fr: e.target.value }))} /></label>
                <label className="field-alert"><span>SpO₂ (%)</span><input value={vitalInput.spo2} onChange={(e) => setVitalInput((v) => ({ ...v, spo2: e.target.value }))} /></label>
                <label className="field-alert"><span>Temperatura (°C)</span><input value={vitalInput.temp} onChange={(e) => setVitalInput((v) => ({ ...v, temp: e.target.value }))} /></label>
                <label><span>HGT (mg/dL)</span><input value={vitalInput.hgt} onChange={(e) => setVitalInput((v) => ({ ...v, hgt: e.target.value }))} /></label>
              </div>
              <div className="optional-parameters">
                <div className="optional-parameter-add"><select value={parameterToAdd} onChange={(event) => setParameterToAdd(event.target.value)}><option>Capnografia (EtCO₂)</option><option>Pressão Intracraniana (PIC)</option><option>Pressão Intra-abdominal (PIA)</option><option>Pressão Venosa Central (PVC)</option></select><Button onClick={addOptionalParameter}><Icon name="admission" size={14} /> Adicionar Novo Parâmetro</Button></div>
                {optionalParameters.length > 0 && <div className="optional-parameter-fields">{optionalParameters.map((parameter) => <label key={parameter}><span>{parameter}</span><input placeholder="Valor" inputMode="decimal" /><Button onClick={() => setOptionalParameters((current) => current.filter((item) => item !== parameter))} ariaLabel={`Remover ${parameter}`}><Icon name="close" size={12} /></Button></label>)}</div>}
                <small>Remover um parâmetro oculta o campo ativo sem excluir medições históricas.</small>
              </div>
              <div className="entry-footer">
                <div className="executor-stamp"><div className="profile-avatar">{professional.initials}</div><div><span>Executor identificado</span><strong>{professional.name} · {professional.registry}</strong></div></div>
                <Button className="primary-button" onClick={saveVitals}><Icon name="check" size={16} /> Registrar sinais vitais</Button>
              </div>
            </div>
          </section>

          <aside className="record-side">
            {requiresClinicalResponse ? <section className="record-section response-card">
              <div className="response-head">
                <div className="response-icon"><Icon name="alert" size={20} /></div>
                <div><div className="record-section-title">Resposta clínica</div><p>Obrigatória para valores alterados</p></div>
                <span className={responseSaved ? 'completed' : ''}>{responseSaved ? 'Registrada' : 'Pendente'}</span>
              </div>
              <div className="alert-summary">
                <strong>Alerta gerado às 09:01</strong>
                <span>PA 86/52 mmHg · SpO₂ 91% · FC 118 bpm</span>
              </div>
              <div className="form-label">CONDUTA REALIZADA</div>
              <div className="response-options">
                {['Médico comunicado', 'Intervenção realizada', 'Mantida observação'].map((option) => (
                  <Button className={responseType === option ? 'active' : ''} onClick={() => setResponseType(option)} key={option}>
                    <span className="radio-dot" />{option}
                  </Button>
                ))}
              </div>
              <label className="response-text">
                <span>Descrição da resposta clínica <b>*</b></span>
                <textarea value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Descreva avaliação, profissional comunicado, orientações recebidas e intervenções realizadas..." />
              </label>
              <div className="response-meta">
                <div><Icon name="clock" size={15} /><span>Registro: {formatLocalDateTime(new Date())}</span></div>
                <div><Icon name="patients" size={15} /><span>Dra. Larissa Menezes · CRM-SP 145829</span></div>
              </div>
              <Button className="primary-button response-save" onClick={saveResponse}><Icon name="check" size={16} /> Salvar resposta clínica</Button>
            </section> : <section className="record-section isolated-response-info"><Icon name="check" size={20} /><div><div className="record-section-title">Sem resposta clínica obrigatória</div><p>A alteração isolada normalizou na aferição seguinte e permanece sinalizada no histórico.</p></div></section>}

            <section className="record-section care-summary">
              <div className="record-section-title">Resumo assistencial</div>
              <div><span>Suporte ventilatório</span><strong>Cateter nasal O₂ · 4 L/min</strong></div>
              <div><span>Dieta</span><strong>Enteral contínua · 45 mL/h</strong></div>
              <div><span>Precaução</span><strong>Contato</strong></div>
              <div><span>Risco</span><strong>Braden 12 · Morse 55</strong></div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}

type BalanceRow = {
  hour: string
  iv: number
  diet: number
  pumps: number
  urine: number
  drains: number
  other: number
}

type BalanceEntry = {
  id: number
  hour: string
  direction: 'entrada' | 'saida'
  category: string
  amount: number
  description: string
}

const balanceRows: BalanceRow[] = Array.from({ length: 24 }, (_, index) => {
  const hour = (7 + index) % 24
  return {
    hour: `${String(hour).padStart(2, '0')}:00`,
    iv: index % 3 === 0 ? 100 : 50,
    diet: 45,
    pumps: index % 4 === 0 ? 18 : 12,
    urine: [70, 85, 60, 95][index % 4],
    drains: index % 4 === 0 ? 15 : 5,
    other: index === 7 ? 120 : 0,
  }
})

function BalanceTrendChart({ values }: { values: number[] }) {
  const minimum = Math.min(0, ...values)
  const maximum = Math.max(1, ...values)
  const range = maximum - minimum || 1
  const points = values.map((value, index) => {
    const x = 8 + index * (304 / Math.max(values.length - 1, 1))
    const y = 86 - ((value - minimum) / range) * 66
    return `${x},${y}`
  }).join(' ')
  const zeroY = 86 - ((0 - minimum) / range) * 66

  return (
    <svg className="balance-trend-svg" viewBox="0 0 320 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="balanceArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M8 ${zeroY}H312`} className="balance-zero-line" />
      <polygon points={`8,86 ${points} 312,86`} className="balance-area" />
      <polyline points={points} className="balance-line" />
      {points.split(' ').filter((_, index) => index % 4 === 3).map((point) => {
        const [cx, cy] = point.split(',')
        return <circle key={point} cx={cx} cy={cy} r="2.6" />
      })}
    </svg>
  )
}

function FluidBalanceScreen({ onNotify }: { onNotify: (message: string) => void }) {
  const [entries, setEntries] = useState<BalanceEntry[]>([])
  const [direction, setDirection] = useState<'entrada' | 'saida'>('entrada')
  const [category, setCategory] = useState('Solução intravenosa')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [hour, setHour] = useState('09:00')
  const [error, setError] = useState('')
  const [pumpRate, setPumpRate] = useState('12')
  const [pumpRateDraft, setPumpRateDraft] = useState('12')
  const [rateHistory, setRateHistory] = useState([{ time: '07:00', rate: 12, professional: 'Enf. Camila Torres' }])

  const adjustedRows = useMemo(() => balanceRows.map((row, index) => {
    const projected = index > 3
    const adjusted = projected ? { ...row, iv: 0, diet: 0, pumps: Number(pumpRate), urine: 0, drains: 0, other: 0 } : { ...row }
    entries.filter((entry) => entry.hour === row.hour).forEach((entry) => {
      if (entry.category === 'Solução intravenosa') adjusted.iv += entry.amount
      if (entry.category === 'Dieta enteral') adjusted.diet += entry.amount
      if (entry.category === 'Bomba de infusão') adjusted.pumps += entry.amount
      if (entry.category === 'Diurese') adjusted.urine += entry.amount
      if (entry.category === 'Dreno') adjusted.drains += entry.amount
      if (entry.category === 'Outras saídas') adjusted.other += entry.amount
    })
    return { ...adjusted, projected }
  }), [entries, pumpRate])

  const totals = useMemo(() => adjustedRows.filter((row) => !row.projected).reduce((result, row) => ({
    iv: result.iv + row.iv,
    diet: result.diet + row.diet,
    pumps: result.pumps + row.pumps,
    urine: result.urine + row.urine,
    drains: result.drains + row.drains,
    other: result.other + row.other,
  }), { iv: 0, diet: 0, pumps: 0, urine: 0, drains: 0, other: 0 }), [adjustedRows])

  const totalInput = totals.iv + totals.diet + totals.pumps
  const totalOutput = totals.urine + totals.drains + totals.other
  const netBalance = totalInput - totalOutput
  const cumulative = adjustedRows.filter((row) => !row.projected).reduce<number[]>((values, row) => {
    const hourly = row.iv + row.diet + row.pumps - row.urine - row.drains - row.other
    values.push((values.at(-1) ?? 0) + hourly)
    return values
  }, [])

  const categories = direction === 'entrada'
    ? ['Solução intravenosa', 'Dieta enteral', 'Bomba de infusão']
    : ['Diurese', 'Dreno', 'Outras saídas']

  const changeDirection = (nextDirection: 'entrada' | 'saida') => {
    setDirection(nextDirection)
    setCategory(nextDirection === 'entrada' ? 'Solução intravenosa' : 'Diurese')
    setError('')
  }

  const addEntry = () => {
    const numericAmount = Number(amount.replace(',', '.'))
    if (!numericAmount || numericAmount <= 0) {
      setError('Informe um volume maior que zero.')
      return
    }
    if (!description.trim()) {
      setError('Descreva a solução, dieta, dispositivo ou ocorrência.')
      return
    }
    setEntries((current) => [...current, {
      id: Date.now(), hour, direction, category, amount: numericAmount, description: description.trim(),
    }])
    setAmount('')
    setDescription('')
    setError('')
    onNotify(`${direction === 'entrada' ? 'Entrada' : 'Saída'} de ${numericAmount} mL registrada às ${hour}.`)
  }

  const partialBalance = (hours: number) => adjustedRows.slice(0, hours).filter((row) => !row.projected)
    .reduce((total, row) => total + row.iv + row.diet + row.pumps - row.urine - row.drains - row.other, 0)

  const updatePumpRate = () => {
    const numericRate = Number(pumpRateDraft.replace(',', '.'))
    if (!(numericRate > 0)) {
      onNotify('Informe uma vazão de bomba válida.')
      return
    }
    setPumpRate(String(numericRate))
    setRateHistory((current) => [...current, { time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), rate: numericRate, professional: professionals.enfermeiro.name }])
    onNotify(`Vazão ajustada para ${numericRate} mL/h. Projeções futuras recalculadas.`)
  }

  return (
    <main className="balance-page">
      <div className="balance-content">
        <div className="balance-page-heading">
          <div>
            <div className="page-title">Balanço hídrico</div>
            <p>Controle horário de entradas, saídas e saldo acumulado nas últimas 24 horas</p>
          </div>
          <div className="balance-period"><Icon name="clock" size={17} /><div><span>PERÍODO ATUAL</span><strong>{new Date().toLocaleDateString('pt-BR')} às 07:00 — {new Date(Date.now() + 86400000).toLocaleDateString('pt-BR')} às 06:59 · Agora {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong></div></div>
        </div>

        <section className="balance-patient-bar">
          <div className="balance-bed"><span>LEITO</span><strong>01</strong></div>
          <div className="balance-patient-avatar">MLS</div>
          <div className="balance-patient-data">
            <strong>Marina L. Souza</strong>
            <span>68 anos · Feminino · AI-2025-04821</span>
          </div>
          <div className="balance-diagnosis"><span>DIAGNÓSTICO</span><strong>Choque séptico de foco pulmonar</strong></div>
          <div className="balance-weight"><span>PESO ATUAL</span><strong>72,4 kg</strong><small>20/06 · 06:15</small></div>
          <Button className="secondary-button" onClick={() => onNotify('Seleção de paciente disponível na próxima etapa.')}>Trocar paciente</Button>
        </section>

        <section className="balance-summary">
          <div className="balance-stat input">
            <div className="balance-stat-icon"><Icon name="admission" size={20} /></div>
            <div><span>TOTAL DE ENTRADAS</span><strong>{totalInput.toLocaleString('pt-BR')} <small>mL</small></strong><em>{(totalInput / 72.4).toFixed(1).replace('.', ',')} mL/kg</em></div>
          </div>
          <div className="balance-stat output">
            <div className="balance-stat-icon"><Icon name="handoff" size={20} /></div>
            <div><span>TOTAL DE SAÍDAS</span><strong>{totalOutput.toLocaleString('pt-BR')} <small>mL</small></strong><em>Diurese: {(totals.urine / 72.4 / 24).toFixed(1).replace('.', ',')} mL/kg/h</em></div>
          </div>
          <div className={`balance-stat net ${netBalance > 500 ? 'warning' : ''}`}>
            <div className="balance-stat-icon"><Icon name="balance" size={20} /></div>
            <div><span>SALDO ACUMULADO 24H</span><strong>{netBalance > 0 ? '+' : ''}{netBalance.toLocaleString('pt-BR')} <small>mL</small></strong><em>{netBalance > 500 ? 'Acima da meta prescrita' : 'Dentro da meta prescrita'}</em></div>
          </div>
          <div className="balance-goal">
            <span>META PRESCRITA</span><strong>0 a +500 mL / 24h</strong>
            <progress className="goal-track" max="700" value={Math.min(700, Math.max(0, netBalance))} />
            <small>Definida pela equipe médica às 07:18</small>
          </div>
        </section>

        <div className="balance-layout">
          <section className="balance-main-column">
            <div className="record-section balance-table-card">
              <div className="record-section-head">
                <div><div className="record-section-title">Registro horário</div><p>Volumes em mililitros (mL) · Lançamentos agrupados por hora</p></div>
                <div className="balance-legend"><span className="input-dot" /> Realizado <span className="output-dot" /> Saídas <span className="projected-dot" /> Projetado</div>
              </div>
              <div className="balance-table-wrap">
                <div className="balance-table grouped-head">
                  <span>HORÁRIO</span><strong>ENTRADAS</strong><strong>SAÍDAS</strong><span>SALDO / H</span><span>ACUMULADO</span>
                </div>
                <div className="balance-table column-head">
                  <span /><span>EV</span><span>DIETA</span><span>BOMBAS</span><span>URINA</span><span>DRENOS</span><span>OUTROS</span><span /><span />
                </div>
                <div className="balance-table-body">
                  {adjustedRows.map((row, index) => {
                    const input = row.iv + row.diet + row.pumps
                    const output = row.urine + row.drains + row.other
                    const net = input - output
                    return (
                      <div className={`balance-table data-row ${row.hour === '10:00' ? 'current' : ''} ${row.projected ? 'projected' : ''}`} key={row.hour}>
                        <strong>{row.hour}</strong>
                        <span>{row.projected ? '···' : row.iv || '—'}</span><span>{row.projected ? '···' : row.diet || '—'}</span><span>{row.pumps || '—'}{row.projected ? '*' : ''}</span>
                        <span>{row.projected ? '···' : row.urine || '—'}</span><span>{row.projected ? '···' : row.drains || '—'}</span><span>{row.projected ? '···' : row.other || '—'}</span>
                        <b className={row.projected ? 'projected-value' : net < 0 ? 'negative' : 'positive'}>{row.projected ? 'Proj.' : `${net > 0 ? '+' : ''}${net}`}</b>
                        <b className={row.projected ? 'projected-value' : (cumulative[index] ?? 0) < 0 ? 'negative' : 'positive'}>{row.projected ? '—' : `${(cumulative[index] ?? 0) > 0 ? '+' : ''}${cumulative[index]}`}</b>
                      </div>
                    )
                  })}
                </div>
                <div className="balance-table balance-subtotal-row"><strong>Balanço Parcial - 6 Horas</strong><span /><span /><span /><span /><span /><span /><b>{partialBalance(6) > 0 ? '+' : ''}{partialBalance(6)} mL</b><b>Realizado</b></div>
                <div className="balance-table balance-subtotal-row"><strong>Balanço Parcial - 12 Horas</strong><span /><span /><span /><span /><span /><span /><b>{partialBalance(12) > 0 ? '+' : ''}{partialBalance(12)} mL</b><b>Realizado</b></div>
                <div className="balance-table total-row">
                  <strong>Balanço Acumulado - 24 Horas</strong><span>{totals.iv}</span><span>{totals.diet}</span><span>{totals.pumps}</span>
                  <span>{totals.urine}</span><span>{totals.drains}</span><span>{totals.other}</span>
                  <b>{netBalance > 0 ? '+' : ''}{netBalance}</b><b>{netBalance > 0 ? '+' : ''}{netBalance}</b>
                </div>
              </div>
            </div>

            <div className="record-section balance-trend-card">
              <div className="record-section-head">
                <div><div className="record-section-title">Tendência do saldo acumulado</div><p>Evolução horária nas últimas 24 horas</p></div>
                <div className="trend-current"><span>Saldo atual</span><strong>{netBalance > 0 ? '+' : ''}{netBalance} mL</strong></div>
              </div>
              <div className="balance-chart-area">
                <div className="balance-y-labels"><span>+700</span><span>+350</span><span>0 mL</span></div>
                <div className="balance-chart">
                  <div className="goal-zone">Faixa da meta</div>
                  <BalanceTrendChart values={cumulative} />
                  <div className="balance-x-labels"><span>10h</span><span>14h</span><span>18h</span><span>22h</span><span>02h</span><span>06h</span><span>09h</span></div>
                </div>
              </div>
            </div>
          </section>

          <aside className="balance-side-column">
            <section className="record-section infusion-rate-card">
              <div className="balance-entry-head"><div className="summary-icon"><Icon name="medication" size={18} /></div><div><div className="record-section-title">Infusão contínua vasoativa</div><p>Noradrenalina · vazão base programada</p></div></div>
              <label><span>Vazão atual (mL/h)</span><div><input value={pumpRateDraft} onChange={(event) => setPumpRateDraft(event.target.value)} inputMode="decimal" /><Button onClick={updatePumpRate}>Registrar ajuste</Button></div></label>
              <div className="rate-history">{rateHistory.slice().reverse().map((item, index) => <div key={`${item.time}-${index}`}><strong>{item.rate} mL/h</strong><span>{item.time} · {item.professional}</span></div>)}</div>
              <small>* A nova vazão é projetada somente nas horas futuras. Valores projetados não compõem o balanço realizado.</small>
            </section>
            <section className="record-section balance-entry-card">
              <div className="balance-entry-head">
                <div className="summary-icon"><Icon name="admission" size={18} /></div>
                <div><div className="record-section-title">Novo lançamento</div><p>Registre uma entrada ou saída</p></div>
              </div>
              <div className="balance-toggle">
                <Button className={direction === 'entrada' ? 'active input' : ''} onClick={() => changeDirection('entrada')}>Entrada</Button>
                <Button className={direction === 'saida' ? 'active output' : ''} onClick={() => changeDirection('saida')}>Saída</Button>
              </div>
              <div className="balance-form">
                <label><span>Horário <b>*</b></span><select value={hour} onChange={(event) => setHour(event.target.value)}>{balanceRows.slice(0, 4).map((row) => <option key={row.hour}>{row.hour}</option>)}</select></label>
                <label><span>Categoria <b>*</b></span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Volume (mL) <b>*</b></span><input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="Ex.: 250" /></label>
                <label><span>Descrição <b>*</b></span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder={direction === 'entrada' ? 'Ex.: SF 0,9% em acesso central' : 'Ex.: Diurese por sonda vesical'} /></label>
                {error && <div className="balance-form-error"><Icon name="alert" size={15} /><span>{error}</span></div>}
                <div className="balance-executor">
                  <div className="profile-avatar">LM</div>
                  <div><span>Executor identificado</span><strong>Dra. Larissa Menezes</strong><small>CRM-SP 145829 · agora</small></div>
                </div>
                <Button className="primary-button balance-submit" onClick={addEntry}><Icon name="check" size={16} /> Registrar lançamento</Button>
              </div>
            </section>

            <section className="record-section balance-breakdown">
              <div className="record-section-title">Composição das 24 horas</div>
              <div className="breakdown-group"><strong>Entradas</strong>
                <div><span>Soluções intravenosas</span><b>{totals.iv} mL</b></div>
                <div><span>Dieta enteral</span><b>{totals.diet} mL</b></div>
                <div><span>Bombas de infusão</span><b>{totals.pumps} mL</b></div>
              </div>
              <div className="breakdown-group output"><strong>Saídas</strong>
                <div><span>Diurese</span><b>{totals.urine} mL</b></div>
                <div><span>Drenos</span><b>{totals.drains} mL</b></div>
                <div><span>Outras perdas</span><b>{totals.other} mL</b></div>
              </div>
            </section>

            {entries.length > 0 && (
              <section className="record-section latest-entries">
                <div className="record-section-title">Lançamentos nesta sessão</div>
                {entries.slice().reverse().map((entry) => (
                  <div key={entry.id}><span className={entry.direction}>{entry.direction === 'entrada' ? '+' : '−'}{entry.amount} mL</span><div><strong>{entry.category}</strong><small>{entry.hour} · {entry.description}</small></div></div>
                ))}
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}

const prescribedMedications = [
  { id: 1, name: 'Ceftriaxona', dose: '2 g', route: 'EV', frequency: '24/24h', times: ['10:00'], status: 'Ativa', note: 'Diluir em 100 mL de SF 0,9%' },
  { id: 2, name: 'Noradrenalina', dose: '0,12 mcg/kg/min', route: 'EV', frequency: 'Contínua', times: ['Contínuo'], status: 'Em infusão', note: 'Bomba de infusão · acesso venoso central' },
  { id: 3, name: 'Enoxaparina', dose: '40 mg', route: 'SC', frequency: '24/24h', times: ['20:00'], status: 'Ativa', note: 'Administrar em região abdominal' },
  { id: 4, name: 'Omeprazol', dose: '40 mg', route: 'EV', frequency: '24/24h', times: ['08:00'], status: 'Ativa', note: 'Diluir conforme protocolo institucional' },
  { id: 5, name: 'Insulina regular', dose: 'Conforme glicemia', route: 'SC', frequency: '6/6h', times: ['00:00', '06:00', '12:00', '18:00'], status: 'Ativa', note: 'Conforme escala de correção prescrita' },
]

const scheduleHours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00']
type MedicationSchedule = Record<number, string[]>
type SchedulesByBed = Record<string, MedicationSchedule>
type MedicationOrder = typeof prescribedMedications[number]

function MedicationPatientBar({ patient = patients[0], risks }: { patient?: Patient; risks?: PatientClinicalRisk }) {
  return (
    <section className="med-patient-bar">
      <div className="med-bed"><span>LEITO</span><strong>{patient.bed}</strong></div>
      <div className="balance-patient-avatar">{patient.initials}</div>
      <div className="balance-patient-data"><strong>{patient.name}</strong><span>{patient.age} anos · {patient.sex} · {patient.admission}</span></div>
      <div className="balance-diagnosis"><span>DIAGNÓSTICO PRINCIPAL</span><strong>{patient.diagnosis}</strong></div>
      <div className="med-allergy-chip"><Icon name="alert" size={16} /><div><span>ALERGIAS</span><strong>{risks?.allergies.length ? risks.allergies.map((item) => item.substance).join(' · ') : 'Nenhuma registrada'}</strong></div></div>
    </section>
  )
}

function AccessRestricted({ requiredRole, currentRole, onChangeRole }: {
  requiredRole: ProfessionalRole; currentRole: ProfessionalRole; onChangeRole: (role: ProfessionalRole) => void
}) {
  const nurse = requiredRole === 'enfermeiro'
  const physician = requiredRole === 'medico'
  return (
    <div className="access-restricted">
      <div className="access-icon"><Icon name="shield" size={28} /></div>
      <div className="access-kicker">ACESSO RESTRITO POR PERFIL</div>
      <div className="access-title">{physician ? 'Prescrição exclusiva do médico' : nurse ? 'Aprazamento exclusivo do enfermeiro' : 'Checagem exclusiva do técnico de enfermagem'}</div>
      <p>{physician ? 'Somente profissionais com perfil médico podem acessar e editar prescrições.' : nurse
        ? 'Somente profissionais com perfil de enfermeiro podem definir ou alterar os horários de administração.'
        : 'Somente profissionais com perfil de técnico de enfermagem podem registrar a administração dos medicamentos.'}</p>
      <div className="access-current"><span>Perfil conectado</span><strong>{professionals[currentRole].name} · {professionals[currentRole].title}</strong></div>
      <Button className="primary-button" onClick={() => onChangeRole(requiredRole)}>
        Simular acesso como {physician ? 'médica' : nurse ? 'enfermeira' : 'técnico de enfermagem'} <Icon name="chevron" size={16} />
      </Button>
      <small>Este controle existe apenas para demonstração do protótipo.</small>
    </div>
  )
}

function PrescriptionScreen({ role, onChangeRole, onNotify, medications, onMedicationAdd, patient, risks, activePatients, onPatientChange }: { role: ProfessionalRole; onChangeRole: (role: ProfessionalRole) => void; onNotify: (message: string) => void; medications: MedicationOrder[]; onMedicationAdd: (medication: MedicationOrder) => void; patient: Patient; risks: PatientClinicalRisk; activePatients: Patient[]; onPatientChange: (bed: string) => void }) {
  const [medication, setMedication] = useState('Dipirona')
  const [dose, setDose] = useState('1 g')
  const [route, setRoute] = useState('EV')
  const [frequency, setFrequency] = useState('6/6h')
  const medicationAllergyAliases: Record<string, string[]> = { Amoxicilina: ['penicilina', 'beta-lactâmico'], Ceftriaxona: ['cefalosporina', 'beta-lactâmico'], Dipirona: ['dipirona', 'metamizol'] }
  const matchingAllergy = risks.allergies.find((item) => { const allergyName = item.substance.toLocaleLowerCase('pt-BR'); const medicineName = medication.toLocaleLowerCase('pt-BR'); return allergyName.includes(medicineName) || medicineName.includes(allergyName) || (medicationAllergyAliases[medication] || []).some((alias) => allergyName.includes(alias)) })
  const allergyBlocked = Boolean(matchingAllergy)
  const [diluent, setDiluent] = useState('SF 0,9% — 100 mL')
  const [speed, setSpeed] = useState('50 mL/h')
  const [target, setTarget] = useState('Manter PAM > 65 mmHg')
  const [formError, setFormError] = useState('')
  const readOnly = role === 'enfermeiro'

  const selectMedication = (value: string) => {
    setMedication(value)
    if (value === 'Paracetamol') {
      setDose('750 mg')
      setRoute('VO')
      setFrequency('6/6h se dor ou febre')
    }
  }

  const savePrescription = () => {
    if (allergyBlocked) {
      onNotify('Prescrição bloqueada por incompatibilidade com alergia documentada.')
      return
    }
    if (![medication, dose, route, diluent, speed, frequency, target].every((value) => value.trim())) {
      setFormError('Preencha todos os campos obrigatórios antes de salvar.')
      return
    }
    setFormError('')
    onMedicationAdd({ id: Date.now(), name: medication, dose, route, frequency, times: [], status: 'Aguardando Aprazamento da Enfermagem', note: `${diluent} · ${speed} · Alvo: ${target}` })
    onNotify(`${medication} incluído na prescrição simulada.`)
  }

  if (role === 'tecnico') {
    return <main className="clinical-module-page"><AccessRestricted requiredRole="medico" currentRole={role} onChangeRole={onChangeRole} /></main>
  }

  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Prescrição medicamentosa</div><p>Prescrição atual · {formatDate(new Date())} · Vigência das 07:00 às 06:59</p></div>
          <div className="module-owner"><div className="profile-avatar">LM</div><div><span>PRESCRITOR RESPONSÁVEL</span><strong>Dra. Larissa Menezes · CRM-SP 145829</strong></div></div>
        </div>
        <MedicationPatientBar patient={patient} risks={risks} />
        <div className="schedule-bed-selector" style={{ margin: '12px 0' }}><span>PACIENTE / LEITO DA PRESCRIÇÃO</span><select value={patient.bed} onChange={(event) => onPatientChange(event.target.value)}>{activePatients.map((item) => <option key={item.admission} value={item.bed}>Leito {item.bed} · {item.name}</option>)}</select></div>

        <div className="prescription-layout">
          <section className="record-section medication-list-card">
            <div className="record-section-head">
              <div><div className="record-section-title">Medicamentos prescritos</div><p>{medications.length} itens ativos nesta prescrição</p></div>
              <div className="prescription-status"><span /><strong>Prescrição aberta</strong></div>
            </div>
            <div className="medication-table-head"><span>MEDICAMENTO</span><span>DOSE / VIA</span><span>FREQUÊNCIA</span><span>HORÁRIOS</span><span>STATUS</span></div>
            {medications.map((item) => (
              <div className="medication-row" key={item.id}>
                <div><strong>{item.name}</strong><small>{item.note}</small></div>
                <div><strong>{item.dose}</strong><small>{item.route}</small></div>
                <span>{item.frequency}</span>
                <div className="time-chips">{item.times.length ? item.times.map((time) => <b key={time}>{time}</b>) : <b>Sem horário médico</b>}</div>
                <span className={`med-status ${item.status === 'Em infusão' ? 'infusing' : item.status.includes('Aguardando') ? 'awaiting' : ''}`}>{item.status}</span>
              </div>
            ))}
          </section>

          <aside className="record-section prescription-form-card">
            <div className="prescription-form-head"><div className="summary-icon"><Icon name="medication" size={19} /></div><div><div className="record-section-title">{readOnly ? 'Consulta da prescrição' : 'Adicionar medicamento'}</div><p>{readOnly ? 'Visualização sem permissão de edição' : 'Nova linha da prescrição'}</p></div></div>
            {readOnly && <PermissionNotice role={role} allowed="médico para editar ou salvar" />}
            {allergyBlocked && (
              <div className="allergy-block">
                <div className="allergy-block-title"><Icon name="alert" size={20} /><div><span>BLOQUEIO DE SEGURANÇA</span><strong>Incompatibilidade com alergia</strong></div></div>
                <p>{matchingAllergy?.substance} consta no catálogo de alergias deste paciente: {matchingAllergy?.reaction}. A inclusão de {medication} está bloqueada.</p>
                <div><span>{matchingAllergy?.severity} · {matchingAllergy?.recordedAt}</span><strong>{matchingAllergy?.recordedBy}</strong></div>
              </div>
            )}
            <div className="prescription-form">
              <label><span>Medicamento <b>*</b></span><select value={medication} disabled={readOnly} onChange={(event) => selectMedication(event.target.value)}><option>Dipirona</option><option>Paracetamol</option><option>Metoclopramida</option><option>Amoxicilina</option><option>Ceftriaxona</option></select></label>
              <div className="form-split">
                <label><span>Dose <b>*</b></span><input value={dose} disabled={readOnly} onChange={(event) => setDose(event.target.value)} /></label>
                <label><span>Via <b>*</b></span><select value={route} disabled={readOnly} onChange={(event) => setRoute(event.target.value)}><option>EV</option><option>VO</option><option>SNE</option><option>SNG</option><option>SC</option><option>IM</option></select></label>
              </div>
              <label><span>Diluente e volume <b>*</b></span><input value={diluent} disabled={readOnly} onChange={(event) => setDiluent(event.target.value)} /></label>
              <label><span>Velocidade de infusão <b>*</b></span><input value={speed} disabled={readOnly} onChange={(event) => setSpeed(event.target.value)} /></label>
              <label><span>Frequência <b>*</b></span><input value={frequency} disabled={readOnly} onChange={(event) => setFrequency(event.target.value)} placeholder="Ex.: 8/8h, 12/12h ou Contínuo" /></label>
              <label><span>Alvo clínico <b>*</b></span><input value={target} disabled={readOnly} onChange={(event) => setTarget(event.target.value)} /></label>
              <label><span>Orientações de administração</span><textarea disabled={readOnly} placeholder="Observações clínicas adicionais..." /></label>
              {formError && <div className="balance-form-error"><Icon name="alert" size={15} /><span>{formError}</span></div>}
              <div className="prescriber-stamp"><Icon name="document" size={16} /><div><span>Assinatura eletrônica ao salvar</span><strong>Dra. Larissa Menezes · CRM-SP 145829</strong></div></div>
              {!readOnly && <Button className={`primary-button prescription-save ${allergyBlocked ? 'blocked' : ''}`} onClick={savePrescription}>
                {allergyBlocked ? <Icon name="alert" size={16} /> : <Icon name="check" size={16} />}
                {allergyBlocked ? 'Salvar bloqueado por alergia' : 'Adicionar à prescrição'}
              </Button>}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function SchedulingScreen({ role, onChangeRole, onNotify, schedule, onScheduleChange, selectedBed, onSelectedBedChange, approved, onApprove, medications }: {
  role: ProfessionalRole
  onChangeRole: (role: ProfessionalRole) => void
  onNotify: (message: string) => void
  schedule: MedicationSchedule
  onScheduleChange: (schedule: MedicationSchedule) => void
  selectedBed: string
  onSelectedBedChange: (bed: string) => void
  approved: boolean
  onApprove: () => void
  medications: MedicationOrder[]
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [validationError, setValidationError] = useState('')
  const schedulePatients = [...patients, ...additionalPatientRecords.slice(0, 2)]
  const schedulePatient = schedulePatients.find((patient) => patient.bed === selectedBed) ?? schedulePatients[0]
  if (role !== 'enfermeiro') {
    return <main className="clinical-module-page"><AccessRestricted requiredRole="enfermeiro" currentRole={role} onChangeRole={onChangeRole} /></main>
  }
  const toggleTime = (medicationId: number, time: string) => {
    if (approved) return
    const current = schedule[medicationId] ?? []
    onScheduleChange({ ...schedule, [medicationId]: current.includes(time) ? current.filter((item) => item !== time) : [...current, time] })
  }
  const requestApproval = () => {
    if (medications.some((item) => item.frequency !== 'Contínua' && (schedule[item.id] ?? []).length === 0)) {
      setValidationError('Selecione ao menos um horário para cada medicamento antes da homologação.')
      return
    }
    setValidationError('')
    setConfirmOpen(true)
  }
  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Aprazamento de medicamentos</div><p>Definição dos horários de administração pela enfermagem</p></div>
          <div className="role-authorized"><Icon name="shield" size={17} /><div><span>PERFIL AUTORIZADO</span><strong>Enf. Camila Torres · COREN-SP 598214</strong></div></div>
        </div>
        <div className="schedule-patient-header">
          <MedicationPatientBar patient={schedulePatient} />
          <div className="schedule-bed-selector"><span>LEITO ATIVO</span><select value={selectedBed} onChange={(event) => onSelectedBedChange(event.target.value)}>{['01', '02', '03', '05', '06', '07', '08', '09'].map((bed) => <option value={bed} key={bed}>L{bed}</option>)}</select><small>{new Date().toLocaleDateString('pt-BR')} · {professionals[role].name}</small></div>
        </div>
        <section className="record-section schedule-card">
          <div className="schedule-toolbar">
            <div><div className="record-section-title">Itens pendentes de aprazamento</div><p>Selecione os horários de administração para o leito ativo. Infusões contínuas não entram na grade horária.</p></div>
            <div className="schedule-count"><strong>{medications.filter((item) => item.frequency !== 'Contínua').length}</strong><span>{approved ? 'grade homologada' : 'medicamentos a aprazar'}</span></div>
          </div>
          <div className="schedule-matrix-wrap">
            <div className="schedule-matrix schedule-matrix-head"><span>MEDICAMENTO / PRESCRIÇÃO</span>{scheduleHours.map((time) => <b key={time}>{time}</b>)}</div>
            {medications.filter((item) => item.frequency !== 'Contínua').map((item) => <div className="schedule-matrix schedule-matrix-row" key={item.id}>
              <div><strong>{item.name} · {item.dose} · {item.route}</strong><span>{item.note} · {item.frequency}</span></div>
              {scheduleHours.map((time) => <Button className={(schedule[item.id] ?? []).includes(time) ? 'selected' : ''} onClick={() => toggleTime(item.id, time)} key={time} ariaLabel={`${item.name} às ${time}`}><span /></Button>)}
            </div>)}
          </div>
          <div className="schedule-selected-summary">{medications.filter((item) => item.frequency !== 'Contínua').map((item) => <div key={item.id}><strong>{item.name}</strong><span>{(schedule[item.id] ?? []).length ? (schedule[item.id] ?? []).sort((a, b) => scheduleHours.indexOf(a) - scheduleHours.indexOf(b)).join(' · ') : 'Nenhum horário selecionado'}</span></div>)}</div>
          {validationError && <div className="schedule-validation"><Icon name="alert" size={15} />{validationError}</div>}
          <div className="schedule-footer">
            <div className="schedule-guidance"><Icon name="clock" size={17} /><div><strong>{approved ? 'Grade homologada' : 'Revisão dos horários'}</strong><span>{approved ? 'A grade está bloqueada para edição e disponível na checagem.' : 'Selecione os horários conforme a prescrição e revise antes de homologar.'}</span></div></div>
            <div className="schedule-signature"><span>Responsável pelo aprazamento</span><strong>Enf. Camila Torres · COREN-SP 598214</strong></div>
            <Button className={`primary-button ${approved ? 'approved' : ''}`} onClick={requestApproval} disabled={approved}><Icon name="check" size={16} /> {approved ? 'Grade homologada e liberada' : 'Homologar e Liberar Grade para Checagem'}</Button>
          </div>
        </section>
      </div>
      {confirmOpen && <ConfirmationDialog title="Homologar grade de aprazamento?" description="Os horários selecionados serão assinados pela enfermeira e liberados para a checagem do técnico de enfermagem." confirmLabel="Homologar e assinar" onCancel={() => setConfirmOpen(false)} onConfirm={() => { onApprove(); setConfirmOpen(false); onNotify(`Grade do leito L${selectedBed} homologada por ${professionals[role].name} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} e liberada para checagem.`) }} />}
    </main>
  )
}

type AdministrationRecord = { status: 'Administrado' | 'Não administrado'; time: string; reason?: string; justification?: string }

function AdministrationScreen({ role, onChangeRole, onNotify, schedule, approved, medications, selectedBed, onSelectedBedChange }: {
  role: ProfessionalRole; onChangeRole: (role: ProfessionalRole) => void; onNotify: (message: string) => void
  schedule: MedicationSchedule; approved: boolean; medications: MedicationOrder[]; selectedBed: string; onSelectedBedChange: (bed: string) => void
}) {
  const [records, setRecords] = useState<Record<string, AdministrationRecord>>(() => { try { return JSON.parse(localStorage.getItem(`avicen-administration-${selectedBed}`) || '{}') as Record<string, AdministrationRecord> } catch { return {} } })
  const [nonAdministration, setNonAdministration] = useState<{ key: string; name: string } | null>(null)
  const [reason, setReason] = useState('')
  const [justification, setJustification] = useState('')
  const [modalError, setModalError] = useState('')
  const saeItems = ['Avaliação de dor realizada', 'Mudança de decúbito / prevenção de lesão por pressão', 'Higiene e conforto realizados', 'Cuidados com dispositivos e acessos', 'Balanço hídrico conferido', 'Orientações e intercorrências registradas']
  const [saeRecords, setSaeRecords] = useState<Record<string, boolean>>(() => { try { return JSON.parse(localStorage.getItem(`avicen-sae-${selectedBed}`) || '{}') as Record<string, boolean> } catch { return {} } })
  useEffect(() => { try { setRecords(JSON.parse(localStorage.getItem(`avicen-administration-${selectedBed}`) || '{}') as Record<string, AdministrationRecord>); setSaeRecords(JSON.parse(localStorage.getItem(`avicen-sae-${selectedBed}`) || '{}') as Record<string, boolean>) } catch { setRecords({}); setSaeRecords({}) } }, [selectedBed])
  const toggleSae = (item: string) => setSaeRecords((current) => { const updated = { ...current, [item]: !current[item] }; localStorage.setItem(`avicen-sae-${selectedBed}`, JSON.stringify(updated)); return updated })
  const checkAdministration = (key: string, name: string) => {
    setRecords((current) => { const updated = { ...current, [key]: { status: 'Administrado' as const, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) } }; localStorage.setItem(`avicen-administration-${selectedBed}`, JSON.stringify(updated)); return updated })
    onNotify(`${name}: administração checada com sucesso.`)
  }
  const confirmNonAdministration = () => {
    if (!nonAdministration || !reason || !justification.trim()) {
      setModalError('Selecione um motivo e informe a descrição / justificativa.')
      return
    }
    setRecords((current) => { const updated = { ...current, [nonAdministration.key]: { status: 'Não administrado' as const, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), reason, justification: justification.trim() } }; localStorage.setItem(`avicen-administration-${selectedBed}`, JSON.stringify(updated)); return updated })
    setNonAdministration(null); setReason(''); setJustification(''); setModalError('')
    onNotify('Não administração registrada e preservada no histórico.')
  }
  if (role !== 'tecnico') {
    return <main className="clinical-module-page"><AccessRestricted requiredRole="tecnico" currentRole={role} onChangeRole={onChangeRole} /></main>
  }
  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Checagem de enfermagem</div><p>Administração de medicamentos · Turno diurno · 07:00 às 19:00</p></div>
          <div className="role-authorized"><Icon name="shield" size={17} /><div><span>PERFIL AUTORIZADO</span><strong>Tec. André Lima · COREN-SP 1274058</strong></div></div>
        </div>
        <div className="schedule-patient-header"><MedicationPatientBar patient={[...patients, ...additionalPatientRecords.slice(0, 2)].find((patient) => patient.bed === selectedBed) ?? patients[0]} /><div className="schedule-bed-selector"><span>LEITO ATIVO</span><select value={selectedBed} onChange={(event) => onSelectedBedChange(event.target.value)}>{['01', '02', '03', '05', '06', '07', '08', '09'].map((bed) => <option value={bed} key={bed}>L{bed}</option>)}</select></div></div>

        {(() => {
          const entries = medications.flatMap((item) => (schedule[item.id] ?? []).map((time) => ({ item, time, key: `${item.id}-${time}` }))).sort((a, b) => scheduleHours.indexOf(a.time) - scheduleHours.indexOf(b.time))
          const administered = Object.values(records).filter((record) => record.status === 'Administrado').length
          return <>
        <div className="administration-summary">
          <div><span>PROGRAMADOS NO TURNO</span><strong>{approved ? entries.length : 0}</strong></div>
          <div><span>ADMINISTRADOS</span><strong>{administered}</strong></div>
          <div><span>PENDENTES</span><strong>{approved ? Math.max(0, entries.length - Object.keys(records).length) : 0}</strong></div>
          <div className="administration-alert"><Icon name="clock" size={17} /><span>1 medicamento vence nos próximos 15 minutos</span></div>
        </div>

        <section className="record-section administration-card">
          <div className="schedule-toolbar">
            <div><div className="record-section-title">Medicamentos do horário</div><p>Confirme paciente, medicamento, dose, via e horário antes da administração</p></div>
            <div className="current-time"><span>HORÁRIO ATUAL</span><strong>{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong></div>
          </div>
          {!approved && <div className="administration-unreleased"><Icon name="clock" size={25} /><strong>Grade aguardando homologação</strong><span>Somente horários aprovados pela enfermeira são liberados para checagem.</span></div>}
          {approved && entries.map(({ item, time, key }) => {
            const record = records[key]
            const done = record?.status === 'Administrado'
            const notAdministered = record?.status === 'Não administrado'
            return (
              <div className={`administration-row ${done ? 'done' : notAdministered ? 'not-administered' : ''}`} key={key}>
                <div className="admin-time"><span>{time}</span>{notAdministered && <b className="not-admin-dot" />}<small>{item.frequency}</small></div>
                <div className="admin-medication"><strong>{item.name}</strong><span>{item.dose} · {item.route}</span><small>{item.note}</small></div>
                <div className="five-rights">
                  <span><Icon name="check" size={11} /> Paciente</span><span><Icon name="check" size={11} /> Medicamento</span>
                  <span><Icon name="check" size={11} /> Dose</span><span><Icon name="check" size={11} /> Via</span>
                </div>
                <div className={`administration-status ${done ? 'done' : notAdministered ? 'not-administered' : ''}`}>
                  {done ? <><Icon name="check" size={15} /><div><strong>Administrado</strong><span>{record.time} · Tec. André Lima</span><small>COREN-SP 1274058</small></div></>
                    : notAdministered ? <><Icon name="close" size={15} /><div><strong>Não administrado</strong><span>{record.reason}</span><small>{record.time} · {record.justification}</small></div></>
                    : <><Icon name="clock" size={15} /><div><strong>Pendente</strong><span>Aguardando checagem</span></div></>}
                </div>
                {record ? (
                  <Button className="secondary-button" onClick={() => onNotify(`${item.name}: registro de administração visualizado.`)}>Ver registro</Button>
                ) : <div className="administration-actions"><Button className="primary-button" onClick={() => checkAdministration(key, item.name)}><Icon name="check" size={15} /> Confirmar Checagem</Button><Button className="secondary-button" onClick={() => setNonAdministration({ key, name: item.name })}>Não Administrado / Bolar</Button></div>}
              </div>
            )
          })}
          <section className="record-section sae-checklist-card">
            <div className="record-section-title">Sistematização da Assistência de Enfermagem (SAE)</div>
            <p>Registre a execução dos cuidados do turno para o paciente selecionado. Os itens marcados ficam associados ao leito e ao profissional da sessão.</p>
            <div className="sae-checklist-grid">{saeItems.map((item) => <label className="sae-check-item" key={item}><input type="checkbox" checked={!!saeRecords[item]} onChange={() => toggleSae(item)} /><span>{item}</span></label>)}</div>
            <div className="sae-progress">{Object.values(saeRecords).filter(Boolean).length} de {saeItems.length} cuidados registrados</div>
          </section>
          <div className="administration-footer"><Icon name="shield" size={16} /><span>Registros demonstrativos vinculados ao leito, horário local e profissional da sessão; não equivalem a assinatura digital certificada.</span></div>
        </section>
          </>})()}
      </div>
      {nonAdministration && <div className="confirmation-layer" role="dialog" aria-modal="true" aria-label="Registrar não administração">
        <Button className="confirmation-backdrop" onClick={() => setNonAdministration(null)} ariaLabel="Fechar" />
        <div className="non-admin-modal">
          <div className="non-admin-modal-head"><div className="confirmation-icon"><Icon name="alert" size={22} /></div><div><strong>Não Administrado / Bolar</strong><span>{nonAdministration.name}</span></div></div>
          <label><span>Motivo obrigatório <b>*</b></span><select value={reason} onChange={(event) => setReason(event.target.value)}><option value="">Selecione...</option><option>Recusa expressa do paciente</option><option>Condição clínica impeditiva</option><option>Ausência no leito (Exame/TC)</option><option>Acesso venoso inviável</option><option>Item em falta na farmácia</option></select></label>
          <label><span>Descrição / Justificativa <b>*</b></span><textarea value={justification} onChange={(event) => setJustification(event.target.value)} placeholder="Descreva a ocorrência e as providências adotadas..." /></label>
          {modalError && <div className="balance-form-error"><Icon name="alert" size={14} /><span>{modalError}</span></div>}
          <div className="non-admin-signature"><Icon name="shield" size={15} /><span>Tec. André Lima · COREN-SP 1274058 · assinatura ao confirmar</span></div>
          <div className="confirmation-actions"><Button className="secondary-button" onClick={() => setNonAdministration(null)}>Cancelar</Button><Button className="danger-button" onClick={confirmNonAdministration}>Confirmar não administração</Button></div>
        </div>
      </div>}
    </main>
  )
}

type InvasiveDevice = {
  id: number
  admission: string
  type: string
  site: string
  insertion: string
  duration: string
  indication: string
  insertedBy: string
  removed?: string
  removalReason?: string
  removalNotes?: string
  cultureSent?: boolean
  removedBy?: string
}

const initialDevices: InvasiveDevice[] = [
  { id: 1, admission: patients[0].admission, type: 'Cateter venoso central', site: 'Veia jugular interna direita', insertion: '18/06/2025 · 16:20', duration: '2 dias e 18h', indication: 'Infusão de droga vasoativa', insertedBy: 'Dr. Rafael Campos · CRM-SP 168442' },
  { id: 2, admission: patients[0].admission, type: 'Cateter arterial', site: 'Artéria radial esquerda', insertion: '19/06/2025 · 08:45', duration: '1 dia e 2h', indication: 'Monitorização invasiva da pressão arterial', insertedBy: 'Dra. Larissa Menezes · CRM-SP 145829' },
  { id: 3, admission: patients[0].admission, type: 'Sonda vesical de demora', site: 'Uretra', insertion: '18/06/2025 · 15:10', duration: '2 dias e 19h', indication: 'Controle rigoroso de débito urinário', insertedBy: 'Enf. Camila Torres · COREN-SP 598214' },
  { id: 4, admission: patients[0].admission, type: 'Sonda nasoenteral', site: 'Narina direita · posição pós-pilórica', insertion: '19/06/2025 · 11:30', duration: '22 horas', indication: 'Terapia nutricional enteral', insertedBy: 'Enf. Camila Torres · COREN-SP 598214' },
  { id: 5, admission: patients[0].admission, type: 'Tubo orotraqueal', site: 'Via oral · fixação 22 cm', insertion: '18/06/2025 · 14:55', duration: '1 dia e 16h', indication: 'Ventilação mecânica invasiva', insertedBy: 'Dr. Rafael Campos · CRM-SP 168442', removed: '20/06/2025 · 07:12' },
]

function DeviceTrackingScreen({ onNotify, devices, setDevices, activePatients, role }: { onNotify: (message: string) => void; devices: InvasiveDevice[]; setDevices: Dispatch<SetStateAction<InvasiveDevice[]>>; activePatients: Patient[]; role: ProfessionalRole }) {
  const [selectedAdmission, setSelectedAdmission] = useState(activePatients[0]?.admission ?? '')
  const patient = activePatients.find((item) => item.admission === selectedAdmission) ?? activePatients[0] ?? patients[0]
  const professional = professionals[role]
  const patientDevices = devices.filter((device) => device.admission === patient.admission)
  const [systemNow, setSystemNow] = useState(() => new Date())
  useEffect(() => { const timer = window.setInterval(() => setSystemNow(new Date()), 1000); return () => window.clearInterval(timer) }, [])
  const [type, setType] = useState('Cateter venoso periférico')
  const [site, setSite] = useState('')
  const [indication, setIndication] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState('')
  const [deviceFilter, setDeviceFilter] = useState<'active' | 'all' | 'removed'>('all')
  const [removalTarget, setRemovalTarget] = useState<InvasiveDevice | null>(null)
  const [removalDate, setRemovalDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [removalTime, setRemovalTime] = useState(() => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
  const [removalReason, setRemovalReason] = useState('')
  const [removalNotes, setRemovalNotes] = useState('')
  const [cultureSent, setCultureSent] = useState(false)
  const [removalError, setRemovalError] = useState('')

  const activeDevices = patientDevices.filter((device) => !device.removed)
  const visibleDevices = patientDevices.filter((device) => deviceFilter === 'all' || (deviceFilter === 'active' ? !device.removed : device.removed))

  const addDevice = () => {
    if (!site.trim() || !indication.trim()) {
      setError('Informe o sítio anatômico e a indicação do dispositivo.')
      return
    }
    setDevices((current) => [...current, {
      id: Date.now(), admission: patient.admission, type, site: site.trim(), indication: indication.trim(),
      insertion: formatLocalDateTime(systemNow), duration: 'Agora', insertedBy: `${professional.name} · ${professional.registry}`,
    }])
    setSite('')
    setIndication('')
    setError('')
    setFormOpen(false)
    onNotify(`${type} registrado com sucesso.`)
  }

  const removeDevice = () => {
    if (!removalTarget || !removalDate || !removalTime || !removalReason || !removalNotes.trim()) {
      setRemovalError('Preencha data, hora, motivo e nota de procedimento.')
      return
    }
    setDevices((current) => current.map((device) => device.id === removalTarget.id ? {
      ...device, removed: `${removalDate.split('-').reverse().join('/')} · ${removalTime}`, removalReason,
      removalNotes: removalNotes.trim(), cultureSent, removedBy: `${professional.name} · ${professional.registry}`,
    } : device))
    onNotify(`${removalTarget.type}: retirada registrada com sucesso.`)
    setRemovalTarget(null); setRemovalReason(''); setRemovalNotes(''); setCultureSent(false); setRemovalError('')
  }

  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Dispositivos invasivos</div><p>Rastreamento de inserção, permanência, avaliação diária e retirada</p></div>
          <Button className="primary-button module-primary-action" onClick={() => setFormOpen(!formOpen)}><Icon name="admission" size={16} /> Registrar dispositivo</Button>
        </div>
        <label className="schedule-bed-selector"><span>PACIENTE / LEITO</span><select value={patient.admission} onChange={(event) => setSelectedAdmission(event.target.value)}>{activePatients.map((item) => <option key={item.admission} value={item.admission}>L{item.bed} · {item.name}</option>)}</select></label>
        <MedicationPatientBar patient={patient} />

        <section className="device-summary">
          <div><span>DISPOSITIVOS ATIVOS</span><strong>{activeDevices.length}</strong><small>Em acompanhamento</small></div>
          <div><span>RETIRADOS NA INTERNAÇÃO</span><strong>{devices.length - activeDevices.length}</strong><small>Com registro completo</small></div>
          <div><span>MAIOR TEMPO DE PERMANÊNCIA</span><strong>2d 19h</strong><small>Sonda vesical de demora</small></div>
          <div className="device-evaluation"><Icon name="check" size={18} /><div><strong>Avaliação diária registrada</strong><span>Todos os dispositivos revisados às 07:32</span></div></div>
        </section>

        {formOpen && (
          <section className="record-section device-entry-form">
            <div className="device-form-title"><div><div className="record-section-title">Novo dispositivo invasivo</div><p>Os dados serão vinculados ao paciente e ao profissional autenticado</p></div><Button className="icon-button" onClick={() => setFormOpen(false)} ariaLabel="Fechar formulário"><Icon name="close" size={17} /></Button></div>
            <div className="device-form-grid">
              <label><span>Tipo de dispositivo <b>*</b></span><select value={type} onChange={(event) => setType(event.target.value)}><option>Cateter venoso periférico</option><option>Cateter venoso central</option><option>Cateter arterial</option><option>Dreno torácico</option><option>Sonda vesical de demora</option></select></label>
              <label><span>Data e hora de inserção</span><input value={formatLocalDateTime(systemNow)} readOnly /></label>
              <label><span>Sítio anatômico <b>*</b></span><input value={site} onChange={(event) => setSite(event.target.value)} placeholder="Ex.: membro superior direito" /></label>
              <label><span>Indicação clínica <b>*</b></span><input value={indication} onChange={(event) => setIndication(event.target.value)} placeholder="Motivo da inserção" /></label>
            </div>
            {error && <div className="device-form-error"><Icon name="alert" size={15} />{error}</div>}
            <div className="device-form-footer">
              <div className="executor-stamp"><div className="profile-avatar">{professional.initials}</div><div><span>Profissional responsável</span><strong>{professional.name} · {professional.registry}</strong></div></div>
              <Button className="secondary-button" onClick={() => setFormOpen(false)}>Cancelar</Button>
              <Button className="primary-button" onClick={addDevice}><Icon name="check" size={16} /> Salvar dispositivo</Button>
            </div>
          </section>
        )}

        <section className="record-section device-list-card">
          <div className="record-section-head">
            <div><div className="record-section-title">Dispositivos do paciente</div><p>Histórico da internação atual</p></div>
            <div className="device-filter">
              <Button className={deviceFilter === 'active' ? 'active' : ''} onClick={() => setDeviceFilter('active')}>Ativos</Button>
              <Button className={deviceFilter === 'all' ? 'active' : ''} onClick={() => setDeviceFilter('all')}>Todos</Button>
              <Button className={deviceFilter === 'removed' ? 'active' : ''} onClick={() => setDeviceFilter('removed')}>Retirados</Button>
            </div>
          </div>
          <div className="device-table-head"><span>DISPOSITIVO</span><span>INSERÇÃO</span><span>SÍTIO ANATÔMICO</span><span>PERMANÊNCIA</span><span>SITUAÇÃO</span><span>AÇÃO</span></div>
          {visibleDevices.map((device) => (
            <div className={`device-row ${device.removed ? 'removed' : ''}`} key={device.id}>
              <div className="device-name"><div className="device-type-icon"><Icon name="device" size={18} /></div><div><strong>{device.type}</strong><span>{device.indication}</span><small>Inserido por {device.insertedBy}</small></div></div>
              <div><strong>{device.insertion.split(' · ')[0]}</strong><span>{device.insertion.split(' · ')[1]}</span></div>
              <div><strong>{device.site}</strong><span>{device.removed ? `${device.removalReason ?? 'Alta do dispositivo'} · ${device.removalNotes ?? 'Sítio sem sinais flogísticos'}` : 'Avaliação: íntegro e sem sinais flogísticos'}</span></div>
              <div className="device-duration"><strong>{device.duration}</strong><span>{device.removed ? `Retirado em ${device.removed} · ${device.removedBy ?? 'Registro histórico'}` : 'Dispositivo ativo'}</span></div>
              <span className={`device-status ${device.removed ? 'removed' : ''}`}>{device.removed ? 'Retirado' : 'Em uso'}</span>
              {device.removed
                ? <Button className="secondary-button" onClick={() => onNotify(`${device.type}: histórico visualizado.`)}>Ver registro</Button>
                : <Button className="device-remove-button" onClick={() => { const stamp = new Date(); setRemovalDate(stamp.toISOString().slice(0, 10)); setRemovalTime(stamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })); setRemovalTarget(device) }}>Registrar retirada</Button>}
            </div>
          ))}
        </section>
      </div>
      {removalTarget && <div className="confirmation-layer" role="dialog" aria-modal="true" aria-label="Registrar retirada de dispositivo">
        <Button className="confirmation-backdrop" onClick={() => setRemovalTarget(null)} ariaLabel="Fechar" />
        <div className="device-removal-modal">
          <div className="non-admin-modal-head"><div className="confirmation-icon"><Icon name="device" size={22} /></div><div><strong>Registrar retirada</strong><span>{removalTarget.type} · {removalTarget.site}</span></div></div>
          <div className="removal-date-time"><label><span>Data <b>*</b></span><input type="date" value={removalDate} onChange={(event) => setRemovalDate(event.target.value)} /></label><label><span>Hora <b>*</b></span><input type="time" value={removalTime} onChange={(event) => setRemovalTime(event.target.value)} /></label></div>
          <label><span>Motivo da retirada <b>*</b></span><select value={removalReason} onChange={(event) => setRemovalReason(event.target.value)}><option value="">Selecione...</option><option>Alta do dispositivo</option><option>Suspeita de infecção</option><option>Obstrução/Perda acidental</option><option>Troca programada</option></select></label>
          <label className="culture-checkbox"><input type="checkbox" checked={cultureSent} onChange={(event) => setCultureSent(event.target.checked)} /><span>Ponta enviada para cultura</span></label>
          <label><span>Nota de Procedimento / Cuidados Realizados <b>*</b></span><textarea value={removalNotes} onChange={(event) => setRemovalNotes(event.target.value)} placeholder="Descreva técnica, condições do sítio e cuidados realizados..." /></label>
          {removalError && <div className="balance-form-error"><Icon name="alert" size={14} /><span>{removalError}</span></div>}
          <div className="non-admin-signature"><Icon name="shield" size={15} /><span>{professional.name} · {professional.registry} · registro demonstrativo ao confirmar</span></div>
          <div className="confirmation-actions"><Button className="secondary-button" onClick={() => setRemovalTarget(null)}>Cancelar</Button><Button className="primary-button" onClick={removeDevice}>Confirmar retirada</Button></div>
        </div>
      </div>}
    </main>
  )
}

function ShiftHandoffScreen({ role, onNotify, activePatients, devices, pendingTasks }: { role: ProfessionalRole; onNotify: (message: string) => void; activePatients: Patient[]; devices: InvasiveDevice[]; pendingTasks: PendingTask[] }) {
  const handoffPatients = activePatients
  const [selectedPatientId, setSelectedPatientId] = useState(1)
  const selectedPatient = handoffPatients.find((patient) => patient.id === selectedPatientId) ?? handoffPatients[0]
  const [diagnosis, setDiagnosis] = useState('Choque séptico de foco pulmonar, em resposta parcial às medidas instituídas.')
  const [summary, setSummary] = useState('')
  const activePatientDevices = devices.filter((device) => device.admission === selectedPatient.admission && !device.removed)
  const deviceSummary = activePatientDevices.map((device) => `${device.type} — ${device.site}`).join('; ') || 'Nenhum dispositivo invasivo ativo registrado.'
  const [deviceNotes, setDeviceNotes] = useState('')
  const [vasoactive, setVasoactive] = useState('')
  const [tasks, setTasks] = useState('')
  const [saved, setSaved] = useState(false)
  const [handoffStatus, setHandoffStatus] = useState<'draft' | 'transmitted' | 'completed'>('draft')
  const [transferHistory, setTransferHistory] = useState<string[]>([])
  const professional = professionals[role]
  const patientPendingTasks = pendingTasks.filter((task) => task.bed === selectedPatient.bed && !task.done)
  const readiness = { diagnosis: Boolean(selectedPatient.diagnosis), devices: activePatientDevices.length > 0 || deviceNotes.trim().length > 0, pending: patientPendingTasks.length === 0 || tasks.trim().length > 0, summary: summary.trim().length > 0 }
  const isReady = Object.values(readiness).every(Boolean)

  const saveHandoff = () => {
    setSaved(true)
    onNotify('Passagem de plantão salva como rascunho.')
  }

  const switchPatient = (patient: Patient) => {
    setSelectedPatientId(patient.id)
    setDiagnosis(`${patient.diagnosis}. Quadro em acompanhamento intensivo.`)
    setSummary('')
    setTasks('')
    setDeviceNotes('')
    setHandoffStatus('draft')
    setSaved(false)
  }

  const importEvolution = () => {
    const latestVitals = (() => { try { const rows = JSON.parse(localStorage.getItem(`avicen-vitals-${selectedPatient.admission}`) || '[]') as Array<{at:string; values:Record<string,string>}>; const latest = rows[rows.length - 1]; return latest ? ` Última aferição (${latest.at}): ${Object.entries(latest.values).map(([key, value]) => `${key}: ${value}`).join(', ')}.` : ' Não há aferições manuais registradas.' } catch { return ' Não há aferições manuais registradas.' } })()
    setSummary(`Resumo compilado em ${formatLocalDateTime(new Date())}: ${selectedPatient.name} apresenta ${selectedPatient.diagnosis.toLocaleLowerCase('pt-BR')}.${latestVitals} Conteúdo editável; registros originais preservados.`)
    onNotify('Resumo da última evolução importado. O registro original foi preservado.')
  }

  const transmitHandoff = () => {
    if (!diagnosis.trim() || !summary.trim() || !isReady) {
      onNotify('Complete o resumo clínico, revise dispositivos e documente as pendências reais antes de transmitir.')
      return
    }
    if (handoffStatus !== 'draft') {
      onNotify('Esta transmissão já foi assinada e não pode ser sobrescrita silenciosamente.')
      return
    }
    setSaved(true)
    setHandoffStatus('transmitted')
    setTransferHistory((current) => [...current, `Transmitido por ${professional.name} · ${professional.registry} · ${formatLocalDateTime(new Date())}`])
    onNotify('Plantão transmitido e aguardando aceite do receptor.')
  }

  const acceptHandoff = () => {
    if (handoffStatus !== 'transmitted') {
      onNotify('O emissor deve transmitir e assinar o plantão antes do aceite.')
      return
    }
    setHandoffStatus('completed')
    setTransferHistory((current) => [...current, `Aceito por ${professional.name} · ${professional.registry} · ${formatLocalDateTime(new Date())}`])
    onNotify('Turno aceito, homologado e assinado pelo receptor.')
  }

  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading handoff-heading">
          <div><div className="page-title">Passagem de plantão</div><p>Relatório estruturado · UTI Adulto · Turno diurno para noturno</p></div>
          <div className="handoff-heading-actions">
            <span className={`handoff-state ${handoffStatus === 'completed' ? 'reviewed' : handoffStatus === 'transmitted' || saved ? 'saved' : ''}`}><Icon name={handoffStatus === 'completed' ? 'check' : 'document'} size={14} />{handoffStatus === 'completed' ? 'Turno homologado' : handoffStatus === 'transmitted' ? 'Aguardando receptor' : saved ? 'Rascunho salvo' : 'Rascunho não salvo'}</span>
            <Button className="secondary-button" onClick={saveHandoff}><Icon name="document" size={15} /> Salvar rascunho</Button>
            <Button className="primary-button" onClick={importEvolution}><Icon name="document" size={15} /> Importar Resumo da Última Evolução</Button>
          </div>
        </div>
        <div className="handoff-bed-carousel">
          {handoffPatients.map((patient) => { const tasksForPatient = pendingTasks.filter((task) => task.bed === patient.bed && !task.done); const hasVitals = (() => { try { return (JSON.parse(localStorage.getItem(`avicen-vitals-${patient.admission}`) || '[]') as unknown[]).length > 0 } catch { return false } })(); const ready = Boolean(patient.diagnosis && (hasVitals || devices.some((device) => device.admission === patient.admission)) && tasksForPatient.length === 0); return <Button className={selectedPatient.id === patient.id ? 'active' : ''} onClick={() => switchPatient(patient)} key={patient.id}><span>L{patient.bed}</span><strong>{patient.initials}</strong><small className={ready ? 'ready' : 'pending'}>{ready ? 'Pronto' : 'Pendente'}</small></Button> })}
        </div>
        <MedicationPatientBar patient={selectedPatient} />

        <div className="handoff-layout">
          <section className="handoff-main">
            <div className="record-section handoff-intro">
              <div><span>PERÍODO DO PLANTÃO</span><strong>{formatDate(new Date())} · 07:00 às 19:00</strong></div>
              <div><span>TEMPO DE INTERNAÇÃO</span><strong>{selectedPatient.stay}</strong></div>
              <div><span>GRAVIDADE ATUAL</span><strong className="attention">Atenção clínica</strong></div>
            </div>

            <section className="record-section handoff-form">
              <div className="handoff-section-head"><span>1</span><div><strong>Diagnóstico e situação atual</strong><small>Problema principal e evolução durante o turno</small></div></div>
              <label><span>Diagnóstico principal</span><textarea value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} /></label>
              <label><span>Resumo clínico do turno</span><textarea className="large" value={summary} onChange={(event) => setSummary(event.target.value)} /></label>
            </section>

            <section className="record-section handoff-form">
              <div className="handoff-section-head"><span>2</span><div><strong>Suportes e dispositivos ativos</strong><small>Acessos, sondas, drenos e suporte ventilatório</small></div></div>
              <div className="handoff-active-devices">
                {activePatientDevices.map((device) => <span key={device.id}><Icon name="device" size={13} />{device.type}<b>{device.site}</b></span>)}{!activePatientDevices.length && <span>Nenhum dispositivo ativo registrado para este atendimento.</span>}
              </div>
              <label><span>Observações sobre dispositivos</span><textarea value={deviceNotes || deviceSummary} onChange={(event) => setDeviceNotes(event.target.value)} /></label>
            </section>

            <section className="record-section handoff-form">
              <div className="handoff-section-head"><span>3</span><div><strong>Drogas vasoativas e infusões críticas</strong><small>Dose atual, meta e cuidados na continuidade</small></div></div>
              <div className="vasoactive-banner"><Icon name="medication" size={18} /><div><strong>Infusões críticas registradas</strong><span>Consulte a prescrição e os registros de infusão do atendimento selecionado.</span></div><b>REGISTROS</b></div>
              <label><span>Orientações para continuidade</span><textarea value={vasoactive} onChange={(event) => setVasoactive(event.target.value)} placeholder="Consolide as drogas vasoativas e infusões a partir dos registros do paciente." /></label>
            </section>

            <section className="record-section handoff-form">
              <div className="handoff-section-head"><span>4</span><div><strong>Pendências e plano para o próximo turno</strong><small>Exames, reavaliações e tarefas com horário definido</small></div></div>
              <label><span>Pendências prioritárias (derivadas dos registros)</span><textarea className="tasks" value={tasks || patientPendingTasks.map((task) => `• ${task.task} — ${task.due}`).join('\n') || 'Nenhuma pendência aberta registrada para este leito.'} onChange={(event) => setTasks(event.target.value)} /></label>
            </section>
          </section>

          <aside className="handoff-side">
            <section className="record-section handoff-checklist">
              <div className="record-section-title">Checklist de segurança</div>
              {['Identificação do paciente conferida', 'Alergias e precauções comunicadas', 'Drogas vasoativas revisadas', 'Dispositivos e curativos avaliados', 'Pendências com horários definidos'].map((item, index) => <label key={item}><input type="checkbox" defaultChecked={false} /><span><Icon name="check" size={12} />{item}</span></label>)}
            </section>
            <section className="record-section handoff-professionals">
              <div className="record-section-title">Profissionais do plantão</div>
              <div><div className="profile-avatar">{professional.initials}</div><div><span>ENTREGA DO PLANTÃO</span><strong>{professional.name}</strong><small>{professional.registry}</small></div></div>
              <div><div className="profile-avatar incoming">RP</div><div><span>RECEBIMENTO PREVISTO</span><strong>Dr. Ricardo Paes</strong><small>CRM-SP 182306 · Turno noturno</small></div></div>
            </section>
            <section className="handoff-review-note">
              <Icon name="shield" size={18} />
              <div><strong>Revisão antes da entrega</strong><span>Confirme as informações verbalmente com o profissional que receberá o plantão.</span></div>
            </section>
            <div className="handoff-readiness"><strong>{isReady ? 'Dados mínimos disponíveis' : 'Revisão necessária antes da transmissão'}</strong><span>{patientPendingTasks.length} pendência(s) aberta(s) · {activePatientDevices.length} dispositivo(s) ativo(s)</span></div>
            <Button className="primary-button handoff-review-button" onClick={transmitHandoff}><Icon name="document" size={16} /> Transmitir Plantão - Assinatura do Emissor</Button>
            <Button className="secondary-button handoff-save-button" onClick={acceptHandoff}><Icon name="check" size={15} /> Aceitar e Homologar Turno - Assinatura do Receptor</Button>
            <Button className="secondary-button handoff-save-button" onClick={saveHandoff}><Icon name="document" size={15} /> Salvar alterações</Button>
            {transferHistory.length > 0 && <section className="handoff-transfer-history"><strong>Histórico da transferência</strong>{transferHistory.map((entry) => <span key={entry}><Icon name="check" size={11} />{entry}</span>)}</section>}
          </aside>
        </div>
      </div>
    </main>
  )
}

let admittedBedList: string[] = []

type AdmissionTab = 'admission' | 'risks' | 'transfer' | 'outcome' | 'audit'

type AuditEntry = {
  id: number
  time: string
  action: string
  detail: string
  professional: string
  signature: string
}

const initialAuditEntries: AuditEntry[] = [
  { id: 1, time: '20/06/2025 · 09:18', action: 'Alergia revisada', detail: 'Mantido registro de anafilaxia por Dipirona.', professional: 'Dra. Larissa Menezes', signature: 'CRM-SP 145829 · assinatura eletrônica válida' },
  { id: 2, time: '20/06/2025 · 07:04', action: 'Ciência de risco registrada', detail: 'Alergias e comorbidades conferidas no início do plantão.', professional: 'Enf. Camila Torres', signature: 'COREN-SP 598214 · assinatura eletrônica válida' },
  { id: 3, time: '18/06/2025 · 14:46', action: 'Admissão na UTI', detail: 'Paciente admitida no leito 01, procedente do pronto atendimento.', professional: 'Dr. Rafael Campos', signature: 'CRM-SP 168442 · assinatura eletrônica válida' },
]

function ConfirmationDialog({ title, description, danger, confirmLabel, onCancel, onConfirm }: {
  title: string; description: string; danger?: boolean; confirmLabel: string; onCancel: () => void; onConfirm: () => void
}) {
  return (
    <div className="confirmation-layer" role="dialog" aria-modal="true" aria-label={title}>
      <Button className="confirmation-backdrop" onClick={onCancel} ariaLabel="Cancelar ação" />
      <div className={`confirmation-dialog ${danger ? 'danger' : ''}`}>
        <div className="confirmation-icon"><Icon name={danger ? 'alert' : 'shield'} size={24} /></div>
        <div className="confirmation-title">{title}</div>
        <p>{description}</p>
        <div className="confirmation-notice"><Icon name="document" size={15} /><span>Esta ação será assinada e adicionada ao histórico permanente. O registro não poderá ser excluído pela interface.</span></div>
        <div className="confirmation-actions">
          <Button className="secondary-button" onClick={onCancel}>Cancelar</Button>
          <Button className={danger ? 'danger-button' : 'primary-button'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

function PermissionNotice({ role, allowed }: { role: ProfessionalRole; allowed: string }) {
  return (
    <div className="permission-notice">
      <Icon name="shield" size={17} />
      <div><strong>Ação restrita para o perfil atual</strong><span>Perfil conectado: {professionals[role].title}. Permissão necessária: {allowed}.</span></div>
    </div>
  )
}

function AdmissionScreen({ role, onNotify, onAdmit, activePatients, onRiskUpdate, onTransfer, onOutcome, getRisks }: { role: ProfessionalRole; onNotify: (message: string) => void; onAdmit: (patient: Patient) => void; activePatients: Patient[]; onRiskUpdate: (admission: string, risk: PatientClinicalRisk) => void; onTransfer: (admission: string, destinationBed: string, reason: string) => void; onOutcome: (admission: string, outcome: 'Alta' | 'Óbito', detail: string) => void; getRisks: (admission: string) => PatientClinicalRisk }) {
  const [tab, setTab] = useState<AdmissionTab>('admission')
  const [dialog, setDialog] = useState<null | 'admission' | 'transfer' | 'outcome'>(null)
  const [audit, setAudit] = useState(initialAuditEntries)
  const [allergy, setAllergy] = useState('Vancomicina')
  const [allergyReaction, setAllergyReaction] = useState('Eritema e prurido durante infusão')
  const [comorbidity, setComorbidity] = useState('Doença renal crônica estágio 3')
  const [outcome, setOutcome] = useState<'alta' | 'obito'>('alta')
  const [selectedBed, setSelectedBed] = useState('')
  const [admissionSaved, setAdmissionSaved] = useState(false)
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [systemNow, setSystemNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setSystemNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const [sex, setSex] = useState('Feminino')
  const [cpf, setCpf] = useState('')
  const [origin, setOrigin] = useState('Pronto atendimento')
  const admissionDateTime = formatLocalDateTime(systemNow)
  const [diagnosis, setDiagnosis] = useState('')
  const [formError, setFormError] = useState('')
  const [transferSaved, setTransferSaved] = useState(false)
  const [riskPatientId, setRiskPatientId] = useState(activePatients[0]?.admission || '')
  const [transferPatientId, setTransferPatientId] = useState(activePatients[0]?.admission || '')
  const [transferDestination, setTransferDestination] = useState('04')
  const [transferReason, setTransferReason] = useState('Necessidade de isolamento')
  const [outcomePatientId, setOutcomePatientId] = useState(activePatients[0]?.admission || '')
  const [riskSeverity, setRiskSeverity] = useState('Grave')
  const [riskNotes, setRiskNotes] = useState('')
  const [comorbidityStatus, setComorbidityStatus] = useState('Ativa')
  const selectedRiskPatient = activePatients.find((patient) => patient.admission === riskPatientId)
  const selectedTransferPatient = activePatients.find((patient) => patient.admission === transferPatientId)
  const selectedOutcomePatient = activePatients.find((patient) => patient.admission === outcomePatientId)
  const occupiedBeds = activePatients.map((patient) => patient.bed)
  const availableTransferBeds = ['01','02','03','04','05','06','07','08','09','10'].filter((bed) => !occupiedBeds.includes(bed) || bed === selectedTransferPatient?.bed)
  const effectiveTransferDestination = availableTransferBeds.includes(transferDestination) ? transferDestination : (availableTransferBeds.find((bed) => bed !== selectedTransferPatient?.bed) || '')
  const canManageAdmission = role === 'medico' || role === 'enfermeiro'
  const canRegisterRisk = role !== 'tecnico'
  const canTransfer = role === 'medico' || role === 'enfermeiro'
  const canRegisterOutcome = role === 'medico'
  const professional = professionals[role]

  const appendAudit = (action: string, detail: string) => {
    setAudit((current) => [{
      id: Date.now(), time: formatLocalDateTime(new Date()), action, detail,
      professional: professional.name, signature: `${professional.registry} · assinatura eletrônica válida`,
    }, ...current])
  }

  const confirmAction = () => {
    if (dialog === 'admission') {
      const birth = parseBirthDate(birthDate)!
      const stamp = new Date()
      const age = Math.max(0, stamp.getFullYear() - birth.getFullYear() - (stamp < new Date(stamp.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0))
      const attendanceId = `AI-${stamp.getFullYear()}-${String(Date.now()).slice(-5)}`
      const initials = fullName.trim().split(/\s+/).slice(0, 3).map((part) => part[0]).join('').toUpperCase()
      const admitted: Patient = {
        id: Date.now(), bed: selectedBed, initials, name: fullName.trim(), age, sex,
        admission: attendanceId, diagnosis: diagnosis.trim(), stay: '1º dia de UTI', status: 'stable',
        vitals: [
          { label: 'FC', value: '—', unit: 'bpm' }, { label: 'PA', value: '—', unit: 'mmHg' },
          { label: 'FR', value: '—', unit: 'irpm' }, { label: 'SpO₂', value: '—', unit: '%' },
          { label: 'T°C', value: '—', unit: '°C' },
        ],
        alerts: [{ type: 'warning', icon: 'document', text: 'Sinais vitais aguardando primeira aferição' }],
      }
      onAdmit(admitted)
      setAdmissionSaved(true)
      appendAudit('Admissão e leito confirmados', `${fullName.trim()} admitido(a) na UTI Adulto, leito ${selectedBed}. Atendimento ${attendanceId}. Procedência: ${origin}. CPF: ${cpf || 'não informado'}.`)
      onNotify(`Admissão de ${fullName.trim()} confirmada no leito ${selectedBed}.`)
      setFullName(''); setBirthDate(''); setCpf(''); setDiagnosis(''); setSelectedBed(''); setFormError('')
    }
    if (dialog === 'transfer') {
      if (!selectedTransferPatient) { onNotify('Paciente de origem não encontrado.'); setDialog(null); return }
      onTransfer(selectedTransferPatient.admission, effectiveTransferDestination, transferReason)
      setTransferSaved(true)
      appendAudit('Transferência interna registrada', `${selectedTransferPatient.name}: leito ${selectedTransferPatient.bed} → leito ${effectiveTransferDestination}. Motivo: ${transferReason}.`)
      onNotify(`Transferência concluída: ${selectedTransferPatient.name} agora está no leito ${effectiveTransferDestination}.`)
    }
    if (dialog === 'outcome') {
      if (!selectedOutcomePatient) { onNotify('Selecione um paciente internado.'); setDialog(null); return }
      const result = outcome === 'alta' ? 'Alta' : 'Óbito'
      onOutcome(selectedOutcomePatient.admission, result, outcome === 'alta' ? 'Transferência para Unidade de Internação Clínica.' : 'Óbito registrado pelo médico responsável.')
      appendAudit(outcome === 'alta' ? 'Alta da UTI registrada' : 'Óbito registrado', `${selectedOutcomePatient.name} · leito ${selectedOutcomePatient.bed}. ${outcome === 'alta' ? 'Prontuário global permanece ativo.' : 'Atendimento encerrado.'}`)
      onNotify(outcome === 'alta' ? `Alta registrada. Leito ${selectedOutcomePatient.bed} liberado.` : `Óbito registrado. Leito ${selectedOutcomePatient.bed} liberado.`)
    }
    setDialog(null)
  }

  const risksForPatient = (admission: string): PatientClinicalRisk => getRisks(admission)

  const addRisk = (kind: 'allergy' | 'comorbidity') => {
    if (!canRegisterRisk || !selectedRiskPatient) { onNotify('Selecione um paciente internado antes de registrar riscos.'); return }
    const current = risksForPatient(selectedRiskPatient.admission)
    const stamp = formatLocalDateTime(new Date())
    const updated: PatientClinicalRisk = kind === 'allergy'
      ? { ...current, allergies: [...current.allergies, { substance: allergy.trim(), reaction: allergyReaction.trim(), severity: riskSeverity, recordedAt: stamp, recordedBy: `${professional.name} · ${professional.registry}` }] }
      : { ...current, comorbidities: [...current.comorbidities, { condition: comorbidity.trim(), notes: riskNotes.trim(), status: comorbidityStatus, recordedAt: stamp, recordedBy: `${professional.name} · ${professional.registry}` }] }
    if ((kind === 'allergy' && (!allergy.trim() || !allergyReaction.trim())) || (kind === 'comorbidity' && !comorbidity.trim())) { onNotify('Preencha os dados obrigatórios do risco clínico.'); return }
    onRiskUpdate(selectedRiskPatient.admission, updated)
    appendAudit(kind === 'allergy' ? 'Alergia adicionada' : 'Comorbidade adicionada', `${selectedRiskPatient.name}: ${kind === 'allergy' ? `${allergy}: ${allergyReaction} (${riskSeverity})` : comorbidity}`)
    onNotify(`${kind === 'allergy' ? 'Alergia' : 'Comorbidade'} vinculada ao atendimento ${selectedRiskPatient.admission}.`)
  }

  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Admissão e movimentação do paciente</div><p>Cadastro, alocação de leito, riscos clínicos, transferências e desfecho</p></div>
          <div className="append-only-badge"><Icon name="shield" size={16} /><div><span>REGISTRO CLÍNICO IMUTÁVEL</span><strong>Inclusões e correções permanecem no histórico</strong></div></div>
        </div>

        <div className="admission-tabs">
          <Button className={tab === 'admission' ? 'active' : ''} onClick={() => setTab('admission')}><Icon name="admission" size={15} /> Admissão e leito</Button>
          <Button className={tab === 'risks' ? 'active' : ''} onClick={() => setTab('risks')}><Icon name="alert" size={15} /> Alergias e comorbidades</Button>
          <Button className={tab === 'transfer' ? 'active' : ''} onClick={() => setTab('transfer')}><Icon name="handoff" size={15} /> Transferência interna</Button>
          <Button className={tab === 'outcome' ? 'active' : ''} onClick={() => setTab('outcome')}><Icon name="document" size={15} /> Alta ou óbito</Button>
          <Button className={tab === 'audit' ? 'active' : ''} onClick={() => setTab('audit')}><Icon name="clock" size={15} /> Histórico e auditoria</Button>
        </div>

        {tab === 'admission' && (
          <div className="admission-layout">
            <section className="record-section admission-form-card">
              <div className="admission-section-heading"><div><div className="record-section-title">Identificação e dados da internação</div><p>Todos os dados abaixo são fictícios</p></div><span className={admissionSaved ? 'completed' : ''}>{admissionSaved ? 'Admissão confirmada' : 'Rascunho'}</span></div>
              {!canManageAdmission && <PermissionNotice role={role} allowed="médico ou enfermeiro" />}
              <div className="admission-form-grid">
                <label className="wide"><span>Nome completo <b>*</b></span><input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nome completo do paciente" disabled={!canManageAdmission} required /></label>
                <label><span>Data de nascimento <b>*</b></span><input type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={birthDate} onChange={(event) => setBirthDate(maskBirthDate(event.target.value))} maxLength={10} disabled={!canManageAdmission} required aria-label="Data de nascimento no formato dia, mês e ano" /></label>
                <label><span>Sexo</span><select value={sex} onChange={(event) => setSex(event.target.value)} disabled={!canManageAdmission}><option>Feminino</option><option>Masculino</option><option>Outro</option><option>Não informado</option></select></label>
                <label><span>CPF</span><input value={cpf} onChange={(event) => setCpf(event.target.value)} placeholder="CPF (opcional)" disabled={!canManageAdmission} /></label>
                <label><span>Atendimento</span><input value="Gerado ao confirmar" readOnly /></label>
                <label><span>Procedência <b>*</b></span><select value={origin} onChange={(event) => setOrigin(event.target.value)} disabled={!canManageAdmission}><option>Pronto atendimento</option><option>Centro cirúrgico</option><option>Unidade de internação</option><option>Transferência de outro hospital</option></select></label>
                <label><span>Data e hora da admissão <b>*</b></span><input type="text" value={admissionDateTime} readOnly aria-readonly="true" disabled={!canManageAdmission} required /></label>
                <label className="wide"><span>Diagnóstico de admissão <b>*</b></span><input value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} placeholder="Diagnóstico principal da admissão" disabled={!canManageAdmission} required /></label>
              </div>
            </section>
            <aside className="record-section bed-assignment">
              <div className="record-section-title">Alocação de leito</div>
              <p>Selecione um leito disponível na UTI Adulto</p>
              <div className="bed-map">
                {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((bed) => (
                  <Button
                    className={`${!occupiedBeds.includes(bed) ? 'available' : 'occupied'} ${bed === selectedBed ? 'selected' : ''}`}
                    key={bed}
                    ariaLabel={`Leito ${bed}`}
                    onClick={() => canManageAdmission && !occupiedBeds.includes(bed) && setSelectedBed(bed)}
                  >
                    <span>LEITO</span><strong>{bed}</strong><small>{!occupiedBeds.includes(bed) ? 'Disponível' : 'Ocupado'}</small>
                  </Button>
                ))}
              </div>
              <div className="bed-selected"><Icon name="bed" size={18} /><div><span>LEITO SELECIONADO</span><strong>{selectedBed ? `${selectedBed} · UTI Adulto · 2º andar` : 'Selecione um leito disponível'}</strong></div></div>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <div className="record-signature"><span>Registro será assinado por</span><strong>{professional.name}</strong><small>{professional.registry} · {formatLocalDateTime(systemNow)}</small></div>
              <Button className="primary-button admission-submit" onClick={() => { if (!canManageAdmission) return; if (!fullName.trim() || !parseBirthDate(birthDate) || !diagnosis.trim() || !selectedBed) { setFormError('Preencha o nome, informe uma data de nascimento válida no formato DD/MM/AAAA, o diagnóstico e selecione um leito disponível.'); return } setFormError(''); setDialog('admission') }}>
                <Icon name="check" size={16} /> Confirmar admissão e leito
              </Button>
            </aside>
          </div>
        )}

        {tab === 'risks' && (
          <div className="risk-registration-grid">
            <section className="record-section risk-form" style={{ gridColumn: '1 / -1' }}><label><span>Paciente / atendimento selecionado</span><select value={riskPatientId} onChange={(event) => setRiskPatientId(event.target.value)}>{activePatients.map((patient) => <option key={patient.admission} value={patient.admission}>Leito {patient.bed} · {patient.name} · {patient.admission}</option>)}</select></label></section>
            {!canRegisterRisk && <div className="risk-permission"><PermissionNotice role={role} allowed="médico ou enfermeiro" /></div>}
            <section className="record-section risk-form">
              <div className="risk-form-head allergy"><Icon name="alert" size={19} /><div><div className="record-section-title">Registrar alergia</div><p>O alerta será exibido permanentemente no prontuário</p></div></div>
              <label><span>Substância ou medicamento <b>*</b></span><input value={allergy} onChange={(event) => setAllergy(event.target.value)} disabled={!canRegisterRisk} /></label>
              <label><span>Reação apresentada <b>*</b></span><textarea value={allergyReaction} onChange={(event) => setAllergyReaction(event.target.value)} disabled={!canRegisterRisk} /></label>
              <label><span>Gravidade</span><select value={riskSeverity} onChange={(event) => setRiskSeverity(event.target.value)} disabled={!canRegisterRisk}><option>Grave</option><option>Moderada</option><option>Leve</option></select></label>
              <Button className="danger-outline-button" onClick={() => addRisk('allergy')}><Icon name="alert" size={15} /> Adicionar alergia ao histórico</Button>
            </section>
            <section className="record-section risk-form">
              <div className="risk-form-head"><Icon name="shield" size={19} /><div><div className="record-section-title">Registrar comorbidade</div><p>Condição preexistente relevante para o cuidado</p></div></div>
              <label><span>Comorbidade <b>*</b></span><input value={comorbidity} onChange={(event) => setComorbidity(event.target.value)} disabled={!canRegisterRisk} /></label>
              <label><span>Observações clínicas</span><textarea value={riskNotes} onChange={(event) => setRiskNotes(event.target.value)} placeholder="Observações clínicas relevantes..." disabled={!canRegisterRisk} /></label>
              <label><span>Situação</span><select value={comorbidityStatus} onChange={(event) => setComorbidityStatus(event.target.value)} disabled={!canRegisterRisk}><option>Ativa</option><option>Controlada</option><option>Em investigação</option></select></label>
              <Button className="primary-button" onClick={() => addRisk('comorbidity')}><Icon name="check" size={15} /> Adicionar comorbidade</Button>
            </section>
            <section className="record-section immutable-note"><Icon name="document" size={21} /><div><strong>Registros sem exclusão física</strong><span>Uma informação incorreta deve ser retificada com um novo registro. A versão original permanece disponível para auditoria.</span></div></section>
          </div>
        )}

        {tab === 'transfer' && (
          <div className="single-form-layout">
            <section className="record-section transfer-form">
              <div className="admission-section-heading"><div><div className="record-section-title">Transferência interna</div><p>Movimentação entre leitos ou unidades do hospital</p></div><span className={transferSaved ? 'completed' : ''}>{transferSaved ? 'Transferência registrada' : 'Não iniciada'}</span></div>
              {!canTransfer && <PermissionNotice role={role} allowed="médico ou enfermeiro" />}
              <div className="admission-form-grid">
                <label className="wide"><span>Paciente internado <b>*</b></span><select value={transferPatientId} onChange={(event) => setTransferPatientId(event.target.value)} disabled={!canTransfer}>{activePatients.map((patient) => <option key={patient.admission} value={patient.admission}>Leito {patient.bed} · {patient.name}</option>)}</select></label>
                <label><span>Leito de origem</span><input value={selectedTransferPatient?.bed || '—'} readOnly /></label>
                <label><span>Leito de destino <b>*</b></span><select value={effectiveTransferDestination} onChange={(event) => setTransferDestination(event.target.value)} disabled={!canTransfer}>{availableTransferBeds.filter((bed) => bed !== selectedTransferPatient?.bed).map((bed) => <option key={bed} value={bed}>Leito {bed}</option>)}</select></label>
                <label><span>Data e hora</span><input value={formatLocalDateTime(new Date())} readOnly /></label>
                <label><span>Motivo da transferência <b>*</b></span><select value={transferReason} onChange={(event) => setTransferReason(event.target.value)} disabled={!canTransfer}><option>Necessidade de isolamento</option><option>Adequação assistencial</option><option>Manutenção do leito</option></select></label>
              </div>
              <div className="form-confirm-footer"><div className="record-signature"><span>Responsável pela movimentação</span><strong>{professional.name} · {professional.registry}</strong></div><Button className="primary-button" onClick={() => { if (!canTransfer) return; if (!selectedTransferPatient || !effectiveTransferDestination || effectiveTransferDestination === selectedTransferPatient.bed || occupiedBeds.includes(effectiveTransferDestination)) { onNotify('Selecione um paciente e um leito de destino disponível.'); return } setTransferDestination(effectiveTransferDestination); setDialog('transfer') }}><Icon name="check" size={16} /> Confirmar transferência</Button></div>
            </section>
          </div>
        )}

        {tab === 'outcome' && (
          <div className="single-form-layout">
            <section className="record-section outcome-form">
              <div className="admission-section-heading"><div><div className="record-section-title">Desfecho da internação na UTI</div><p>Registre alta da UTI ou óbito do paciente</p></div><span className="doctor-only">Exclusivo do médico</span></div>
              {!canRegisterOutcome && <PermissionNotice role={role} allowed="médico" />}
              <label className="outcome-patient-select"><span>Paciente internado <b>*</b></span><select value={outcomePatientId} onChange={(event) => setOutcomePatientId(event.target.value)} disabled={!canRegisterOutcome}>{activePatients.map((patient) => <option key={patient.admission} value={patient.admission}>Leito {patient.bed} · {patient.name}</option>)}</select></label>
              <div className="outcome-selector">
                <Button className={outcome === 'alta' ? 'active discharge' : ''} onClick={() => canRegisterOutcome && setOutcome('alta')}><Icon name="handoff" size={19} /><div><strong>Alta da UTI</strong><span>Transferência para outra unidade assistencial</span></div></Button>
                <Button className={outcome === 'obito' ? 'active death' : ''} onClick={() => canRegisterOutcome && setOutcome('obito')}><Icon name="document" size={19} /><div><strong>Óbito</strong><span>Encerramento da internação por falecimento</span></div></Button>
              </div>
              {outcome === 'alta' ? (
                <div className="admission-form-grid">
                  <label><span>Destino <b>*</b></span><select disabled={!canRegisterOutcome}><option>Unidade de Internação Clínica</option><option>Unidade semi-intensiva</option><option>Outro hospital</option></select></label>
                  <label><span>Quarto / leito</span><input defaultValue="Quarto 312 · Leito B" disabled={!canRegisterOutcome} /></label>
                  <label className="wide"><span>Condições de transferência</span><textarea defaultValue="Hemodinamicamente estável, sem droga vasoativa, em oxigênio por cateter nasal a 2 L/min." disabled={!canRegisterOutcome} /></label>
                </div>
              ) : (
                <div className="admission-form-grid death-fields">
                  <label><span>Data e hora do óbito <b>*</b></span><input value={formatLocalDateTime(new Date())} readOnly disabled={!canRegisterOutcome} /></label>
                  <label><span>Médico constatante</span><input defaultValue="Dra. Larissa Menezes · CRM-SP 145829" readOnly /></label>
                  <label className="wide"><span>Causa básica registrada <b>*</b></span><textarea defaultValue="Choque séptico refratário secundário a pneumonia bacteriana grave." disabled={!canRegisterOutcome} /></label>
                  <label className="wide"><span>Comunicação à família</span><input defaultValue="Familiares comunicados presencialmente às 10:48." disabled={!canRegisterOutcome} /></label>
                </div>
              )}
              <div className="form-confirm-footer"><div className="record-signature"><span>Assinatura médica</span><strong>{professional.name} · {professional.registry}</strong></div><Button className={outcome === 'obito' ? 'danger-button' : 'primary-button'} onClick={() => canRegisterOutcome && setDialog('outcome')}><Icon name={outcome === 'obito' ? 'alert' : 'check'} size={16} />{outcome === 'obito' ? 'Confirmar registro de óbito' : 'Confirmar alta da UTI'}</Button></div>
            </section>
          </div>
        )}

        {tab === 'audit' && (
          <section className="record-section audit-card">
            <div className="audit-card-head"><div><div className="record-section-title">Histórico de auditoria</div><p>Linha do tempo append-only: registros podem ser complementados, mas nunca excluídos</p></div><span><Icon name="shield" size={14} /> Integridade verificada</span></div>
            {audit.map((entry) => (
              <div className="audit-row" key={entry.id}>
                <div className="audit-marker"><span /></div>
                <div className="audit-time"><strong>{entry.time.split(' · ')[0]}</strong><span>{entry.time.split(' · ')[1]}</span></div>
                <div className="audit-action"><strong>{entry.action}</strong><span>{entry.detail}</span></div>
                <div className="audit-signature"><strong>{entry.professional}</strong><span><Icon name="check" size={11} />{entry.signature}</span></div>
                <span className="immutable-chip">Permanente</span>
              </div>
            ))}
            <div className="audit-footer"><Icon name="document" size={15} /><span>Não há ação de exclusão disponível. Retificações geram um novo evento vinculado ao registro original.</span></div>
          </section>
        )}
      </div>
      {dialog && <ConfirmationDialog
        title={dialog === 'admission' ? 'Confirmar admissão na UTI?' : dialog === 'transfer' ? 'Confirmar transferência interna?' : outcome === 'alta' ? 'Confirmar alta da UTI?' : 'Confirmar registro de óbito?'}
        description={dialog === 'admission' ? `${fullName || 'O paciente'} será vinculado(a) ao leito ${selectedBed} e o registro de internação será aberto.`
          : dialog === 'transfer' ? `O paciente ${selectedTransferPatient?.name || ''} será movido do leito ${selectedTransferPatient?.bed || ''} para o leito ${effectiveTransferDestination}.` 
          : outcome === 'alta' ? `A permanência de ${selectedOutcomePatient?.name || 'paciente'} na UTI será encerrada e o leito ${selectedOutcomePatient?.bed || ''} será liberado.`
          : 'Este é um registro clínico e legal definitivo. Revise data, hora, causa e comunicação familiar.'}
        danger={dialog === 'outcome' && outcome === 'obito'}
        confirmLabel={dialog === 'outcome' && outcome === 'obito' ? 'Sim, registrar óbito' : 'Confirmar e assinar'}
        onCancel={() => setDialog(null)}
        onConfirm={confirmAction}
      />}
    </main>
  )
}

type PendingTask = { id: number; patient: string; bed: string; task: string; due: string; priority: 'danger' | 'warning' | 'normal'; assignedRole: ProfessionalRole; assignedProfessional: string; createdAt: string; done?: boolean; completedAt?: string; completedBy?: string }

const initialPendingTasks: PendingTask[] = [
  { id: 1, patient: 'Marina L. Souza', bed: '01', task: 'Documentar resposta ao alerta de hipotensão', due: 'Acompanhar agora', priority: 'danger', assignedRole: 'medico', assignedProfessional: professionals.medico.name, createdAt: new Date().toISOString() },
  { id: 2, patient: 'Elisa C. Santos', bed: '08', task: 'Checar administração de antibiótico', due: 'Próximo horário aprazado', priority: 'warning', assignedRole: 'tecnico', assignedProfessional: professionals.tecnico.name, createdAt: new Date().toISOString() },
  { id: 3, patient: 'Ana S. Pereira', bed: '05', task: 'Fechar balanço hídrico parcial', due: 'Durante o turno', priority: 'warning', assignedRole: 'tecnico', assignedProfessional: professionals.tecnico.name, createdAt: new Date().toISOString() },
  { id: 4, patient: 'Carlos A. Ribeiro', bed: '02', task: 'Assinar evolução médica do turno', due: 'Durante o turno', priority: 'normal', assignedRole: 'medico', assignedProfessional: professionals.medico.name, createdAt: new Date().toISOString() },
  { id: 5, patient: 'Marina L. Souza', bed: '01', task: 'Revisar dispositivos e curativos do leito', due: 'Na avaliação do turno', priority: 'warning', assignedRole: 'enfermeiro', assignedProfessional: professionals.enfermeiro.name, createdAt: new Date().toISOString() },
]

function PendingTaskPanel({ open, onClose, onNotify, role, tasks, setTasks }: { open: boolean; onClose: () => void; onNotify: (message: string) => void; role: ProfessionalRole; tasks: PendingTask[]; setTasks: Dispatch<SetStateAction<PendingTask[]>> }) {
  const pending = tasks.filter((task) => !task.done && task.assignedRole === role && task.assignedProfessional === professionals[role].name)
  const completeTask = (id: number) => {
    setTasks((current) => { const updated = current.map((task) => task.id === id ? { ...task, done: true, completedAt: new Date().toISOString(), completedBy: professionals[role].name } : task); localStorage.setItem('avicen-pending-tasks', JSON.stringify(updated)); return updated })
    onNotify('Pendência concluída e mantida no histórico.')
  }
  if (!open) return null
  return (
    <div className="pending-drawer-layer">
      <Button className="pending-drawer-backdrop" onClick={onClose} ariaLabel="Fechar pendências" />
      <aside className="pending-panel open">
        <div className="pending-panel-body">
          <div className="pending-panel-head"><div><strong>Pendências do turno</strong><span>{pending.length} itens requerem acompanhamento</span></div><Button className="icon-button" onClick={onClose} ariaLabel="Fechar"><Icon name="close" size={17} /></Button></div>
          <div className="pending-panel-list">
            {pending.map((task) => (
              <div className={`pending-task ${task.priority}`} key={task.id}>
                <div className="pending-task-bed">L{task.bed}</div>
                <div><strong>{task.task}</strong><span>{task.patient}</span><small>Responsável: {task.assignedProfessional}</small><small><Icon name="clock" size={11} />{task.due}</small></div>
                <Button onClick={() => completeTask(task.id)} ariaLabel="Concluir pendência"><Icon name="check" size={14} /></Button>
              </div>
            ))}
            {!pending.length && <div className="pending-empty"><Icon name="check" size={24} /><strong>Sem pendências abertas</strong><span>Itens concluídos permanecem no histórico de auditoria.</span></div>}
          </div>
          <div className="pending-completed"><span>CONCLUÍDAS NESTA SESSÃO</span><strong>{tasks.filter((task) => task.done).length}</strong></div>
        </div>
      </aside>
    </div>
  )
}

type PatientRegistryEntry = {
  patient: Patient
  cpf: string
  admissionDate: string
  admissionDateLabel: string
  hospitalizationStatus: 'Internado' | 'Alta' | 'Óbito'
}

const additionalPatientRecords: Patient[] = [
  {
    id: 7, bed: '07', initials: 'PMG', name: 'Paulo M. Gomes', age: 59, sex: 'Masculino',
    admission: 'AI-2025-04741', diagnosis: 'Insuficiência cardíaca descompensada', stay: '4º dia de UTI', status: 'stable',
    vitals: [
      { label: 'FC', value: '88', unit: 'bpm' }, { label: 'PA', value: '116/70', unit: 'mmHg' },
      { label: 'FR', value: '20', unit: 'irpm' }, { label: 'SpO₂', value: '96', unit: '%' }, { label: 'T°C', value: '36,6', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'check', text: 'Sem pendências críticas' }],
  },
  {
    id: 8, bed: '09', initials: 'LCB', name: 'Lúcia C. Barros', age: 72, sex: 'Feminino',
    admission: 'AI-2025-04722', diagnosis: 'Sepse de foco urinário', stay: '5º dia de UTI', status: 'warning',
    vitals: [
      { label: 'FC', value: '98', unit: 'bpm' }, { label: 'PA', value: '104/62', unit: 'mmHg' },
      { label: 'FR', value: '22', unit: 'irpm' }, { label: 'SpO₂', value: '95', unit: '%' }, { label: 'T°C', value: '37,4', unit: '°C' },
    ],
    alerts: [{ type: 'warning', icon: 'document', text: 'Reavaliação médica às 11:00' }],
  },
  {
    id: 9, bed: '—', initials: 'MFA', name: 'Márcio F. Almeida', age: 47, sex: 'Masculino',
    admission: 'AI-2025-04398', diagnosis: 'Traumatismo cranioencefálico', stay: 'Alta após 7 dias de UTI', status: 'stable',
    vitals: [
      { label: 'FC', value: '78', unit: 'bpm' }, { label: 'PA', value: '124/76', unit: 'mmHg' },
      { label: 'FR', value: '17', unit: 'irpm' }, { label: 'SpO₂', value: '98', unit: '%' }, { label: 'T°C', value: '36,4', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'check', text: 'Alta registrada em 17/06/2025' }],
  },
  {
    id: 10, bed: '—', initials: 'NRS', name: 'Neusa R. Silveira', age: 81, sex: 'Feminino',
    admission: 'AI-2025-04176', diagnosis: 'Choque cardiogênico refratário', stay: 'Óbito no 3º dia de UTI', status: 'critical',
    vitals: [
      { label: 'FC', value: '—', unit: 'bpm' }, { label: 'PA', value: '—', unit: 'mmHg' },
      { label: 'FR', value: '—', unit: 'irpm' }, { label: 'SpO₂', value: '—', unit: '%' }, { label: 'T°C', value: '—', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'document', text: 'Óbito registrado em 14/06/2025' }],
  },
]

const patientRegistry: PatientRegistryEntry[] = [
  { patient: patients[0], cpf: '***.421.768-**', admissionDate: '2025-06-18', admissionDateLabel: '18/06/2025 · 14:32', hospitalizationStatus: 'Internado' },
  { patient: patients[1], cpf: '***.805.129-**', admissionDate: '2025-06-20', admissionDateLabel: '20/06/2025 · 06:48', hospitalizationStatus: 'Internado' },
  { patient: patients[2], cpf: '***.337.591-**', admissionDate: '2025-06-15', admissionDateLabel: '15/06/2025 · 09:16', hospitalizationStatus: 'Internado' },
  { patient: patients[3], cpf: '***.982.440-**', admissionDate: '2025-06-19', admissionDateLabel: '19/06/2025 · 11:05', hospitalizationStatus: 'Internado' },
  { patient: patients[4], cpf: '***.174.632-**', admissionDate: '2025-06-12', admissionDateLabel: '12/06/2025 · 18:40', hospitalizationStatus: 'Internado' },
  { patient: patients[5], cpf: '***.618.905-**', admissionDate: '2025-06-19', admissionDateLabel: '19/06/2025 · 08:22', hospitalizationStatus: 'Internado' },
  { patient: additionalPatientRecords[0], cpf: '***.550.287-**', admissionDate: '2025-06-17', admissionDateLabel: '17/06/2025 · 16:10', hospitalizationStatus: 'Internado' },
  { patient: additionalPatientRecords[1], cpf: '***.293.714-**', admissionDate: '2025-06-16', admissionDateLabel: '16/06/2025 · 21:34', hospitalizationStatus: 'Internado' },
  { patient: additionalPatientRecords[2], cpf: '***.864.325-**', admissionDate: '2025-06-10', admissionDateLabel: '10/06/2025 · 07:52', hospitalizationStatus: 'Alta' },
  { patient: additionalPatientRecords[3], cpf: '***.046.819-**', admissionDate: '2025-06-12', admissionDateLabel: '12/06/2025 · 03:28', hospitalizationStatus: 'Óbito' },
]

function PatientsScreen({ onOpenPatient, onAddPatient, admittedPatients = [], outcomes = {}, bedMoves = {} }: {
  onOpenPatient: (patient: Patient) => void
  onAddPatient: () => void
  admittedPatients?: Patient[]
  outcomes?: Record<string, 'Alta' | 'Óbito'>
  bedMoves?: Record<string, string>
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'Todos' | 'Internado' | 'Alta' | 'Óbito'>('Todos')
  const [bed, setBed] = useState('Todos')
  const [admissionDate, setAdmissionDate] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const updateFilter = (action: () => void) => {
    action()
    setPage(1)
  }

  const allPatientRegistry = [...patientRegistry, ...admittedPatients.map((patient) => ({ patient, cpf: 'Não informado', admissionDate: new Date().toISOString().slice(0, 10), admissionDateLabel: new Date().toLocaleDateString('pt-BR') + ' · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), hospitalizationStatus: 'Internado' as const }))].map((entry) => ({ ...entry, patient: { ...entry.patient, bed: bedMoves[entry.patient.admission] || entry.patient.bed }, hospitalizationStatus: outcomes[entry.patient.admission] || entry.hospitalizationStatus }))
  const filteredPatients = useMemo(() => allPatientRegistry.filter((entry) => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
    const matchesSearch = !normalizedSearch || `${entry.patient.name} ${entry.cpf} ${entry.patient.admission}`
      .toLocaleLowerCase('pt-BR').includes(normalizedSearch)
    const matchesStatus = status === 'Todos' || entry.hospitalizationStatus === status
    const matchesBed = bed === 'Todos' || entry.patient.bed === bed
    const matchesDate = !admissionDate || entry.admissionDate === admissionDate
    return matchesSearch && matchesStatus && matchesBed && matchesDate
  }), [admissionDate, admittedPatients, bed, search, status])

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize))
  const visibleRows = filteredPatients.slice((page - 1) * pageSize, page * pageSize)
  const hospitalizedCount = allPatientRegistry.filter((entry) => entry.hospitalizationStatus === 'Internado').length
  const startRecord = filteredPatients.length ? (page - 1) * pageSize + 1 : 0
  const endRecord = Math.min(page * pageSize, filteredPatients.length)

  return (
    <main className="patients-page">
      <div className="patients-page-content">
        <div className="patients-page-header">
          <div>
            <div className="page-title">Pacientes</div>
            <p>Gerenciamento e acompanhamento dos pacientes internados na UTI.</p>
          </div>
          <div className="patients-page-header-actions">
            <div className="patients-count-summary"><span>CADASTRADOS</span><strong>{allPatientRegistry.length}</strong></div>
            <div className="patients-count-summary hospitalized"><span>INTERNADOS</span><strong>{hospitalizedCount}</strong></div>
            <Button className="primary-button patients-add-button" onClick={onAddPatient}><Icon name="admission" size={16} /> Adicionar paciente</Button>
          </div>
        </div>

        <section className="record-section patients-directory">
          <div className="patients-directory-filters">
            <label className="patients-search">
              <Icon name="search" size={18} />
              <input value={search} onChange={(event) => updateFilter(() => setSearch(event.target.value))} placeholder="Buscar por nome, CPF ou ID de atendimento..." />
              {search && <Button onClick={() => updateFilter(() => setSearch(''))} ariaLabel="Limpar busca"><Icon name="close" size={14} /></Button>}
            </label>
            <label className="patients-filter-field"><span>Status da internação</span><select value={status} onChange={(event) => updateFilter(() => setStatus(event.target.value as typeof status))}><option>Todos</option><option>Internado</option><option>Alta</option><option>Óbito</option></select></label>
            <label className="patients-filter-field"><span>Leito da UTI</span><select value={bed} onChange={(event) => updateFilter(() => setBed(event.target.value))}><option value="Todos">Todos os leitos</option>{['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="patients-filter-field date"><span>Data de admissão</span><input type="date" value={admissionDate} onChange={(event) => updateFilter(() => setAdmissionDate(event.target.value))} /></label>
            {(search || status !== 'Todos' || bed !== 'Todos' || admissionDate) && <Button className="patients-clear-filters" onClick={() => { setSearch(''); setStatus('Todos'); setBed('Todos'); setAdmissionDate(''); setPage(1) }}>Limpar filtros</Button>}
          </div>

          <div className="patients-table-head">
            <span>PACIENTE</span><span>ID DE ATENDIMENTO</span><span>LEITO</span><span>IDADE</span>
            <span>DIAGNÓSTICO PRINCIPAL</span><span>DATA DE ADMISSÃO</span><span>STATUS</span><span>AÇÕES</span>
          </div>

          <div className="patients-table-body">
            {visibleRows.map((entry) => (
              <div className="patients-table-row" key={entry.patient.id}>
                <Button className="patient-list-identity" onClick={() => onOpenPatient(entry.patient)}>
                  <div className="avatar">{entry.patient.initials}</div>
                  <div><strong>{entry.patient.name}</strong><span>{entry.cpf}</span></div>
                </Button>
                <strong className="patient-attendance-id">{entry.patient.admission}</strong>
                <div className={`patient-list-bed ${entry.patient.bed === '—' ? 'none' : ''}`}><Icon name="bed" size={14} /><strong>{entry.patient.bed}</strong></div>
                <span>{entry.patient.age} anos</span>
                <span className="patient-list-diagnosis">{entry.patient.diagnosis}</span>
                <div className="patient-admission-date"><strong>{entry.admissionDateLabel.split(' · ')[0]}</strong><span>{entry.admissionDateLabel.split(' · ')[1]}</span></div>
                <span className={`patient-hospital-status ${entry.hospitalizationStatus.toLocaleLowerCase('pt-BR')}`}>{entry.hospitalizationStatus}</span>
                <div className="patient-row-actions">
                  <Button className="patient-details-action" onClick={() => onOpenPatient(entry.patient)}>Ver detalhes</Button>
                  <Button className="patient-record-action" onClick={() => onOpenPatient(entry.patient)} ariaLabel={`Abrir prontuário de ${entry.patient.name}`}><Icon name="document" size={15} /></Button>
                </div>
              </div>
            ))}
            {!visibleRows.length && (
              <div className="patients-no-results"><Icon name="search" size={25} /><strong>Nenhum paciente encontrado</strong><span>Revise os termos da busca ou remova um dos filtros aplicados.</span></div>
            )}
          </div>

          <div className="patients-pagination">
            <span>Exibindo <strong>{startRecord}–{endRecord}</strong> de <strong>{filteredPatients.length}</strong> registros</span>
            <div>
              <Button className={page === 1 ? 'disabled' : ''} onClick={() => page > 1 && setPage(page - 1)}><Icon name="chevron" size={14} /> Anterior</Button>
              {Array.from({ length: totalPages }, (_, index) => (
                <Button className={page === index + 1 ? 'active' : ''} onClick={() => setPage(index + 1)} key={index + 1}>{index + 1}</Button>
              ))}
              <Button className={page === totalPages ? 'disabled next' : 'next'} onClick={() => page < totalPages && setPage(page + 1)}>Próxima <Icon name="chevron" size={14} /></Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function LoginScreen({ onLogin }: { onLogin: (role: ProfessionalRole) => void }) {
  const [registration, setRegistration] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<ProfessionalRole>('medico')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!registration.trim() || !password.trim()) {
      setError('Informe seu usuário/registro e sua senha para continuar.')
      return
    }
    setError('')
    onLogin(selectedRole)
  }

  return (
    <main className="login-screen">
      <section className="login-brand-panel">
        <div className="login-brand">
          <div className="brand-mark"><Icon name="activity" size={25} /></div>
          <div><div className="brand-name">AVICEN</div><div className="brand-product">UTI ADULTO</div></div>
        </div>
        <div className="login-brand-copy">
          <span className="login-eyebrow">PRONTUÁRIO ELETRÔNICO DO PACIENTE</span>
          <h1>Cuidado conectado.<br/>Informação no momento certo.</h1>
          <p>Uma visão integrada das informações assistenciais para apoiar a rotina da equipe multiprofissional na Unidade de Terapia Intensiva.</p>
        </div>
        <div className="login-brand-footer"><Icon name="shield" size={16}/> Ambiente de demonstração · Hospital Santa Aurora</div>
      </section>
      <section className="login-form-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-heading"><span>ACESSO AO SISTEMA</span><h2>Entrar no AVICEN</h2><p>Informe suas credenciais profissionais para acessar a unidade.</p></div>
          <label htmlFor="login-role">Perfil profissional</label>
          <select id="login-role" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value as ProfessionalRole)}>
            <option value="medico">Médico</option>
            <option value="enfermeiro">Enfermeiro(a)</option>
            <option value="tecnico">Técnico(a) de enfermagem</option>
          </select>
          <label htmlFor="login-registration">Usuário ou registro profissional</label>
          <input id="login-registration" autoComplete="username" value={registration} onChange={(event) => setRegistration(event.target.value)} placeholder="CRM / COREN / usuário" />
          <label htmlFor="login-password">Senha</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" />
          {error && <div className="login-error" role="alert">{error}</div>}
          <button className="login-submit" type="submit">Entrar no sistema <Icon name="chevron" size={16}/></button>
          <div className="login-demo-note"><Icon name="shield" size={15}/><span>Protótipo acadêmico: autenticação demonstrativa. Use quaisquer credenciais preenchidas para acessar.</span></div>
        </form>
        <div className="login-unit-footer">HOSPITAL SANTA AURORA <span>·</span> UTI ADULTO · 2º ANDAR</div>
      </section>
    </main>
  )
}

export default function App() {
  const [now, setNow] = useState(new Date())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeNav, setActiveNav] = useState('Painel da UTI')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'attention' | 'stable'>('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [role, setRole] = useState<ProfessionalRole>('medico')
  const [invasiveDevices, setInvasiveDevices] = useState<InvasiveDevice[]>(() => { try { return JSON.parse(localStorage.getItem('avicen-invasive-devices') || 'null') as InvasiveDevice[] || initialDevices } catch { return initialDevices } })
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>(() => { try { return JSON.parse(localStorage.getItem('avicen-pending-tasks') || 'null') as PendingTask[] || initialPendingTasks } catch { return initialPendingTasks } })
  const [admittedPatients, setAdmittedPatients] = useState<Patient[]>(() => { try { return JSON.parse(localStorage.getItem('avicen-admitted-patients') || '[]') as Patient[] } catch { return [] } })
  const [patientRisks, setPatientRisks] = useState<PatientRisksByAdmission>(() => { try { return JSON.parse(localStorage.getItem('avicen-patient-risks') || '{}') as PatientRisksByAdmission } catch { return {} } })
  const [patientOutcomes, setPatientOutcomes] = useState<Record<string, 'Alta' | 'Óbito'>>(() => { try { return JSON.parse(localStorage.getItem('avicen-patient-outcomes') || '{}') as Record<string, 'Alta' | 'Óbito'> } catch { return {} } })
  const [patientBedMoves, setPatientBedMoves] = useState<Record<string, string>>(() => { try { return JSON.parse(localStorage.getItem('avicen-patient-bed-moves') || '{}') as Record<string, string> } catch { return {} } })
  const [pendingOpen, setPendingOpen] = useState(false)
  const [selectedMedicationBed, setSelectedMedicationBed] = useState('01')
  const [medicationsByBed, setMedicationsByBed] = useState<Record<string, MedicationOrder[]>>(() => { try { const saved = localStorage.getItem('avicen-medications-by-bed'); return saved ? JSON.parse(saved) as Record<string, MedicationOrder[]> : { '01': prescribedMedications } } catch { return { '01': prescribedMedications } } })
  const medications = medicationsByBed[selectedMedicationBed] ?? (selectedMedicationBed === '01' ? prescribedMedications : [])
  const [schedulesByBed, setSchedulesByBed] = useState<SchedulesByBed>(() => {
    try { return JSON.parse(localStorage.getItem('avicen-medication-schedules') || '{}') as SchedulesByBed } catch { return {} }
  })
  const [approvedByBed, setApprovedByBed] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('avicen-approved-schedules') || '{}') as Record<string, boolean> } catch { return {} }
  })
  const medicationSchedule = schedulesByBed[selectedMedicationBed] ?? (selectedMedicationBed === '01' ? { 1: ['10:00'], 3: ['20:00'], 4: ['08:00'], 5: ['12:00', '18:00', '00:00', '06:00'] } : {})
  const scheduleApproved = approvedByBed[selectedMedicationBed] ?? false
  const updateMedicationSchedule = (next: MedicationSchedule) => {
    setSchedulesByBed((current) => {
      const updated = { ...current, [selectedMedicationBed]: next }
      localStorage.setItem('avicen-medication-schedules', JSON.stringify(updated))
      return updated
    })
    setApprovedByBed((current) => {
      const updated = { ...current, [selectedMedicationBed]: false }
      localStorage.setItem('avicen-approved-schedules', JSON.stringify(updated))
      return updated
    })
  }
  const approveMedicationSchedule = () => setApprovedByBed((current) => {
    const updated = { ...current, [selectedMedicationBed]: true }
    localStorage.setItem('avicen-approved-schedules', JSON.stringify(updated))
    return updated
  })

  useEffect(() => { localStorage.setItem('avicen-invasive-devices', JSON.stringify(invasiveDevices)) }, [invasiveDevices])
  useEffect(() => { localStorage.setItem('avicen-pending-tasks', JSON.stringify(pendingTasks)) }, [pendingTasks])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  const allKnownPatients = useMemo(() => [...patients, ...additionalPatientRecords.slice(0, 2), ...admittedPatients].map((patient) => ({ ...patient, bed: patientBedMoves[patient.admission] || patient.bed })), [admittedPatients, patientBedMoves])
  const dashboardPatients = useMemo(() => allKnownPatients.filter((patient) => !patientOutcomes[patient.admission]), [allKnownPatients, patientOutcomes])
  const activePatients = dashboardPatients
  admittedBedList = activePatients.map((patient) => patient.bed)
  const getPatientRisks = (admission: string): PatientClinicalRisk => patientRisks[admission] || (admission === patients[0].admission ? { allergies: [{ substance: 'Dipirona', reaction: 'anafilaxia', severity: 'Grave', recordedAt: '18/06/2025 · 14:46', recordedBy: 'Enf. Juliana Pires · COREN-SP 412885' }], comorbidities: [{ condition: 'Hipertensão arterial', notes: '', status: 'Ativa', recordedAt: '18/06/2025', recordedBy: 'Equipe assistencial' }, { condition: 'Diabetes mellitus tipo 2', notes: '', status: 'Ativa', recordedAt: '18/06/2025', recordedBy: 'Equipe assistencial' }, { condition: 'DRC estágio 3', notes: '', status: 'Ativa', recordedAt: '18/06/2025', recordedBy: 'Equipe assistencial' }] } : admission === patients[3].admission ? { allergies: [{ substance: 'Penicilina', reaction: 'reação alérgica documentada', severity: 'Moderada', recordedAt: '19/06/2025', recordedBy: 'Equipe assistencial' }], comorbidities: [] } : { allergies: [], comorbidities: [] })
  const updatePatientRisks = (admission: string, risk: PatientClinicalRisk) => setPatientRisks((current) => { const updated = { ...current, [admission]: risk }; localStorage.setItem('avicen-patient-risks', JSON.stringify(updated)); return updated })
  const movePatientBed = (admission: string, destination: string, reason: string) => setPatientBedMoves((current) => { const updated = { ...current, [admission]: destination }; localStorage.setItem('avicen-patient-bed-moves', JSON.stringify(updated)); return updated })
  const closePatientStay = (admission: string, outcome: 'Alta' | 'Óbito') => setPatientOutcomes((current) => { const updated = { ...current, [admission]: outcome }; localStorage.setItem('avicen-patient-outcomes', JSON.stringify(updated)); return updated })
  const visiblePatients = useMemo(() => dashboardPatients.filter((patient) => {
    const matchesQuery = `${patient.name} ${patient.bed} ${patient.admission} ${patient.diagnosis}`
      .toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'all'
      || (filter === 'attention' && patient.status !== 'stable')
      || (filter === 'stable' && patient.status === 'stable')
    return matchesQuery && matchesFilter
  }), [dashboardPatients, filter, query])

  const handleNavigation = (label: string) => {
    setPendingOpen(false)
    if (['Painel da UTI', 'Pacientes', 'Admissão', 'Balanço hídrico', 'Prescrições', 'Aprazamento', 'Checagem de enfermagem', 'Dispositivos invasivos', 'Passagem de plantão'].includes(label)) {
      setActiveNav(label)
      setSelectedPatient(null)
    }
    else setNotice(`${label}: módulo disponível na próxima etapa do protótipo.`)
  }

  const getNavigationRestriction = (label: string) => {
    if (label === 'Prescrições' && role === 'enfermeiro') return 'Acesso somente para consulta. Edição exclusiva do perfil médico.'
    if (label === 'Prescrições' && role === 'tecnico') return 'Acesso restrito ao perfil médico.'
    if (label === 'Aprazamento' && role !== 'enfermeiro') return 'Acesso restrito ao perfil enfermeiro.'
    if (label === 'Checagem de enfermagem' && role !== 'tecnico') return 'Acesso restrito ao perfil técnico de enfermagem.'
    return undefined
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={(selectedRole) => { setRole(selectedRole); setIsAuthenticated(true); setActiveNav('Painel da UTI') }} />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="activity" size={25} /></div>
          <div><div className="brand-name">AVICEN</div><div className="brand-product">UTI ADULTO</div></div>
        </div>
        <div className="unit-selector">
          <div className="unit-icon"><Icon name="bed" size={18} /></div>
          <div><span>Unidade atual</span><strong>UTI Adulto · 2º andar</strong></div>
          <Icon name="chevron" size={16} />
        </div>
        <nav className="nav-list" aria-label="Navegação principal">
          <div className="nav-section-label">ASSISTÊNCIA</div>
          {navItems.slice(0, 8).map((item) => (
            <Button
              key={item.label}
              className={`nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => handleNavigation(item.label)}
              title={getNavigationRestriction(item.label)}
            >
              <Icon name={item.icon} size={18} /><span>{item.label}</span>
              {item.label === 'Checagem de enfermagem' && <b>5</b>}
            </Button>
          ))}
          <div className="nav-section-label secondary">GESTÃO DO TURNO</div>
          {navItems.slice(8).map((item) => (
            <Button key={item.label} className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => handleNavigation(item.label)}>
              <Icon name={item.icon} size={18} /><span>{item.label}</span>
            </Button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="shift-status"><span /><div><strong>Plantão ativo</strong><small>Início às 07:00</small></div></div>
          <div className="hospital-name">Hospital Santa Aurora</div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="date-block">
            <strong>{formatDate(now)}</strong>
            <span>{now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="topbar-actions">
            <Button className="icon-button notification-button" ariaLabel="Notificações" onClick={() => setPendingOpen(true)}>
              <Icon name="bell" size={20} />{pendingTasks.filter((task) => !task.done && task.assignedRole === role && task.assignedProfessional === professionals[role].name).length > 0 && <span className="notification-dot">{pendingTasks.filter((task) => !task.done && task.assignedRole === role && task.assignedProfessional === professionals[role].name).length}</span>}
            </Button>
            <div className="profile-divider" />
            <div className="profile-switch">
              <div className="profile-avatar">{professionals[role].initials}</div>
              <div><strong>{professionals[role].name}</strong><span>{professionals[role].title} · {professionals[role].registry}</span></div>
              <select value={role} onChange={(event) => { setRole(event.target.value as ProfessionalRole); setNotice('Perfil de demonstração alterado.') }} aria-label="Alterar perfil de demonstração">
                <option value="medico">Médica</option><option value="enfermeiro">Enfermeira</option><option value="tecnico">Técnico</option>
              </select>
            </div>
          </div>
        </header>

        {selectedPatient ? (
          <PatientRecord patient={selectedPatient} role={role} onBack={() => setSelectedPatient(null)} onNotify={setNotice} risks={getPatientRisks(selectedPatient.admission)} />
        ) : activeNav === 'Pacientes' ? (
          <PatientsScreen onOpenPatient={setSelectedPatient} onAddPatient={() => setActiveNav('Admissão')} admittedPatients={admittedPatients} outcomes={patientOutcomes} bedMoves={patientBedMoves} />
        ) : activeNav === 'Admissão' ? (
          <AdmissionScreen role={role} onNotify={setNotice} activePatients={activePatients} onRiskUpdate={updatePatientRisks} onTransfer={movePatientBed} onOutcome={closePatientStay} getRisks={getPatientRisks} onAdmit={(patient) => { setAdmittedPatients((current) => { const next = [...current, patient]; localStorage.setItem('avicen-admitted-patients', JSON.stringify(next)); return next }) }} />
        ) : activeNav === 'Balanço hídrico' ? (
          <FluidBalanceScreen onNotify={setNotice} />
        ) : activeNav === 'Prescrições' ? (
          <PrescriptionScreen role={role} onChangeRole={setRole} onNotify={setNotice} patient={activePatients.find((patient) => patient.bed === selectedMedicationBed) || activePatients[0] || patients[0]} risks={getPatientRisks((activePatients.find((patient) => patient.bed === selectedMedicationBed) || activePatients[0] || patients[0]).admission)} activePatients={activePatients} onPatientChange={setSelectedMedicationBed} medications={medications} onMedicationAdd={(medication) => { setMedicationsByBed((current) => { const updated = { ...current, [selectedMedicationBed]: [...(current[selectedMedicationBed] ?? (selectedMedicationBed === '01' ? prescribedMedications : [])).filter((item) => item.id !== medication.id), medication] }; localStorage.setItem('avicen-medications-by-bed', JSON.stringify(updated)); return updated }); setApprovedByBed((current) => { const updated = { ...current, [selectedMedicationBed]: false }; localStorage.setItem('avicen-approved-schedules', JSON.stringify(updated)); return updated }) }} />
        ) : activeNav === 'Aprazamento' ? (
          <SchedulingScreen role={role} onChangeRole={setRole} onNotify={setNotice} medications={medications} schedule={medicationSchedule} onScheduleChange={updateMedicationSchedule} selectedBed={selectedMedicationBed} onSelectedBedChange={setSelectedMedicationBed} approved={scheduleApproved} onApprove={approveMedicationSchedule} />
        ) : activeNav === 'Checagem de enfermagem' ? (
          <AdministrationScreen role={role} onChangeRole={setRole} onNotify={setNotice} medications={medications} schedule={medicationSchedule} approved={scheduleApproved} selectedBed={selectedMedicationBed} onSelectedBedChange={setSelectedMedicationBed} />
        ) : activeNav === 'Dispositivos invasivos' ? (
          <DeviceTrackingScreen onNotify={setNotice} devices={invasiveDevices} setDevices={setInvasiveDevices} activePatients={activePatients} role={role} />
        ) : activeNav === 'Passagem de plantão' ? (
          <ShiftHandoffScreen role={role} onNotify={setNotice} activePatients={activePatients} devices={invasiveDevices} pendingTasks={pendingTasks} />
        ) : <main className="dashboard">
          <div className="page-heading">
            <div>
              <div className="page-title">Painel da UTI</div>
              <p>Visão geral dos pacientes e prioridades assistenciais do turno</p>
            </div>
            <div className="updated-at"><span /><div><strong>Dados atualizados</strong><small>há menos de 1 minuto</small></div></div>
          </div>

          <section className="summary-grid" aria-label="Resumo da unidade">
            <SummaryCard icon="bed" label="OCUPAÇÃO DA UTI" value={`${Math.min(100, activePatients.length * 10)}%`} detail={`${activePatients.length} de 10 leitos ocupados`} />
            <SummaryCard icon="patients" label="PACIENTES INTERNADOS" value={String(activePatients.length)} detail="Tempo médio: 4,2 dias" />
            <SummaryCard icon="check" label="LEITOS DISPONÍVEIS" value={String(Math.max(0, 10 - activePatients.length))} detail="Leitos disponíveis" tone="success" />
            <SummaryCard icon="alert" label="REQUEREM ATENÇÃO" value="4" detail="1 crítico · 3 em observação" tone="danger" />
          </section>

          <SafetyHuddle />

          <section className="patients-section">
            <div className="patients-toolbar">
              <div>
                <div className="section-title">Pacientes internados <span>{visiblePatients.length}</span></div>
                <p>Ordenados por prioridade clínica</p>
              </div>
              <div className="toolbar-controls">
                <label className="search-field">
                  <Icon name="search" size={18} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar paciente, leito ou atendimento" />
                  {query && <Button className="clear-search" onClick={() => setQuery('')} ariaLabel="Limpar busca"><Icon name="close" size={15} /></Button>}
                </label>
                <div className="filter-group">
                  <Icon name="filter" size={17} />
                  <Button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todos</Button>
                  <Button className={filter === 'attention' ? 'active' : ''} onClick={() => setFilter('attention')}>Atenção</Button>
                  <Button className={filter === 'stable' ? 'active' : ''} onClick={() => setFilter('stable')}>Estáveis</Button>
                </div>
              </div>
            </div>

            {visiblePatients.length ? (
              <div className="patient-grid">
                {visiblePatients.map((patient) => <PatientCard key={patient.id} patient={patient} onOpen={() => setSelectedPatient(patient)} />)}
                {!query && filter === 'all' && ['01','02','03','04','05','06','07','08','09','10'].filter((bed) => !activePatients.some((patient) => patient.bed === bed)).map((bed) => <AvailableBedCard key={bed} bed={bed} />)}
              </div>
            ) : (
              <div className="empty-state"><Icon name="search" size={28} /><strong>Nenhum paciente encontrado</strong><span>Revise a busca ou altere os filtros.</span></div>
            )}
          </section>
        </main>}
      </div>

      <PendingTaskPanel open={pendingOpen} onClose={() => setPendingOpen(false)} onNotify={setNotice} role={role} tasks={pendingTasks} setTasks={setPendingTasks} />
      {notice && <div className="toast"><Icon name="check" size={17} /><span>{notice}</span></div>}
    </div>
  )
}
