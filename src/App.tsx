import { useEffect, useMemo, useRef, useState, type Dispatch, type RefObject, type SetStateAction, type FormEvent, type ReactNode } from 'react'

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
  | 'logout'
  | 'medication'
  | 'more'
  | 'moon'
  | 'patients'
  | 'search'
  | 'shield'
  | 'sun'
  | 'menu'

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
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>,
  medication: <><path d="M10 4 4 10a4.2 4.2 0 0 0 6 6l6-6a4.2 4.2 0 0 0-6-6ZM7 7l6 6M17 14v7M13.5 17.5h7" /></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  moon: <><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></>,
  patients: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M9 12h6M12 9v6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
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
  weightKg?: number
  weightRecordedAt?: string
  birthDate?: string
  admission: string
  diagnosis: string
  cid10: string
  cpfMasked?: string
  receptionRecordId?: string
  admissionOrigin?: 'NIR' | 'Recepção'
  homeMedications?: string[]
  admittedAt?: string
  stay: string
  status: 'critical' | 'warning' | 'stable'
  vitals: { label: string; value: string; unit?: string; alert?: boolean }[]
  alerts: { type: 'danger' | 'warning' | 'neutral'; icon: IconName; text: string }[]
}

type PatientClinicalRisk = {
  allergies: { substance: string; reaction: string; severity: string; recordedAt: string; recordedBy: string }[]
  comorbidities: { condition: string; notes: string; status: string; recordedAt: string; recordedBy: string }[]
  allergiesReviewed?: boolean
  comorbiditiesReviewed?: boolean
}
type PatientRisksByAdmission = Record<string, PatientClinicalRisk>
type PatientOutcomeRecord = {
  status: 'Alta' | 'Óbito'
  recordedAt: string
  recordedBy: string
  cause?: string
  familyCommunication?: string
  medicalDecisionAt?: string
  medicalDecisionBy?: string
  destinationUnit?: DischargeDestinationUnit
  destinationBed?: string
  transportedAt?: string
  transportedBy?: string
}
type DischargeDestinationUnit = 'Unidade de Internação Clínica' | 'Unidade semi-intensiva'
type MedicalDischargeOrder = {
  medicalJustification: string
  transferConditions: string
  orderedAt: string
  orderedBy: string
  status: 'Aguardando organização da enfermagem' | 'Aguardando transporte' | 'Transporte concluído'
  destinationUnit?: DischargeDestinationUnit
  destinationBed?: string
  organizedAt?: string
  organizedBy?: string
  transportedAt?: string
  transportedBy?: string
}
type MedicalDischargeOrders = Record<string, MedicalDischargeOrder>
const dischargeDestinationBeds: Record<DischargeDestinationUnit, string[]> = {
  'Unidade de Internação Clínica': ['312-A', '312-B', '318-A'],
  'Unidade semi-intensiva': ['214-A', '214-B'],
}
type InstitutionalPatientRecord = {
  patient: Patient
  birthDate: string
  risks: PatientClinicalRisk
  historySummary: string[]
}
type ReceptionAdmissionIdentity = {
  id: string
  name: string
  birthDate: string
  sex: string
  cpfMasked: string
}
type ProfessionalRole = 'medico' | 'enfermeiro' | 'tecnico'
type HuddleExamStatus = 'Agendado' | 'Pendente' | 'Concluído'
type HuddleAssetCategory = 'Infraestrutura' | 'Equipamento'
type HuddleExam = { id: number; bed: string; event: string; scheduledAt: string; status: HuddleExamStatus }
type HuddleAsset = { id: number; category: HuddleAssetCategory; name: string; status: string; details: string }
type SafetyHuddleData = { updatedAt: string; reviewedPatients: string[]; exams: HuddleExam[]; assets: HuddleAsset[] }

const noKnownClinicalFinding = 'Nenhuma conhecida'
const allergyCatalog = [
  'Amoxicilina', 'Penicilina', 'Cefalosporinas', 'Beta-lactâmicos', 'Ceftriaxona',
  'Dipirona', 'Metamizol', 'Vancomicina', 'Sulfonamidas', 'AINEs',
  'Contraste iodado', 'Látex', 'Clorexidina',
]
const comorbidityCatalog = [
  'Hipertensão arterial', 'Diabetes mellitus tipo 2', 'Doença renal crônica',
  'Insuficiência cardíaca', 'Doença arterial coronariana', 'Doença pulmonar obstrutiva crônica',
  'Asma', 'Obesidade', 'Hipotireoidismo', 'Epilepsia', 'Fibrilação atrial',
]
const homeMedicationCatalog = [
  'Losartana', 'Enalapril', 'Metformina', 'Insulina', 'AAS (ácido acetilsalicílico)',
  'Atorvastatina', 'Sinvastatina', 'Omeprazol', 'Furosemida', 'Anlodipino',
  'Carvedilol', 'Levotiroxina', 'Varfarina', 'Apixabana',
]

function ClinicalCatalogPicker({ label, options, value, onChange, disabled }: {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
  const filteredOptions = [...options, noKnownClinicalFinding].filter((option) =>
    option.toLocaleLowerCase('pt-BR').includes(normalizedSearch) && !value.includes(option))
  const selectOption = (option: string) => {
    onChange(option === noKnownClinicalFinding
      ? [noKnownClinicalFinding]
      : [...value.filter((item) => item !== noKnownClinicalFinding), option])
    setSearch('')
    setOpen(false)
  }

  return (
    <div className="clinical-catalog-picker">
      <label className="clinical-catalog-search-label">
        <span>{label} <b>*</b></span>
        <span className="clinical-catalog-search">
          <Icon name="search" size={15} />
          <input
            type="search"
            aria-label={`Buscar ${label.toLocaleLowerCase('pt-BR')} no catálogo`}
            value={search}
            onChange={(event) => { setSearch(event.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
              if (event.key === 'Enter' && filteredOptions.length === 1) {
                event.preventDefault()
                selectOption(filteredOptions[0])
              }
            }}
            placeholder="Buscar no catálogo"
            autoComplete="off"
            disabled={disabled}
          />
        </span>
      </label>
      {open && !disabled && <div className="clinical-catalog-options" role="listbox" aria-label={`Opções de ${label.toLocaleLowerCase('pt-BR')}`}>
        {filteredOptions.length ? filteredOptions.map((option) => (
          <button type="button" role="option" aria-selected="false" key={option} onClick={() => selectOption(option)}>{option}</button>
        )) : <span>Nenhum resultado no catálogo.</span>}
      </div>}
      <div className="clinical-catalog-selected" aria-live="polite">
        {value.map((item) => (
          <span className="clinical-catalog-chip" key={item}>
            {item}
            {!disabled && <button type="button" aria-label={`Remover ${item}`} onClick={() => onChange(value.filter((selected) => selected !== item))}>×</button>}
          </span>
        ))}
        {!value.length && <span className="clinical-catalog-empty">Selecione uma opção do catálogo.</span>}
      </div>
    </div>
  )
}

function loadPatientOutcomes(): Record<string, PatientOutcomeRecord> {
  try {
    const saved = JSON.parse(localStorage.getItem('avicen-patient-outcomes') || '{}') as Record<string, PatientOutcomeRecord | 'Alta' | 'Óbito'>
    return Object.fromEntries(Object.entries(saved).map(([admission, outcome]) => [
      admission,
      typeof outcome === 'string'
        ? { status: outcome, recordedAt: '', recordedBy: 'Registro anterior' }
        : outcome,
    ]))
  } catch {
    return {}
  }
}

function loadMedicalDischargeOrders(): MedicalDischargeOrders {
  try {
    return JSON.parse(localStorage.getItem('avicen-medical-discharge-orders') || '{}') as MedicalDischargeOrders
  } catch {
    return {}
  }
}

function createInitialSafetyHuddle(): SafetyHuddleData {
  return {
    updatedAt: new Date().toISOString(),
    reviewedPatients: [],
    exams: [
      { id: 1, bed: '02', event: 'Tomografia computadorizada', scheduledAt: '16:00', status: 'Agendado' },
      { id: 2, bed: '07', event: 'Radiografia de leito', scheduledAt: '', status: 'Pendente' },
    ],
    assets: [
      { id: 1, category: 'Infraestrutura', name: 'Gaveta do posto de enfermagem', status: 'Reparo solicitado', details: 'Trilho danificado · chamado aberto para manutenção predial' },
      { id: 2, category: 'Infraestrutura', name: 'Luminária do leito 04', status: 'Reparo solicitado', details: 'Lâmpada inoperante · avaliação pendente' },
      { id: 3, category: 'Equipamento', name: 'Bomba de infusão 03', status: 'Emprestado', details: 'No setor de emergência · previsão de retorno às 16:30' },
      { id: 4, category: 'Equipamento', name: 'Bomba de infusão 07', status: 'Em manutenção', details: 'Engenharia clínica · ordem de serviço 2048' },
    ],
  }
}

const DEFAULT_FONT_SCALE = 1.4

const demoAccounts: { username: string; password: string; role: ProfessionalRole }[] = [
  { username: 'medico', password: 'medico123', role: 'medico' },
  { username: 'enfermeiro', password: 'enfermeiro123', role: 'enfermeiro' },
  { username: 'tecnico', password: 'tecnico123', role: 'tecnico' },
]

const professionals: Record<ProfessionalRole, { initials: string; name: string; title: string; registry: string }> = {
  medico: { initials: 'LM', name: 'Dra. Larissa Menezes', title: 'Médica intensivista', registry: 'CRM-SP 145829' },
  enfermeiro: { initials: 'CT', name: 'Enf. Camila Torres', title: 'Enfermeira assistencial', registry: 'COREN-SP 598214' },
  tecnico: { initials: 'AL', name: 'Tec. André Lima', title: 'Técnico de enfermagem', registry: 'COREN-SP 1274058' },
}

const patients: Patient[] = [
  {
    id: 1, bed: '01', initials: 'MLS', name: 'Marina L. Souza', age: 68, sex: 'Feminino',
    admission: 'AI-2025-04821', diagnosis: 'Choque séptico de foco pulmonar', cid10: 'R57.2', stay: '3º dia de UTI', status: 'critical',
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
    admission: 'AI-2025-04798', diagnosis: 'Pós-operatório de revascularização', cid10: 'Z48.8', stay: '1º dia de UTI', status: 'warning',
    vitals: [
      { label: 'FC', value: '96', unit: 'bpm' }, { label: 'PA', value: '102/64', unit: 'mmHg' },
      { label: 'FR', value: '22', unit: 'irpm' }, { label: 'SpO₂', value: '94', unit: '%' },
      { label: 'T°C', value: '37,2', unit: '°C' },
    ],
    alerts: [{ type: 'warning', icon: 'document', text: 'Evolução médica sem assinatura' }],
  },
  {
    id: 3, bed: '03', initials: 'JPF', name: 'João P. Ferreira', age: 76, sex: 'Masculino',
    admission: 'AI-2025-04667', diagnosis: 'Insuficiência respiratória aguda', cid10: 'J96.0', stay: '6º dia de UTI', status: 'stable',
    vitals: [
      { label: 'FC', value: '82', unit: 'bpm' }, { label: 'PA', value: '118/72', unit: 'mmHg' },
      { label: 'FR', value: '18', unit: 'irpm' }, { label: 'SpO₂', value: '97', unit: '%' },
      { label: 'T°C', value: '36,5', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'check', text: 'Sem pendências críticas' }],
  },
  {
    id: 4, bed: '05', initials: 'ASP', name: 'Ana S. Pereira', age: 43, sex: 'Feminino',
    admission: 'AI-2025-04806', diagnosis: 'Pancreatite aguda grave', cid10: 'K85.9', stay: '2º dia de UTI', status: 'warning',
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
    admission: 'AI-2025-04589', diagnosis: 'Acidente vascular cerebral hemorrágico', cid10: 'I61.9', stay: '8º dia de UTI', status: 'stable',
    vitals: [
      { label: 'FC', value: '74', unit: 'bpm' }, { label: 'PA', value: '132/78', unit: 'mmHg' },
      { label: 'FR', value: '16', unit: 'irpm' }, { label: 'SpO₂', value: '98', unit: '%' },
      { label: 'T°C', value: '36,3', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'check', text: 'Sem pendências críticas' }],
  },
  {
    id: 6, bed: '08', initials: 'ECS', name: 'Elisa C. Santos', age: 35, sex: 'Feminino',
    admission: 'AI-2025-04817', diagnosis: 'Pneumonia bacteriana grave', cid10: 'J15.9', stay: '2º dia de UTI', status: 'warning',
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
  { label: 'Prescrições', icon: 'medication' },
  { label: 'Aprazamento de enfermagem', icon: 'clock' },
  { label: 'Admissão', icon: 'admission' },
  { label: 'Passagem de plantão', icon: 'handoff' },
]

const physicianNavItems = [navItems[0], navItems[1], navItems[2], navItems[4], navItems[5]]
const nurseNavItems = navItems.filter((item) => item.label !== 'Prescrições')
const technicianNavItems = nurseNavItems.filter((item) => item.label !== 'Aprazamento de enfermagem')

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  }).format(date)
}

function formatLocalDateTime(date: Date) {
  return `${date.toLocaleDateString('pt-BR')} · ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

function getStayDuration(admissionDate: string) {
  const [year, month, day] = admissionDate.slice(0, 10).split('-').map(Number)
  const admissionDay = Date.UTC(year, month - 1, day)
  const today = new Date()
  const currentDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  if (!year || !month || !day || Number.isNaN(admissionDay)) return 'Permanência não informada'
  const days = Math.max(1, Math.floor((currentDay - admissionDay) / 86_400_000) + 1)
  return `${days} ${days === 1 ? 'dia' : 'dias'} de internação`
}

function comparePatientsByBed(left: Patient, right: Patient) {
  const leftBed = /^\d+$/.test(left.bed) ? Number(left.bed) : Number.POSITIVE_INFINITY
  const rightBed = /^\d+$/.test(right.bed) ? Number(right.bed) : Number.POSITIVE_INFINITY
  return leftBed - rightBed || left.bed.localeCompare(right.bed, 'pt-BR') || left.admission.localeCompare(right.admission)
}

function parseBirthDate(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null
  const [day, month, year] = value.split('/').map(Number)
  const date = new Date(year, month - 1, day, 12)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  if (date > new Date()) return null
  return date
}

function getAgeAtDate(birthDate: Date, referenceDate: Date) {
  const age = referenceDate.getFullYear() - birthDate.getFullYear()
  const birthdayHasPassed = referenceDate >= new Date(referenceDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  return Math.max(0, age - (birthdayHasPassed ? 0 : 1))
}

function Button({
  children, className = '', onClick, ariaLabel, title, disabled = false,
}: { children?: ReactNode; className?: string; onClick?: () => void; ariaLabel?: string; title?: string; disabled?: boolean }) {
  return <button className={className} onClick={onClick} aria-label={ariaLabel} title={title} disabled={disabled}>{children}</button>
}

const nirTransferRecords: InstitutionalPatientRecord[] = [
  {
    patient: {
      id: 11, bed: '—', initials: 'RFA', name: 'Renato F. Almeida', age: 62, sex: 'Masculino',
      admission: 'AI-2026-03147', diagnosis: 'Pneumonia comunitária', cid10: 'J18.9', cpfMasked: '***.740.391-**', stay: 'Histórico institucional',
      status: 'warning',
      vitals: [
        { label: 'FC', value: '92', unit: 'bpm' }, { label: 'PA', value: '128/76', unit: 'mmHg' },
        { label: 'FR', value: '20', unit: 'irpm' }, { label: 'SpO₂', value: '95', unit: '%' }, { label: 'T°C', value: '37,2', unit: '°C' },
      ],
      alerts: [{ type: 'neutral', icon: 'document', text: 'Registro institucional localizado pelo NIR' }],
      homeMedications: ['Losartana 50 mg · 1x/dia', 'Metformina 850 mg · 2x/dia'],
    },
    birthDate: '14/08/1964',
    risks: {
      allergies: [{ substance: 'Amoxicilina', reaction: 'Urticária', severity: 'Moderada', recordedAt: '03/11/2026', recordedBy: 'Prontuário institucional' }],
      comorbidities: [{ condition: 'Hipertensão arterial', notes: 'Em tratamento regular', status: 'Ativa', recordedAt: '03/11/2026', recordedBy: 'Prontuário institucional' }],
      allergiesReviewed: true,
      comorbiditiesReviewed: true,
    },
    historySummary: ['Atendimento AI-2026-03147 localizado no prontuário institucional.', 'Alergias, comorbidades e medicações domiciliares serão herdadas sem recadastro.'],
  },
]

const receptionAdmissionIdentities: ReceptionAdmissionIdentity[] = [
  { id: 'REC-2026-06214', name: 'Camila R. Alves', birthDate: '04/09/1972', sex: 'Feminino', cpfMasked: '***.482.761-**' },
  { id: 'REC-2026-06215', name: 'Eduardo S. Martins', birthDate: '11/02/1958', sex: 'Masculino', cpfMasked: '***.193.540-**' },
]

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

function PatientCard({ patient, hospitalizationStatus, risks, onOpen }: {
  patient: Patient
  hospitalizationStatus: 'Internado' | 'Alta' | 'Óbito'
  risks: PatientClinicalRisk
  onOpen: () => void
}) {
  const latestVitals = (() => {
    try {
      const history = JSON.parse(localStorage.getItem(`avicen-vitals-${patient.admission}`) || '[]') as Array<{
        at: string
        values: { fc: string; systolic: string; diastolic: string; fr: string; spo2: string; temp: string }
      }>
      const latest = history[history.length - 1]
      if (latest) return {
        at: latest.at,
        values: [
          { label: 'FC', value: latest.values.fc, unit: 'bpm' },
          { label: 'PA', value: `${latest.values.systolic}/${latest.values.diastolic}`, unit: 'mmHg' },
          { label: 'FR', value: latest.values.fr, unit: 'irpm' },
          { label: 'SpO₂', value: latest.values.spo2, unit: '%' },
          { label: 'T°C', value: latest.values.temp, unit: '°C' },
        ],
      }
    } catch {
      return { at: '', values: patient.vitals }
    }
    return { at: '', values: patient.vitals }
  })()
  const isHospitalized = hospitalizationStatus === 'Internado'
  const clinicalStatus = isHospitalized ? patient.status : 'history'
  const clinicalStatusLabel = hospitalizationStatus === 'Internado'
    ? ({ critical: 'Crítico', warning: 'Observação', stable: 'Estável' } as const)[patient.status]
    : hospitalizationStatus
  const allergyText = risks.allergies.length
    ? risks.allergies.map((allergy) => `${allergy.substance} — ${allergy.reaction}`).join(' · ')
    : risks.allergiesReviewed ? 'Nenhuma alergia conhecida na admissão' : 'Nenhuma alergia registrada'

  return (
    <button type="button" className={`patient-card status-${clinicalStatus}`} onClick={onOpen} aria-label={`Abrir prontuário de ${patient.name}, leito ${patient.bed}`}>
      <div className="patient-card-head">
        <div className="bed-block">
          <span className="bed-label">LEITO</span>
          <strong>{patient.bed === '—' ? 'Histórico' : patient.bed}</strong>
        </div>
        <div className="patient-identity">
          <div className="avatar">{patient.initials}</div>
          <div className="patient-copy">
            <div className="patient-name">{patient.name}</div>
            <div className="patient-meta">{patient.age} anos · {patient.admission}</div>
          </div>
        </div>
        <span className={`patient-status-label ${clinicalStatus}`}>{clinicalStatusLabel}</span>
        <Icon name="chevron" size={18} />
      </div>

      <div className="diagnosis">
        <span>HIPÓTESE DIAGNÓSTICA</span>
        <strong>{patient.diagnosis}</strong>
        <small>CID-10: {patient.cid10 || 'Não informado'}</small>
        <small>{isHospitalized && patient.admittedAt ? getStayDuration(patient.admittedAt) : patient.stay}</small>
      </div>

      <div className="vitals-grid">
        {latestVitals.values.map((vital) => (
          <div className={`vital ${vital.alert ? 'abnormal' : ''}`} key={vital.label}>
            <span>{vital.label}</span>
            <strong>{vital.value}</strong>
            <small>{vital.unit}</small>
          </div>
        ))}
      </div>
      <div className="patient-vitals-time">
        <span>Últimos sinais vitais</span>
        <small>{latestVitals.at || (latestVitals.values.some((vital) => vital.value !== '—') ? 'Dados de referência do protótipo' : 'Aguardando primeira aferição')}</small>
      </div>

      <div className={`patient-allergy-alert ${risks.allergies.length ? 'danger' : 'clear'}`}>
        <Icon name="alert" size={16} />
        <div><strong>ALERGIA MEDICAMENTOSA</strong><span>{allergyText}</span></div>
      </div>
    </button>
  )
}

function SafetyHuddle({ activePatients, huddle, now, onUpdate }: {
  activePatients: Patient[]
  huddle: SafetyHuddleData
  now: Date
  onUpdate: () => void
}) {
  const criticalPatients = activePatients.filter((patient) => patient.status === 'critical').sort(comparePatientsByBed)
  const updatedAt = new Date(huddle.updatedAt)
  const isCycleOverdue = !Number.isFinite(updatedAt.getTime()) || now.getTime() - updatedAt.getTime() >= 12 * 60 * 60 * 1000
  const hasUnreviewedCritical = criticalPatients.some((patient) => !huddle.reviewedPatients.includes(patient.admission))
  const isUpdateDue = isCycleOverdue || hasUnreviewedCritical
  const updatedAtLabel = Number.isNaN(updatedAt.getTime()) ? 'Atualização não registrada' : updatedAt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  const cycleStatus = isCycleOverdue ? 'Atualização do plantão pendente' : hasUnreviewedCritical ? 'Novo caso crítico para validar' : 'Ciclo de 12 horas ativo'

  return (
    <section className="safety-huddle">
      <div className="safety-huddle-header">
        <div className="safety-huddle-title"><Icon name="shield" size={21} /><div><strong>Safety Huddle</strong><span>Segurança do paciente e infraestrutura da UTI</span></div></div>
        <div className={`safety-huddle-cycle ${isUpdateDue ? 'due' : ''}`}>
          <span className="safety-huddle-cycle-status">{cycleStatus}</span>
          <small>Última validação: {updatedAtLabel}</small>
        </div>
        <button type="button" className="safety-huddle-update-button" onClick={onUpdate}>
          <Icon name="check" size={16} /> Atualizar Safety Huddle (Plantão 12h)
        </button>
      </div>

      <div className="safety-huddle-pillars">
        <section className="safety-huddle-pillar critical">
          <div className="safety-huddle-pillar-heading"><span className="safety-huddle-pillar-icon"><Icon name="alert" size={17} /></span><div><strong>Criticidade de pacientes</strong><small>{criticalPatients.length} caso(s) crítico(s) na unidade</small></div></div>
          <div className="safety-huddle-items">
            {criticalPatients.length ? criticalPatients.map((patient) => (
              <div className="safety-huddle-item" key={patient.admission}>
                <b>Leito {patient.bed}</b><span>{patient.name} · {patient.diagnosis}</span><em>Risco elevado</em>
              </div>
            )) : <div className="safety-huddle-empty">Nenhum paciente crítico sinalizado no censo.</div>}
          </div>
        </section>

        <section className="safety-huddle-pillar logistics">
          <div className="safety-huddle-pillar-heading"><span className="safety-huddle-pillar-icon"><Icon name="clock" size={17} /></span><div><strong>Exames e logística crítica</strong><small>{huddle.exams.filter((exam) => exam.status !== 'Concluído').length} evento(s) em acompanhamento</small></div></div>
          <div className="safety-huddle-items">
            {huddle.exams.length ? huddle.exams.map((exam) => (
              <div className="safety-huddle-item" key={exam.id}>
                <b>Leito {exam.bed || '—'}</b><span>{exam.event || 'Evento não descrito'}{exam.scheduledAt ? ` · ${exam.scheduledAt}` : ''}</span><em className={exam.status === 'Concluído' ? 'complete' : exam.status === 'Agendado' ? 'scheduled' : ''}>{exam.status}</em>
              </div>
            )) : <div className="safety-huddle-empty">Nenhum exame ou evento logístico registrado.</div>}
          </div>
        </section>

        <section className="safety-huddle-pillar assets">
          <div className="safety-huddle-pillar-heading"><span className="safety-huddle-pillar-icon"><Icon name="device" size={17} /></span><div><strong>Infraestrutura e equipamentos</strong><small>{huddle.assets.length} item(ns) monitorado(s)</small></div></div>
          <div className="safety-huddle-items">
            {huddle.assets.length ? huddle.assets.map((asset) => (
              <div className="safety-huddle-item" key={asset.id}>
                <b>{asset.name}</b><span>{asset.details}</span><em className={asset.status === 'Em uso' ? 'complete' : ''}>{asset.category} · {asset.status}</em>
              </div>
            )) : <div className="safety-huddle-empty">Nenhum item de infraestrutura ou equipamento registrado.</div>}
          </div>
        </section>
      </div>
    </section>
  )
}

function PriorityPanel({ tasks, onOpenTasks }: { tasks: PendingTask[]; onOpenTasks: () => void }) {
  const openTasks = tasks.filter((task) => !task.done)
  const priorities = [
    { key: 'danger', label: 'Ação imediata', empty: 'Sem ações imediatas', tasks: openTasks.filter((task) => task.priority === 'danger') },
    { key: 'warning', label: 'Acompanhar no turno', empty: 'Sem itens em observação', tasks: openTasks.filter((task) => task.priority === 'warning') },
    { key: 'normal', label: 'Rotina', empty: 'Sem tarefas de rotina', tasks: openTasks.filter((task) => task.priority === 'normal') },
  ] as const

  return (
    <section className="priority-panel" aria-label="Prioridades e logística do turno">
      <div className="priority-heading">
        <div className="priority-icon"><Icon name="alert" size={19} /></div>
        <div><strong>Prioridades do turno</strong><span>{openTasks.length} pendências abertas</span></div>
      </div>
      <div className="priority-items">
        {priorities.map((priority) => (
          <button type="button" className="priority-item" key={priority.key} onClick={onOpenTasks}>
            <span className={`priority-count ${priority.key}`}>{priority.tasks.length}</span>
            <span><strong>{priority.label}</strong><small>{priority.tasks[0] ? `L${priority.tasks[0].bed} · ${priority.tasks[0].task}` : priority.empty}</small></span>
            <Icon name="chevron" size={16} />
          </button>
        ))}
      </div>
    </section>
  )
}

function SafetyHuddleUpdateDialog({ activePatients, huddle, onClose, onSave }: {
  activePatients: Patient[]
  huddle: SafetyHuddleData
  onClose: () => void
  onSave: (updated: SafetyHuddleData) => void
}) {
  const [draft, setDraft] = useState<SafetyHuddleData>(() => ({
    ...huddle,
    reviewedPatients: [...huddle.reviewedPatients],
    exams: huddle.exams.map((exam) => ({ ...exam })),
    assets: huddle.assets.map((asset) => ({ ...asset })),
  }))
  const [error, setError] = useState('')
  const criticalPatients = activePatients.filter((patient) => patient.status === 'critical').sort(comparePatientsByBed)

  const updateExam = (id: number, changes: Partial<HuddleExam>) => {
    setDraft((current) => ({ ...current, exams: current.exams.map((exam) => exam.id === id ? { ...exam, ...changes } : exam) }))
  }
  const updateAsset = (id: number, changes: Partial<HuddleAsset>) => {
    setDraft((current) => ({ ...current, assets: current.assets.map((asset) => asset.id === id ? { ...asset, ...changes } : asset) }))
  }
  const togglePatientReview = (admission: string) => {
    setDraft((current) => ({
      ...current,
      reviewedPatients: current.reviewedPatients.includes(admission)
        ? current.reviewedPatients.filter((item) => item !== admission)
        : [...current.reviewedPatients, admission],
    }))
  }
  const saveUpdate = () => {
    if (criticalPatients.some((patient) => !draft.reviewedPatients.includes(patient.admission))) {
      setError('Valide todos os pacientes críticos antes de concluir a atualização do plantão.')
      return
    }
    if (draft.exams.some((exam) => !exam.bed.trim() || !exam.event.trim() || !exam.status)
      || draft.assets.some((asset) => !asset.name.trim() || !asset.status.trim() || !asset.details.trim())) {
      setError('Complete leito, evento, status e detalhes dos itens antes de salvar.')
      return
    }
    onSave({ ...draft, updatedAt: new Date().toISOString() })
  }
  const addExam = () => setDraft((current) => ({
    ...current,
    exams: [...current.exams, { id: Date.now(), bed: '', event: '', scheduledAt: '', status: 'Pendente' }],
  }))
  const addAsset = () => setDraft((current) => ({
    ...current,
    assets: [...current.assets, { id: Date.now(), category: 'Equipamento', name: '', status: 'Em manutenção', details: '' }],
  }))

  return (
    <div className="safety-huddle-dialog-layer" role="dialog" aria-modal="true" aria-labelledby="safety-huddle-dialog-title">
      <button type="button" className="safety-huddle-dialog-backdrop" onClick={onClose} aria-label="Fechar atualização do Safety Huddle" />
      <section className="safety-huddle-dialog">
        <header className="safety-huddle-dialog-header">
          <div><span>REVISÃO DE TROCA DE TURNO · 12 HORAS</span><h2 id="safety-huddle-dialog-title">Atualizar Safety Huddle</h2><p>Valide a criticidade clínica, os exames e a infraestrutura antes de registrar a passagem.</p></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close" size={18} /></button>
        </header>

        <div className="safety-huddle-dialog-body">
          <section className="huddle-review-section">
            <div className="huddle-review-heading"><div><strong>1. Criticidade de pacientes</strong><span>Confirme a revisão dos casos críticos do censo atual.</span></div><b>{draft.reviewedPatients.filter((admission) => criticalPatients.some((patient) => patient.admission === admission)).length}/{criticalPatients.length} revisados</b></div>
            <div className="huddle-review-patients">
              {criticalPatients.length ? criticalPatients.map((patient) => (
                <label className="huddle-review-patient" key={patient.admission}>
                  <input type="checkbox" checked={draft.reviewedPatients.includes(patient.admission)} onChange={() => togglePatientReview(patient.admission)} />
                  <span><strong>Leito {patient.bed} · {patient.name}</strong><small>{patient.diagnosis}</small></span>
                  <em>Crítico</em>
                </label>
              )) : <p className="huddle-review-empty">Nenhum paciente crítico sinalizado; censo revisado sem casos críticos.</p>}
            </div>
          </section>

          <section className="huddle-review-section">
            <div className="huddle-review-heading"><div><strong>2. Exames e logística crítica</strong><span>Registre leito, evento, horário e andamento.</span></div><button type="button" className="huddle-add-button" onClick={addExam}><Icon name="admission" size={14} /> Adicionar evento</button></div>
            <div className="huddle-edit-list">
              {draft.exams.map((exam) => (
                <div className="huddle-edit-row exam" key={exam.id}>
                  <label><span>Leito</span><input value={exam.bed} onChange={(event) => updateExam(exam.id, { bed: event.target.value })} placeholder="02" /></label>
                  <label className="wide"><span>Exame / evento</span><input value={exam.event} onChange={(event) => updateExam(exam.id, { event: event.target.value })} placeholder="Ex.: TC, RX de leito" /></label>
                  <label><span>Horário</span><input type="time" value={exam.scheduledAt} onChange={(event) => updateExam(exam.id, { scheduledAt: event.target.value })} /></label>
                  <label><span>Status</span><select value={exam.status} onChange={(event) => updateExam(exam.id, { status: event.target.value as HuddleExamStatus })}><option>Agendado</option><option>Pendente</option><option>Concluído</option></select></label>
                  <button type="button" className="huddle-remove-button" onClick={() => setDraft((current) => ({ ...current, exams: current.exams.filter((item) => item.id !== exam.id) }))} aria-label={`Remover evento ${exam.event || 'sem descrição'}`}><Icon name="close" size={15} /></button>
                </div>
              ))}
              {!draft.exams.length && <p className="huddle-review-empty">Nenhum exame ou evento logístico registrado.</p>}
            </div>
          </section>

          <section className="huddle-review-section">
            <div className="huddle-review-heading"><div><strong>3. Infraestrutura e equipamentos</strong><span>Registre avarias, empréstimos e manutenção de Engenharia Clínica.</span></div><button type="button" className="huddle-add-button" onClick={addAsset}><Icon name="admission" size={14} /> Adicionar item</button></div>
            <div className="huddle-edit-list">
              {draft.assets.map((asset) => (
                <div className="huddle-edit-row asset" key={asset.id}>
                  <label><span>Categoria</span><select value={asset.category} onChange={(event) => updateAsset(asset.id, { category: event.target.value as HuddleAssetCategory })}><option>Infraestrutura</option><option>Equipamento</option></select></label>
                  <label className="wide"><span>Item / ativo</span><input value={asset.name} onChange={(event) => updateAsset(asset.id, { name: event.target.value })} placeholder="Ex.: Bomba de infusão 03" /></label>
                  <label><span>Status</span><select value={asset.status} onChange={(event) => updateAsset(asset.id, { status: event.target.value })}><option>Em uso</option><option>Emprestado</option><option>Em manutenção</option><option>Reparo solicitado</option></select></label>
                  <label className="wide"><span>Detalhes / localização</span><input value={asset.details} onChange={(event) => updateAsset(asset.id, { details: event.target.value })} placeholder="Setor, chamado ou condição observada" /></label>
                  <button type="button" className="huddle-remove-button" onClick={() => setDraft((current) => ({ ...current, assets: current.assets.filter((item) => item.id !== asset.id) }))} aria-label={`Remover item ${asset.name || 'sem identificação'}`}><Icon name="close" size={15} /></button>
                </div>
              ))}
              {!draft.assets.length && <p className="huddle-review-empty">Nenhum item de infraestrutura ou equipamento registrado.</p>}
            </div>
          </section>
          {error && <p className="huddle-review-error" role="alert">{error}</p>}
        </div>

        <footer className="safety-huddle-dialog-footer">
          <span><Icon name="shield" size={15} /> A atualização será registrada para o próximo ciclo de 12 horas.</span>
          <div><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button type="button" className="primary-button" onClick={saveUpdate}><Icon name="check" size={15} /> Registrar atualização</button></div>
        </footer>
      </section>
    </div>
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

type ClinicalNoteKind = 'Médica' | 'Enfermagem' | 'Técnica'
type ClinicalNote = { id: string; createdAt: string; author: string; kind: ClinicalNoteKind; text: string }
type ExamStatus = 'Normal' | 'Alterado' | 'Pendente'
type ExamRecord = {
  id: string; name: string; collectedAt: string; result: string; status: ExamStatus; report: string
  kind?: 'laboratorio' | 'imagem'
  responsible?: string
  executionStatus?: 'Finalizado' | 'Pendente'
  reportStatus?: 'Liberado' | 'Pendente'
  demonstration?: boolean
  parameters?: { name: string; value: string; reference: string; status: 'Normal' | 'Alterado' }[]
}

const noteKindByRole: Record<ProfessionalRole, ClinicalNoteKind> = { medico: 'Médica', enfermeiro: 'Enfermagem', tecnico: 'Técnica' }

function readStoredList<T>(key: string, fallback: () => T[]): T[] {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T[]) : fallback()
  } catch {
    return fallback()
  }
}

function buildSeedNotes(): ClinicalNote[] {
  const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString()
  return [
    { id: 'seed-tecnica', createdAt: hoursAgo(1), author: `${professionals.tecnico.name} · ${professionals.tecnico.registry}`, kind: 'Técnica', text: 'Paciente em decúbito elevado, sem queixas. Higiene oral realizada e dispositivos verificados.' },
    { id: 'seed-enfermagem', createdAt: hoursAgo(2), author: `${professionals.enfermeiro.name} · ${professionals.enfermeiro.registry}`, kind: 'Enfermagem', text: 'Balanço hídrico do turno em acompanhamento. Cuidados de SAE mantidos conforme prescrição.' },
    { id: 'seed-medica', createdAt: hoursAgo(3), author: `${professionals.medico.name} · ${professionals.medico.registry}`, kind: 'Médica', text: 'Quadro de choque séptico em reavaliação. Mantém vasopressor e antibioticoterapia conforme prescrição vigente.' },
  ]
}

function buildSeedExams(): ExamRecord[] {
  const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString()
  return [
    { id: 'seed-hemograma', name: 'Hemograma completo', collectedAt: hoursAgo(5), result: 'Leucócitos 18.400/mm³ · Hb 10,2 g/dL', status: 'Alterado', report: 'Leucocitose com desvio à esquerda, compatível com processo infeccioso em investigação.' },
    { id: 'seed-lactato', name: 'Lactato sérico', collectedAt: hoursAgo(2), result: 'Lactato 3,1 mmol/L', status: 'Alterado', report: 'Hiperlactatemia. Reavaliar em 2 horas.' },
    { id: 'seed-ecocardiograma', name: 'Ecocardiograma transtorácico', collectedAt: hoursAgo(1), result: 'Aguardando laudo', status: 'Pendente', report: '' },
  ]
}

function buildDemonstrationExams(): ExamRecord[] {
  const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString()
  return [
    {
      id: 'demo-hemograma-completo', name: 'Hemograma completo', collectedAt: hoursAgo(4),
      kind: 'laboratorio', responsible: 'Profissional fictício', executionStatus: 'Finalizado', reportStatus: 'Liberado',
      result: 'Resultados ilustrativos dos parâmetros abaixo.', status: 'Alterado',
      report: 'Laudo demonstrativo fictício, sem finalidade diagnóstica.', demonstration: true,
      parameters: [
        { name: 'Hemácias', value: '4,2 milhões/mm³', reference: '4,0–5,5 milhões/mm³', status: 'Normal' },
        { name: 'Hemoglobina', value: '10,2 g/dL', reference: '12,0–16,0 g/dL', status: 'Alterado' },
        { name: 'Hematócrito', value: '32%', reference: '36–46%', status: 'Alterado' },
        { name: 'VCM', value: '86 fL', reference: '80–100 fL', status: 'Normal' },
        { name: 'HCM', value: '29 pg', reference: '27–33 pg', status: 'Normal' },
        { name: 'CHCM', value: '33 g/dL', reference: '32–36 g/dL', status: 'Normal' },
        { name: 'RDW', value: '14,1%', reference: '11,5–14,5%', status: 'Normal' },
        { name: 'Leucócitos', value: '18.400/mm³', reference: '4.000–11.000/mm³', status: 'Alterado' },
        { name: 'Neutrófilos', value: '82%', reference: '40–75%', status: 'Alterado' },
        { name: 'Linfócitos', value: '12%', reference: '20–45%', status: 'Alterado' },
        { name: 'Monócitos', value: '4%', reference: '2–10%', status: 'Normal' },
        { name: 'Eosinófilos', value: '1%', reference: '1–6%', status: 'Normal' },
        { name: 'Basófilos', value: '1%', reference: '0–2%', status: 'Normal' },
        { name: 'Plaquetas', value: '240.000/mm³', reference: '150.000–450.000/mm³', status: 'Normal' },
      ],
    },
    {
      id: 'demo-tomografia', name: 'Tomografia de tórax', collectedAt: hoursAgo(6),
      kind: 'imagem', responsible: 'Profissional fictício', executionStatus: 'Finalizado', reportStatus: 'Liberado',
      result: 'Ilustrações esquemáticas disponíveis para demonstração.', status: 'Normal',
      report: 'Laudo demonstrativo fictício, sem finalidade diagnóstica.', demonstration: true,
    },
  ]
}

function isExamRecord(item: unknown): item is ExamRecord {
  if (!item || typeof item !== 'object') return false
  const exam = item as Record<string, unknown>
  const optionalString = (value: unknown) => value === undefined || typeof value === 'string'
  const parametersValid = exam.parameters === undefined || (Array.isArray(exam.parameters) && exam.parameters.every((item: unknown) => {
    if (!item || typeof item !== 'object') return false
    const parameter = item as Record<string, unknown>
    return typeof parameter.name === 'string' && typeof parameter.value === 'string' && typeof parameter.reference === 'string' &&
      (parameter.status === 'Normal' || parameter.status === 'Alterado')
  }))
  return typeof exam.id === 'string' && typeof exam.name === 'string' &&
    typeof exam.collectedAt === 'string' && !Number.isNaN(Date.parse(exam.collectedAt)) &&
    typeof exam.result === 'string' && typeof exam.report === 'string' &&
    (exam.status === 'Normal' || exam.status === 'Alterado' || exam.status === 'Pendente') &&
    (exam.kind === undefined || exam.kind === 'laboratorio' || exam.kind === 'imagem') &&
    optionalString(exam.responsible) &&
    (exam.executionStatus === undefined || exam.executionStatus === 'Finalizado' || exam.executionStatus === 'Pendente') &&
    (exam.reportStatus === undefined || exam.reportStatus === 'Liberado' || exam.reportStatus === 'Pendente') &&
    (exam.demonstration === undefined || typeof exam.demonstration === 'boolean') && parametersValid
}

function readExams(key: string): { exams: ExamRecord[]; error: string | null } {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) return { exams: buildSeedExams(), error: null }
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed) || !parsed.every(isExamRecord)) {
      return { exams: [], error: 'Não foi possível ler os exames salvos: os dados estão em formato inválido. Os dados originais foram preservados.' }
    }
    return { exams: parsed, error: null }
  } catch {
    return { exams: [], error: 'Não foi possível acessar ou ler os exames salvos. Os dados originais foram preservados.' }
  }
}

function PatientPrescriptionTab({ patient, onNotify, prescriptionItems, prescriptionStatus, schedule, scheduleApproved, versions }: {
  patient: Patient; onNotify: (message: string) => void
  prescriptionItems: PrescriptionItem[]; prescriptionStatus: string; schedule: MedicationSchedule; scheduleApproved: boolean; versions: PrescriptionVersion[]
}) {
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version)
  const displayableVersions = sortedVersions.filter((version) => !version.demonstrationHistory)
  const displayedVersion = displayableVersions.find((version) => version.status === 'Vigente') ?? displayableVersions[0]
  const validFrom = displayedVersion?.validFrom ? new Date(displayedVersion.validFrom) : null
  const expiresAt = displayedVersion?.expiresAt ? new Date(displayedVersion.expiresAt) : null
  const historyVersions = sortedVersions.filter((version) => version.status === 'Suspensa' || (Number.isFinite(Date.parse(version.expiresAt)) && Date.parse(version.expiresAt) <= Date.now()))
  const [openedVersion, setOpenedVersion] = useState<PrescriptionVersion | null>(null)
  const [, setRecordsVersion] = useState(0)
  const onRecordsChange = () => setRecordsVersion((current) => current + 1)
  useEffect(() => {
    if (!openedVersion) return
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpenedVersion(null) }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openedVersion])
  return (
    <>
      <section className="record-section">
        <div className="record-section-head prescription-record-head">
          <div>
            <div className="record-section-title">{prescriptionStatus === 'Vigente' ? 'Prescrição médica vigente' : 'Prescrição médica'}</div>
            <p>{displayedVersion ? `Prescrição ${formatPrescriptionNumber(displayedVersion)}` : prescriptionItems.length ? 'Sem número · registro legado' : 'Sem prescrição registrada'}</p>
            {displayedVersion?.demonstration && <p className="prescription-demo-notice">Exemplo fictício para demonstração · não utilizar na assistência.</p>}
            <p>{validFrom && expiresAt && !Number.isNaN(validFrom.getTime()) && !Number.isNaN(expiresAt.getTime())
              ? `Vigência registrada: ${formatLocalDateTime(validFrom)} até ${formatLocalDateTime(expiresAt)}`
              : 'Vigência não registrada para esta prescrição.'}</p>
            <p>Grade de horários: 08:00 às 07:00 do dia seguinte.</p>
          </div>
          <span className={`prescription-version-status ${prescriptionStatus === 'Vigente' ? 'vigente' : prescriptionStatus === 'Expirada' ? 'expirada' : prescriptionStatus === 'Suspensa' ? 'suspensa' : 'legacy'}`}>{prescriptionStatus}</span>
        </div>
        <PrescriptionScheduleList items={prescriptionItems} schedule={schedule} approved={scheduleApproved} prescriptionStatus={prescriptionStatus} bed={patient.bed} onNotify={onNotify} onRecordsChange={onRecordsChange} />
      </section>

      <section className="record-section prescription-history">
        <div className="record-section-head">
          <div><div className="record-section-title">Histórico de prescrições</div><p>Prescrições anteriores ou expiradas · duplo clique para consultar</p></div>
        </div>
        {historyVersions.length ? <div className="prescription-history-scroll">
          <table className="prescription-history-table">
            <thead><tr><th scope="col">Número</th><th scope="col">Data</th><th scope="col">Vigência</th><th scope="col">Situação</th><th scope="col">Consulta</th></tr></thead>
            <tbody>{historyVersions.map((version) => {
              const status = version.status === 'Suspensa' ? 'Suspensa' : 'Expirada'
              return <tr key={version.id} onDoubleClick={() => setOpenedVersion(version)}>
                <td>{formatPrescriptionNumber(version)}{version.demonstration && <small className="prescription-demo-label">Exemplo fictício</small>}</td>
                <td>{formatStoredPrescriptionDate(version.createdAt)}</td>
                <td>{formatStoredPrescriptionDate(version.validFrom)} até {formatStoredPrescriptionDate(version.expiresAt)}</td>
                <td><span className={`prescription-version-status ${status.toLocaleLowerCase('pt-BR')}`}>{status}</span></td>
                <td><button type="button" className="secondary-button" onClick={() => setOpenedVersion(version)}>Abrir</button></td>
              </tr>
            })}</tbody>
          </table>
        </div> : <div className="prescription-draft-empty">Nenhuma prescrição anterior ou expirada registrada.</div>}
      </section>

      {openedVersion && <div className="confirmation-layer" role="dialog" aria-modal="true" aria-labelledby="prescription-history-dialog-title">
        <button type="button" className="confirmation-backdrop" aria-label="Fechar consulta" onClick={() => setOpenedVersion(null)} />
        <div className="prescription-history-dialog">
          <div className="record-section-head">
            <div><div className="record-section-title" id="prescription-history-dialog-title">Prescrição {formatPrescriptionNumber(openedVersion)}</div>
              <p>Vigência: {formatStoredPrescriptionDate(openedVersion.validFrom)} até {formatStoredPrescriptionDate(openedVersion.expiresAt)}</p>
            </div>
            <button type="button" className="secondary-button" autoFocus onClick={() => setOpenedVersion(null)}>Fechar</button>
          </div>
          <p>Consulta somente de leitura. Os horários históricos não estão disponíveis por versão.</p>
          {openedVersion.demonstration && <p className="prescription-demo-notice">Exemplo fictício para demonstração · não utilizar na assistência.</p>}
          <PrescriptionItemsList items={openedVersion.items} prescriptionStatus={openedVersion.status === 'Suspensa' ? 'Suspensa' : 'Expirada'} />
          <p>Responsável: {openedVersion.signedBy || 'Não registrado'}</p>
        </div>
      </div>}
    </>
  )
}

function ClinicalNotesSection({ patient, role, onNotify, anamnesisValidation, onValidateAnamnesis }: {
  patient: Patient; role: ProfessionalRole; onNotify: (message: string) => void
  anamnesisValidation: { validatedAt: string; validatedBy: string } | null; onValidateAnamnesis: () => void
}) {
  const storageKey = `avicen-clinical-notes-${patient.admission}`
  const [notes, setNotes] = useState<ClinicalNote[]>(() => readStoredList(storageKey, buildSeedNotes))
  const [filter, setFilter] = useState<'Todas' | ClinicalNoteKind>('Todas')
  const [draft, setDraft] = useState('')
  const professional = professionals[role]
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(notes)) }, [storageKey, notes])
  const visibleNotes = [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).filter((note) => filter === 'Todas' || note.kind === filter)

  const addNote = () => {
    const text = draft.trim()
    if (!text) {
      onNotify('Escreva o conteúdo da anotação antes de salvar.')
      return
    }
    const note: ClinicalNote = { id: `note-${Date.now()}`, createdAt: new Date().toISOString(), author: `${professional.name} · ${professional.registry}`, kind: noteKindByRole[role], text }
    setNotes((current) => [note, ...current])
    setDraft('')
    onNotify('Anotação registrada no histórico do prontuário.')
  }

  return (
    <>
      <section className="record-section nursing-anamnesis-card">
        <div className="record-section-head">
          <div><div className="record-section-title">Anamnese de enfermagem</div><p>Revise histórico assistencial, alergias, comorbidades, medicações domiciliares e cuidados registrados.</p></div>
          <span className={anamnesisValidation ? 'device-status' : 'immutable-chip'}>{anamnesisValidation ? 'Validada' : 'Aguardando validação'}</span>
        </div>
        <div className="nursing-anamnesis-footer">
          <span>{anamnesisValidation ? `Validada por ${anamnesisValidation.validatedBy} · ${formatLocalDateTime(new Date(anamnesisValidation.validatedAt))}` : 'A validação fica registrada no atendimento e identifica o profissional responsável.'}</span>
          {role === 'enfermeiro' && <Button className="primary-button" onClick={onValidateAnamnesis}><Icon name="check" size={15} /> {anamnesisValidation ? 'Revalidar anamnese' : 'Validar anamnese de enfermagem'}</Button>}
        </div>
      </section>

      <section className="record-section clinical-note-form">
        <div className="record-section-head">
          <div><div className="record-section-title">Nova anotação</div><p>Registrada como {noteKindByRole[role].toLowerCase()} por {professional.name} · {professional.registry}</p></div>
        </div>
        <div className="clinical-note-body">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Descreva a evolução, a conduta ou a observação do turno..." aria-label="Texto da anotação" />
          <div className="clinical-note-actions"><Button className="primary-button" onClick={addNote}><Icon name="check" size={15} /> Adicionar anotação</Button></div>
        </div>
      </section>

      <section className="record-section clinical-history">
        <div className="record-section-head">
          <div><div className="record-section-title">Histórico de evoluções</div><p>Anotações médicas, de enfermagem e técnicas · mais recentes primeiro</p></div>
          <div className="clinical-filter" role="group" aria-label="Filtrar por categoria">
            {(['Todas', 'Médica', 'Enfermagem', 'Técnica'] as const).map((option) => <Button key={option} className={filter === option ? 'active' : ''} onClick={() => setFilter(option)}>{option}</Button>)}
          </div>
        </div>
        {visibleNotes.map((note) => (
          <article className="evolution-entry" key={note.id}>
            <div className="clinical-note-kind">{note.kind}</div>
            <div className="clinical-note-content">
              <div className="clinical-note-meta"><strong>{note.author}</strong><span>{formatLocalDateTime(new Date(note.createdAt))}</span></div>
              <p>{note.text}</p>
            </div>
          </article>
        ))}
        {!visibleNotes.length && <div className="prescription-draft-empty">Nenhuma anotação nesta categoria.</div>}
      </section>
    </>
  )
}

function ExamsSection({ patient }: { patient: Patient }) {
  const storageKey = `avicen-exams-${patient.admission}`
  const [stored] = useState(() => readExams(storageKey))
  const [examples] = useState(buildDemonstrationExams)
  const [opened, setOpened] = useState<{ exam: ExamRecord; view: 'resultado' | 'imagens' } | null>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) firstRender.current = false
    else headingRef.current?.focus()
  }, [opened])
  const exams = [...examples, ...stored.exams]

  return (
    <section className="record-section">
      {opened ? (
        <>
          <div className="record-section-head">
            <div>
              <div className="record-section-title" ref={headingRef} tabIndex={-1}>{opened.view === 'imagens' ? 'Imagens do exame' : 'Resultado e laudo'} · {opened.exam.name}</div>
              <p>{formatLocalDateTime(new Date(opened.exam.collectedAt))} · Responsável: {opened.exam.responsible || 'Não informado'}</p>
            </div>
            <Button className="secondary-button" onClick={() => setOpened(null)}>Voltar para exames</Button>
          </div>
          {(opened.exam.demonstration || opened.exam.id.startsWith('seed-')) && <p className="exam-demo-notice">Exemplo fictício para demonstração. Não utilizar na assistência ou para diagnóstico.</p>}
          {opened.view === 'imagens' ? (
            <div className="exam-images">
              <p>Ilustrações esquemáticas fictícias — não são imagens de um exame real.</p>
              <div className="exam-image-grid">
                {[1, 2].map((image) => (
                  <figure key={image}>
                    <svg viewBox="0 0 280 200" role="img" aria-label={`Ilustração esquemática fictícia ${image}`}>
                      <rect width="280" height="200" rx="8" fill="#19222b" />
                      <ellipse cx="140" cy="100" rx={image === 1 ? 105 : 96} ry="82" fill="#9ba5ab" />
                      <ellipse cx="140" cy="100" rx="88" ry="66" fill="#626f76" />
                      <ellipse cx="107" cy="91" rx="28" ry="43" fill="#28343d" />
                      <ellipse cx="173" cy="91" rx="28" ry="43" fill="#28343d" />
                      <circle cx="140" cy="142" r="13" fill="#b9c1c3" />
                    </svg>
                    <figcaption>Ilustração {image} · apenas demonstração</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ) : (
            <div className="exam-result">
              <div><span>Resultado</span><p>{opened.exam.result}</p></div>
              {opened.exam.parameters && <div className="exam-parameters-wrap">
                <table className="exam-parameters">
                  <thead><tr><th>Parâmetro</th><th>Resultado</th><th>Referência ilustrativa</th><th>Situação</th></tr></thead>
                  <tbody>{opened.exam.parameters.map((parameter) => <tr key={parameter.name}>
                    <td>{parameter.name}</td><td>{parameter.value}</td><td>{parameter.reference}</td><td>{parameter.status}</td>
                  </tr>)}</tbody>
                </table>
              </div>}
              <div><span>Laudo</span><p>{opened.exam.report || 'Nenhum laudo registrado.'}</p></div>
              <div><span>Situação do resultado</span><p>{opened.exam.status}</p></div>
              {opened.exam.kind === 'imagem' && <Button className="secondary-button" onClick={() => setOpened({ exam: opened.exam, view: 'imagens' })}>Ver imagens</Button>}
            </div>
          )}
        </>
      ) : (
        <>
        <div className="record-section-head">
          <div><div className="record-section-title" ref={headingRef} tabIndex={-1}>Resultados e laudos</div><p>Consulte o resultado pelo ícone. Para exames de imagem, abra as imagens pelo botão ou com duplo clique na linha.</p></div>
        </div>
        {stored.error && <p className="exam-load-error" role="alert">{stored.error}</p>}
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead><tr><th scope="col">Nº</th><th scope="col">Descrição</th><th scope="col">Data</th><th scope="col">Status</th><th scope="col">Responsável</th><th scope="col">Laudo</th><th scope="col">Consulta</th></tr></thead>
            <tbody>{exams.map((exam, index) => <tr key={`${exam.id}-${index}`} onDoubleClick={exam.kind === 'imagem' ? () => setOpened({ exam, view: 'imagens' }) : undefined}>
              <td data-label="Nº">{index + 1}</td>
              <td data-label="Descrição"><strong>{exam.name}</strong>{exam.demonstration ? <small className="exam-demo-label">Exemplo fictício</small> : exam.id.startsWith('seed-') && <small className="exam-demo-label">Exemplo fictício · registro anterior</small>}</td>
              <td data-label="Data">{formatLocalDateTime(new Date(exam.collectedAt))}</td>
              <td data-label="Status">{exam.executionStatus || 'Não informado'}</td>
              <td data-label="Responsável">{exam.responsible || 'Não informado'}</td>
              <td data-label="Laudo">{exam.reportStatus || 'Não informado'}</td>
              <td data-label="Consulta"><div className="exam-actions">
                <button type="button" className="exam-action" aria-label={`Abrir resultado e laudo de ${exam.name}`} title="Abrir resultado e laudo" onClick={() => setOpened({ exam, view: 'resultado' })} onDoubleClick={(event) => event.stopPropagation()}><Icon name="document" size={18} /></button>
                {exam.kind === 'imagem' && <button type="button" className="exam-image-action" onClick={() => setOpened({ exam, view: 'imagens' })} onDoubleClick={(event) => event.stopPropagation()}>Ver imagens</button>}
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>
        </>
      )}
    </section>
  )
}

function PatientRecord({ patient, role, onBack, onNotify, risks, outcome, isDeceased = false, onRoleChange, medications, prescriptionItems, prescriptionStatus, schedule, scheduleApproved, devices, onDevicesChange, prescriptionVersions }: {
  patient: Patient; role: ProfessionalRole; onBack: () => void; onNotify: (message: string) => void; risks: PatientClinicalRisk
  outcome?: PatientOutcomeRecord; isDeceased?: boolean
  onRoleChange: (role: ProfessionalRole) => void
  medications: MedicationOrder[]
  prescriptionItems: PrescriptionItem[]
  prescriptionStatus: string
  schedule: MedicationSchedule
  scheduleApproved: boolean
  devices: InvasiveDevice[]
  onDevicesChange: Dispatch<SetStateAction<InvasiveDevice[]>>
  prescriptionVersions: PrescriptionVersion[]
}) {
  const [recorded, setRecorded] = useState(false)
  const [activeRecordTab, setActiveRecordTab] = useState<'overview' | 'prescription' | 'balance' | 'devices' | 'notes' | 'exams'>('overview')
  const [nursingAnamnesisValidation, setNursingAnamnesisValidation] = useState<{ validatedAt: string; validatedBy: string } | null>(() => {
    try { return JSON.parse(localStorage.getItem(`avicen-nursing-anamnesis-${patient.admission}`) || 'null') as { validatedAt: string; validatedBy: string } | null } catch { return null }
  })
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
  useEffect(() => {
    try { setNursingAnamnesisValidation(JSON.parse(localStorage.getItem(`avicen-nursing-anamnesis-${patient.admission}`) || 'null') as { validatedAt: string; validatedBy: string } | null) } catch { setNursingAnamnesisValidation(null) }
  }, [patient.admission])
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

  const validateNursingAnamnesis = () => {
    if (role !== 'enfermeiro') {
      onNotify('A validação da anamnese de enfermagem é exclusiva do perfil enfermeiro.')
      return
    }
    const validation = {
      validatedAt: new Date().toISOString(),
      validatedBy: `${professional.name} · ${professional.registry}`,
    }
    localStorage.setItem(`avicen-nursing-anamnesis-${patient.admission}`, JSON.stringify(validation))
    setNursingAnamnesisValidation(validation)
    onNotify(`Anamnese de enfermagem validada por ${professional.name}.`)
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

  if (isDeceased || outcome?.status === 'Óbito') {
    return (
      <main className="record-page">
        <div className="record-warning death-record-warning">
          <div className="warning-primary"><Icon name="alert" size={21} /><div><span>PRONTUÁRIO ENCERRADO</span><strong>Óbito registrado · prescrições e aprazamentos bloqueados</strong></div></div>
          <div className="warning-separator" />
          <div className="warning-secondary"><Icon name="shield" size={20} /><div><span>TRILHA DE AUDITORIA</span><strong>Somente evoluções permanecem disponíveis</strong></div></div>
        </div>
        <div className="record-content">
          <div className="record-breadcrumb">
            <Button className="back-button" onClick={onBack}><Icon name="chevron" size={16} /> Pacientes</Button>
            <span>/</span><strong>Prontuário encerrado</strong>
          </div>
          <section className="patient-hero">
            <div className="record-bed"><span>LEITO</span><strong>{patient.bed === '—' ? '—' : patient.bed}</strong><small>Encerrado</small></div>
            <div className="record-person">
              <div className="record-avatar">{patient.initials}</div>
              <div>
                <div className="record-name">{patient.name}</div>
                <div className="record-demographics">{patient.age} anos · {patient.sex}</div>
                <div className="record-identifiers"><span>Atendimento <strong>{patient.admission}</strong></span></div>
              </div>
            </div>
            <div className="record-diagnosis"><span>DIAGNÓSTICO PRINCIPAL</span><strong>{patient.diagnosis}</strong><small>CID-10: {patient.cid10}</small></div>
          </section>
          <div className="record-tabs">
            <Button className="active" aria-current="page"><Icon name="document" size={15} /> Evoluções</Button>
          </div>
          <section className="record-section death-evolution-section">
            <div className="record-section-head">
              <div><div className="record-section-title">Evolução e registro de óbito</div><p>Registro clínico preservado para consulta e auditoria</p></div>
              <span className="immutable-chip">Somente leitura</span>
            </div>
            <article className="death-evolution-entry">
              <div className="death-evolution-marker"><Icon name="document" size={17} /></div>
              <div>
                <strong>Óbito registrado</strong>
                <span>{outcome?.recordedAt ? formatLocalDateTime(new Date(outcome.recordedAt)) : 'Registro histórico'}</span>
                <span>Responsável: {outcome?.recordedBy || 'Equipe assistencial'}</span>
                <p>{outcome?.cause || 'Causa não disponível no registro legado.'}</p>
                {outcome?.familyCommunication && <p>Comunicação à família: {outcome.familyCommunication}</p>}
              </div>
            </article>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="record-page">
      <div className="record-warning">
        <div className="warning-primary"><Icon name="alert" size={21} /><div><span>ALERGIAS MEDICAMENTOSAS</span><strong>{risks.allergies.length ? risks.allergies.map((item) => `${item.substance} — ${item.reaction}`).join(' · ') : risks.allergiesReviewed ? 'Nenhuma alergia conhecida na admissão' : 'Nenhuma alergia registrada'}</strong></div></div>
        <div className="warning-separator" />
        <div className="warning-secondary"><Icon name="shield" size={20} /><div><span>COMORBIDADES RELEVANTES</span><strong>{risks.comorbidities.length ? risks.comorbidities.map((item) => item.condition).join(' · ') : risks.comorbiditiesReviewed ? 'Nenhuma comorbidade conhecida na admissão' : 'Nenhuma comorbidade registrada'}</strong></div></div>
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
              <div className="record-demographics">{patient.age} anos · {patient.sex} · Nascimento: {patient.birthDate || 'Não informado'}</div>
              <div className="record-identifiers">
                <span>Atendimento <strong>{patient.admission}</strong></span>
                <span>Prontuário <strong>PSA-0084721</strong></span>
                <span>Admissão <strong>{patient.admission}</strong></span>
              </div>
            </div>
          </div>
          <div className="record-diagnosis">
            <span>DIAGNÓSTICO PRINCIPAL</span><strong>{patient.diagnosis}</strong>
            <small>CID-10: {patient.cid10 || 'Não informado'} · {patient.stay}</small>
          </div>
        </section>

        {patient.homeMedications && <section className="record-section home-medications-panel">
          <div className="record-section-title">Medicações de uso domiciliar informadas na admissão</div>
          <p>{patient.homeMedications.length ? patient.homeMedications.join(' · ') : 'Nenhuma medicação domiciliar conhecida na admissão.'}</p>
        </section>}

        <div className="record-tabs">
          <Button className={activeRecordTab === 'overview' ? 'active' : ''} onClick={() => setActiveRecordTab('overview')}>Visão geral</Button>
          <Button className={activeRecordTab === 'prescription' ? 'active' : ''} onClick={() => setActiveRecordTab('prescription')}>Prescrição</Button>
          <Button className={activeRecordTab === 'balance' ? 'active' : ''} onClick={() => setActiveRecordTab('balance')}>Balanço hídrico</Button>
          <Button className={activeRecordTab === 'devices' ? 'active' : ''} onClick={() => setActiveRecordTab('devices')}>Dispositivos</Button>
          <Button className={activeRecordTab === 'notes' ? 'active' : ''} onClick={() => setActiveRecordTab('notes')}>Evoluções</Button>
          <Button className={activeRecordTab === 'exams' ? 'active' : ''} onClick={() => setActiveRecordTab('exams')}>Exames</Button>
        </div>

        {activeRecordTab === 'prescription' ? (
          <PatientPrescriptionTab
            patient={patient}
            onNotify={onNotify}
            prescriptionItems={prescriptionItems}
            prescriptionStatus={prescriptionStatus}
            schedule={schedule}
            scheduleApproved={scheduleApproved}
            versions={prescriptionVersions}
          />
        ) : activeRecordTab === 'notes' ? (
          <ClinicalNotesSection
            patient={patient}
            role={role}
            onNotify={onNotify}
            anamnesisValidation={nursingAnamnesisValidation}
            onValidateAnamnesis={validateNursingAnamnesis}
          />
        ) : activeRecordTab === 'exams' ? (
          <ExamsSection key={patient.admission} patient={patient} />
        ) : activeRecordTab === 'balance' ? (
          <FluidBalanceScreen key={patient.admission} patient={patient} role={role} onNotify={onNotify} />
        ) : activeRecordTab === 'devices' ? (
          <DeviceTrackingScreen key={patient.admission} patient={patient} onNotify={onNotify} devices={devices} setDevices={onDevicesChange} role={role} />
        ) : (
          <>
        <div className="record-quick-actions" role="toolbar" aria-label="Ações rápidas do prontuário">
          <Button className="primary-button" onClick={() => document.getElementById('nova-afericao')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><Icon name="admission" size={15} /> Registrar sinais vitais</Button>
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
            <div className="hourly-table" role="region" aria-label="Tabela de controle horário de sinais vitais" tabIndex={0}>
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

            <div className="entry-form" id="nova-afericao">
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
          </>
        )}
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

type BalanceGridCell = {
  amount: number | null
  projected: boolean
  updatedAt: string
  executor: string
  parts?: { realized: number; projected: number }
}

type BalanceGridPeriod = {
  pumps: string[]
  outputs?: string[]
  mergedCells?: string[]
  cells: Record<string, BalanceGridCell>
}

type BalanceGridStore = Record<string, BalanceGridPeriod>

type BalanceGridRow = {
  id: string
  label: string
  direction: 'entrada' | 'saida'
}

const balanceInputRows: BalanceGridRow[] = [
  { id: 'oral', label: 'Oral (VO)', direction: 'entrada' },
  { id: 'enteral', label: 'Dieta enteral', direction: 'entrada' },
  { id: 'parenteral', label: 'Dieta parenteral', direction: 'entrada' },
  { id: 'evBolus', label: 'EV (bolus)', direction: 'entrada' },
  { id: 'saline', label: 'Soro', direction: 'entrada' },
  { id: 'blood', label: 'Hemocomponentes', direction: 'entrada' },
]

const balancePumpRows: BalanceGridRow[] = [
  { id: 'pump-example', label: 'Noradrenalina (exemplo)', direction: 'entrada' },
]

const balanceOutputRows: BalanceGridRow[] = [
  { id: 'urine', label: 'Urina', direction: 'saida' },
  { id: 'feces', label: 'Fezes', direction: 'saida' },
  { id: 'drains', label: 'Drenos', direction: 'saida' },
  { id: 'other', label: 'Outras saídas', direction: 'saida' },
]

function balanceCellKey(rowId: string, hour: string) {
  return JSON.stringify([rowId, hour])
}

function balanceNameKey(name: string) {
  return name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
}

function isEmesisName(name: string) {
  return ['emese', 'vomito'].includes(balanceNameKey(name))
}

function balancePeriodKey(date: Date) {
  const start = new Date(date)
  start.setHours(7, 0, 0, 0)
  if (date.getTime() < start.getTime()) start.setDate(start.getDate() - 1)
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
}

function legacyBalancePeriod(entry: BalanceEntry) {
  const date = new Date(entry.id)
  return Number.isFinite(date.getTime()) && date.getFullYear() >= 2000 ? balancePeriodKey(date) : null
}

function roundedBalanceVolume(value: number) {
  return Number(value.toFixed(3))
}

function BalanceVolumeInput({ label, hour, periodKey, value, projected, canConfirm, disabled, onSave, onConfirm, onInvalid, onStart, onFinish, onNotify }: {
  label: string
  hour: string
  periodKey: string
  value: number | null
  projected: boolean
  canConfirm: boolean
  disabled: boolean
  onSave: (value: number | null) => boolean
  onConfirm: () => void
  onInvalid: (invalid: boolean) => void
  onStart: () => void
  onFinish: (saved: boolean) => void
  onNotify: (message: string) => void
}) {
  const formatted = value === null ? '' : String(value).replace('.', ',')
  const [draft, setDraft] = useState(formatted)
  const [error, setError] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState(periodKey)

  useEffect(() => { if (!editing && !error) setDraft(formatted) }, [formatted, editing, error])

  const save = () => {
    if (editingPeriod !== periodKey && draft !== formatted) {
      setError(true)
      onInvalid(true)
      onNotify('O período do balanço mudou durante a edição. Confira o horário e registre o valor novamente.')
      return false
    }
    if (draft === formatted) { setError(false); onInvalid(false); return true }
    const text = draft.trim()
    if (text && !/^\d+(?:[.,]\d{1,3})?$/.test(text)) {
      setError(true)
      onInvalid(true)
      onNotify(`Informe um volume em mL com até três casas decimais para ${label} às ${hour}.`)
      return false
    }
    const amount = text ? Number(text.replace(',', '.')) : null
    if (amount !== null && (!Number.isFinite(amount) || amount > Number.MAX_SAFE_INTEGER / 1000)) {
      setError(true)
      onInvalid(true)
      onNotify(`Informe um volume válido em mL para ${label} às ${hour}.`)
      return false
    }
    const saved = onSave(amount)
    setError(!saved)
    onInvalid(!saved)
    return saved
  }

  return (
    <div className={`balance-volume-cell ${projected ? 'is-projected' : ''}`}>
      <input aria-label={`${label} às ${hour} em mL${projected && value !== null ? ', previsto' : ''}`} aria-invalid={error} inputMode="decimal" value={draft} placeholder="—" disabled={disabled}
        onChange={(event) => setDraft(event.target.value)} onFocus={() => { setEditing(true); setEditingPeriod(periodKey); onStart() }} onBlur={() => { const saved = save(); setEditing(false); onFinish(saved) }}
        onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur() }} />
      {projected && value !== null && <span className="balance-projection-label" aria-hidden="true">P</span>}
      {canConfirm && <button type="button" className="balance-confirm-cell" disabled={disabled} onClick={onConfirm} aria-label={`Confirmar ${label} às ${hour} como realizado`}>Confirmar</button>}
    </div>
  )
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

function loadBalanceGrid(key: string): { store: BalanceGridStore; error: string } {
  try {
    const saved = localStorage.getItem(key)
    if (!saved) return { store: {}, error: '' }
    const parsed: unknown = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Dados inválidos')
    for (const period of Object.values(parsed)) {
      if (!period || typeof period !== 'object' || Array.isArray(period)) throw new Error('Período inválido')
      const data = period as { pumps?: unknown; outputs?: unknown; mergedCells?: unknown; cells?: unknown }
      if (!Array.isArray(data.pumps) || !data.pumps.every((name) => typeof name === 'string') || (data.outputs !== undefined && (!Array.isArray(data.outputs) || !data.outputs.every((name) => typeof name === 'string'))) || (data.mergedCells !== undefined && (!Array.isArray(data.mergedCells) || !data.mergedCells.every((key) => typeof key === 'string'))) || !data.cells || typeof data.cells !== 'object' || Array.isArray(data.cells)) throw new Error('Registro inválido')
      for (const cell of Object.values(data.cells)) {
        if (!cell || typeof cell !== 'object' || Array.isArray(cell)) throw new Error('Célula inválida')
        const value = cell as Partial<BalanceGridCell>
        if ((value.amount !== null && (typeof value.amount !== 'number' || !Number.isFinite(value.amount) || value.amount < 0)) || typeof value.projected !== 'boolean' || typeof value.updatedAt !== 'string' || typeof value.executor !== 'string') throw new Error('Valor inválido')
        if (value.parts !== undefined && (!value.parts || typeof value.parts !== 'object' || typeof value.parts.realized !== 'number' || !Number.isFinite(value.parts.realized) || value.parts.realized < 0 || typeof value.parts.projected !== 'number' || !Number.isFinite(value.parts.projected) || value.parts.projected < 0 || value.projected || value.amount !== roundedBalanceVolume(value.parts.realized + value.parts.projected))) throw new Error('Parcelas inválidas')
      }
    }
    return { store: parsed as BalanceGridStore, error: '' }
  } catch {
    return { store: {}, error: 'Não foi possível carregar os registros da grade. A edição está bloqueada para evitar perda de dados.' }
  }
}

function loadBalanceEntries(key: string): { entries: BalanceEntry[]; error: string } {
  try {
    const saved = localStorage.getItem(key)
    if (!saved) return { entries: [], error: '' }
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed) || !parsed.every((entry) =>
      entry && typeof entry === 'object' && typeof entry.id === 'number' && typeof entry.hour === 'string' &&
      (entry.direction === 'entrada' || entry.direction === 'saida') && typeof entry.category === 'string' &&
      typeof entry.amount === 'number' && Number.isFinite(entry.amount) && entry.amount >= 0 && typeof entry.description === 'string')) throw new Error('Lançamentos inválidos')
    return { entries: parsed as BalanceEntry[], error: '' }
  } catch {
    return { entries: [], error: 'Não foi possível carregar os lançamentos anteriores. A edição e a homologação estão bloqueadas para evitar perda de dados.' }
  }
}

function FluidBalanceScreen({ patient, role, onNotify }: { patient: Patient; role: ProfessionalRole; onNotify: (message: string) => void }) {
  const balanceAdmission = patient.admission
  const balanceEntriesKey = `avicen-fluid-balance-entries-${balanceAdmission}`
  const pumpRateKey = `avicen-fluid-balance-pump-rate-${balanceAdmission}`
  const gridKey = `avicen-fluid-balance-grid-${balanceAdmission}`
  const [legacyData] = useState(() => loadBalanceEntries(balanceEntriesKey))
  const entries = legacyData.entries
  const [loadedGrid] = useState(() => loadBalanceGrid(gridKey))
  const [gridStore, setGridStore] = useState<BalanceGridStore>(loadedGrid.store)
  const [pumpName, setPumpName] = useState('')
  const [outputName, setOutputName] = useState('')
  const [addingPump, setAddingPump] = useState(false)
  const [customPump, setCustomPump] = useState(false)
  const [renamingPump, setRenamingPump] = useState<string | null>(null)
  const [addingOutput, setAddingOutput] = useState(false)
  const [invalidCells, setInvalidCells] = useState<Record<string, boolean>>({})
  const [lockedPeriod, setLockedPeriod] = useState<string | null>(null)
  const lockedPeriodRef = useRef<string | null>(null)
  const [pumpRate] = useState(() => localStorage.getItem(pumpRateKey) || '12')
  const [, setClockTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.activeElement?.closest('.balance-grid-scroll input')) setClockTick((value) => value + 1)
    }, 30000)
    return () => clearInterval(timer)
  }, [])
  const now = new Date()
  const shiftKey = lockedPeriod ?? balancePeriodKey(now)
  const shiftStart = new Date(`${shiftKey}T07:00:00`)
  const shiftEnd = new Date(shiftStart)
  shiftEnd.setDate(shiftEnd.getDate() + 1)
  shiftEnd.setMinutes(-1)
  const approvalKey = `avicen-fluid-balance-approval-${balanceAdmission}-${shiftKey}`
  const [approval, setApproval] = useState<{ approvedAt: string; approvedBy: string; netBalance: number } | null>(() => {
    try { return JSON.parse(localStorage.getItem(approvalKey) || 'null') as { approvedAt: string; approvedBy: string; netBalance: number } | null } catch { return null }
  })
  useEffect(() => {
    try { setApproval(JSON.parse(localStorage.getItem(approvalKey) || 'null') as { approvedAt: string; approvedBy: string; netBalance: number } | null) }
    catch { onNotify('Não foi possível carregar a homologação do balanço.') }
  }, [approvalKey])

  const period = gridStore[shiftKey] ?? { pumps: [], cells: {} }
  const noradrenalineNames = period.pumps.filter((name) => balanceNameKey(name) === 'noradrenalina')
  const pumpRows = [...balancePumpRows, ...period.pumps.filter((name) => balanceNameKey(name) !== 'noradrenalina').map((name) => ({ id: `pump:${name}`, label: name, direction: 'entrada' as const }))]
  const inputRows = [...balanceInputRows, ...pumpRows]
  const outputNames = period.outputs ?? []
  const hasSavedEmesis = balanceRows.some((row) => Object.prototype.hasOwnProperty.call(period.cells, balanceCellKey('emesis', row.hour)))
  const outputRows = [
    ...balanceOutputRows.slice(0, 3),
    ...(!outputNames.some(isEmesisName) || hasSavedEmesis ? [{ id: 'emesis', label: 'Êmese', direction: 'saida' as const }] : []),
    ...balanceOutputRows.slice(3),
    ...outputNames.map((name) => ({ id: `output:${name}`, label: isEmesisName(name) ? `Êmese (registro anterior: ${name})` : name, direction: 'saida' as const })),
  ]
  const medicationOptions = [...new Set([...prescribedMedications.map((item) => item.name), ...homeMedicationCatalog, 'Midazolam', 'Fentanil', ...period.pumps])]
  const legacyCategories: Record<string, string> = {
    iv: 'Solução intravenosa', diet: 'Dieta enteral', pumps: 'Bomba de infusão',
    urine: 'Diurese', drains: 'Dreno', other: 'Outras saídas',
  }
  const hourIsFuture = (index: number) => {
    const start = new Date(shiftStart)
    start.setHours(start.getHours() + index)
    return start.getTime() > Date.now()
  }
  const getRawCell = (rowId: string, index: number): { realized: number | null; projected: number | null } => {
    const row = balanceRows[index]
    const saved = period.cells[balanceCellKey(rowId, row.hour)]
    if (saved) {
      if (saved.parts) return saved.parts
      return saved.projected ? { realized: null, projected: saved.amount } : { realized: saved.amount, projected: null }
    }
    const exampleValues: Record<string, number> = { iv: row.iv, diet: row.diet, pumps: row.pumps, urine: row.urine, drains: row.drains, other: row.other }
    const example = index < 4 ? exampleValues[rowId] ?? 0 : rowId === 'pumps' ? Number(pumpRate) : 0
    const legacy = entries.filter((entry) => legacyBalancePeriod(entry) === shiftKey && entry.hour === row.hour && entry.category === legacyCategories[rowId]).reduce((sum, entry) => sum + entry.amount, 0)
    const amount = example + legacy
    return index >= 4 || hourIsFuture(index) ? { realized: null, projected: amount || null } : { realized: amount || null, projected: null }
  }
  const mergedSources: Record<string, string[]> = {
    enteral: ['diet'],
    saline: ['iv'],
    'pump-example': ['pumps', ...noradrenalineNames.map((name) => `pump:${name}`)],
  }
  const getCell = (rowId: string, index: number) => {
    const key = balanceCellKey(rowId, balanceRows[index].hour)
    const sources = period.mergedCells?.includes(key) ? [rowId] : [rowId, ...(mergedSources[rowId] ?? [])]
    const parts = sources.map((source) => getRawCell(source, index))
    const combine = (kind: 'realized' | 'projected') => {
      const values = parts.map((part) => part[kind]).filter((value): value is number => value !== null)
      return values.length ? roundedBalanceVolume(values.reduce((sum, value) => sum + value, 0)) : null
    }
    const realized = combine('realized')
    const projectedAmount = combine('projected')
    const amount = realized === null && projectedAmount === null ? null : roundedBalanceVolume((realized ?? 0) + (projectedAmount ?? 0))
    return { amount, realized, projectedAmount, projected: realized === null && projectedAmount !== null }
  }
  const sumCell = (rowId: string, index: number, includeProjected: boolean) => {
    const cell = getCell(rowId, index)
    return (cell.realized ?? 0) + (includeProjected ? cell.projectedAmount ?? 0 : 0)
  }
  const sumRows = (rows: BalanceGridRow[], index: number, includeProjected: boolean) => rows.reduce((sum, row) => sum + sumCell(row.id, index, includeProjected), 0)
  const totalForRows = (rows: BalanceGridRow[], includeProjected = false) => roundedBalanceVolume(balanceRows.reduce((sum, _, index) => sum + sumRows(rows, index, includeProjected), 0))
  const adjustedRows = balanceRows.map((row, index) => ({
    hour: row.hour, input: sumRows(inputRows, index, false), output: sumRows(outputRows, index, false),
  }))
  const totalInput = totalForRows(inputRows)
  const totalOutput = totalForRows(outputRows)
  const netBalance = roundedBalanceVolume(totalInput - totalOutput)
  const predictedInput = totalForRows(inputRows, true)
  const predictedOutput = totalForRows(outputRows, true)
  const predictedNet = roundedBalanceVolume(predictedInput - predictedOutput)
  const cumulative = adjustedRows.reduce<number[]>((values, row) => {
    const hourly = row.input - row.output
    values.push(roundedBalanceVolume((values.at(-1) ?? 0) + hourly))
    return values
  }, [])

  const savePeriod = (updated: BalanceGridPeriod) => {
    if (loadedGrid.error || legacyData.error) {
      onNotify(loadedGrid.error || legacyData.error)
      return false
    }
    const next = { ...gridStore, [shiftKey]: updated }
    try {
      localStorage.removeItem(approvalKey)
      setApproval(null)
      localStorage.setItem(gridKey, JSON.stringify(next))
    } catch {
      onNotify('Não foi possível salvar o balanço hídrico neste navegador.')
      return false
    }
    setGridStore(next)
    return true
  }

  const saveCellParts = (rowId: string, index: number, realized: number | null, projected: number | null) => {
    const key = balanceCellKey(rowId, balanceRows[index].hour)
    const amount = realized === null && projected === null ? null : roundedBalanceVolume((realized ?? 0) + (projected ?? 0))
    const cell: BalanceGridCell = {
      amount, projected: realized === null && projected !== null, updatedAt: new Date().toISOString(), executor: `${professionals[role].name} · ${professionals[role].registry}`,
      ...(realized !== null && projected !== null ? { parts: { realized, projected } } : {}),
    }
    return savePeriod({
      ...period,
      ...(mergedSources[rowId] ? { mergedCells: [...new Set([...(period.mergedCells ?? []), key])] } : {}),
      cells: { ...period.cells, [key]: cell },
    })
  }
  const saveCell = (rowId: string, index: number, amount: number | null, projected = hourIsFuture(index)) =>
    saveCellParts(rowId, index, projected ? null : amount, projected ? amount : null)

  const addPump = (rawName: string) => {
    const name = rawName.trim()
    if (!name) { onNotify('Informe ou selecione o nome do medicamento.'); return }
    if (name === '__outro__') { onNotify('Informe um nome válido para o medicamento.'); return }
    if (balanceNameKey(name) === 'noradrenalina' || period.pumps.some((item) => balanceNameKey(item) === balanceNameKey(name))) {
      onNotify('Este medicamento já possui uma linha na tabela.')
      return
    }
    if (savePeriod({ ...period, pumps: [...period.pumps, name] })) {
      setPumpName('')
      setAddingPump(false)
      setCustomPump(false)
    }
  }

  const pumpHasRecords = (name: string) => balanceRows.some((row) => {
    const key = balanceCellKey(`pump:${name}`, row.hour)
    return Object.prototype.hasOwnProperty.call(period.cells, key) || invalidCells[`${shiftKey}:${key}`]
  })

  const renamePump = (original: string, rawName: string) => {
    const name = rawName.trim()
    if (!name) { onNotify('Informe ou selecione o nome do medicamento.'); return }
    if (name === '__outro__') { onNotify('Informe um nome válido para o medicamento.'); return }
    if (pumpHasRecords(original)) { onNotify('Não é possível trocar o medicamento de uma linha com lançamentos.'); return }
    if (balanceNameKey(name) === 'noradrenalina' || period.pumps.some((item) => item !== original && balanceNameKey(item) === balanceNameKey(name))) {
      onNotify('Este medicamento já possui uma linha na tabela.')
      return
    }
    if (name === original || savePeriod({ ...period, pumps: period.pumps.map((item) => item === original ? name : item) })) {
      setRenamingPump(null)
      setPumpName('')
    }
  }

  const addOutput = () => {
    const name = outputName.trim()
    if (!name) { onNotify('Informe ou selecione o nome da saída.'); return }
    if ((isEmesisName(name) && outputRows.some((row) => row.id === 'emesis' || (row.id.startsWith('output:') && isEmesisName(row.id.slice(7))))) ||
      outputRows.some((row) => balanceNameKey(row.label) === balanceNameKey(name))) {
      onNotify('Esta saída já possui uma linha na tabela.')
      return
    }
    if (savePeriod({ ...period, outputs: [...outputNames, name] })) {
      setOutputName('')
      setAddingOutput(false)
    }
  }

  const partialBalance = (hours: number) => roundedBalanceVolume(adjustedRows.slice(0, hours)
    .reduce((total, row) => total + row.input - row.output, 0))

  const approveBalance = () => {
    if (role !== 'enfermeiro') {
      onNotify('A homologação do balanço hídrico é exclusiva do perfil enfermeiro.')
      return
    }
    if (loadedGrid.error || legacyData.error || Object.keys(invalidCells).some((key) => key.startsWith(`${shiftKey}:`) && invalidCells[key])) {
      onNotify('Corrija os valores não salvos da grade antes de homologar o balanço.')
      return
    }
    const record = {
      approvedAt: new Date().toISOString(),
      approvedBy: `${professionals[role].name} · ${professionals[role].registry}`,
      netBalance,
    }
    try { localStorage.setItem(approvalKey, JSON.stringify(record)) }
    catch { onNotify('Não foi possível salvar a homologação neste navegador.'); return }
    setApproval(record)
    onNotify(`Balanço hídrico homologado por ${professionals[role].name}.`)
  }

  const renderBalanceRow = (row: BalanceGridRow) => (
    <tr key={row.id}>
      <th scope="row">
        {row.id.startsWith('pump:') ? (
          <div className="balance-grid-row-control">
            <select aria-label={`Medicamento BIC: ${row.label}`} value={row.label} disabled={pumpHasRecords(row.label) || !!(loadedGrid.error || legacyData.error)}
              title={pumpHasRecords(row.label) ? `${row.label} — não pode ser alterado após um lançamento.` : `${row.label} — selecionar medicamento`}
              onChange={(event) => {
                if (event.target.value === '__outro__') { setPumpName(''); setRenamingPump(row.label) }
                else renamePump(row.label, event.target.value)
              }}>
              {medicationOptions.map((name) => <option value={name} key={name}>{name}</option>)}
              <option value="__outro__">Outro medicamento…</option>
            </select>
            {renamingPump === row.label && <><input aria-label={`Outro medicamento para ${row.label}`} value={pumpName} onChange={(event) => setPumpName(event.target.value)} />
              <Button className="secondary-button" onClick={() => renamePump(row.label, pumpName)}>Confirmar</Button></>}
          </div>
        ) : row.label}
      </th>
          {balanceRows.map((hourRow, index) => {
            const cell = getCell(row.id, index)
            const cellLabel = row.id.startsWith('output:') ? `${row.label} (saída)` : row.label
            const mixed = cell.realized !== null && cell.projectedAmount !== null
            const renderVolume = (part?: 'realized' | 'projected') => <BalanceVolumeInput
              label={`${cellLabel}${part === 'realized' ? ' (realizado)' : part === 'projected' ? ' (previsto)' : ''}`} hour={hourRow.hour} periodKey={shiftKey}
              value={part === 'realized' ? cell.realized : part === 'projected' ? cell.projectedAmount : cell.amount}
              projected={part === 'projected' || (!part && cell.projected)}
              canConfirm={(part === 'projected' || (!part && cell.projected)) && cell.projectedAmount !== null && !hourIsFuture(index)} disabled={!!(loadedGrid.error || legacyData.error)}
              onSave={(amount) => {
                const other = part === 'realized' ? 'projected' : 'realized'
                if (part && invalidCells[`${shiftKey}:${balanceCellKey(row.id, hourRow.hour)}:${other}`]) {
                  onNotify('Corrija a outra parcela deste horário antes de salvar.')
                  return false
                }
                return part === 'realized' ? saveCellParts(row.id, index, amount, cell.projectedAmount) : part === 'projected' ? saveCellParts(row.id, index, cell.realized, amount) : saveCell(row.id, index, amount)
              }}
              onConfirm={() => {
                const key = `${shiftKey}:${balanceCellKey(row.id, hourRow.hour)}`
                if (invalidCells[key] || invalidCells[`${key}:realized`] || invalidCells[`${key}:projected`]) { onNotify('Corrija os valores não salvos antes de confirmar.'); return }
                if (saveCell(row.id, index, cell.amount, false)) onNotify(`${row.label} às ${hourRow.hour} confirmado como realizado.`)
              }}
              onInvalid={(invalid) => setInvalidCells((current) => ({ ...current, [`${shiftKey}:${balanceCellKey(row.id, hourRow.hour)}${part ? `:${part}` : ''}`]: invalid }))}
              onStart={() => {
                const selected = lockedPeriodRef.current ?? balancePeriodKey(new Date())
                lockedPeriodRef.current = selected
                setLockedPeriod(selected)
              }}
              onFinish={(saved) => {
                if (saved || shiftKey === balancePeriodKey(new Date())) {
                  lockedPeriodRef.current = null
                  setLockedPeriod(null)
                }
                else onNotify('Corrija o valor para concluir o período anterior.')
              }}
              onNotify={onNotify} />
            return <td key={hourRow.hour}>{mixed
              ? <div className="balance-cell-parts"><div><span>R</span>{renderVolume('realized')}</div><div>{renderVolume('projected')}</div></div>
              : renderVolume()}</td>
          })}
    </tr>
  )

  return (
    <div className="balance-page">
      <div className="balance-content">
        <div className="balance-page-heading">
          <div>
            <div className="page-title">Balanço hídrico</div>
            <p>Controle horário de entradas, saídas e saldo acumulado nas últimas 24 horas</p>
          </div>
          <div className="balance-period"><Icon name="clock" size={17} /><div><span>PERÍODO ATUAL</span><strong>{shiftStart.toLocaleDateString('pt-BR')} às 07:00 — {shiftEnd.toLocaleDateString('pt-BR')} às 06:59 · Agora {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong></div></div>
        </div>

        <section className="balance-patient-bar">
          <div className="balance-bed"><span>LEITO</span><strong>{patient.bed}</strong></div>
          <div className="balance-patient-avatar">{patient.initials}</div>
          <div className="balance-patient-data">
            <strong>{patient.name}</strong>
            <span>{patient.age} anos · {patient.sex} · {patient.admission}</span>
          </div>
          <div className="balance-diagnosis"><span>DIAGNÓSTICO</span><strong>{patient.diagnosis}</strong></div>
          <div className="balance-weight"><span>PESO ATUAL</span><strong>{patient.weightKg ? `${patient.weightKg.toLocaleString('pt-BR')} kg` : 'Não informado'}</strong><small>{patient.weightRecordedAt || 'Sem registro no atendimento'}</small></div>
        </section>

        <section className="balance-summary">
          <div className="balance-stat input">
            <div className="balance-stat-icon"><Icon name="admission" size={20} /></div>
            <div><span>TOTAL DE ENTRADAS</span><strong>{totalInput.toLocaleString('pt-BR')} <small>mL</small></strong><em>{patient.weightKg ? `${(totalInput / patient.weightKg).toFixed(1).replace('.', ',')} mL/kg` : 'Peso não informado'}</em><small>Realizado acima · Previsto: {predictedInput.toLocaleString('pt-BR')} mL</small></div>
          </div>
          <div className="balance-stat output">
            <div className="balance-stat-icon"><Icon name="handoff" size={20} /></div>
            <div><span>TOTAL DE SAÍDAS</span><strong>{totalOutput.toLocaleString('pt-BR')} <small>mL</small></strong><em>{patient.weightKg ? `Diurese: ${(totalForRows([balanceOutputRows[0]]) / patient.weightKg / 24).toFixed(1).replace('.', ',')} mL/kg/h` : 'Peso não informado'}</em><small>Realizado acima · Previsto: {predictedOutput.toLocaleString('pt-BR')} mL</small></div>
          </div>
          <div className={`balance-stat net ${netBalance > 500 ? 'warning' : ''}`}>
            <div className="balance-stat-icon"><Icon name="balance" size={20} /></div>
            <div><span>SALDO ACUMULADO 24H</span><strong>{netBalance > 0 ? '+' : ''}{netBalance.toLocaleString('pt-BR')} <small>mL</small></strong><em>{netBalance > 500 ? 'Acima da meta prescrita' : 'Dentro da meta prescrita'}</em><small>Realizado acima · Previsto: {predictedNet > 0 ? '+' : ''}{predictedNet.toLocaleString('pt-BR')} mL</small></div>
          </div>
          <div className="balance-goal">
            <span>META PRESCRITA</span><strong>0 a +500 mL / 24h</strong>
            <progress className="goal-track" max="700" value={Math.min(700, Math.max(0, netBalance))} />
            <small>Definida pela equipe médica às 07:18</small>
            {approval
              ? <small className="balance-homologation-status">Homologado por {approval.approvedBy} · {formatLocalDateTime(new Date(approval.approvedAt))} · saldo {approval.netBalance > 0 ? '+' : ''}{approval.netBalance.toLocaleString('pt-BR')} mL</small>
              : <small>{role === 'enfermeiro' ? 'Aguardando homologação do enfermeiro.' : 'Homologação exclusiva do perfil enfermeiro.'}</small>}
            {role === 'enfermeiro' && <Button className="primary-button balance-approval-button" onClick={approveBalance}><Icon name="check" size={15} /> {approval ? 'Re-homologar balanço' : 'Homologar balanço do turno'}</Button>}
          </div>
        </section>

        <div className="balance-layout">
          <section className="balance-main-column">
            <div className="record-section balance-table-card">
              <div className="record-section-head">
                <div><div className="record-section-title">Registro horário</div><p>Dados demonstrativos · mL · Salvo ao sair da célula · R = realizado · P = previsto</p></div>
              </div>
              <details className="balance-grid-note">
                <summary>Orientações da tabela</summary>
                <p>Dados demonstrativos. O total previsto inclui o realizado e as projeções, que não se tornam realizadas automaticamente. Cada célula representa o total da categoria no horário; quando há valores realizados e previstos no mesmo horário, as parcelas são editadas separadamente. Os volumes aceitam até três casas decimais.</p>
                <p>A lista de BIC é demonstrativa e não confirma uma prescrição. Nomes ficam bloqueados após lançamentos. Os dados fictícios de BIC estão na linha de noradrenalina.</p>
              </details>
              {lockedPeriod && lockedPeriod !== balancePeriodKey(now) && <div className="balance-form-error" role="status">Conclua ou corrija a edição para avançar ao período atual.</div>}
              {(loadedGrid.error || legacyData.error) && <div className="balance-form-error" role="alert">{loadedGrid.error || legacyData.error}</div>}
              <div className="balance-grid-scroll" role="region" aria-label="Tabela de entradas e saídas por horário" tabIndex={0}>
                <table className="balance-hour-grid">
                  <thead><tr><th scope="col">Item</th>{balanceRows.map((row) => <th scope="col" key={row.hour}>{row.hour}</th>)}</tr></thead>
                  <tbody>
                    <tr className="balance-group-row"><th scope="rowgroup">Entradas</th><td colSpan={24} /></tr>
                    {balanceInputRows.map(renderBalanceRow)}
                    <tr className="balance-group-row"><th scope="row">BIC <Button className="secondary-button balance-grid-add" onClick={() => { setAddingPump(true); setCustomPump(false); setRenamingPump(null); setPumpName('') }}>+ Medicamento</Button></th><td colSpan={24} /></tr>
                    {pumpRows.map(renderBalanceRow)}
                    {addingPump && <tr><th scope="row"><div className="balance-grid-row-control">
                      <select aria-label="Selecionar medicamento em BIC" value="" onChange={(event) => {
                        if (event.target.value === '__outro__') { setCustomPump(true); setPumpName('') }
                        else if (event.target.value) addPump(event.target.value)
                      }}>
                        <option value="">Selecione</option>
                        {medicationOptions.filter((name) => balanceNameKey(name) !== 'noradrenalina' && !period.pumps.some((item) => balanceNameKey(item) === balanceNameKey(name))).map((name) => <option value={name} key={name}>{name}</option>)}
                        <option value="__outro__">Outro medicamento…</option>
                      </select>
                      {customPump && <><input aria-label="Nome do novo medicamento em BIC" value={pumpName} onChange={(event) => setPumpName(event.target.value)} placeholder="Nome" />
                        <Button className="secondary-button" onClick={() => addPump(pumpName)}>Adicionar</Button></>}
                      <Button className="secondary-button" onClick={() => { setAddingPump(false); setCustomPump(false); setPumpName('') }}>Cancelar</Button>
                    </div></th><td colSpan={24} /></tr>}
                  </tbody>
                  <tbody>
                    <tr className="balance-group-row"><th scope="rowgroup">Saídas <Button className="secondary-button balance-grid-add" onClick={() => setAddingOutput(true)}>+ Saída</Button></th><td colSpan={24} /></tr>
                    {outputRows.map(renderBalanceRow)}
                    {addingOutput && <tr><th scope="row"><div className="balance-grid-row-control">
                      <input aria-label="Nome da nova saída" list="balance-output-options" value={outputName} onChange={(event) => setOutputName(event.target.value)} placeholder="Selecione ou digite" />
                      <datalist id="balance-output-options"><option value="Aspiração gástrica" /><option value="Efluente de estomia" /><option value="Perdas sanguíneas" /></datalist>
                      <Button className="secondary-button" onClick={addOutput}>Adicionar</Button>
                      <Button className="secondary-button" onClick={() => { setAddingOutput(false); setOutputName('') }}>Cancelar</Button>
                    </div></th><td colSpan={24} /></tr>}
                  </tbody>
                </table>
              </div>
              <div className="balance-grid-totals">
                <span>Saldo realizado · 6h <strong>{partialBalance(6) > 0 ? '+' : ''}{partialBalance(6).toLocaleString('pt-BR')} mL</strong></span>
                <span>Saldo realizado · 12h <strong>{partialBalance(12) > 0 ? '+' : ''}{partialBalance(12).toLocaleString('pt-BR')} mL</strong></span>
                <span>Saldo realizado · 24h <strong>{netBalance > 0 ? '+' : ''}{netBalance.toLocaleString('pt-BR')} mL</strong></span>
                <span>Saldo previsto · 24h <strong>{predictedNet > 0 ? '+' : ''}{predictedNet.toLocaleString('pt-BR')} mL</strong></span>
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
                  <div className="balance-x-labels"><span>07h</span><span>11h</span><span>15h</span><span>19h</span><span>23h</span><span>03h</span><span>06h</span></div>
                </div>
              </div>
            </div>
          </section>

          <aside className="balance-side-column">
            <section className="record-section balance-breakdown">
              <div className="record-section-title">Composição das 24 horas</div>
              <div className="breakdown-group"><strong>Entradas</strong>
                {balanceInputRows.map((row) => <div key={row.id}><span>{row.label}</span><b>{totalForRows([row]).toLocaleString('pt-BR')} mL</b></div>)}
                <div><span>BIC</span><b>{totalForRows(pumpRows).toLocaleString('pt-BR')} mL</b></div>
              </div>
              <div className="breakdown-group output"><strong>Saídas</strong>
                {outputRows.map((row) => <div key={row.id}><span>{row.label}</span><b>{totalForRows([row]).toLocaleString('pt-BR')} mL</b></div>)}
              </div>
            </section>

            {entries.length > 0 && (
              <section className="record-section latest-entries">
                <div className="record-section-title">Lançamentos anteriores preservados</div>
                <p>As descrições originais foram mantidas. O período é identificado pela data do registro; lançamentos sem data identificável não entram nos totais. Uma correção na grade substitui o total exibido para aquela categoria e horário.</p>
                {entries.slice().reverse().map((entry) => (
                  <div key={entry.id}><span className={entry.direction}>{entry.direction === 'entrada' ? '+' : '−'}{entry.amount} mL</span><div><strong>{entry.category}</strong><small>{legacyBalancePeriod(entry) ? formatLocalDateTime(new Date(entry.id)) : 'Data indisponível'} · {entry.hour} · {entry.description}</small></div></div>
                ))}
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
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
const prescriptionDisplayHours = [...scheduleHours.slice(1), scheduleHours[0]]
type MedicationSchedule = Record<number, string[]>
type SchedulesByBed = Record<string, MedicationSchedule>
type MedicationOrder = typeof prescribedMedications[number]
type PrescriptionCategory = 'Medicamentos' | 'Dietas' | 'Exames' | 'Cuidados Especiais'
type PrescriptionItem = {
  id: number
  category: PrescriptionCategory
  name: string
  activeIngredient?: string
  dose?: string
  route?: string
  diluent?: string
  volume?: string
  speed?: string
  frequency?: string
  details?: string
  status: 'Ativa' | 'Suspensa'
}
type PrescriptionVersion = {
  id: string
  prescriptionNumber?: number
  version: number
  createdAt: string
  validFrom: string
  expiresAt: string
  status: 'Vigente' | 'Suspensa'
  signedBy: string
  items: PrescriptionItem[]
  legacy?: boolean
  demonstration?: boolean
  demonstrationHistory?: boolean
}
type PrescriptionVersionsByAdmission = Record<string, PrescriptionVersion[]>

function numberPrescriptionVersions(versionsByAdmission: PrescriptionVersionsByAdmission): PrescriptionVersionsByAdmission {
  const versions = Object.values(versionsByAdmission).flat()
  let nextNumber = versions.reduce((max, version) => Math.max(max, version.prescriptionNumber ?? 0), 0)
  const numbers = new Map<string, number>()
  versions.filter((version) => !version.prescriptionNumber && !version.legacy)
    .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '') || a.id.localeCompare(b.id))
    .forEach((version) => numbers.set(version.id, ++nextNumber))
  return Object.fromEntries(Object.entries(versionsByAdmission).map(([admission, entries]) => [
    admission,
    entries.map((version) => numbers.has(version.id) ? { ...version, prescriptionNumber: numbers.get(version.id) } : version),
  ]))
}

function formatPrescriptionNumber(version?: PrescriptionVersion) {
  return version?.prescriptionNumber ? `Nº ${String(version.prescriptionNumber).padStart(6, '0')}` : 'Sem número · registro legado'
}

function formatStoredPrescriptionDate(value: string) {
  const date = new Date(value)
  return value && !Number.isNaN(date.getTime()) ? formatLocalDateTime(date) : 'Não registrada'
}

const medicationAllergyAliases: Record<string, string[]> = {
  Amoxicilina: ['penicilina', 'beta-lactâmico'],
  Ceftriaxona: ['cefalosporina', 'beta-lactâmico'],
  Dipirona: ['dipirona', 'metamizol'],
}

function findMedicationAllergy(medication: string, risks: PatientClinicalRisk) {
  if (!medication.trim()) return undefined
  const medicationName = medication.toLocaleLowerCase('pt-BR')
  return risks.allergies.find((allergy) => {
    const allergyName = allergy.substance.toLocaleLowerCase('pt-BR')
    return allergyName.includes(medicationName)
      || medicationName.includes(allergyName)
      || (medicationAllergyAliases[medication] || []).some((alias) => allergyName.includes(alias))
  })
}

function toPrescriptionItem(medication: MedicationOrder): PrescriptionItem {
  return {
    id: medication.id,
    category: 'Medicamentos',
    name: medication.name,
    activeIngredient: medication.name,
    dose: medication.dose,
    route: medication.route,
    frequency: medication.frequency,
    details: medication.note,
    status: 'Ativa',
  }
}

function toMedicationOrders(items: PrescriptionItem[]): MedicationOrder[] {
  return items.filter((item) => item.category === 'Medicamentos' && item.status === 'Ativa').map((item) => ({
    id: item.id,
    name: item.activeIngredient || item.name,
    dose: item.dose || '',
    route: item.route || '',
    frequency: item.frequency || '',
    times: [],
    status: 'Aguardando Aprazamento da Enfermagem',
    note: [item.diluent, item.volume, item.speed, item.details].filter(Boolean).join(' · '),
  }))
}

function getPrescriptionWindow(now: Date) {
  const validFrom = new Date(now)
  validFrom.setHours(7, 0, 0, 0)
  if (now.getTime() < validFrom.getTime()) validFrom.setDate(validFrom.getDate() - 1)
  return {
    validFrom: validFrom.toISOString(),
    expiresAt: new Date(validFrom.getTime() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

function addDemonstrationPrescriptions(
  existing: PrescriptionVersionsByAdmission,
  medicationsByBed: Record<string, MedicationOrder[]>,
  bedMoves: Record<string, string>,
  outcomes: Record<string, PatientOutcomeRecord>,
  now: Date,
): PrescriptionVersionsByAdmission {
  const updated = { ...existing }
  const demonstrationPatients = [...patients, ...additionalPatientRecords.slice(0, 3)]
  const currentWindow = getPrescriptionWindow(now)
  const makeItems = (patient: Patient, validFrom: string): PrescriptionItem[] => {
    const id = -(Date.parse(validFrom) * 10 + patient.id * 10)
    return [
      { id: id - 1, category: 'Dietas', name: 'Dieta fictícia', details: 'Exemplo demonstrativo, sem orientação assistencial.', status: 'Ativa' },
      { id: id - 2, category: 'Medicamentos', name: 'Medicamento fictício', details: 'Exemplo demonstrativo, sem dose ou via.', status: 'Ativa' },
      { id: id - 3, category: 'Exames', name: 'Exame fictício', details: 'Solicitação apenas para demonstração.', status: 'Ativa' },
      { id: id - 4, category: 'Cuidados Especiais', name: 'Cuidado fictício', details: 'Orientação apenas para demonstração.', status: 'Ativa' },
    ]
  }

  demonstrationPatients.forEach((patient) => {
    const entries = [...(updated[patient.admission] ?? [])]
    for (const daysAgo of [2, 1]) {
      const id = `demo-historico-${patient.admission}-${daysAgo}`
      const existingIndex = entries.findIndex((version) => version.id === id)
      if (existingIndex >= 0) {
        if (daysAgo === 2 && entries[existingIndex].demonstrationHistory && entries[existingIndex].status !== 'Vigente') {
          entries[existingIndex] = { ...entries[existingIndex], status: 'Vigente' }
        }
        continue
      }
      const date = new Date(currentWindow.validFrom)
      date.setDate(date.getDate() - daysAgo)
      const window = getPrescriptionWindow(date)
      entries.push({
        id, version: -daysAgo, createdAt: window.validFrom, ...window, status: daysAgo === 2 ? 'Vigente' : 'Suspensa',
        signedBy: 'Exemplo demonstrativo · sem assinatura clínica', items: makeItems(patient, window.validFrom), demonstration: true, demonstrationHistory: true,
      })
    }

    const bed = bedMoves[patient.admission] || patient.bed
    const legacyMedications = medicationsByBed[bed] ?? (bed === '01' ? prescribedMedications : [])
    const hasUserVersion = entries.some((version) => !version.demonstration)
    const hasCurrentExample = entries.some((version) => version.demonstration && !version.demonstrationHistory
      && version.status === 'Vigente' && Date.parse(version.expiresAt) > now.getTime())
    const isActiveDemoPatient = patient.bed !== '—' && !outcomes[patient.admission]
    if (isActiveDemoPatient && !hasUserVersion && !legacyMedications.length && !hasCurrentExample) {
      const exampleVersions = entries.filter((version) => version.demonstration && !version.demonstrationHistory)
      entries.push({
        id: `demo-vigente-${patient.admission}-${currentWindow.validFrom}`,
        version: Math.max(0, ...exampleVersions.map((version) => version.version)) + 1,
        createdAt: currentWindow.validFrom, ...currentWindow, status: 'Vigente',
        signedBy: 'Exemplo demonstrativo · sem assinatura clínica', items: makeItems(patient, currentWindow.validFrom), demonstration: true,
      })
    }
    updated[patient.admission] = entries
  })

  return numberPrescriptionVersions(updated)
}

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

const prescriptionCategoryOrder: PrescriptionCategory[] = ['Dietas', 'Medicamentos', 'Exames', 'Cuidados Especiais']
const saeCareItems = [
  'Avaliação de dor realizada',
  'Mudança de decúbito / prevenção de lesão por pressão',
  'Higiene e conforto realizados',
  'Cuidados com dispositivos e acessos',
  'Balanço hídrico conferido',
  'Orientações e intercorrências registradas',
]

function PrescriptionItemsList({ items, prescriptionStatus }: { items: PrescriptionItem[]; prescriptionStatus: string }) {
  let itemNumber = 0
  const groups = prescriptionCategoryOrder.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="prescription-items-list">
      <div className="prescription-items-table prescription-items-head"><span>Nº</span><span>ITEM PRESCRITO</span><span>DETALHES / ORIENTAÇÕES</span><span>STATUS</span></div>
      {groups.map((group) => (
        <section className="prescription-category-group" key={group.category}>
          <div className="prescription-category-heading"><strong>{group.category}</strong><span>{group.items.length} item(ns)</span></div>
          {group.items.map((item) => {
            itemNumber += 1
            const status = prescriptionStatus === 'Expirada' || prescriptionStatus === 'Suspensa'
              ? prescriptionStatus
              : item.status
            const statusClass = status === 'Suspensa' ? 'suspensa' : status === 'Expirada' ? 'expirada' : ''
            const details = item.category === 'Medicamentos'
              ? [item.dose, item.route && `Via ${item.route}`, item.diluent, item.volume, item.speed, item.frequency, item.details]
                .filter(Boolean).join(' · ')
              : item.category === 'Dietas'
                ? [item.route && `Via ${item.route}`, item.volume, item.speed && `Infusão ${item.speed}`].filter(Boolean).join(' · ')
                : item.details || '—'
            return (
              <div className="prescription-items-table prescription-item-row" key={item.id}>
                <span className="prescription-item-number">Item {itemNumber}</span>
                <strong>{item.name}</strong>
                <span>{details}</span>
                <b className={`prescription-item-status ${statusClass}`}>{status}</b>
              </div>
            )
          })}
        </section>
      ))}
      {!items.length && <div className="medication-empty">Nenhum item de prescrição registrado para este paciente.</div>}
    </div>
  )
}

const nonAdministrationReasons = ['Recusa expressa do paciente', 'Condição clínica impeditiva', 'Ausência no leito (Exame/TC)', 'Acesso venoso inviável', 'Item em falta na farmácia']

function readAdministrationRecords(bed: string): Record<string, AdministrationRecord> {
  try { return JSON.parse(localStorage.getItem(`avicen-administration-${bed}`) || '{}') as Record<string, AdministrationRecord> } catch { return {} }
}

function saveAdministrationRecord(bed: string, key: string, record: AdministrationRecord) {
  localStorage.setItem(`avicen-administration-${bed}`, JSON.stringify({ ...readAdministrationRecords(bed), [key]: record }))
}

function PrescriptionScheduleList({ items, schedule, approved, prescriptionStatus, bed, onNotify, onRecordsChange }: { items: PrescriptionItem[]; schedule: MedicationSchedule; approved: boolean; prescriptionStatus: string; bed: string; onNotify: (message: string) => void; onRecordsChange: () => void }) {
  const tableScrollRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const [tableWidth, setTableWidth] = useState(0)
  const [dialog, setDialog] = useState<{ item: PrescriptionItem; time: string; key: string } | null>(null)
  const [dialogMode, setDialogMode] = useState<'choose' | 'bolar'>('choose')
  const [reason, setReason] = useState('')
  const [justification, setJustification] = useState('')
  const [dialogError, setDialogError] = useState('')
  const { records: saeRecords, toggleItem: toggleSaeItem } = useSaeRecords(bed)
  useEffect(() => {
    const scroll = tableScrollRef.current
    const table = scroll?.querySelector('table')
    if (!scroll || !table) return
    const updateWidth = () => setTableWidth(scroll.scrollWidth)
    const observer = new ResizeObserver(updateWidth)
    observer.observe(scroll)
    observer.observe(table)
    updateWidth()
    return () => observer.disconnect()
  }, [])
  const records = readAdministrationRecords(bed)
  const sortedTimes = (itemId: number) => [...(schedule[itemId] ?? [])].sort((a, b) => scheduleHours.indexOf(a) - scheduleHours.indexOf(b))
  const isBlocked = (item: PrescriptionItem) => item.status === 'Suspensa' || prescriptionStatus === 'Suspensa' || prescriptionStatus === 'Expirada'

  const closeDialog = () => { setDialog(null); setDialogMode('choose'); setReason(''); setJustification(''); setDialogError('') }
  const canRegister = (item: PrescriptionItem, time: string) => {
    const currentItem = items.find((entry) => entry.id === item.id)
    if (!currentItem || isBlocked(currentItem)) { onNotify('Este item está suspenso ou a prescrição não está vigente.'); return false }
    if (!approved) { onNotify('A checagem está disponível para todos os perfis após a homologação do aprazamento pela enfermagem.'); return false }
    if (!sortedTimes(item.id).includes(time)) { onNotify('Este horário não está mais aprazado.'); return false }
    const key = `${item.id}-${time}`
    const existing = readAdministrationRecords(bed)[key]
    if (existing) { onNotify(`${item.name} às ${time}: já registrado como ${existing.status.toLowerCase()}.`); return false }
    return true
  }
  const openSchedule = (item: PrescriptionItem, time: string) => {
    if (!canRegister(item, time)) return
    const key = `${item.id}-${time}`
    setDialog({ item, time, key })
  }
  const currentTime = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const registerCheck = () => {
    if (!dialog) return
    if (!canRegister(dialog.item, dialog.time)) { closeDialog(); return }
    saveAdministrationRecord(bed, dialog.key, { status: 'Administrado', time: currentTime() })
    onRecordsChange()
    onNotify(`${dialog.item.name} às ${dialog.time}: administração checada.`)
    closeDialog()
  }
  const registerBolar = () => {
    if (!dialog) return
    if (!reason || !justification.trim()) { setDialogError('Selecione um motivo e informe a descrição / justificativa.'); return }
    if (!canRegister(dialog.item, dialog.time)) { closeDialog(); return }
    saveAdministrationRecord(bed, dialog.key, { status: 'Não administrado', time: currentTime(), reason, justification: justification.trim() })
    onRecordsChange()
    onNotify(`${dialog.item.name} às ${dialog.time}: medicação bolada.`)
    closeDialog()
  }

  let itemNumber = items.some((item) => item.category === 'Dietas') ? 0 : 1
  const groups = prescriptionCategoryOrder.map((category) => ({
    category,
    items: items.filter((item) => item.category === category).map((item) => ({ item, number: ++itemNumber })),
  }))
  return (
    <div className="prescription-items-list">
      <p className="prescription-table-hint">Deslize a tabela para ver os detalhes e todos os horários. Duplo clique ou Enter em um horário aprazado para checar ou bolar.</p>
      <div className="prescription-table-scroll" ref={tableScrollRef} role="region" aria-label="Tabela da prescrição e horários" tabIndex={0}
        onScroll={(event) => { if (scrollbarRef.current) scrollbarRef.current.scrollLeft = event.currentTarget.scrollLeft }}>
        <table className="prescription-grid">
          <thead>
            <tr>
              <th scope="col" className="prescription-grid-number">Nº</th>
              <th scope="col" className="prescription-grid-item">Item</th>
              <th scope="col">Dose / volume</th>
              <th scope="col">Via</th>
              <th scope="col">Frequência</th>
              <th scope="col">Diluição</th>
              <th scope="col">Velocidade</th>
              <th scope="col">Orientações</th>
              {prescriptionDisplayHours.map((time) => <th scope="col" className="prescription-grid-hour" key={time}>{time}</th>)}
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.category}>
              <tr className="prescription-grid-category"><th scope="rowgroup" colSpan={32}><span>{group.category}</span></th></tr>
              {group.items.map(({ item, number }) => {
                const suspended = item.status === 'Suspensa'
                const blocked = isBlocked(item)
                const times = item.category === 'Medicamentos' ? sortedTimes(item.id) : []
                return (
                  <tr key={item.id} className={suspended ? 'prescription-grid-suspended' : undefined} aria-label={suspended ? `${item.name}, item suspenso` : undefined} title={suspended ? 'Item suspenso' : undefined}>
                    <td className="prescription-grid-number">{number}</td>
                    <th scope="row" className="prescription-grid-item">
                      <strong>{item.name}</strong>
                      {!suspended && prescriptionStatus === 'Expirada' && <span className="prescription-item-status expirada">Expirada</span>}
                      {!blocked && item.category === 'Medicamentos' && !times.length && <small>{approved ? 'Sem horário aprazado' : 'Aguardando aprazamento'}</small>}
                    </th>
                    <td>{[item.dose, item.volume].filter(Boolean).join(' · ') || '—'}</td>
                    <td>{item.route || '—'}</td>
                    <td>{item.frequency || '—'}</td>
                    <td>{item.diluent || '—'}</td>
                    <td>{item.speed || '—'}</td>
                    <td>{item.details || '—'}</td>
                    {prescriptionDisplayHours.map((time) => {
                      const record = records[`${item.id}-${time}`]
                      const stateClass = record?.status === 'Administrado' ? 'checked' : record?.status === 'Não administrado' ? 'bolado' : ''
                      return <td className="prescription-grid-hour" key={time}>
                        {times.includes(time) ? <button
                          type="button"
                          className={`prescription-time-chip ${stateClass}`}
                          aria-label={`${item.name}, ${time}${record ? `, ${record.status}` : ', aprazado'}${blocked ? ', bloqueado' : ''}`}
                          title={blocked ? 'Item ou prescrição bloqueada' : record ? `${time} · ${record.status} · já registrado` : `${time} · aprazado · duplo clique para checar ou bolar`}
                          disabled={blocked}
                          onDoubleClick={() => openSchedule(item, time)}
                          onKeyDown={(event) => { if (event.key === 'Enter') openSchedule(item, time) }}
                        >{stateClass === 'checked' ? <Icon name="check" size={24} /> : <span className="time-icon" />}</button> : '—'}
                      </td>
                    })}
                  </tr>
                )
              })}
              {!group.items.length && (group.category === 'Dietas'
                ? <tr><td className="prescription-grid-number">1</td><td className="prescription-grid-item">Nenhuma dieta registrada</td><td className="prescription-grid-empty" colSpan={30}>O item 1 está reservado para dieta.</td></tr>
                : <tr><td className="prescription-grid-empty" colSpan={32}>Nenhum item registrado nesta seção.</td></tr>)}
            </tbody>
          ))}
          <tbody>
            <tr className="prescription-grid-category"><th scope="rowgroup" colSpan={32}><span>SAE · Registros de enfermagem (não são prescrição médica)</span></th></tr>
            {saeCareItems.map((item, index) => (
              <tr key={item}>
                <td className="prescription-grid-number">{itemNumber + index + 1}</td>
                <th scope="row" className="prescription-grid-item">
                  <label className="prescription-grid-sae"><input type="checkbox" checked={!!saeRecords[item]} onChange={() => toggleSaeItem(item)} /><span>{item}</span></label>
                </th>
                <td colSpan={30} className="prescription-grid-empty">Registro de cuidado de enfermagem, sem horário aprazado.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prescription-sticky-scrollbar" ref={scrollbarRef} role="region" aria-label="Rolagem horizontal da prescrição" tabIndex={0}
        onScroll={(event) => { if (tableScrollRef.current) tableScrollRef.current.scrollLeft = event.currentTarget.scrollLeft }}>
        <div style={{ width: tableWidth }} />
      </div>
      {dialog && (
        <div className="confirmation-layer" role="dialog" aria-modal="true" aria-label="Checar ou bolar medicação">
          <Button className="confirmation-backdrop" onClick={closeDialog} ariaLabel="Fechar" />
          <div className="non-admin-modal">
            <div className="non-admin-modal-head"><div className="confirmation-icon"><Icon name="clock" size={22} /></div><div><strong>{dialogMode === 'choose' ? 'Checar ou bolar medicação' : 'Bolar medicação'}</strong><span>{dialog.item.name} · {dialog.time}</span></div></div>
            {dialogMode === 'choose' ? (
              <>
                <p className="schedule-dialog-text">Escolha o registro para este horário aprazado.</p>
                <div className="confirmation-actions">
                  <Button className="secondary-button" onClick={closeDialog}>Cancelar</Button>
                  <Button className="secondary-button" onClick={() => setDialogMode('bolar')}>Bolar medicação</Button>
                  <Button className="primary-button" onClick={registerCheck}><Icon name="check" size={15} /> Checar medicação</Button>
                </div>
              </>
            ) : (
              <>
                <label><span>Motivo obrigatório <b>*</b></span><select value={reason} onChange={(event) => setReason(event.target.value)}><option value="">Selecione...</option>{nonAdministrationReasons.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label><span>Descrição / Justificativa <b>*</b></span><textarea value={justification} onChange={(event) => setJustification(event.target.value)} placeholder="Descreva a ocorrência e as providências adotadas..." /></label>
                {dialogError && <div className="balance-form-error"><Icon name="alert" size={14} /><span>{dialogError}</span></div>}
                <div className="confirmation-actions"><Button className="secondary-button" onClick={() => { setDialogMode('choose'); setDialogError('') }}>Voltar</Button><Button className="danger-button" onClick={registerBolar}>Confirmar não administração</Button></div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function useSaeRecords(bed: string) {
  const [records, setRecords] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(`avicen-sae-${bed}`) || '{}') as Record<string, boolean> } catch { return {} }
  })

  useEffect(() => {
    try { setRecords(JSON.parse(localStorage.getItem(`avicen-sae-${bed}`) || '{}') as Record<string, boolean>) } catch { setRecords({}) }
  }, [bed])

  const toggleItem = (item: string) => setRecords((current) => {
    const updated = { ...current, [item]: !current[item] }
    localStorage.setItem(`avicen-sae-${bed}`, JSON.stringify(updated))
    return updated
  })

  return { records, toggleItem }
}

function SAEChecklist({ bed, role }: { bed: string; role: ProfessionalRole }) {
  const { records, toggleItem } = useSaeRecords(bed)

  return (
    <section className="record-section sae-checklist-card">
      <div className="record-section-title">Sistematização da Assistência de Enfermagem (SAE)</div>
      <p>Orientações e cuidados do turno para o paciente do leito {bed}, compartilhados com a equipe assistencial.</p>
      <div className="sae-checklist-grid">{saeCareItems.map((item) => <label className="sae-check-item" key={item}><input type="checkbox" checked={!!records[item]} onChange={() => toggleItem(item)} /><span>{item}</span></label>)}</div>
      <div className="sae-progress">{Object.values(records).filter(Boolean).length} de {saeCareItems.length} cuidados registrados · {professionals[role].name}</div>
    </section>
  )
}

function NursingPrescriptionSection({ patient, risks, items, prescriptionStatus, role, includeSae = true, showPatientBar = true }: {
  patient: Patient
  risks: PatientClinicalRisk
  items: PrescriptionItem[]
  prescriptionStatus: string
  role: ProfessionalRole
  includeSae?: boolean
  showPatientBar?: boolean
}) {
  return (
    <section className="record-section nursing-prescription-panel">
      <div className="record-section-head">
        <div><div className="record-section-title">Prescrição médica completa</div><p>Itens agrupados para conferência integrada com a assistência de enfermagem</p></div>
        <span className={`prescription-version-status ${prescriptionStatus === 'Vigente' ? 'vigente' : prescriptionStatus === 'Expirada' ? 'expirada' : prescriptionStatus === 'Suspensa' ? 'suspensa' : 'legacy'}`}>{prescriptionStatus}</span>
      </div>
      {showPatientBar && <MedicationPatientBar patient={patient} risks={risks} />}
      <PrescriptionItemsList items={items} prescriptionStatus={prescriptionStatus} />
      {includeSae && <SAEChecklist bed={patient.bed} role={role} />}
    </section>
  )
}

function NursingPrescriptionPage({ patient, risks, items, prescriptionStatus, role, activePatients, onPatientChange }: {
  patient: Patient
  risks: PatientClinicalRisk
  items: PrescriptionItem[]
  prescriptionStatus: string
  role: ProfessionalRole
  activePatients: Patient[]
  onPatientChange: (bed: string) => void
}) {
  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Prescrição integrada e SAE</div><p>Prescrição médica completa e orientações de enfermagem para o leito ativo.</p></div>
          <div className="role-authorized"><Icon name="shield" size={17} /><div><span>PERFIL CONECTADO</span><strong>{professionals[role].name} · {professionals[role].title}</strong></div></div>
        </div>
        <label className="schedule-bed-selector nursing-prescription-bed-selector"><span>PACIENTE / LEITO ATIVO</span><select value={patient.bed} onChange={(event) => onPatientChange(event.target.value)}>{activePatients.map((item) => <option key={item.admission} value={item.bed}>Leito {item.bed} · {item.name}</option>)}</select></label>
        <NursingPrescriptionSection patient={patient} risks={risks} items={items} prescriptionStatus={prescriptionStatus} role={role} />
      </div>
    </main>
  )
}

function PrescriptionPatientGrid({ patients, onSelect, title = 'Prescrições médicas', description = 'Selecione um paciente internado para consultar ou atualizar a prescrição vigente por 24 horas.', emptyMessage = 'Não há pacientes internados disponíveis para prescrição.', actionLabel = 'Abrir prescrição', ariaLabel = 'Pacientes internados para prescrição' }: {
  patients: Patient[]
  onSelect: (patient: Patient) => void
  title?: string
  description?: string
  emptyMessage?: string
  actionLabel?: string
  ariaLabel?: string
}) {
  const criticality = { critical: 'Crítico', warning: 'Observação', stable: 'Estável' } as const
  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">{title}</div><p>{description}</p></div>
          {title === 'Prescrições médicas' && <div className="prescription-validity-badge"><Icon name="clock" size={16} /><span>Vigência de 24 horas · 07:00 às 06:59</span></div>}
        </div>
        <section className="prescription-patient-grid" aria-label={ariaLabel}>
          {patients.map((patient) => (
            <button type="button" className={`prescription-patient-card status-${patient.status}`} key={patient.admission} onClick={() => onSelect(patient)} aria-label={`Selecionar ${patient.name}, leito ${patient.bed}, ${criticality[patient.status]}`}>
              <span className="prescription-patient-bed"><small>LEITO</small><strong>{patient.bed}</strong></span>
              <span className={`prescription-patient-criticality ${patient.status}`}>{criticality[patient.status]}</span>
              <strong className="prescription-patient-name">{patient.name}</strong>
              <span className="prescription-patient-diagnosis"><small>HD</small>{patient.diagnosis}</span>
              <span className="prescription-patient-open">{actionLabel} <Icon name="chevron" size={15} /></span>
            </button>
          ))}
          {!patients.length && <div className="prescription-patients-empty">{emptyMessage}</div>}
        </section>
      </div>
    </main>
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

function BedAccessUnavailable({ bed, deceased }: { bed: string; deceased: boolean }) {
  return (
    <main className="clinical-module-page">
      <section className="bed-access-unavailable" role="status">
        <div className="access-icon"><Icon name={deceased ? 'shield' : 'bed'} size={26} /></div>
        <div className="access-kicker">{deceased ? 'PROTOCOLO DE ÓBITO' : 'LEITO SEM PACIENTE ATIVO'}</div>
        <div className="access-title">{deceased ? 'Prescrição e aprazamento bloqueados' : `Leito ${bed} sem paciente internado`}</div>
        <p>{deceased
          ? 'O prontuário foi encerrado por óbito. Somente a aba Evoluções permanece disponível para consulta e auditoria.'
          : 'Não é possível prescrever ou aprazar sem uma internação ativa neste leito.'}</p>
      </section>
    </main>
  )
}

function PrescriptionScreen({ role, onChangeRole, onNotify, medications, onMedicationAdd, patient, risks, activePatients, onPatientChange, onBackToPatients }: {
  role: ProfessionalRole
  onChangeRole: (role: ProfessionalRole) => void
  onNotify: (message: string) => void
  medications: MedicationOrder[]
  onMedicationAdd: (medication: MedicationOrder) => void
  patient: Patient
  risks: PatientClinicalRisk
  activePatients: Patient[]
  onPatientChange: (bed: string) => void
  onBackToPatients?: () => void
}) {
  const [medication, setMedication] = useState('Dipirona')
  const [dose, setDose] = useState('1 g')
  const [route, setRoute] = useState('EV')
  const [frequency, setFrequency] = useState('6/6h')
  const [formMode, setFormMode] = useState<null | 'new' | 'edit'>(null)
  const [editingMedicationId, setEditingMedicationId] = useState<number | null>(null)
  const [editNote, setEditNote] = useState('')
  const medicationAllergyAliases: Record<string, string[]> = { Amoxicilina: ['penicilina', 'beta-lactâmico'], Ceftriaxona: ['cefalosporina', 'beta-lactâmico'], Dipirona: ['dipirona', 'metamizol'] }
  const matchingAllergy = risks.allergies.find((item) => { const allergyName = item.substance.toLocaleLowerCase('pt-BR'); const medicineName = medication.toLocaleLowerCase('pt-BR'); return allergyName.includes(medicineName) || medicineName.includes(allergyName) || (medicationAllergyAliases[medication] || []).some((alias) => allergyName.includes(alias)) })
  const allergyBlocked = Boolean(matchingAllergy)
  const [diluent, setDiluent] = useState('SF 0,9% — 100 mL')
  const [speed, setSpeed] = useState('50 mL/h')
  const [target, setTarget] = useState('Manter PAM > 65 mmHg')
  const [formError, setFormError] = useState('')
  const readOnly = role === 'enfermeiro'
  const medicationOptions = [...new Set([
    'Dipirona', 'Paracetamol', 'Metoclopramida', 'Amoxicilina', 'Ceftriaxona',
    ...medications.map((item) => item.name), medication,
  ])]

  const selectPrescriptionForEdit = (id: number) => {
    const selected = medications.find((item) => item.id === id)
    if (!selected) return
    setEditingMedicationId(selected.id)
    setMedication(selected.name)
    setDose(selected.dose)
    setRoute(selected.route)
    setFrequency(selected.frequency)
    setEditNote(selected.note)
    setFormError('')
  }

  const startNewPrescription = () => {
    setMedication('Dipirona')
    setDose('1 g')
    setRoute('EV')
    setFrequency('6/6h')
    setFormError('')
    setEditingMedicationId(null)
    setFormMode('new')
  }

  const startEditingPrescription = () => {
    const firstMedication = medications[0]
    if (!firstMedication) {
      onNotify('Não há itens prescritos para alterar neste atendimento.')
      return
    }
    selectPrescriptionForEdit(firstMedication.id)
    setFormMode('edit')
  }

  const selectMedication = (value: string) => {
    setMedication(value)
    if (value === 'Paracetamol') {
      setDose('750 mg')
      setRoute('VO')
      setFrequency('6/6h se dor ou febre')
    }
  }

  const savePrescription = () => {
    if (role !== 'medico' || !formMode) return
    if (allergyBlocked) {
      onNotify('Prescrição bloqueada por incompatibilidade com alergia documentada.')
      return
    }
    if (formMode === 'edit' && editingMedicationId === null) {
      setFormError('Selecione uma prescrição vigente para alterar.')
      return
    }
    if (![medication, dose, route, frequency, ...(formMode === 'new' ? [diluent, speed, target] : [editNote])].every((value) => value.trim())) {
      setFormError('Preencha todos os campos obrigatórios antes de salvar.')
      return
    }
    const orderId = formMode === 'edit' ? editingMedicationId : Date.now()
    if (orderId === null) {
      setFormError('Selecione uma prescrição vigente para alterar.')
      return
    }
    setFormError('')
    onMedicationAdd({
      id: orderId,
      name: medication,
      dose,
      route,
      frequency,
      times: [],
      status: 'Aguardando Aprazamento da Enfermagem',
      note: formMode === 'edit' ? editNote.trim() : `${diluent} · ${speed} · Alvo: ${target}`,
    })
    onNotify(formMode === 'edit' ? `${medication}: prescrição alterada e aguardando novo aprazamento.` : `${medication} incluído na prescrição simulada.`)
    setFormMode(null)
    setEditingMedicationId(null)
  }

  if (role === 'tecnico') {
    return <main className="clinical-module-page"><AccessRestricted requiredRole="medico" currentRole={role} onChangeRole={onChangeRole} /></main>
  }

  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div>
            {onBackToPatients && <Button className="secondary-button prescription-back-button" onClick={onBackToPatients}><Icon name="chevron" size={15} /> Voltar aos pacientes</Button>}
            <div className="page-title">Prescrição medicamentosa</div>
            <p>Prescrição atual · {formatDate(new Date())} · Vigência de 24 horas, das 07:00 às 06:59</p>
          </div>
          <div className="module-owner"><div className="profile-avatar">LM</div><div><span>PRESCRITOR RESPONSÁVEL</span><strong>Dra. Larissa Menezes · CRM-SP 145829</strong></div></div>
        </div>
        <MedicationPatientBar patient={patient} risks={risks} />
        {role !== 'medico' && <div className="schedule-bed-selector prescription-nurse-patient-selector"><span>PACIENTE / LEITO DA PRESCRIÇÃO</span><select value={patient.bed} onChange={(event) => onPatientChange(event.target.value)}>{activePatients.map((item) => <option key={item.admission} value={item.bed}>Leito {item.bed} · {item.name}</option>)}</select></div>}

        {role === 'medico' && <div className="prescription-action-bar">
          <Button className="primary-button" onClick={startNewPrescription}><Icon name="admission" size={16} /> Nova prescrição</Button>
          <Button className="secondary-button" onClick={startEditingPrescription}><Icon name="document" size={16} /> Alterar prescrição</Button>
        </div>}

        <div className={`prescription-layout ${role === 'medico' && !formMode ? 'single-column' : ''}`}>
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
            {!medications.length && <div className="medication-empty">Nenhuma prescrição vigente registrada para este paciente.</div>}
          </section>

          {(role === 'medico' ? Boolean(formMode) : true) && <aside className="record-section prescription-form-card">
            <div className="prescription-form-head"><div className="summary-icon"><Icon name="medication" size={19} /></div><div><div className="record-section-title">{readOnly ? 'Consulta da prescrição' : formMode === 'edit' ? 'Alterar prescrição' : 'Nova prescrição'}</div><p>{readOnly ? 'Visualização sem permissão de edição' : formMode === 'edit' ? 'Revise o item vigente antes de salvar a alteração' : 'Nova linha para a vigência atual de 24 horas'}</p></div></div>
            {readOnly && <PermissionNotice role={role} allowed="médico para editar ou salvar" />}
            {formMode === 'edit' && <label className="prescription-edit-selector"><span>Prescrição vigente <b>*</b></span><select value={editingMedicationId ?? ''} onChange={(event) => selectPrescriptionForEdit(Number(event.target.value))}>{medications.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.dose} · {item.frequency}</option>)}</select></label>}
            {allergyBlocked && (
              <div className="allergy-block">
                <div className="allergy-block-title"><Icon name="alert" size={20} /><div><span>BLOQUEIO DE SEGURANÇA</span><strong>Incompatibilidade com alergia</strong></div></div>
                <p>{matchingAllergy?.substance} consta no catálogo de alergias deste paciente: {matchingAllergy?.reaction}. A inclusão de {medication} está bloqueada.</p>
                <div><span>{matchingAllergy?.severity} · {matchingAllergy?.recordedAt}</span><strong>{matchingAllergy?.recordedBy}</strong></div>
              </div>
            )}
            <div className="prescription-form">
              <label><span>Medicamento <b>*</b></span><select value={medication} disabled={readOnly} onChange={(event) => selectMedication(event.target.value)}>{medicationOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
              <div className="form-split">
                <label><span>Dose <b>*</b></span><input value={dose} disabled={readOnly} onChange={(event) => setDose(event.target.value)} /></label>
                <label><span>Via <b>*</b></span><select value={route} disabled={readOnly} onChange={(event) => setRoute(event.target.value)}><option>EV</option><option>VO</option><option>SNE</option><option>SNG</option><option>SC</option><option>IM</option></select></label>
              </div>
              {formMode === 'edit' ? (
                <label><span>Orientações / observações <b>*</b></span><input value={editNote} onChange={(event) => setEditNote(event.target.value)} /></label>
              ) : (
                <>
                  <label><span>Diluente e volume <b>*</b></span><input value={diluent} disabled={readOnly} onChange={(event) => setDiluent(event.target.value)} /></label>
                  <label><span>Velocidade de infusão <b>*</b></span><input value={speed} disabled={readOnly} onChange={(event) => setSpeed(event.target.value)} /></label>
                  <label><span>Alvo clínico <b>*</b></span><input value={target} disabled={readOnly} onChange={(event) => setTarget(event.target.value)} /></label>
                  <label><span>Orientações de administração</span><textarea disabled={readOnly} placeholder="Observações clínicas adicionais..." /></label>
                </>
              )}
              <label><span>Frequência <b>*</b></span><input value={frequency} disabled={readOnly} onChange={(event) => setFrequency(event.target.value)} placeholder="Ex.: 8/8h, 12/12h ou Contínuo" /></label>
              {formError && <div className="balance-form-error"><Icon name="alert" size={15} /><span>{formError}</span></div>}
              <div className="prescriber-stamp"><Icon name="document" size={16} /><div><span>Assinatura eletrônica ao salvar</span><strong>Dra. Larissa Menezes · CRM-SP 145829</strong></div></div>
              {!readOnly && <div className="prescription-form-actions">
                <Button className="secondary-button" onClick={() => { setFormMode(null); setEditingMedicationId(null); setFormError('') }}>Cancelar</Button>
                <Button className={`primary-button prescription-save ${allergyBlocked ? 'blocked' : ''}`} onClick={savePrescription}>
                  {allergyBlocked ? <Icon name="alert" size={16} /> : <Icon name="check" size={16} />}
                  {allergyBlocked ? 'Salvar bloqueado por alergia' : formMode === 'edit' ? 'Salvar alteração' : 'Salvar nova prescrição'}
                </Button>
              </div>}
            </div>
          </aside>}
        </div>
      </div>
    </main>
  )
}

function PhysicianPrescriptionScreen({ patient, risks, medications, versions, onNotify, onBackToPatients, onClosePrescription }: {
  patient: Patient
  risks: PatientClinicalRisk
  medications: MedicationOrder[]
  versions: PrescriptionVersion[]
  onNotify: (message: string) => void
  onBackToPatients: () => void
  onClosePrescription: (items: PrescriptionItem[], previousItems: PrescriptionItem[]) => void
}) {
  const [formMode, setFormMode] = useState<null | 'new' | 'edit'>(null)
  const [category, setCategory] = useState<PrescriptionCategory>('Medicamentos')
  const [draftItems, setDraftItems] = useState<PrescriptionItem[]>([])
  const [editingDraftItemId, setEditingDraftItemId] = useState<number | null>(null)
  const [activeIngredient, setActiveIngredient] = useState('')
  const [dose, setDose] = useState('')
  const [route, setRoute] = useState('')
  const [diluent, setDiluent] = useState('')
  const [volume, setVolume] = useState('')
  const [speed, setSpeed] = useState('')
  const [frequency, setFrequency] = useState('')
  const [dietType, setDietType] = useState('')
  const [dietRoute, setDietRoute] = useState('')
  const [dietVolume, setDietVolume] = useState('')
  const [dietInfusion, setDietInfusion] = useState('')
  const [examType, setExamType] = useState('Laboratorial')
  const [examRequest, setExamRequest] = useState('')
  const [careInstructions, setCareInstructions] = useState('')
  const [formError, setFormError] = useState('')
  const [historyDays, setHistoryDays] = useState(7)
  const now = new Date()
  const displayableVersions = versions.filter((version) => !version.demonstrationHistory)
  const currentVersion = displayableVersions.filter((version) => version.status === 'Vigente').sort((a, b) => b.version - a.version)[0]
  const latestVersion = displayableVersions.slice().sort((left, right) => {
    const leftTime = left.createdAt ? Date.parse(left.createdAt) : 0
    const rightTime = right.createdAt ? Date.parse(right.createdAt) : 0
    return leftTime - rightTime
  }).slice(-1)[0]
  const currentItems = currentVersion?.items ?? latestVersion?.items ?? medications.map(toPrescriptionItem)
  const currentExpired = Boolean(currentVersion && !(Date.parse(currentVersion.expiresAt) > now.getTime()))
  const currentStatus = currentVersion
    ? currentExpired ? 'Expirada' : 'Vigente'
    : latestVersion ? 'Suspensa' : currentItems.length ? 'Legado · sem versão' : 'Sem prescrição homologada'
  const medicationOptions = [...new Set([
    'Dipirona', 'Paracetamol', 'Metoclopramida', 'Amoxicilina', 'Ceftriaxona',
    ...medications.map((item) => item.name),
    ...currentItems.filter((item) => item.category === 'Medicamentos').map((item) => item.activeIngredient || item.name),
  ])]
  const matchingAllergy = category === 'Medicamentos' ? findMedicationAllergy(activeIngredient, risks) : undefined
  const unaddedFields = category === 'Medicamentos'
    ? [activeIngredient, dose, route, diluent, volume, speed, frequency]
    : category === 'Dietas'
      ? [dietType, dietRoute, dietVolume, dietInfusion]
      : category === 'Exames'
        ? [examRequest]
        : [careInstructions]
  const hasUnaddedItem = editingDraftItemId !== null || unaddedFields.some((value) => value.trim())
  const historyVersions = versions.filter((version) => {
    const expired = version.status === 'Vigente' && !(Date.parse(version.expiresAt) > now.getTime())
    if (version.id === currentVersion?.id && !expired) return false
    if (!version.createdAt) return true
    const recordedAt = Date.parse(version.createdAt)
    return Number.isFinite(recordedAt) && recordedAt >= now.getTime() - historyDays * 24 * 60 * 60 * 1000
  }).sort((left, right) => {
    const leftTime = left.createdAt ? Date.parse(left.createdAt) : 0
    const rightTime = right.createdAt ? Date.parse(right.createdAt) : 0
    return leftTime - rightTime
  })

  const resetItemFields = () => {
    setActiveIngredient('')
    setDose('')
    setRoute('')
    setDiluent('')
    setVolume('')
    setSpeed('')
    setFrequency('')
    setDietType('')
    setDietRoute('')
    setDietVolume('')
    setDietInfusion('')
    setExamType('Laboratorial')
    setExamRequest('')
    setCareInstructions('')
  }

  const closeForm = () => {
    setFormMode(null)
    setDraftItems([])
    setEditingDraftItemId(null)
    setFormError('')
    resetItemFields()
  }

  const startNewPrescription = () => {
    setDraftItems([])
    setEditingDraftItemId(null)
    setFormError('')
    resetItemFields()
    setFormMode('new')
  }

  const startEditingPrescription = () => {
    if (!currentItems.length) {
      onNotify('Não há itens de prescrição para alterar neste atendimento.')
      return
    }
    setDraftItems(currentItems.map((item) => ({ ...item })))
    setEditingDraftItemId(null)
    setFormError('')
    resetItemFields()
    setFormMode('edit')
  }

  const editDraftItem = (item: PrescriptionItem) => {
    setEditingDraftItemId(item.id)
    setCategory(item.category)
    setActiveIngredient(item.activeIngredient || item.name)
    setDose(item.dose || '')
    setRoute(item.route || '')
    setDiluent(item.diluent || '')
    setVolume(item.volume || '')
    setSpeed(item.speed || '')
    setFrequency(item.frequency || '')
    setDietType(item.category === 'Dietas' ? item.name : '')
    setDietRoute(item.category === 'Dietas' ? item.route || '' : '')
    setDietVolume(item.category === 'Dietas' ? item.volume || '' : '')
    setDietInfusion(item.category === 'Dietas' ? item.speed || '' : '')
    setExamType(item.category === 'Exames' ? item.name : 'Laboratorial')
    setExamRequest(item.category === 'Exames' ? item.details || '' : '')
    setCareInstructions(item.category === 'Cuidados Especiais' ? item.details || '' : '')
    setFormError('')
  }

  const addDraftItem = () => {
    let item: PrescriptionItem
    const existing = editingDraftItemId === null ? undefined : draftItems.find((draft) => draft.id === editingDraftItemId)
    if (category === 'Medicamentos') {
      if (![activeIngredient, dose, route, diluent, volume, speed, frequency].every((value) => value.trim())) {
        setFormError('Informe princípio ativo, dose, via, diluente, volume, velocidade e frequência.')
        return
      }
      const allergy = findMedicationAllergy(activeIngredient, risks)
      if (allergy && (existing?.status ?? 'Ativa') === 'Ativa') {
        setFormError(`Item bloqueado: ${activeIngredient} é incompatível com a alergia registrada a ${allergy.substance}.`)
        return
      }
      item = {
        id: editingDraftItemId ?? Math.max(Date.now(), ...draftItems.map((draft) => draft.id + 1)),
        category,
        name: activeIngredient,
        activeIngredient,
        dose,
        route,
        diluent,
        volume,
        speed,
        frequency,
        details: existing?.details,
        status: existing?.status ?? 'Ativa',
      }
    } else if (category === 'Dietas') {
      if (![dietType, dietRoute, dietVolume, dietInfusion].every((value) => value.trim())) {
        setFormError('Informe tipo, via, volume e infusão da dieta.')
        return
      }
      item = { id: editingDraftItemId ?? Math.max(Date.now(), ...draftItems.map((draft) => draft.id + 1)), category, name: dietType, route: dietRoute, volume: dietVolume, speed: dietInfusion, status: existing?.status ?? 'Ativa' }
    } else if (category === 'Exames') {
      if (!examRequest.trim()) {
        setFormError('Descreva o exame laboratorial ou de imagem solicitado.')
        return
      }
      item = { id: editingDraftItemId ?? Math.max(Date.now(), ...draftItems.map((draft) => draft.id + 1)), category, name: examType, details: examRequest.trim(), status: existing?.status ?? 'Ativa' }
    } else {
      if (!careInstructions.trim()) {
        setFormError('Descreva o cuidado especial e a frequência de vigilância.')
        return
      }
      item = { id: editingDraftItemId ?? Math.max(Date.now(), ...draftItems.map((draft) => draft.id + 1)), category, name: 'Cuidados especiais', details: careInstructions.trim(), status: existing?.status ?? 'Ativa' }
    }
    setDraftItems((current) => existing
      ? current.map((draft) => draft.id === existing.id ? item : draft)
      : [...current, item])
    setEditingDraftItemId(null)
    setFormError('')
    resetItemFields()
  }

  const toggleDraftItem = (id: number) => {
    setDraftItems((current) => current.map((item) => item.id === id
      ? { ...item, status: item.status === 'Ativa' ? 'Suspensa' : 'Ativa' }
      : item))
    if (editingDraftItemId === id) {
      setEditingDraftItemId(null)
      resetItemFields()
    }
  }

  const closeOfficialPrescription = () => {
    if (hasUnaddedItem) {
      setFormError('Adicione ou atualize o item da minuta antes de fechar a prescrição.')
      return
    }
    if (!draftItems.length) {
      setFormError('Adicione ao menos um item antes de fechar a prescrição.')
      return
    }
    const blockedItem = draftItems.find((item) => item.category === 'Medicamentos'
      && item.status === 'Ativa'
      && findMedicationAllergy(item.activeIngredient || item.name, risks))
    if (blockedItem) {
      const allergy = findMedicationAllergy(blockedItem.activeIngredient || blockedItem.name, risks)
      setFormError(`Prescrição bloqueada: ${blockedItem.name} é incompatível com a alergia registrada a ${allergy?.substance}.`)
      return
    }
    onClosePrescription(draftItems, currentItems)
    setFormMode(null)
    setDraftItems([])
    setEditingDraftItemId(null)
    setFormError('')
    resetItemFields()
  }

  const describeItem = (item: PrescriptionItem) => {
    if (item.category === 'Medicamentos') {
      return [item.dose, item.route && `Via ${item.route}`, item.diluent, item.volume, item.speed, item.frequency, item.details]
        .filter(Boolean).join(' · ')
    }
    if (item.category === 'Dietas') return [item.route && `Via ${item.route}`, item.volume, item.speed && `Infusão ${item.speed}`].filter(Boolean).join(' · ')
    return item.details || '—'
  }

  if (!patient || !patient.admission) return null

  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div>
            <Button className="secondary-button prescription-back-button" onClick={onBackToPatients}><Icon name="chevron" size={15} /> Voltar aos pacientes</Button>
            <div className="page-title">Prescrição medicamentosa</div>
            <p>Vigência de 24 horas · 07:00 às 06:59 · Atendimento {patient.admission}</p>
          </div>
          <div className="module-owner"><div className="profile-avatar">{professionals.medico.initials}</div><div><span>PRESCRITOR RESPONSÁVEL</span><strong>{professionals.medico.name} · {professionals.medico.registry}</strong></div></div>
        </div>
        <MedicationPatientBar patient={patient} risks={risks} />

        <div className="prescription-action-bar">
          <Button className="primary-button" onClick={startNewPrescription}><Icon name="admission" size={16} /> Nova prescrição</Button>
          <Button className="secondary-button" onClick={startEditingPrescription}><Icon name="document" size={16} /> Alterar prescrição</Button>
        </div>

        <div className={`prescription-layout ${formMode ? '' : 'single-column'}`}>
          <section className="record-section medication-list-card prescription-current-card">
            <div className="record-section-head">
              <div><div className="record-section-title">Itens da prescrição vigente</div><p>{currentItems.filter((item) => item.status === 'Ativa').length} item(ns) ativos · versão {currentVersion?.version ?? latestVersion?.version ?? (currentItems.length ? 'legada' : '—')} · {currentVersion || latestVersion || currentItems.length ? formatPrescriptionNumber(currentVersion ?? latestVersion) : 'Sem prescrição registrada'}</p>{(currentVersion ?? latestVersion)?.demonstration && <p className="prescription-demo-notice">Exemplo fictício para demonstração · não utilizar na assistência.</p>}</div>
              <span className={`prescription-version-status ${currentStatus === 'Vigente' ? 'vigente' : currentStatus === 'Suspensa' ? 'suspensa' : currentStatus === 'Expirada' ? 'expirada' : 'legacy'}`}>{currentStatus}</span>
            </div>
            {currentVersion && <div className="prescription-validity-range">Início: {formatLocalDateTime(new Date(currentVersion.validFrom))} · Término: {formatLocalDateTime(new Date(currentVersion.expiresAt))}</div>}
            <PrescriptionItemsList items={currentItems} prescriptionStatus={currentStatus} />
          </section>

          {formMode && <aside className="record-section prescription-form-card prescription-composer">
            <div className="prescription-form-head"><div className="summary-icon"><Icon name="medication" size={19} /></div><div><div className="record-section-title">{formMode === 'edit' ? 'Alterar prescrição' : 'Nova prescrição'}</div><p>Itens em minuta · ainda não homologados</p></div></div>
            <div className="prescription-draft-list">
              <div className="prescription-draft-title">Itens da minuta <span>{draftItems.length}</span></div>
              {draftItems.map((item) => (
                <div className={`prescription-draft-item ${item.status === 'Suspensa' ? 'suspended' : ''}`} key={item.id}>
                  <div><strong>{item.name}</strong><span>{item.category} · {describeItem(item)}</span></div>
                  <b>{item.status}</b>
                  <div className="prescription-draft-item-actions">
                    <Button className="secondary-button" onClick={() => editDraftItem(item)}>Editar</Button>
                    <Button className="secondary-button" onClick={() => toggleDraftItem(item.id)}>{item.status === 'Ativa' ? 'Suspender' : 'Restaurar'}</Button>
                  </div>
                </div>
              ))}
              {!draftItems.length && <div className="prescription-draft-empty">Ainda não há itens na minuta.</div>}
            </div>

            <div className="prescription-form">
              <label><span>Categoria <b>*</b></span><select value={category} onChange={(event) => { setCategory(event.target.value as PrescriptionCategory); setEditingDraftItemId(null); resetItemFields(); setFormError('') }}><option>Medicamentos</option><option>Dietas</option><option>Exames</option><option>Cuidados Especiais</option></select></label>
              {category === 'Medicamentos' && <>
                <label><span>Princípio ativo <b>*</b></span><select value={activeIngredient} onChange={(event) => { setActiveIngredient(event.target.value); setFormError('') }}><option value="">Selecione...</option>{medicationOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
                {matchingAllergy && <div className="allergy-block">
                  <div className="allergy-block-title"><Icon name="alert" size={20} /><div><span>BLOQUEIO DE SEGURANÇA</span><strong>Incompatibilidade com alergia</strong></div></div>
                  <p>{matchingAllergy.substance} consta no histórico deste paciente: {matchingAllergy.reaction}. A inclusão de {activeIngredient} está bloqueada.</p>
                </div>}
                <div className="form-split"><label><span>Dose <b>*</b></span><input value={dose} onChange={(event) => setDose(event.target.value)} /></label><label><span>Via <b>*</b></span><select value={route} onChange={(event) => setRoute(event.target.value)}><option value="">Selecione...</option><option>EV</option><option>VO</option><option>SNE</option><option>SNG</option><option>SC</option><option>IM</option></select></label></div>
                <label><span>Diluente <b>*</b></span><input value={diluent} onChange={(event) => setDiluent(event.target.value)} placeholder="Ex.: SF 0,9%" /></label>
                <div className="form-split"><label><span>Volume <b>*</b></span><input value={volume} onChange={(event) => setVolume(event.target.value)} placeholder="Ex.: 100 mL" /></label><label><span>Velocidade <b>*</b></span><input value={speed} onChange={(event) => setSpeed(event.target.value)} placeholder="Ex.: 50 mL/h" /></label></div>
                <label><span>Frequência <b>*</b></span><input value={frequency} onChange={(event) => setFrequency(event.target.value)} placeholder="Ex.: 8/8h ou Contínua" /></label>
              </>}
              {category === 'Dietas' && <>
                <label><span>Tipo de dieta <b>*</b></span><select value={dietType} onChange={(event) => setDietType(event.target.value)}><option value="">Selecione...</option><option>Dieta enteral padrão</option><option>Dieta enteral hipercalórica</option><option>Dieta parenteral</option><option>Dieta oral</option></select></label>
                <label><span>Via <b>*</b></span><select value={dietRoute} onChange={(event) => setDietRoute(event.target.value)}><option value="">Selecione...</option><option>VO</option><option>SNE</option><option>SNG</option><option>Gastrostomia</option><option>EV</option></select></label>
                <div className="form-split"><label><span>Volume <b>*</b></span><input value={dietVolume} onChange={(event) => setDietVolume(event.target.value)} placeholder="Ex.: 1200 mL/dia" /></label><label><span>Infusão <b>*</b></span><input value={dietInfusion} onChange={(event) => setDietInfusion(event.target.value)} placeholder="Ex.: 50 mL/h" /></label></div>
              </>}
              {category === 'Exames' && <>
                <label><span>Tipo de exame <b>*</b></span><select value={examType} onChange={(event) => setExamType(event.target.value)}><option>Laboratorial</option><option>Imagem</option></select></label>
                <label><span>Solicitação laboratorial ou de imagem <b>*</b></span><textarea value={examRequest} onChange={(event) => setExamRequest(event.target.value)} placeholder="Descreva o exame e a indicação clínica" /></label>
              </>}
              {category === 'Cuidados Especiais' && <label><span>Conduta e frequência de vigilância <b>*</b></span><textarea value={careInstructions} onChange={(event) => setCareInstructions(event.target.value)} placeholder="Ex.: controle neurológico de pupilas 2/2h; manter cabeceira elevada." /></label>}
              {formError && <div className="balance-form-error" role="alert"><Icon name="alert" size={15} /><span>{formError}</span></div>}
            </div>

            <div className="prescriber-stamp"><Icon name="document" size={16} /><div><span>Assinatura eletrônica demonstrativa</span><strong>{professionals.medico.name} · {professionals.medico.registry}</strong></div></div>
            <div className="prescription-form-actions">
              <Button className="secondary-button" onClick={closeForm}>Cancelar</Button>
              <Button className="secondary-button" onClick={addDraftItem}><Icon name="admission" size={15} /> Adicionar item</Button>
              <Button className="primary-button" onClick={closeOfficialPrescription}><Icon name="check" size={15} /> Fechar prescrição</Button>
            </div>
          </aside>}
        </div>

        <section className="record-section prescription-history">
          <div className="record-section-head">
            <div><div className="record-section-title">Histórico de versões</div><p>Consulta cronológica de prescrições anteriores e itens suspensos</p></div>
            <label className="prescription-history-filter"><span>Período</span><select value={historyDays} onChange={(event) => setHistoryDays(Number(event.target.value))}><option value={1}>Últimas 24 horas</option><option value={3}>Últimos 3 dias</option><option value={7}>Últimos 7 dias</option><option value={30}>Últimos 30 dias</option></select></label>
          </div>
          {historyVersions.map((version) => {
            const expired = version.status === 'Vigente' && !(Date.parse(version.expiresAt) > now.getTime())
            const status = version.status === 'Suspensa' ? 'Suspensa' : expired ? 'Expirada' : 'Vigente'
            return <article className="prescription-history-version" key={version.id}>
              <div className="prescription-history-version-head">
                <strong>{version.demonstration ? 'Exemplo fictício' : `Versão ${version.version || 'legada'}`} · {formatPrescriptionNumber(version)}</strong>
                <span>{version.createdAt ? formatLocalDateTime(new Date(version.createdAt)) : 'Data não disponível · registro legado'}</span>
                <b className={`prescription-version-status ${status.toLocaleLowerCase('pt-BR')}`}>{status}</b>
              </div>
              {version.validFrom && version.expiresAt && <small>Vigência: {formatLocalDateTime(new Date(version.validFrom))} até {formatLocalDateTime(new Date(version.expiresAt))}</small>}
              <PrescriptionItemsList items={version.items} prescriptionStatus={status} />
              <small>Responsável: {version.signedBy}</small>
            </article>
          })}
          {!historyVersions.length && <div className="prescription-draft-empty">Não há versões anteriores registradas no período selecionado.</div>}
        </section>
      </div>
    </main>
  )
}

function SchedulingScreen({ role, onChangeRole, onNotify, schedule, onScheduleChange, selectedBed, onSelectedBedChange, approved, onApprove, medications, activePatients, pendingPatients, getPatientRisks }: {
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
  activePatients: Patient[]
  pendingPatients: Patient[]
  getPatientRisks: (admission: string) => PatientClinicalRisk
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [selectedAdmission, setSelectedAdmission] = useState<string | null>(null)
  if (role === 'tecnico') {
    const schedulePatient = activePatients.find((patient) => patient.bed === selectedBed)
    return (
      <main className="clinical-module-page">
        <div className="clinical-module-content">
          <div className="module-heading"><div><div className="page-title">Aprazamento de enfermagem</div><p>Visualização do leito ativo; edição da grade restrita ao perfil enfermeiro.</p></div><div className="role-authorized"><Icon name="shield" size={17} /><div><span>PERFIL CONECTADO</span><strong>{professionals[role].name} · {professionals[role].title}</strong></div></div></div>
          {schedulePatient && <div className="schedule-patient-header"><MedicationPatientBar patient={schedulePatient} risks={getPatientRisks(schedulePatient.admission)} /><div className="schedule-bed-selector"><span>LEITO ATIVO</span><strong>{schedulePatient.bed} · {schedulePatient.name}</strong></div></div>}
          <div className="nursing-role-notice"><Icon name="shield" size={16} /> A definição e homologação dos horários permanece exclusiva do perfil enfermeiro.</div>
        </div>
      </main>
    )
  }
  if (role !== 'enfermeiro') {
    return <main className="clinical-module-page"><AccessRestricted requiredRole="enfermeiro" currentRole={role} onChangeRole={onChangeRole} /></main>
  }
  const schedulePatient = activePatients.find((patient) => patient.admission === selectedAdmission)
  if (!schedulePatient) {
    return <PrescriptionPatientGrid
      patients={pendingPatients}
      onSelect={(patient) => { onSelectedBedChange(patient.bed); setSelectedAdmission(patient.admission) }}
      title="Aprazamento de enfermagem"
      description="Selecione um paciente com prescrição médica vigente aguardando aprazamento neste turno."
      emptyMessage="Não há pacientes com prescrição pendente de aprazamento neste turno."
      actionLabel="Abrir aprazamento"
      ariaLabel="Pacientes com prescrição pendente de aprazamento"
    />
  }
  const schedulePatientRisks = getPatientRisks(schedulePatient.admission)
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
        <div className="schedule-patient-header schedule-aprazamento-patient-header">
          <MedicationPatientBar patient={schedulePatient} risks={schedulePatientRisks} />
          <div className="schedule-bed-selector"><Button className="secondary-button prescription-back-button" onClick={() => { setSelectedAdmission(null); setValidationError('') }}><Icon name="chevron" size={15} /> Voltar aos pacientes</Button><small>{new Date().toLocaleDateString('pt-BR')} · {professionals[role].name}</small></div>
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

function AdministrationScreen({ role, onChangeRole, onNotify, recordsVersion = 0, onRecordsChange, schedule, approved, medications, prescriptionItems, prescriptionStatus, patient, risks, activePatients, selectedBed, onSelectedBedChange, embedded = false }: {
  role: ProfessionalRole; onChangeRole: (role: ProfessionalRole) => void; onNotify: (message: string) => void; recordsVersion?: number; onRecordsChange?: () => void
  schedule: MedicationSchedule; approved: boolean; medications: MedicationOrder[]; prescriptionItems: PrescriptionItem[]; prescriptionStatus: string
  patient: Patient; risks: PatientClinicalRisk; activePatients: Patient[]; selectedBed: string; onSelectedBedChange: (bed: string) => void; embedded?: boolean
}) {
  const [records, setRecords] = useState<Record<string, AdministrationRecord>>(() => { try { return JSON.parse(localStorage.getItem(`avicen-administration-${selectedBed}`) || '{}') as Record<string, AdministrationRecord> } catch { return {} } })
  const [nonAdministration, setNonAdministration] = useState<{ key: string; name: string } | null>(null)
  const [reason, setReason] = useState('')
  const [justification, setJustification] = useState('')
  const [modalError, setModalError] = useState('')
  useEffect(() => { try { setRecords(JSON.parse(localStorage.getItem(`avicen-administration-${selectedBed}`) || '{}') as Record<string, AdministrationRecord>) } catch { setRecords({}) } }, [selectedBed, recordsVersion])
  const checkAdministration = (key: string, name: string) => {
    if (role !== 'tecnico') {
      onNotify('A checagem beira-leito é exclusiva do perfil técnico de enfermagem.')
      return
    }
    setRecords((current) => { const updated = { ...current, [key]: { status: 'Administrado' as const, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) } }; localStorage.setItem(`avicen-administration-${selectedBed}`, JSON.stringify(updated)); return updated })
    onRecordsChange?.()
    onNotify(`${name}: administração checada com sucesso.`)
  }
  const confirmNonAdministration = () => {
    if (role !== 'tecnico') {
      onNotify('O registro de não administração é exclusivo do perfil técnico de enfermagem.')
      setNonAdministration(null)
      return
    }
    if (!nonAdministration || !reason || !justification.trim()) {
      setModalError('Selecione um motivo e informe a descrição / justificativa.')
      return
    }
    setRecords((current) => { const updated = { ...current, [nonAdministration.key]: { status: 'Não administrado' as const, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), reason, justification: justification.trim() } }; localStorage.setItem(`avicen-administration-${selectedBed}`, JSON.stringify(updated)); return updated })
    onRecordsChange?.()
    setNonAdministration(null); setReason(''); setJustification(''); setModalError('')
    onNotify('Não administração registrada e preservada no histórico.')
  }
  if (!embedded && role !== 'tecnico' && role !== 'enfermeiro') {
    return <div className="clinical-module-page"><AccessRestricted requiredRole="tecnico" currentRole={role} onChangeRole={onChangeRole} /></div>
  }
  return (
    <div className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Checagem de enfermagem</div><p>Administração de medicamentos · Turno diurno · 07:00 às 19:00</p></div>
          <div className="role-authorized"><Icon name="shield" size={17} /><div><span>{role === 'tecnico' ? 'EXECUÇÃO BEIRA-LEITO' : 'ACOMPANHAMENTO DE ENFERMAGEM'}</span><strong>{professionals[role].name} · {professionals[role].registry}</strong></div></div>
        </div>
        {!embedded && <div className="schedule-patient-header"><MedicationPatientBar patient={patient} risks={risks} /><div className="schedule-bed-selector"><span>LEITO ATIVO</span><select value={selectedBed} onChange={(event) => onSelectedBedChange(event.target.value)}>{activePatients.map((activePatient) => <option value={activePatient.bed} key={activePatient.admission}>L{activePatient.bed} · {activePatient.name}</option>)}</select></div></div>}
        {!embedded && <section className="record-section nursing-prescription-review">
          <div className="record-section-head"><div><div className="record-section-title">Prescrição médica completa</div><p>Confira a prescrição vigente e os itens agrupados antes da checagem.</p></div><span className={`prescription-version-status ${prescriptionStatus === 'Vigente' ? 'vigente' : prescriptionStatus === 'Expirada' ? 'expirada' : prescriptionStatus === 'Suspensa' ? 'suspensa' : 'legacy'}`}>{prescriptionStatus}</span></div>
          <PrescriptionItemsList items={prescriptionItems} prescriptionStatus={prescriptionStatus} />
        </section>}

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
                ) : role === 'tecnico'
                  ? <div className="administration-actions"><Button className="primary-button" onClick={() => checkAdministration(key, item.name)}><Icon name="check" size={15} /> Confirmar Checagem</Button><Button className="secondary-button" onClick={() => setNonAdministration({ key, name: item.name })}>Não Administrado / Bolar</Button></div>
                  : <span className="immutable-chip">Execução pelo técnico</span>}
              </div>
            )
          })}
          {!embedded && <SAEChecklist bed={selectedBed} role={role} />}
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
    </div>
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

function DeviceTrackingScreen({ onNotify, devices, setDevices, patient, role }: { onNotify: (message: string) => void; devices: InvasiveDevice[]; setDevices: Dispatch<SetStateAction<InvasiveDevice[]>>; patient: Patient; role: ProfessionalRole }) {
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
    <div className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Dispositivos invasivos</div><p>Rastreamento de inserção, permanência, avaliação diária e retirada · inclui SVD e PAI</p></div>
          <Button className="primary-button module-primary-action" onClick={() => setFormOpen(!formOpen)}><Icon name="admission" size={16} /> Registrar dispositivo</Button>
        </div>
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
              <label><span>Tipo de dispositivo <b>*</b></span><select value={type} onChange={(event) => setType(event.target.value)}><option>Cateter venoso periférico</option><option>Cateter venoso central</option><option value="Cateter arterial">Cateter arterial (PAI)</option><option>Dreno torácico</option><option value="Sonda vesical de demora">Sonda vesical de demora (SVD)</option></select></label>
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
    </div>
  )
}

type HandoffDraft = { diagnosis: string; summary: string; deviceNotes: string; vasoactive: string; tasks: string }
type DraftGuard = { hasUnsaved: boolean; saveDraft: () => void }

const handoffDraftKey = (admission: string) => `avicen-handoff-draft-${admission}`
const handoffSnapshot = (draft: HandoffDraft) => JSON.stringify([draft.diagnosis, draft.summary, draft.deviceNotes, draft.vasoactive, draft.tasks])
const readHandoffDraft = (admission: string): HandoffDraft | null => {
  try {
    const raw = localStorage.getItem(handoffDraftKey(admission))
    return raw ? JSON.parse(raw) as HandoffDraft : null
  } catch {
    return null
  }
}

function ShiftHandoffScreen({ role, onNotify, activePatients, devices, pendingTasks, draftGuard }: { role: ProfessionalRole; onNotify: (message: string) => void; activePatients: Patient[]; devices: InvasiveDevice[]; pendingTasks: PendingTask[]; draftGuard: RefObject<DraftGuard | null> }) {
  const handoffPatients = activePatients
  const [selectedPatientId, setSelectedPatientId] = useState(1)
  const selectedPatient = handoffPatients.find((patient) => patient.id === selectedPatientId) ?? handoffPatients[0]
  const [initialDraft] = useState(() => readHandoffDraft(selectedPatient.admission))
  const [diagnosis, setDiagnosis] = useState(initialDraft?.diagnosis ?? 'Choque séptico de foco pulmonar, em resposta parcial às medidas instituídas.')
  const [summary, setSummary] = useState(initialDraft?.summary ?? '')
  const activePatientDevices = devices.filter((device) => device.admission === selectedPatient.admission && !device.removed)
  const deviceSummary = activePatientDevices.map((device) => `${device.type} — ${device.site}`).join('; ') || 'Nenhum dispositivo invasivo ativo registrado.'
  const [deviceNotes, setDeviceNotes] = useState(initialDraft?.deviceNotes ?? '')
  const [vasoactive, setVasoactive] = useState(initialDraft?.vasoactive ?? '')
  const [tasks, setTasks] = useState(initialDraft?.tasks ?? '')
  const [saved, setSaved] = useState(Boolean(initialDraft))
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(initialDraft ? handoffSnapshot(initialDraft) : null)
  const [handoffStatus, setHandoffStatus] = useState<'draft' | 'transmitted' | 'completed'>('draft')
  const [transferHistory, setTransferHistory] = useState<string[]>([])
  const professional = professionals[role]
  const patientPendingTasks = pendingTasks.filter((task) => task.bed === selectedPatient.bed && !task.done)
  const readiness = { diagnosis: Boolean(selectedPatient.diagnosis), devices: activePatientDevices.length > 0 || deviceNotes.trim().length > 0, pending: patientPendingTasks.length === 0 || tasks.trim().length > 0, summary: summary.trim().length > 0 }
  const isReady = Object.values(readiness).every(Boolean)
  const currentDraft: HandoffDraft = { diagnosis, summary, deviceNotes, vasoactive, tasks }
  const hasUnsavedDraft = handoffStatus === 'draft' && Boolean(summary.trim() || tasks.trim() || deviceNotes.trim() || vasoactive.trim()) && savedSnapshot !== handoffSnapshot(currentDraft)

  const saveHandoff = () => {
    localStorage.setItem(handoffDraftKey(selectedPatient.admission), JSON.stringify(currentDraft))
    setSaved(true)
    setSavedSnapshot(handoffSnapshot(currentDraft))
    onNotify('Passagem de plantão salva como rascunho.')
  }

  useEffect(() => {
    draftGuard.current = { hasUnsaved: hasUnsavedDraft, saveDraft: saveHandoff }
  })

  useEffect(() => () => { draftGuard.current = null }, [draftGuard])

  const switchPatient = (patient: Patient) => {
    const stored = readHandoffDraft(patient.admission)
    setSelectedPatientId(patient.id)
    setDiagnosis(stored?.diagnosis ?? `${patient.diagnosis}. Quadro em acompanhamento intensivo.`)
    setSummary(stored?.summary ?? '')
    setTasks(stored?.tasks ?? '')
    setDeviceNotes(stored?.deviceNotes ?? '')
    setVasoactive(stored?.vasoactive ?? '')
    setHandoffStatus('draft')
    setSaved(Boolean(stored))
    setSavedSnapshot(stored ? handoffSnapshot(stored) : null)
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
    localStorage.removeItem(handoffDraftKey(selectedPatient.admission))
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
            <span className={`handoff-state ${handoffStatus === 'completed' ? 'reviewed' : handoffStatus === 'transmitted' || (saved && !hasUnsavedDraft) ? 'saved' : ''}`}><Icon name={handoffStatus === 'completed' ? 'check' : 'document'} size={14} />{handoffStatus === 'completed' ? 'Turno homologado' : handoffStatus === 'transmitted' ? 'Aguardando receptor' : saved && !hasUnsavedDraft ? 'Rascunho salvo' : 'Rascunho não salvo'}</span>
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

type AdmissionTab = 'admission' | 'transfer' | 'outcome'

function ConfirmationDialog({ title, description, danger, confirmLabel, alternateLabel, onAlternate, onCancel, onConfirm }: {
  title: string; description: string; danger?: boolean; confirmLabel: string; alternateLabel?: string; onAlternate?: () => void; onCancel: () => void; onConfirm: () => void
}) {
  return (
    <div className="confirmation-layer" role="dialog" aria-modal="true" aria-label={title}>
      <Button className="confirmation-backdrop" onClick={onCancel} ariaLabel="Cancelar ação" />
      <div className={`confirmation-dialog ${danger ? 'danger' : ''}`}>
        <div className="confirmation-icon"><Icon name={danger ? 'alert' : 'shield'} size={24} /></div>
        <div className="confirmation-title">{title}</div>
        <p>{description}</p>
        <div className="confirmation-notice"><Icon name="shield" size={15} /><span>Revise os dados; a ação será identificada pelo profissional conectado.</span></div>
        <div className={`confirmation-actions ${alternateLabel && onAlternate ? 'has-alternate' : ''}`}>
          <Button className="secondary-button" onClick={onCancel}>Cancelar</Button>
          {alternateLabel && onAlternate && <Button className="secondary-button" onClick={onAlternate}>{alternateLabel}</Button>}
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

function getAvailableDischargeBeds(unit: DischargeDestinationUnit, admission: string, orders: MedicalDischargeOrders, outcomes: Record<string, PatientOutcomeRecord>) {
  const reservedBeds = new Set([
    ...Object.entries(orders)
      .filter(([orderAdmission, order]) => orderAdmission !== admission && outcomes[orderAdmission]?.status !== 'Óbito' && order.status !== 'Aguardando organização da enfermagem' && order.destinationUnit === unit)
      .map(([, order]) => order.destinationBed),
    ...Object.values(outcomes)
      .filter((outcome) => outcome.status === 'Alta' && outcome.destinationUnit === unit)
      .map((outcome) => outcome.destinationBed),
  ])
  return dischargeDestinationBeds[unit].filter((bed) => !reservedBeds.has(bed))
}

function NursingDischargeQueue({ orders, outcomes, activePatients, onAssignDestination }: {
  orders: MedicalDischargeOrders
  outcomes: Record<string, PatientOutcomeRecord>
  activePatients: Patient[]
  onAssignDestination: (admission: string, unit: DischargeDestinationUnit, bed: string) => boolean
}) {
  const unitOptions = Object.keys(dischargeDestinationBeds) as DischargeDestinationUnit[]
  const [selections, setSelections] = useState<Record<string, { unit: DischargeDestinationUnit; bed: string }>>({})
  const pendingOrders = activePatients.flatMap((patient) => {
    const order = orders[patient.admission]
    return order?.status === 'Aguardando organização da enfermagem' ? [{ patient, order }] : []
  })

  return (
    <section className="discharge-queue">
      <div className="discharge-queue-heading">
        <div><div className="record-section-title">Altas médicas aguardando organização</div><p>Defina a unidade e reserve um leito vago para liberar o transporte. Unidades e leitos demonstrativos, sem integração com a gestão hospitalar.</p></div>
        <span>{pendingOrders.length} pendência(s)</span>
      </div>
      <div className="discharge-order-list">
        {pendingOrders.map(({ patient, order }) => {
          const selection = selections[patient.admission]
          const unit = selection?.unit ?? unitOptions[0]
          const availableBeds = getAvailableDischargeBeds(unit, patient.admission, orders, outcomes)
          const bed = selection && availableBeds.includes(selection.bed) ? selection.bed : availableBeds[0] || ''
          return (
            <article className="discharge-order-card" key={patient.admission}>
              <div className="discharge-order-patient">
                <span>LEITO UTI {patient.bed}</span>
                <strong>{patient.name}</strong>
                <small>{patient.diagnosis}</small>
              </div>
              <div className="discharge-order-detail"><span>JUSTIFICATIVA MÉDICA</span><p>{order.medicalJustification}</p></div>
              <div className="discharge-order-detail"><span>CONDIÇÕES DE TRANSFERÊNCIA</span><p>{order.transferConditions}</p><small>Solicitada por {order.orderedBy} · {formatLocalDateTime(new Date(order.orderedAt))}</small></div>
              <div className="discharge-destination-form">
                <label><span>Unidade de destino</span><select value={unit} onChange={(event) => {
                  const nextUnit = event.target.value as DischargeDestinationUnit
                  const nextBeds = getAvailableDischargeBeds(nextUnit, patient.admission, orders, outcomes)
                  setSelections((current) => ({ ...current, [patient.admission]: { unit: nextUnit, bed: nextBeds[0] || '' } }))
                }}>{unitOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label><span>Leito disponível</span><select value={bed} disabled={!availableBeds.length} onChange={(event) => setSelections((current) => ({ ...current, [patient.admission]: { unit, bed: event.target.value } }))}>
                  {availableBeds.length ? availableBeds.map((option) => <option key={option} value={option}>Leito {option}</option>) : <option value="">Nenhum leito vago</option>}
                </select></label>
                <Button className="primary-button" disabled={!bed} onClick={() => onAssignDestination(patient.admission, unit, bed)}><Icon name="check" size={15} /> Confirmar destino e solicitar transporte</Button>
              </div>
            </article>
          )
        })}
        {!pendingOrders.length && <div className="discharge-queue-empty">Não há altas médicas aguardando organização de destino.</div>}
      </div>
    </section>
  )
}

function TechnicianTransportQueue({ orders, activePatients, onCompleteTransport }: {
  orders: MedicalDischargeOrders
  activePatients: Patient[]
  onCompleteTransport: (admission: string) => boolean
}) {
  const [confirmation, setConfirmation] = useState<Patient | null>(null)
  const assignedOrders = activePatients.flatMap((patient) => {
    const order = orders[patient.admission]
    return order?.status === 'Aguardando transporte' ? [{ patient, order }] : []
  })
  const confirmTransport = () => {
    if (confirmation && onCompleteTransport(confirmation.admission)) setConfirmation(null)
  }

  return (
    <section className="discharge-queue">
      <div className="discharge-queue-heading">
        <div><div className="record-section-title">Transportes de alta atribuídos</div><p>Confira o paciente e o destino antes de registrar a conclusão do transporte.</p></div>
        <span>{assignedOrders.length} transporte(s)</span>
      </div>
      <div className="discharge-order-list">
        {assignedOrders.map(({ patient, order }) => (
          <article className="discharge-order-card transport-order-card" key={patient.admission}>
            <div className="discharge-order-patient">
              <span>LEITO UTI {patient.bed}</span>
              <strong>{patient.name}</strong>
              <small>{patient.diagnosis}</small>
            </div>
            <div className="discharge-order-detail"><span>DESTINO RESERVADO</span><p>{order.destinationUnit} · Leito {order.destinationBed}</p><small>Organizado por {order.organizedBy} · {order.organizedAt ? formatLocalDateTime(new Date(order.organizedAt)) : ''}</small></div>
            <div className="discharge-order-detail"><span>CONDIÇÕES DE TRANSFERÊNCIA</span><p>{order.transferConditions}</p></div>
            <Button className="primary-button" onClick={() => setConfirmation(patient)}><Icon name="check" size={15} /> Registrar transporte concluído</Button>
          </article>
        ))}
        {!assignedOrders.length && <div className="discharge-queue-empty">Não há transportes de alta aguardando execução.</div>}
      </div>
      {confirmation && <ConfirmationDialog
        title="Confirmar transporte do paciente?"
        description={`${confirmation.name} será removido da ocupação ativa da UTI após o transporte ao destino reservado.`}
        confirmLabel="Confirmar transporte e concluir alta"
        onCancel={() => setConfirmation(null)}
        onConfirm={confirmTransport}
      />}
    </section>
  )
}

function AdmissionScreen({ role, onNotify, onAdmitPatient, activePatients, onTransferPatient, onOutcome, getRisks, dischargeOrders, outcomes, onCreateDischargeOrder, onAssignDischargeDestination, onCompleteDischargeTransport }: {
  role: ProfessionalRole
  onNotify: (message: string) => void
  onAdmitPatient: (patient: Patient, risks: PatientClinicalRisk) => boolean
  activePatients: Patient[]
  onTransferPatient: (patient: Patient, destinationBed: string, reason: string) => boolean
  onOutcome: (admission: string, outcome: PatientOutcomeRecord) => void
  getRisks: (admission: string) => PatientClinicalRisk
  dischargeOrders: MedicalDischargeOrders
  outcomes: Record<string, PatientOutcomeRecord>
  onCreateDischargeOrder: (admission: string, medicalJustification: string, transferConditions: string) => boolean
  onAssignDischargeDestination: (admission: string, unit: DischargeDestinationUnit, bed: string) => boolean
  onCompleteDischargeTransport: (admission: string) => boolean
}) {
  const [tab, setTab] = useState<AdmissionTab>('admission')
  const [dialog, setDialog] = useState<null | 'admission' | 'transfer' | 'outcome'>(null)
  const [outcome, setOutcome] = useState<'alta' | 'obito'>('alta')
  const [selectedBed, setSelectedBed] = useState('')
  const [systemNow, setSystemNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setSystemNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const [origin, setOrigin] = useState<'internal' | 'external'>('external')
  const [nirAdmission, setNirAdmission] = useState(nirTransferRecords[0]?.patient.admission || '')
  const [receptionAdmission, setReceptionAdmission] = useState(receptionAdmissionIdentities[0]?.id || '')
  const [externalAllergies, setExternalAllergies] = useState<string[]>([])
  const [externalAllergyReactions, setExternalAllergyReactions] = useState<Record<string, string>>({})
  const [externalAllergySeverities, setExternalAllergySeverities] = useState<Record<string, string>>({})
  const [externalComorbidities, setExternalComorbidities] = useState<string[]>([])
  const [externalHomeMedications, setExternalHomeMedications] = useState<string[]>([])
  const admissionDateTime = formatLocalDateTime(systemNow)
  const [diagnosis, setDiagnosis] = useState('')
  const [cid10, setCid10] = useState('')
  const [formError, setFormError] = useState('')
  const [transferSaved, setTransferSaved] = useState(false)
  const [transferPatientId, setTransferPatientId] = useState(activePatients[0]?.admission || '')
  const [transferDestination, setTransferDestination] = useState('04')
  const [transferReason, setTransferReason] = useState('Necessidade de isolamento')
  const [outcomePatientId, setOutcomePatientId] = useState(activePatients[0]?.admission || '')
  const [dischargeJustification, setDischargeJustification] = useState('')
  const [transferConditions, setTransferConditions] = useState('')
  const [outcomeFormError, setOutcomeFormError] = useState('')
  const [deathDateTime, setDeathDateTime] = useState(() => {
    const now = new Date()
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  })
  const [deathCause, setDeathCause] = useState('')
  const [familyCommunication, setFamilyCommunication] = useState('')
  const selectedTransferPatient = activePatients.find((patient) => patient.admission === transferPatientId)
  const selectedOutcomePatient = activePatients.find((patient) => patient.admission === outcomePatientId) || activePatients[0]
  const selectedNirRecord = nirTransferRecords.find((record) => record.patient.admission === nirAdmission)
  const selectedReceptionIdentity = receptionAdmissionIdentities.find((record) => record.id === receptionAdmission)
  const selectedNirRisks = selectedNirRecord ? getRisks(selectedNirRecord.patient.admission) : undefined
  const occupiedBeds = activePatients.map((patient) => patient.bed)
  const availableTransferBeds = ['01','02','03','04','05','06','07','08','09','10'].filter((bed) =>
    (!occupiedBeds.includes(bed) || bed === selectedTransferPatient?.bed))
  const effectiveTransferDestination = availableTransferBeds.includes(transferDestination) ? transferDestination : (availableTransferBeds.find((bed) => bed !== selectedTransferPatient?.bed) || '')
  const canManageAdmission = role === 'medico' || role === 'enfermeiro' || role === 'tecnico'
  const canTransfer = role === 'medico' || role === 'enfermeiro' || role === 'tecnico'
  const canRegisterOutcome = role === 'medico'
  const professional = professionals[role]
  const admissionName = origin === 'internal' ? selectedNirRecord?.patient.name || '' : selectedReceptionIdentity?.name || ''
  const admissionBirthDate = origin === 'internal' ? selectedNirRecord?.birthDate || '' : selectedReceptionIdentity?.birthDate || ''
  const admissionSex = origin === 'internal' ? selectedNirRecord?.patient.sex || '' : selectedReceptionIdentity?.sex || ''
  const admissionCpf = origin === 'internal' ? selectedNirRecord?.patient.cpfMasked || 'Não informado' : selectedReceptionIdentity?.cpfMasked || 'Não informado'
  const admissionAttendance = origin === 'internal' ? selectedNirRecord?.patient.admission || '' : 'Gerado ao confirmar'
  const admissionBirth = parseBirthDate(admissionBirthDate)
  const admissionAge = admissionBirth ? `${getAgeAtDate(admissionBirth, systemNow)} anos` : 'Não informado'
  const admissionDiagnosis = origin === 'internal' ? selectedNirRecord?.patient.diagnosis || '' : diagnosis
  const admissionCid10 = origin === 'internal' ? selectedNirRecord?.patient.cid10 || '' : cid10
  const nirPatientAlreadyActive = Boolean(selectedNirRecord && activePatients.some((patient) => patient.admission === selectedNirRecord.patient.admission))
  const receptionPatientAlreadyActive = Boolean(selectedReceptionIdentity && activePatients.some((patient) => patient.receptionRecordId === selectedReceptionIdentity.id))

  const resetExternalClinicalDraft = () => {
    setExternalAllergies([])
    setExternalAllergyReactions({})
    setExternalAllergySeverities({})
    setExternalComorbidities([])
    setExternalHomeMedications([])
    setDiagnosis('')
    setCid10('')
    setSelectedBed('')
    setFormError('')
  }

  const updateExternalAllergies = (allergies: string[]) => {
    const selectedAllergies = new Set(allergies.filter((item) => item !== noKnownClinicalFinding))
    setExternalAllergies(allergies)
    setExternalAllergyReactions((current) => Object.fromEntries(
      Object.entries(current).filter(([substance]) => selectedAllergies.has(substance)),
    ))
    setExternalAllergySeverities((current) => Object.fromEntries(
      Object.entries(current).filter(([substance]) => selectedAllergies.has(substance)),
    ))
  }

  const confirmAction = () => {
    if (dialog === 'admission') {
      if (!canManageAdmission) {
        setDialog(null)
        onNotify('A admissão e alocação de leito não estão disponíveis para este perfil.')
        return
      }
      const birth = parseBirthDate(admissionBirthDate)
      if (!birth || !selectedBed || !admissionName || (origin === 'internal' ? !selectedNirRecord : !selectedReceptionIdentity)) {
        setDialog(null)
        onNotify('Selecione um cadastro válido da Recepção/NIR e confirme um leito disponível.')
        return
      }
      const stamp = new Date()
      const age = getAgeAtDate(birth, stamp)
      const attendanceId = origin === 'internal' && selectedNirRecord
        ? selectedNirRecord.patient.admission
        : `AI-${stamp.getFullYear()}-${String(Date.now()).slice(-5)}`
      const hasExternalAllergyReactions = externalAllergies
        .filter((item) => item !== noKnownClinicalFinding)
        .every((allergy) => Boolean(externalAllergyReactions[allergy]?.trim()))
      if (origin === 'external' && (
        !externalAllergies.length || !externalComorbidities.length || !externalHomeMedications.length || !hasExternalAllergyReactions
      )) {
        setDialog(null)
        onNotify('Complete o histórico clínico estruturado e informe a reação para cada alergia antes de confirmar.')
        return
      }
      const name = admissionName.trim()
      const initials = name.split(/\s+/).slice(0, 3).map((part) => part[0]).join('').toUpperCase()
      const externalRisk: PatientClinicalRisk = {
        allergies: externalAllergies.filter((item) => item !== noKnownClinicalFinding).map((substance) => ({
          substance,
          reaction: externalAllergyReactions[substance]?.trim() || 'Reação não informada',
          severity: externalAllergySeverities[substance] || 'Não classificada',
          recordedAt: formatLocalDateTime(stamp), recordedBy: `${professional.name} · ${professional.registry}`,
        })),
        comorbidities: externalComorbidities.filter((item) => item !== noKnownClinicalFinding).map((condition) => ({
          condition, notes: 'Informada na admissão externa', status: 'Ativa',
          recordedAt: formatLocalDateTime(stamp), recordedBy: `${professional.name} · ${professional.registry}`,
        })),
        allergiesReviewed: true,
        comorbiditiesReviewed: true,
      }
      const homeMedications = externalHomeMedications.filter((item) => item !== noKnownClinicalFinding)
      const patient: Patient = origin === 'internal' && selectedNirRecord
        ? {
          ...selectedNirRecord.patient, bed: selectedBed, birthDate: selectedNirRecord.birthDate, admittedAt: stamp.toISOString(), stay: '1º dia de UTI',
          admissionOrigin: 'NIR',
        }
        : {
          id: Date.now(), bed: selectedBed, initials, name, age, sex: admissionSex, birthDate: admissionBirthDate,
        admission: attendanceId, diagnosis: diagnosis.trim(), cid10: cid10.trim().toUpperCase(),
        receptionRecordId: selectedReceptionIdentity?.id,
        cpfMasked: admissionCpf, homeMedications,
          admissionOrigin: 'Recepção', admittedAt: stamp.toISOString(), stay: '1º dia de UTI', status: 'stable',
          vitals: [
            { label: 'FC', value: '—', unit: 'bpm' }, { label: 'PA', value: '—', unit: 'mmHg' },
            { label: 'FR', value: '—', unit: 'irpm' }, { label: 'SpO₂', value: '—', unit: '%' },
            { label: 'T°C', value: '—', unit: '°C' },
          ],
          alerts: [{ type: 'warning', icon: 'document', text: 'Sinais vitais aguardando primeira aferição' }],
        }
      const inheritedRisks = origin === 'internal' && selectedNirRisks ? selectedNirRisks : externalRisk
      if (!onAdmitPatient(patient, inheritedRisks)) {
        setDialog(null)
        return
      }
      onNotify(`Admissão de ${name} concluída e alocada no leito ${selectedBed}.`)
      resetExternalClinicalDraft()
    }
    if (dialog === 'transfer') {
      if (!canTransfer) {
        setDialog(null)
        onNotify('A transferência interna não está disponível para este perfil.')
        return
      }
      if (!selectedTransferPatient) { onNotify('Paciente de origem não encontrado.'); setDialog(null); return }
      if (!onTransferPatient(selectedTransferPatient, effectiveTransferDestination, transferReason)) {
        setDialog(null)
        return
      }
      setTransferSaved(true)
      onNotify(`Transferência de ${selectedTransferPatient.name} concluída para o leito ${effectiveTransferDestination}.`)
    }
    if (dialog === 'outcome') {
      if (!canRegisterOutcome) {
        setDialog(null)
        onNotify('O registro de alta ou óbito é exclusivo do médico.')
        return
      }
      if (!selectedOutcomePatient) { onNotify('Selecione um paciente internado.'); setDialog(null); return }
      if (outcome === 'alta') {
        if (!dischargeJustification.trim() || !transferConditions.trim()) {
          setDialog(null)
          setOutcomeFormError('Informe a justificativa médica e as condições de transferência.')
          return
        }
        if (!onCreateDischargeOrder(selectedOutcomePatient.admission, dischargeJustification.trim(), transferConditions.trim())) {
          setDialog(null)
          return
        }
        setOutcomeFormError('')
        setDischargeJustification('')
        setTransferConditions('')
        onNotify(`Decisão médica de alta registrada para ${selectedOutcomePatient.name}; aguardando organização da enfermagem.`)
      } else {
        const outcomeRecord: PatientOutcomeRecord = {
          status: 'Óbito',
          recordedAt: new Date(deathDateTime).toISOString(),
          recordedBy: `${professional.name} · ${professional.registry}`,
          cause: deathCause.trim(),
          familyCommunication: familyCommunication.trim(),
        }
        onOutcome(selectedOutcomePatient.admission, outcomeRecord)
        onNotify('Óbito registrado. Prontuário bloqueado para prescrição e aprazamento.')
      }
    }
    setDialog(null)
  }

  return (
    <main className="clinical-module-page">
      <div className="clinical-module-content">
        <div className="module-heading">
          <div><div className="page-title">Admissão e movimentação do paciente</div><p>Admissão assistencial, transferência interna e desfecho na UTI</p></div>
        </div>

        <div className="admission-tabs">
          <Button className={tab === 'admission' ? 'active' : ''} onClick={() => setTab('admission')}><Icon name="admission" size={15} /> Admissão e leito</Button>
          <Button className={tab === 'transfer' ? 'active' : ''} onClick={() => setTab('transfer')}><Icon name="handoff" size={15} /> Transferência interna</Button>
          <Button className={tab === 'outcome' ? 'active' : ''} onClick={() => setTab('outcome')}><Icon name="document" size={15} />{role === 'medico' ? 'Alta ou óbito' : role === 'enfermeiro' ? 'Organizar alta' : 'Transporte de alta'}</Button>
        </div>

        {tab === 'admission' && (
          <div className="admission-layout">
            <section className="record-section admission-form-card">
              <div className="admission-section-heading"><div><div className="record-section-title">Dados clínicos da admissão</div><p>A identificação civil vem pré-cadastrada pela Recepção/NIR; a UTI registra os dados assistenciais.</p></div><span className="completed">Alocação direta</span></div>
              {!canManageAdmission && <PermissionNotice role={role} allowed="médico, enfermeiro ou técnico de enfermagem" />}
              <div className="admission-form-grid">
                <label className="wide"><span>Procedência <b>*</b></span><select value={origin} onChange={(event) => { setOrigin(event.target.value as typeof origin); resetExternalClinicalDraft() }} disabled={!canManageAdmission}><option value="internal">Transferência interna · NIR</option><option value="external">Transferência externa · Recepção</option></select></label>
                {origin === 'internal' ? (
                  <label className="wide"><span>Paciente pré-cadastrado no NIR <b>*</b></span><select value={nirAdmission} onChange={(event) => { setNirAdmission(event.target.value); setSelectedBed(''); setFormError('') }} disabled={!canManageAdmission}>{nirTransferRecords.map((record) => <option key={record.patient.admission} value={record.patient.admission}>{record.patient.name} · {record.patient.admission}</option>)}</select></label>
                ) : (
                  <label className="wide"><span>Paciente pré-cadastrado pela Recepção <b>*</b></span><select value={receptionAdmission} onChange={(event) => { setReceptionAdmission(event.target.value); resetExternalClinicalDraft() }} disabled={!canManageAdmission}>{receptionAdmissionIdentities.map((record) => <option key={record.id} value={record.id}>{record.name} · Registro {record.id}</option>)}</select></label>
                )}
                <div className="wide admission-identity-summary">
                  <strong>{admissionName || 'Selecione um paciente cadastrado'}</strong>
                  <span>{admissionAge} · {admissionSex || 'Sexo não informado'} · Nascimento: {admissionBirthDate || 'Não informado'} · CPF: {admissionCpf}</span>
                  <small>Dados cadastrais da Recepção/NIR · Registro {origin === 'internal' ? admissionAttendance || 'não localizado' : selectedReceptionIdentity?.id || 'não localizado'} · Atendimento {origin === 'internal' ? admissionAttendance || 'não localizado' : 'gerado ao confirmar'}</small>
                </div>
                <label><span>Data e hora da admissão <b>*</b></span><input type="text" value={admissionDateTime} readOnly aria-readonly="true" disabled={!canManageAdmission} required /></label>
                <label><span>Diagnóstico de admissão <b>*</b></span><input value={admissionDiagnosis} onChange={(event) => setDiagnosis(event.target.value)} placeholder="Diagnóstico principal" disabled={!canManageAdmission || origin === 'internal'} required /></label>
                <label><span>CID-10 <b>*</b></span><input value={admissionCid10} onChange={(event) => setCid10(event.target.value.toUpperCase())} placeholder="Ex.: J96.0" disabled={!canManageAdmission || origin === 'internal'} required /></label>
                {origin === 'internal' && selectedNirRecord && <div className="wide inherited-history-panel">
                  <strong><Icon name="shield" size={15} /> Histórico institucional herdado</strong>
                  {selectedNirRecord.historySummary.map((item) => <span key={item}>{item}</span>)}
                  <span><b>Alergias:</b> {selectedNirRisks?.allergies.map((item) => item.substance).join(', ') || 'Nenhuma registrada'}</span>
                  <span><b>Comorbidades:</b> {selectedNirRisks?.comorbidities.map((item) => item.condition).join(', ') || 'Nenhuma registrada'}</span>
                  <span><b>Medicações domiciliares:</b> {selectedNirRecord.patient.homeMedications?.join('; ') || 'Nenhuma registrada'}</span>
                </div>}
                {origin === 'external' && <div className="wide external-history-fields">
                  <strong>Histórico clínico externo <span>Selecione itens padronizados; registre a reação de cada alergia ou marque “Nenhuma conhecida”.</span></strong>
                  <div className="allergy-catalog-group">
                    <ClinicalCatalogPicker label="Alergias" options={allergyCatalog} value={externalAllergies} onChange={updateExternalAllergies} disabled={!canManageAdmission} />
                    {externalAllergies.filter((item) => item !== noKnownClinicalFinding).map((allergy) => (
                      <div className="allergy-detail-fields" key={allergy}>
                        <label><span>Reação a {allergy} <b>*</b></span><textarea value={externalAllergyReactions[allergy] || ''} onChange={(event) => setExternalAllergyReactions((current) => ({ ...current, [allergy]: event.target.value }))} placeholder="Descreva a reação referida" disabled={!canManageAdmission} required /></label>
                        <label><span>Gravidade</span><select value={externalAllergySeverities[allergy] || 'Não classificada'} onChange={(event) => setExternalAllergySeverities((current) => ({ ...current, [allergy]: event.target.value }))} disabled={!canManageAdmission}><option>Não classificada</option><option>Leve</option><option>Moderada</option><option>Grave</option></select></label>
                      </div>
                    ))}
                  </div>
                  <ClinicalCatalogPicker label="Comorbidades" options={comorbidityCatalog} value={externalComorbidities} onChange={setExternalComorbidities} disabled={!canManageAdmission} />
                  <ClinicalCatalogPicker label="Medicações de uso domiciliar" options={homeMedicationCatalog} value={externalHomeMedications} onChange={setExternalHomeMedications} disabled={!canManageAdmission} />
                </div>}
              </div>
            </section>
            <aside className="record-section bed-assignment">
              <div className="record-section-title">Alocação de leito</div>
              <p>O leito selecionado é alocado diretamente após a confirmação da admissão.</p>
              <div className="bed-map">
                {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((bed) => (
                  (() => {
                    const isOccupied = occupiedBeds.includes(bed)
                    const isAvailable = !isOccupied
                    return (
                  <Button
                    className={`${isAvailable ? 'available' : 'occupied'} ${bed === selectedBed ? 'selected' : ''}`}
                    key={bed}
                    ariaLabel={`Leito ${bed}`}
                    onClick={() => canManageAdmission && isAvailable && setSelectedBed(bed)}
                  >
                    <span>LEITO</span><strong>{bed}</strong><small>{isAvailable ? 'Disponível' : 'Ocupado'}</small>
                  </Button>
                    )
                  })()
                ))}
              </div>
              <div className="bed-selected"><Icon name="bed" size={18} /><div><span>LEITO SELECIONADO</span><strong>{selectedBed ? `${selectedBed} · UTI Adulto · 2º andar` : 'Selecione um leito disponível'}</strong></div></div>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <div className="record-signature"><span>Registro será assinado por</span><strong>{professional.name}</strong><small>{professional.registry} · {formatLocalDateTime(systemNow)}</small></div>
              <Button className="primary-button admission-submit" onClick={() => {
                if (!canManageAdmission) return
                const hasIdentity = origin === 'internal'
                  ? Boolean(selectedNirRecord && !nirPatientAlreadyActive)
                  : Boolean(selectedReceptionIdentity && !receptionPatientAlreadyActive && diagnosis.trim() && cid10.trim())
                const hasAllergyReactions = externalAllergies
                  .filter((item) => item !== noKnownClinicalFinding)
                  .every((allergy) => Boolean(externalAllergyReactions[allergy]?.trim()))
                const hasExternalHistory = origin === 'internal'
                  || Boolean(externalAllergies.length && externalComorbidities.length && externalHomeMedications.length && hasAllergyReactions)
                if (!hasIdentity || !hasExternalHistory || !selectedBed || occupiedBeds.includes(selectedBed)) {
                  setFormError(origin === 'external'
                    ? receptionPatientAlreadyActive
                      ? 'Este atendimento da Recepção já está ativo na UTI.'
                      : 'Selecione um cadastro da Recepção, informe diagnóstico e CID-10, escolha alergias, comorbidades e medicações nos catálogos, registre as reações e selecione um leito livre.'
                    : nirPatientAlreadyActive
                      ? 'Este atendimento do NIR já está ativo na UTI.'
                      : 'Localize um paciente no NIR e selecione um leito livre.')
                  return
                }
                setFormError('')
                setDialog('admission')
              }}>
                <Icon name="check" size={16} /> Confirmar admissão e alocar leito
              </Button>
            </aside>
          </div>
        )}

        {tab === 'transfer' && (
          <div className="single-form-layout">
            <section className="record-section transfer-form">
              <div className="admission-section-heading"><div><div className="record-section-title">Transferência interna</div><p>O leito de destino é atualizado diretamente após a confirmação.</p></div><span>{transferSaved ? 'Transferência concluída' : 'Não iniciada'}</span></div>
              {!canTransfer && <PermissionNotice role={role} allowed="médico, enfermeiro ou técnico de enfermagem" />}
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

        {tab === 'outcome' && role === 'medico' && (
          <div className="single-form-layout">
            <section className="record-section outcome-form">
              <div className="admission-section-heading"><div><div className="record-section-title">Decisão médica de desfecho</div><p>Registre a decisão de alta ou o óbito do paciente</p></div><span className="doctor-only">Exclusivo do médico</span></div>
              <label className="outcome-patient-select"><span>Paciente internado <b>*</b></span><select value={selectedOutcomePatient?.admission || ''} onChange={(event) => setOutcomePatientId(event.target.value)} disabled={!canRegisterOutcome}>{activePatients.map((patient) => <option key={patient.admission} value={patient.admission}>Leito {patient.bed} · {patient.name}</option>)}</select></label>
              <div className="outcome-selector">
                <Button className={outcome === 'alta' ? 'active discharge' : ''} onClick={() => { setOutcome('alta'); setOutcomeFormError('') }}><Icon name="handoff" size={19} /><div><strong>Alta da UTI</strong><span>Decisão médica; a enfermagem organizará destino e transporte</span></div></Button>
                <Button className={outcome === 'obito' ? 'active death' : ''} onClick={() => { setOutcome('obito'); setOutcomeFormError('') }}><Icon name="document" size={19} /><div><strong>Óbito</strong><span>Encerramento da internação por falecimento</span></div></Button>
              </div>
              {outcome === 'alta' ? (
                <div className="admission-form-grid">
                  <label className="wide"><span>Justificativa médica da alta <b>*</b></span><textarea value={dischargeJustification} onChange={(event) => setDischargeJustification(event.target.value)} placeholder="Registre os critérios clínicos que fundamentam a alta da UTI." required /></label>
                  <label className="wide"><span>Condições e orientações para transferência <b>*</b></span><textarea value={transferConditions} onChange={(event) => setTransferConditions(event.target.value)} placeholder="Informe cuidados, suporte e orientações que a equipe deve manter durante a transferência." required /></label>
                  {outcomeFormError && <p className="form-error wide" role="alert">{outcomeFormError}</p>}
                </div>
              ) : (
                <div className="admission-form-grid death-fields">
                  <label><span>Data e hora do óbito <b>*</b></span><input type="datetime-local" value={deathDateTime} onChange={(event) => setDeathDateTime(event.target.value)} disabled={!canRegisterOutcome} required /></label>
                  <label><span>Médico constatante</span><input defaultValue="Dra. Larissa Menezes · CRM-SP 145829" readOnly /></label>
                  <label className="wide"><span>Causa básica registrada <b>*</b></span><textarea value={deathCause} onChange={(event) => setDeathCause(event.target.value)} placeholder="Descreva a causa registrada pelo profissional responsável." disabled={!canRegisterOutcome} required /></label>
                  <label className="wide"><span>Comunicação à família <b>*</b></span><input value={familyCommunication} onChange={(event) => setFamilyCommunication(event.target.value)} placeholder="Informe a comunicação realizada ou “Pendente”." disabled={!canRegisterOutcome} required /></label>
                </div>
              )}
              {outcome === 'obito' && (!deathCause.trim() || !familyCommunication.trim() || !Number.isFinite(new Date(deathDateTime).getTime())) && <p className="form-error" role="alert">Data e hora, causa do óbito e situação da comunicação familiar são obrigatórias.</p>}
              <div className="form-confirm-footer"><div className="record-signature"><span>Assinatura médica</span><strong>{professional.name} · {professional.registry}</strong></div><Button className={outcome === 'obito' ? 'danger-button' : 'primary-button'} onClick={() => {
                if (outcome === 'alta' && (!dischargeJustification.trim() || !transferConditions.trim())) {
                  setOutcomeFormError('Informe a justificativa médica e as condições de transferência.')
                  return
                }
                if (outcome === 'obito' && (!deathCause.trim() || !familyCommunication.trim() || !Number.isFinite(new Date(deathDateTime).getTime()))) {
                  onNotify('Preencha data e hora, causa do óbito e situação da comunicação familiar.')
                  return
                }
                setDialog('outcome')
              }}><Icon name={outcome === 'obito' ? 'alert' : 'check'} size={16} />{outcome === 'obito' ? 'Confirmar registro de óbito' : 'Registrar decisão médica de alta'}</Button></div>
            </section>
          </div>
        )}
        {tab === 'outcome' && role === 'enfermeiro' && <NursingDischargeQueue orders={dischargeOrders} outcomes={outcomes} activePatients={activePatients} onAssignDestination={onAssignDischargeDestination} />}
        {tab === 'outcome' && role === 'tecnico' && <TechnicianTransportQueue orders={dischargeOrders} activePatients={activePatients} onCompleteTransport={onCompleteDischargeTransport} />}

      </div>
      {dialog && <ConfirmationDialog
        title={dialog === 'admission' ? 'Confirmar admissão e alocação?' : dialog === 'transfer' ? 'Confirmar transferência interna?' : outcome === 'alta' ? 'Registrar decisão médica de alta?' : 'Confirmar registro de óbito?'}
        description={dialog === 'admission' ? `${admissionName || 'O paciente'} será admitido diretamente no leito ${selectedBed}.`
          : dialog === 'transfer' ? `O paciente ${selectedTransferPatient?.name || ''} será transferido diretamente do leito ${selectedTransferPatient?.bed || ''} para o leito ${effectiveTransferDestination}.`
          : outcome === 'alta' ? `A decisão médica de alta para ${selectedOutcomePatient?.name || 'paciente'} será encaminhada à enfermagem. O paciente permanece na UTI até a organização do destino e a conclusão do transporte.`
          : 'Este é um registro clínico e legal definitivo. Revise data, hora, causa e comunicação familiar.'}
        danger={dialog === 'outcome' && outcome === 'obito'}
        confirmLabel={dialog === 'outcome' ? outcome === 'obito' ? 'Sim, registrar óbito' : 'Registrar alta médica' : 'Confirmar e assinar'}
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
    admission: 'AI-2025-04741', diagnosis: 'Insuficiência cardíaca descompensada', cid10: 'I50.9', stay: '4º dia de UTI', status: 'stable',
    vitals: [
      { label: 'FC', value: '88', unit: 'bpm' }, { label: 'PA', value: '116/70', unit: 'mmHg' },
      { label: 'FR', value: '20', unit: 'irpm' }, { label: 'SpO₂', value: '96', unit: '%' }, { label: 'T°C', value: '36,6', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'check', text: 'Sem pendências críticas' }],
  },
  {
    id: 8, bed: '09', initials: 'LCB', name: 'Lúcia C. Barros', age: 72, sex: 'Feminino',
    admission: 'AI-2025-04722', diagnosis: 'Sepse de foco urinário', cid10: 'A41.9', stay: '5º dia de UTI', status: 'warning',
    vitals: [
      { label: 'FC', value: '98', unit: 'bpm' }, { label: 'PA', value: '104/62', unit: 'mmHg' },
      { label: 'FR', value: '22', unit: 'irpm' }, { label: 'SpO₂', value: '95', unit: '%' }, { label: 'T°C', value: '37,4', unit: '°C' },
    ],
    alerts: [{ type: 'warning', icon: 'document', text: 'Reavaliação médica às 11:00' }],
  },
  {
    id: 9, bed: '—', initials: 'MFA', name: 'Márcio F. Almeida', age: 47, sex: 'Masculino',
    admission: 'AI-2025-04398', diagnosis: 'Traumatismo cranioencefálico', cid10: 'S06.9', stay: 'Alta após 7 dias de UTI', status: 'stable',
    vitals: [
      { label: 'FC', value: '78', unit: 'bpm' }, { label: 'PA', value: '124/76', unit: 'mmHg' },
      { label: 'FR', value: '17', unit: 'irpm' }, { label: 'SpO₂', value: '98', unit: '%' }, { label: 'T°C', value: '36,4', unit: '°C' },
    ],
    alerts: [{ type: 'neutral', icon: 'check', text: 'Alta registrada em 17/06/2025' }],
  },
  {
    id: 10, bed: '—', initials: 'NRS', name: 'Neusa R. Silveira', age: 81, sex: 'Feminino',
    admission: 'AI-2025-04176', diagnosis: 'Choque cardiogênico refratário', cid10: 'R57.0', stay: 'Óbito no 3º dia de UTI', status: 'critical',
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

function PatientsScreen({ onOpenPatient, onAddPatient, admittedPatients = [], outcomes = {}, bedMoves = {}, getRisks }: {
  onOpenPatient: (patient: Patient, outcome?: PatientOutcomeRecord, isDeceased?: boolean) => void
  onAddPatient: () => void
  admittedPatients?: Patient[]
  outcomes?: Record<string, PatientOutcomeRecord>
  bedMoves?: Record<string, string>
  getRisks: (admission: string) => PatientClinicalRisk
}) {
  const [search, setSearch] = useState('')
  const [bed, setBed] = useState('Todos')
  const [admissionDate, setAdmissionDate] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const updateFilter = (action: () => void) => {
    action()
    setPage(1)
  }

  const allPatientRegistry: PatientRegistryEntry[] = [...patientRegistry, ...admittedPatients.map((patient) => ({
    patient,
    cpf: patient.cpfMasked || 'Não informado',
    admissionDate: patient.admittedAt?.slice(0, 10) || '',
    admissionDateLabel: '',
    hospitalizationStatus: 'Internado' as const,
  }))].map((entry): PatientRegistryEntry => {
    const hospitalizationStatus: PatientRegistryEntry['hospitalizationStatus'] =
      outcomes[entry.patient.admission]?.status ?? entry.hospitalizationStatus
    return {
      ...entry,
      patient: { ...entry.patient, bed: bedMoves[entry.patient.admission] || entry.patient.bed },
      hospitalizationStatus,
    }
  })
  const filteredPatients = allPatientRegistry.filter((entry) => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
    const matchesSearch = !normalizedSearch || `${entry.patient.name} ${entry.cpf} ${entry.patient.admission} ${entry.patient.diagnosis} ${entry.patient.cid10}`
      .toLocaleLowerCase('pt-BR').includes(normalizedSearch)
    const isHospitalized = entry.hospitalizationStatus === 'Internado'
    const matchesBed = bed === 'Todos' || entry.patient.bed === bed
    const matchesDate = !admissionDate || entry.admissionDate === admissionDate
    return isHospitalized && matchesSearch && matchesBed && matchesDate
  }).sort((left, right) => comparePatientsByBed(left.patient, right.patient))

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
            <label className="patients-filter-field"><span>Leito da UTI</span><select value={bed} onChange={(event) => updateFilter(() => setBed(event.target.value))}><option value="Todos">Todos os leitos</option>{['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="patients-filter-field date"><span>Data de admissão</span><input type="date" value={admissionDate} onChange={(event) => updateFilter(() => setAdmissionDate(event.target.value))} /></label>
            {(search || bed !== 'Todos' || admissionDate) && <Button className="patients-clear-filters" onClick={() => { setSearch(''); setBed('Todos'); setAdmissionDate(''); setPage(1) }}>Limpar filtros</Button>}
          </div>

          <div className="patient-grid patients-card-grid">
            {visibleRows.map((entry) => (
              <PatientCard
                key={entry.patient.admission}
                patient={entry.patient}
                hospitalizationStatus={entry.hospitalizationStatus}
                risks={getRisks(entry.patient.admission)}
                onOpen={() => onOpenPatient(entry.patient, outcomes[entry.patient.admission], entry.hospitalizationStatus === 'Óbito')}
              />
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
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!registration.trim() || !password.trim()) {
      setError('Informe seu usuário e sua senha para continuar.')
      return
    }
    const account = demoAccounts.find((item) => item.username === registration.trim().toLowerCase() && item.password === password)
    if (!account) {
      setError('Usuário ou senha incorretos.')
      return
    }
    setError('')
    onLogin(account.role)
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
          <label htmlFor="login-registration">Usuário</label>
          <input id="login-registration" autoComplete="username" value={registration} onChange={(event) => setRegistration(event.target.value)} placeholder="Seu usuário de acesso" />
          <label htmlFor="login-password">Senha</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" />
          {error && <div className="login-error" role="alert">{error}</div>}
          <button className="login-submit" type="submit">Entrar no sistema <Icon name="chevron" size={16}/></button>
          <div className="login-demo-note"><Icon name="shield" size={15}/><span>Protótipo acadêmico: autenticação demonstrativa. Cada usuário entra com seu perfil fixo.</span></div>
        </form>
        <div className="login-unit-footer">HOSPITAL SANTA AURORA <span>·</span> UTI ADULTO · 2º ANDAR</div>
      </section>
    </main>
  )
}

export default function App() {
  const [now, setNow] = useState(new Date())
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('avicen-theme')
    return savedTheme === 'light' ? 'light' : 'dark'
  })
  const [fontScale, setFontScale] = useState(() => {
    const savedScale = Number(localStorage.getItem('avicen-font-scale'))
    return [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8].includes(savedScale) ? savedScale : DEFAULT_FONT_SCALE
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeNav, setActiveNav] = useState('Painel da UTI')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedPatientOutcome, setSelectedPatientOutcome] = useState<PatientOutcomeRecord | undefined>(undefined)
  const [selectedPatientDeceased, setSelectedPatientDeceased] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [role, setRole] = useState<ProfessionalRole>('medico')
  const [invasiveDevices, setInvasiveDevices] = useState<InvasiveDevice[]>(() => { try { return JSON.parse(localStorage.getItem('avicen-invasive-devices') || 'null') as InvasiveDevice[] || initialDevices } catch { return initialDevices } })
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>(() => { try { return JSON.parse(localStorage.getItem('avicen-pending-tasks') || 'null') as PendingTask[] || initialPendingTasks } catch { return initialPendingTasks } })
  const [safetyHuddle, setSafetyHuddle] = useState<SafetyHuddleData>(() => {
    try {
      const saved = localStorage.getItem('avicen-safety-huddle')
      if (!saved) return createInitialSafetyHuddle()
      const parsed = JSON.parse(saved) as Partial<SafetyHuddleData>
      const initial = createInitialSafetyHuddle()
      return {
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : initial.updatedAt,
        reviewedPatients: Array.isArray(parsed.reviewedPatients) ? parsed.reviewedPatients : initial.reviewedPatients,
        exams: Array.isArray(parsed.exams) ? parsed.exams : initial.exams,
        assets: Array.isArray(parsed.assets) ? parsed.assets : initial.assets,
      }
    } catch {
      return createInitialSafetyHuddle()
    }
  })
  const [admittedPatients, setAdmittedPatients] = useState<Patient[]>(() => { try { return JSON.parse(localStorage.getItem('avicen-admitted-patients') || '[]') as Patient[] } catch { return [] } })
  const [patientRisks, setPatientRisks] = useState<PatientRisksByAdmission>(() => { try { return JSON.parse(localStorage.getItem('avicen-patient-risks') || '{}') as PatientRisksByAdmission } catch { return {} } })
  const [patientOutcomes, setPatientOutcomes] = useState<Record<string, PatientOutcomeRecord>>(loadPatientOutcomes)
  const [medicalDischargeOrders, setMedicalDischargeOrders] = useState<MedicalDischargeOrders>(loadMedicalDischargeOrders)
  const [patientBedMoves, setPatientBedMoves] = useState<Record<string, string>>(() => { try { return JSON.parse(localStorage.getItem('avicen-patient-bed-moves') || '{}') as Record<string, string> } catch { return {} } })
  const [pendingOpen, setPendingOpen] = useState(false)
  const draftGuardRef = useRef<DraftGuard | null>(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [safetyHuddleOpen, setSafetyHuddleOpen] = useState(false)
  const [selectedMedicationBed, setSelectedMedicationBed] = useState('01')
  const [selectedPrescriptionAdmission, setSelectedPrescriptionAdmission] = useState<string | null>(null)
  const [medicationsByBed, setMedicationsByBed] = useState<Record<string, MedicationOrder[]>>(() => { try { const saved = localStorage.getItem('avicen-medications-by-bed'); return saved ? JSON.parse(saved) as Record<string, MedicationOrder[]> : { '01': prescribedMedications } } catch { return { '01': prescribedMedications } } })
  const [prescriptionVersionsByAdmission, setPrescriptionVersionsByAdmission] = useState<PrescriptionVersionsByAdmission>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('avicen-prescription-versions-by-admission') || '{}') as PrescriptionVersionsByAdmission
      return addDemonstrationPrescriptions(numberPrescriptionVersions(saved), medicationsByBed, patientBedMoves, patientOutcomes, new Date())
    }
    catch (error) { console.error('Não foi possível carregar as versões de prescrição.', error); return {} }
  })
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
  useEffect(() => { localStorage.setItem('avicen-safety-huddle', JSON.stringify(safetyHuddle)) }, [safetyHuddle])
  useEffect(() => {
    if (Object.values(prescriptionVersionsByAdmission).some((versions) => versions.length)) {
      localStorage.setItem('avicen-prescription-versions-by-admission', JSON.stringify(prescriptionVersionsByAdmission))
    }
  }, [prescriptionVersionsByAdmission])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('avicen-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale))
    localStorage.setItem('avicen-font-scale', String(fontScale))
  }, [fontScale])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeNav, isAuthenticated, selectedPatient])

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
  const dashboardPatients = useMemo(() => allKnownPatients.filter((patient) => !patientOutcomes[patient.admission]).sort(comparePatientsByBed), [allKnownPatients, patientOutcomes])
  const activePatients = dashboardPatients
  const availableBedCount = Math.max(0, 10 - activePatients.length)
  const selectedMedicationPatient = activePatients.find((patient) => patient.bed === selectedMedicationBed)
  const selectedPrescriptionPatient = activePatients.find((patient) => patient.admission === selectedPrescriptionAdmission)
  const selectedPatientVersions = selectedMedicationPatient ? (prescriptionVersionsByAdmission[selectedMedicationPatient.admission] ?? []).filter((version) => !version.demonstrationHistory) : []
  const selectedActivePrescription = selectedPatientVersions.filter((version) => version.status === 'Vigente').sort((a, b) => b.version - a.version)[0]
  const selectedLatestPrescription = selectedPatientVersions.slice().sort((left, right) => {
    const leftTime = left.createdAt ? Date.parse(left.createdAt) : 0
    const rightTime = right.createdAt ? Date.parse(right.createdAt) : 0
    return leftTime - rightTime
  }).slice(-1)[0]
  const selectedLegacyMedications = medicationsByBed[selectedMedicationBed] ?? (selectedMedicationBed === '01' ? prescribedMedications : [])
  const selectedPrescriptionItems = (selectedActivePrescription ?? selectedLatestPrescription)?.items ?? selectedLegacyMedications.map(toPrescriptionItem)
  const selectedPrescriptionExpired = Boolean(selectedActivePrescription && !(Date.parse(selectedActivePrescription.expiresAt) > now.getTime()))
  const selectedPrescriptionStatus = selectedActivePrescription
    ? selectedPrescriptionExpired ? 'Expirada' : 'Vigente'
    : selectedLatestPrescription ? 'Suspensa' : selectedPrescriptionItems.length ? 'Legado · sem versão' : 'Sem prescrição homologada'
  const medications = selectedPatientVersions.length
    ? selectedActivePrescription && Date.parse(selectedActivePrescription.expiresAt) > now.getTime()
      ? toMedicationOrders(selectedActivePrescription.items)
      : []
    : selectedLegacyMedications
  const pendingSchedulingPatients = activePatients.filter((patient) => {
    const versions = (prescriptionVersionsByAdmission[patient.admission] ?? []).filter((version) => !version.demonstrationHistory)
    const activeVersion = versions.filter((version) => version.status === 'Vigente').sort((a, b) => b.version - a.version)[0]
    const patientMedications = versions.length
      ? activeVersion && Date.parse(activeVersion.expiresAt) > now.getTime()
        ? toMedicationOrders(activeVersion.items)
        : []
      : medicationsByBed[patient.bed] ?? (patient.bed === '01' ? prescribedMedications : [])
    return !(approvedByBed[patient.bed] ?? false)
      && patientMedications.some((medication) => medication.frequency !== 'Contínua' && medication.status !== 'Suspensa')
  })
  const selectedBedHasDeceasedRecord = !selectedMedicationPatient && allKnownPatients.some((patient) =>
    (patientBedMoves[patient.admission] || patient.bed) === selectedMedicationBed && patientOutcomes[patient.admission]?.status === 'Óbito')
  admittedBedList = activePatients.map((patient) => patient.bed)
  const getPatientRisks = (admission: string): PatientClinicalRisk => patientRisks[admission]
    || nirTransferRecords.find((record) => record.patient.admission === admission)?.risks
    || (admission === patients[0].admission ? { allergies: [{ substance: 'Dipirona', reaction: 'anafilaxia', severity: 'Grave', recordedAt: '18/06/2025 · 14:46', recordedBy: 'Enf. Juliana Pires · COREN-SP 412885' }], comorbidities: [{ condition: 'Hipertensão arterial', notes: '', status: 'Ativa', recordedAt: '18/06/2025', recordedBy: 'Equipe assistencial' }, { condition: 'Diabetes mellitus tipo 2', notes: '', status: 'Ativa', recordedAt: '18/06/2025', recordedBy: 'Equipe assistencial' }, { condition: 'DRC estágio 3', notes: '', status: 'Ativa', recordedAt: '18/06/2025', recordedBy: 'Equipe assistencial' }] } : admission === patients[3].admission ? { allergies: [{ substance: 'Penicilina', reaction: 'reação alérgica documentada', severity: 'Moderada', recordedAt: '19/06/2025', recordedBy: 'Equipe assistencial' }], comorbidities: [] } : { allergies: [], comorbidities: [] })
  const saveMedicationOrder = (medication: MedicationOrder) => {
    if (!activePatients.some((patient) => patient.bed === selectedMedicationBed)) {
      setNotice('Prescrição bloqueada: não há paciente ativo neste leito.')
      return
    }
    setMedicationsByBed((current) => {
      const updated = {
        ...current,
        [selectedMedicationBed]: [
          ...(current[selectedMedicationBed] ?? (selectedMedicationBed === '01' ? prescribedMedications : [])).filter((item) => item.id !== medication.id),
          medication,
        ],
      }
      localStorage.setItem('avicen-medications-by-bed', JSON.stringify(updated))
      return updated
    })
    setSchedulesByBed((current) => {
      const updated = {
        ...current,
        [selectedMedicationBed]: { ...(current[selectedMedicationBed] ?? {}), [medication.id]: [] },
      }
      localStorage.setItem('avicen-medication-schedules', JSON.stringify(updated))
      return updated
    })
    setApprovedByBed((current) => {
      const updated = { ...current, [selectedMedicationBed]: false }
      localStorage.setItem('avicen-approved-schedules', JSON.stringify(updated))
      return updated
    })
  }
  const closePatientPrescription = (admission: string, items: PrescriptionItem[], previousItems: PrescriptionItem[]) => {
    const patient = activePatients.find((activePatient) => activePatient.admission === admission)
    if (!patient) {
      setNotice('Não foi possível fechar a prescrição: o paciente não possui internação ativa.')
      return
    }
    const createdAt = new Date()
    const validity = getPrescriptionWindow(createdAt)
    const currentVersions = prescriptionVersionsByAdmission[admission] ?? []
    const previousCurrentVersion = currentVersions.filter((version) => version.status === 'Vigente' && !version.demonstrationHistory).sort((a, b) => b.version - a.version)[0]
    const suspendedVersions = currentVersions.map((version) => version.status === 'Vigente' && !version.demonstrationHistory
      && (!version.demonstration || Date.parse(version.expiresAt) > createdAt.getTime())
      ? { ...version, status: 'Suspensa' as const, items: version.items.map((item) => item.status === 'Ativa' ? { ...item, status: 'Suspensa' as const } : item) }
      : version)
    const nextVersion: PrescriptionVersion = {
      id: `${admission}-${createdAt.getTime()}`,
      prescriptionNumber: Object.values(prescriptionVersionsByAdmission).flat().reduce((max, version) => Math.max(max, version.prescriptionNumber ?? 0), 0) + 1,
      version: Math.max(0, ...currentVersions.map((version) => version.version)) + 1,
      createdAt: createdAt.toISOString(),
      validFrom: validity.validFrom,
      expiresAt: validity.expiresAt,
      status: 'Vigente',
      signedBy: `${professionals.medico.name} · ${professionals.medico.registry}`,
      items: items.map((item) => ({ ...item })),
    }
    const updatedVersions = { ...prescriptionVersionsByAdmission, [admission]: [...suspendedVersions, nextVersion] }
    setPrescriptionVersionsByAdmission(updatedVersions)
    localStorage.setItem('avicen-prescription-versions-by-admission', JSON.stringify(updatedVersions))
    setSchedulesByBed((current) => {
      const updated = { ...current, [patient.bed]: {} }
      localStorage.setItem('avicen-medication-schedules', JSON.stringify(updated))
      return updated
    })
    setApprovedByBed((current) => {
      const updated = { ...current, [patient.bed]: false }
      localStorage.setItem('avicen-approved-schedules', JSON.stringify(updated))
      return updated
    })
    const changed = Boolean(previousCurrentVersion || previousItems.length)
    setNotice(changed
      ? `Prescrição v${nextVersion.version} assinada; itens anteriores suspensos e novo aprazamento solicitado.`
      : `Prescrição v${nextVersion.version} assinada por ${professionals.medico.name}; vigência de 24 horas iniciada.`)
  }
  const movePatientBed = (admission: string, destination: string, reason: string) => setPatientBedMoves((current) => { const updated = { ...current, [admission]: destination }; localStorage.setItem('avicen-patient-bed-moves', JSON.stringify(updated)); return updated })
  const admitPatient = (patient: Patient, risks: PatientClinicalRisk) => {
    if (activePatients.some((active) => active.admission === patient.admission || active.bed === patient.bed)) {
      setNotice('O atendimento já está ativo ou o leito foi ocupado. Revise a seleção antes de confirmar.')
      return false
    }
    setAdmittedPatients((current) => {
      if (current.some((item) => item.admission === patient.admission)) return current
      const updated = [...current, patient]
      localStorage.setItem('avicen-admitted-patients', JSON.stringify(updated))
      return updated
    })
    setPatientRisks((current) => {
      if (current[patient.admission]) return current
      const updated = { ...current, [patient.admission]: risks }
      localStorage.setItem('avicen-patient-risks', JSON.stringify(updated))
      return updated
    })
    return true
  }
  const transferPatient = (patient: Patient, destinationBed: string, _reason: string) => {
    if (!activePatients.some((active) => active.admission === patient.admission && active.bed === patient.bed)
      || !['01','02','03','04','05','06','07','08','09','10'].includes(destinationBed)
      || activePatients.some((active) => active.admission !== patient.admission && active.bed === destinationBed)) {
      setNotice('A transferência não pode ser concluída: revise a origem e a disponibilidade do leito destino.')
      return false
    }
    movePatientBed(patient.admission, destinationBed, _reason)
    return true
  }
  const closePatientStay = (admission: string, outcome: PatientOutcomeRecord) => setPatientOutcomes((current) => {
    const updated = { ...current, [admission]: outcome }
    localStorage.setItem('avicen-patient-outcomes', JSON.stringify(updated))
    return updated
  })
  const createMedicalDischargeOrder = (admission: string, medicalJustification: string, transferConditions: string) => {
    if (role !== 'medico') {
      setNotice('Somente o médico pode registrar a decisão clínica de alta.')
      return false
    }
    if (!activePatients.some((patient) => patient.admission === admission)) {
      setNotice('Não foi possível registrar a alta: o paciente não está internado na UTI.')
      return false
    }
    const existing = medicalDischargeOrders[admission]
    if (existing && existing.status !== 'Transporte concluído') {
      setNotice('Já existe uma decisão de alta aguardando organização ou transporte para este paciente.')
      return false
    }
    const order: MedicalDischargeOrder = {
      medicalJustification,
      transferConditions,
      orderedAt: new Date().toISOString(),
      orderedBy: `${professionals.medico.name} · ${professionals.medico.registry}`,
      status: 'Aguardando organização da enfermagem',
    }
    setMedicalDischargeOrders((current) => {
      const updated = { ...current, [admission]: order }
      localStorage.setItem('avicen-medical-discharge-orders', JSON.stringify(updated))
      return updated
    })
    return true
  }
  const assignDischargeDestination = (admission: string, unit: DischargeDestinationUnit, bed: string) => {
    if (role !== 'enfermeiro') {
      setNotice('Somente a enfermagem pode organizar o destino da alta.')
      return false
    }
    const order = medicalDischargeOrders[admission]
    if (!activePatients.some((patient) => patient.admission === admission) || !order || order.status !== 'Aguardando organização da enfermagem') {
      setNotice('Esta decisão de alta não está mais aguardando organização.')
      return false
    }
    if (!getAvailableDischargeBeds(unit, admission, medicalDischargeOrders, patientOutcomes).includes(bed)) {
      setNotice('O leito selecionado não está mais disponível. Atualize a seleção.')
      return false
    }
    const updatedOrder: MedicalDischargeOrder = {
      ...order,
      status: 'Aguardando transporte',
      destinationUnit: unit,
      destinationBed: bed,
      organizedAt: new Date().toISOString(),
      organizedBy: `${professionals.enfermeiro.name} · ${professionals.enfermeiro.registry}`,
    }
    setMedicalDischargeOrders((current) => {
      const updated = { ...current, [admission]: updatedOrder }
      localStorage.setItem('avicen-medical-discharge-orders', JSON.stringify(updated))
      return updated
    })
    setNotice(`Destino ${unit}, leito ${bed}, reservado. Transporte solicitado à equipe técnica.`)
    return true
  }
  const completeDischargeTransport = (admission: string) => {
    if (role !== 'tecnico') {
      setNotice('Somente o técnico de enfermagem pode registrar o transporte do paciente.')
      return false
    }
    const patient = activePatients.find((activePatient) => activePatient.admission === admission)
    const order = medicalDischargeOrders[admission]
    if (!patient || !order || order.status !== 'Aguardando transporte' || !order.destinationUnit || !order.destinationBed) {
      setNotice('O transporte não pode ser concluído: verifique a decisão médica e o destino reservado.')
      return false
    }
    const transportedAt = new Date().toISOString()
    const transportedBy = `${professionals.tecnico.name} · ${professionals.tecnico.registry}`
    closePatientStay(admission, {
      status: 'Alta',
      recordedAt: transportedAt,
      recordedBy: transportedBy,
      medicalDecisionAt: order.orderedAt,
      medicalDecisionBy: order.orderedBy,
      destinationUnit: order.destinationUnit,
      destinationBed: order.destinationBed,
      transportedAt,
      transportedBy,
    })
    const completedOrder: MedicalDischargeOrder = { ...order, status: 'Transporte concluído', transportedAt, transportedBy }
    setMedicalDischargeOrders((current) => {
      const updated = { ...current, [admission]: completedOrder }
      localStorage.setItem('avicen-medical-discharge-orders', JSON.stringify(updated))
      return updated
    })
    setNotice(`Transporte de ${patient.name} concluído para ${order.destinationUnit}, leito ${order.destinationBed}.`)
    return true
  }
  const adjustFontScale = (delta: number) => {
    setFontScale((current) => Math.min(1.8, Math.max(1.2, Number((current + delta).toFixed(1)))))
  }

  const handleNavigation = (label: string) => {
    const availableItems = role === 'medico' ? physicianNavItems : role === 'enfermeiro' ? nurseNavItems : technicianNavItems
    if (!availableItems.some((item) => item.label === label)) {
      setNotice(`O módulo ${label} não está disponível para o perfil ${professionals[role].title.toLowerCase()}.`)
      return
    }
    setPendingOpen(false)
    setSidebarOpen(false)
    if (['Painel da UTI', 'Pacientes', 'Prescrições', 'Aprazamento de enfermagem', 'Admissão', 'Passagem de plantão'].includes(label)) {
      setActiveNav(label)
      setSelectedPatient(null)
      setSelectedPatientOutcome(undefined)
      setSelectedPatientDeceased(false)
      if (label === 'Prescrições') setSelectedPrescriptionAdmission(null)
      if (['Prescrições', 'Aprazamento de enfermagem'].includes(label)) {
        const nextPatient = activePatients.find((patient) => patient.bed === selectedMedicationBed) || activePatients[0]
        if (nextPatient) setSelectedMedicationBed(nextPatient.bed)
      }
    }
    else setNotice(`${label}: módulo disponível na próxima etapa do protótipo.`)
  }

  const getNavigationRestriction = (label: string) => {
    if (label === 'Prescrições' && role === 'enfermeiro') return 'Acesso somente para consulta. Edição exclusiva do perfil médico.'
    if (label === 'Prescrições' && role === 'tecnico') return 'Acesso restrito ao perfil médico.'
    if (label === 'Aprazamento de enfermagem' && role !== 'enfermeiro') return 'Acesso restrito ao perfil enfermeiro.'
    return undefined
  }

  const logout = () => {
    setLogoutDialogOpen(false)
    setNotice(null)
    setSidebarOpen(false)
    setSelectedPatient(null)
    setSelectedPatientOutcome(undefined)
    setSelectedPatientDeceased(false)
    setSelectedPrescriptionAdmission(null)
    setIsAuthenticated(false)
  }

  const requestLogout = () => {
    if (draftGuardRef.current?.hasUnsaved) setLogoutDialogOpen(true)
    else logout()
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={(loggedRole) => { setRole(loggedRole); setIsAuthenticated(true); setActiveNav('Painel da UTI') }} />
  }

  const visibleNavItems = role === 'medico' ? physicianNavItems : role === 'enfermeiro' ? nurseNavItems : technicianNavItems
  const primaryNavItems = visibleNavItems.slice(0, -1)
  const secondaryNavItems = visibleNavItems.slice(-1)

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Fechar navegação" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
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
          {primaryNavItems.map((item) => (
            <Button
              key={item.label}
              className={`nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => handleNavigation(item.label)}
              title={getNavigationRestriction(item.label)}
            >
              <Icon name={item.icon} size={18} /><span>{item.label}</span>
            </Button>
          ))}
          {secondaryNavItems.length > 0 && <div className="nav-section-label secondary">GESTÃO DO TURNO</div>}
          {secondaryNavItems.map((item) => (
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
            <strong className="date-full">{formatDate(now)}</strong>
            <strong className="date-short">{now.toLocaleDateString('pt-BR', { weekday: 'short' })}, {now.toLocaleDateString('pt-BR')}</strong>
            <span>{now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="icon-button navigation-toggle"
              aria-label={sidebarOpen ? 'Fechar navegação' : 'Abrir navegação'}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <Icon name="menu" size={20} />
            </button>
            <Button className="icon-button notification-button" ariaLabel="Notificações" onClick={() => setPendingOpen(true)}>
              <Icon name="bell" size={20} />{pendingTasks.filter((task) => !task.done && task.assignedRole === role && task.assignedProfessional === professionals[role].name).length > 0 && <span className="notification-dot">{pendingTasks.filter((task) => !task.done && task.assignedRole === role && task.assignedProfessional === professionals[role].name).length}</span>}
            </Button>
            <button
              type="button"
              className="icon-button theme-toggle"
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
            </button>
            <div className="font-scale-controls" role="group" aria-label="Ajustar tamanho do texto">
              <button type="button" className="font-scale-button" aria-label="Diminuir tamanho do texto" title="Diminuir tamanho do texto" disabled={fontScale <= 1.2} onClick={() => adjustFontScale(-0.1)}>A-</button>
              <span aria-live="polite" aria-atomic="true">{Math.round(fontScale * 100)}%</span>
              <button type="button" className="font-scale-button" aria-label="Aumentar tamanho do texto" title="Aumentar tamanho do texto" disabled={fontScale >= 1.8} onClick={() => adjustFontScale(0.1)}>A+</button>
              <button type="button" className="font-scale-reset" aria-label="Restaurar tamanho padrão do texto" title="Restaurar tamanho padrão do texto" disabled={fontScale === DEFAULT_FONT_SCALE} onClick={() => setFontScale(DEFAULT_FONT_SCALE)}>Reset</button>
            </div>
            <div className="profile-divider" />
            <div className="profile-switch">
              <div className="profile-avatar">{professionals[role].initials}</div>
              <div><strong>{professionals[role].name}</strong><span>{professionals[role].title} · {professionals[role].registry}</span></div>
            </div>
            <button type="button" className="secondary-button logout-button" onClick={requestLogout} title="Encerrar sessão e trocar de profissional">
              <Icon name="logout" size={16} /><span>Sair</span>
            </button>
          </div>
        </header>

        {selectedPatient ? (
          <PatientRecord
            key={selectedPatient.admission}
            patient={selectedPatient}
            role={role}
            onRoleChange={setRole}
            onBack={() => { setSelectedPatient(null); setSelectedPatientOutcome(undefined); setSelectedPatientDeceased(false) }}
            onNotify={setNotice}
            risks={getPatientRisks(selectedPatient.admission)}
            outcome={selectedPatientOutcome}
            isDeceased={selectedPatientDeceased}
            medications={selectedMedicationPatient?.admission === selectedPatient.admission ? medications : []}
            prescriptionItems={selectedMedicationPatient?.admission === selectedPatient.admission ? selectedPrescriptionItems : []}
            prescriptionStatus={selectedMedicationPatient?.admission === selectedPatient.admission ? selectedPrescriptionStatus : 'Sem prescrição homologada'}
            schedule={selectedMedicationPatient?.admission === selectedPatient.admission ? medicationSchedule : {}}
            scheduleApproved={selectedMedicationPatient?.admission === selectedPatient.admission ? scheduleApproved : false}
            devices={invasiveDevices}
            onDevicesChange={setInvasiveDevices}
            prescriptionVersions={prescriptionVersionsByAdmission[selectedPatient.admission] ?? []}
          />
        ) : activeNav === 'Pacientes' ? (
          <PatientsScreen onOpenPatient={(patient, outcome, isDeceased) => { setSelectedMedicationBed(patient.bed); setSelectedPatient(patient); setSelectedPatientOutcome(outcome); setSelectedPatientDeceased(Boolean(isDeceased || outcome?.status === 'Óbito')) }} onAddPatient={() => setActiveNav('Admissão')} admittedPatients={admittedPatients} outcomes={patientOutcomes} bedMoves={patientBedMoves} getRisks={getPatientRisks} />
        ) : activeNav === 'Admissão' ? (
          <AdmissionScreen
            role={role}
            onNotify={setNotice}
            activePatients={activePatients}
            onTransferPatient={transferPatient}
            onOutcome={closePatientStay}
            getRisks={getPatientRisks}
            onAdmitPatient={admitPatient}
            dischargeOrders={medicalDischargeOrders}
            outcomes={patientOutcomes}
            onCreateDischargeOrder={createMedicalDischargeOrder}
            onAssignDischargeDestination={assignDischargeDestination}
            onCompleteDischargeTransport={completeDischargeTransport}
          />
        ) : activeNav === 'Prescrições' ? (
          role === 'medico' ? (
            selectedPrescriptionPatient ? (
              <PhysicianPrescriptionScreen
                key={selectedPrescriptionPatient.admission}
                patient={selectedPrescriptionPatient}
                risks={getPatientRisks(selectedPrescriptionPatient.admission)}
                medications={selectedMedicationPatient?.admission === selectedPrescriptionPatient.admission ? medications : []}
                versions={prescriptionVersionsByAdmission[selectedPrescriptionPatient.admission] ?? []}
                onNotify={setNotice}
                onBackToPatients={() => setSelectedPrescriptionAdmission(null)}
                onClosePrescription={(items, previousItems) => closePatientPrescription(selectedPrescriptionPatient.admission, items, previousItems)}
              />
            ) : (
              <PrescriptionPatientGrid patients={activePatients} onSelect={(patient) => { setSelectedPrescriptionAdmission(patient.admission); setSelectedMedicationBed(patient.bed) }} />
            )
          ) : selectedMedicationPatient ? (
             <NursingPrescriptionPage patient={selectedMedicationPatient} risks={getPatientRisks(selectedMedicationPatient.admission)} items={selectedPrescriptionItems} prescriptionStatus={selectedPrescriptionStatus} role={role} activePatients={activePatients} onPatientChange={setSelectedMedicationBed} />
          ) : <BedAccessUnavailable bed={selectedMedicationBed} deceased={selectedBedHasDeceasedRecord} />
        ) : activeNav === 'Aprazamento de enfermagem' ? (
          <SchedulingScreen role={role} onChangeRole={setRole} onNotify={setNotice} medications={medications} activePatients={activePatients} pendingPatients={pendingSchedulingPatients} getPatientRisks={getPatientRisks} schedule={medicationSchedule} onScheduleChange={(next) => {
            if (!selectedMedicationPatient) { setNotice('Aprazamento bloqueado: não há paciente ativo neste leito.'); return }
            updateMedicationSchedule(next)
          }} selectedBed={selectedMedicationBed} onSelectedBedChange={setSelectedMedicationBed} approved={scheduleApproved} onApprove={() => {
            if (!selectedMedicationPatient) { setNotice('Aprazamento bloqueado: não há paciente ativo neste leito.'); return }
            approveMedicationSchedule()
          }} />
        ) : activeNav === 'Passagem de plantão' ? (
          <ShiftHandoffScreen role={role} onNotify={setNotice} activePatients={activePatients} devices={invasiveDevices} pendingTasks={pendingTasks} draftGuard={draftGuardRef} />
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
            <SummaryCard icon="check" label="LEITOS DISPONÍVEIS" value={String(availableBedCount)} detail="Leitos disponíveis para alocação direta" tone="success" />
            <SummaryCard icon="alert" label="REQUEREM ATENÇÃO" value={String(activePatients.filter((patient) => patient.status !== 'stable').length)} detail={`${activePatients.filter((patient) => patient.status === 'critical').length} críticos · ${activePatients.filter((patient) => patient.status === 'warning').length} em observação`} tone="danger" />
          </section>

          <SafetyHuddle activePatients={activePatients} huddle={safetyHuddle} now={now} onUpdate={() => setSafetyHuddleOpen(true)} />
          <PriorityPanel tasks={pendingTasks} onOpenTasks={() => setPendingOpen(true)} />
        </main>}
      </div>

      {logoutDialogOpen && <ConfirmationDialog title="Sair com rascunho não salvo?" description="A passagem de plantão em edição ainda não foi salva. Salve como rascunho para retomá-la depois ou saia sem salvar." confirmLabel="Salvar rascunho e sair" alternateLabel="Sair sem salvar" onAlternate={logout} onCancel={() => setLogoutDialogOpen(false)} onConfirm={() => { draftGuardRef.current?.saveDraft(); logout() }} />}
      <PendingTaskPanel open={pendingOpen} onClose={() => setPendingOpen(false)} onNotify={setNotice} role={role} tasks={pendingTasks} setTasks={setPendingTasks} />
      {safetyHuddleOpen && <SafetyHuddleUpdateDialog activePatients={activePatients} huddle={safetyHuddle} onClose={() => setSafetyHuddleOpen(false)} onSave={(updated) => { setSafetyHuddle(updated); setSafetyHuddleOpen(false); setNotice('Safety Huddle atualizado para o próximo ciclo de 12 horas.') }} />}
      {notice && <div className="toast"><Icon name="check" size={17} /><span>{notice}</span></div>}
    </div>
  )
}
