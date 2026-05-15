import React from 'react'
import {
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFileTypeXls,
  IconPhoto,
  IconFile,
  IconFolder,
  IconBolt,
  IconSettings2,
  IconCode,
  IconCircuitDiode,
  IconPalette,
  IconTestPipe,
  IconBuildingFactory2,
  IconClipboardCheck,
  IconCoin,
  IconUsers,
  IconMicroscope,
  IconCpu,
  IconNetwork,
  IconShieldCheck,
  IconTool,
  IconBox,
  IconTruck,
  IconRocket,
  IconBrain,
  IconHammer,
  IconAtom,
  IconChartBar,
  IconCamera,
  IconPrinter,
  IconTemperature,
  IconWifi,
  IconBattery2,
  IconAntenna,
} from '@tabler/icons-react'

const ICON_MAP = [
  { keywords: ['electric', 'power', 'voltage', 'wiring', 'wire', 'energy'], icon: IconBolt },
  { keywords: ['mechanic', 'machine', 'gear', 'engine', 'motor', 'pneum'], icon: IconSettings2 },
  { keywords: ['software', 'code', 'program', 'app', 'web', 'dev', 'firmware', 'script'], icon: IconCode },
  { keywords: ['electron', 'circuit', 'pcb', 'embedded', 'sensor', 'component'], icon: IconCircuitDiode },
  { keywords: ['design', 'draw', 'cad', 'art', 'render', 'model', 'sketch'], icon: IconPalette },
  { keywords: ['test', 'qa', 'quality', 'inspect', 'verif', 'audit', 'iqc', 'qc'], icon: IconTestPipe },
  { keywords: ['product', 'manufactur', 'assembly', 'factory', 'plant', 'process'], icon: IconBuildingFactory2 },
  { keywords: ['document', 'report', 'manual', 'guide', 'spec', 'sop', 'procedure'], icon: IconClipboardCheck },
  { keywords: ['financ', 'account', 'budget', 'cost', 'invoic', 'payment', 'purchas'], icon: IconCoin },
  { keywords: ['human', 'hr', 'staff', 'team', 'people', 'employ', 'recruit'], icon: IconUsers },
  { keywords: ['research', 'lab', 'science', 'experiment', 'r&d', 'develop'], icon: IconMicroscope },
  { keywords: ['hardware', 'cpu', 'chip', 'processor', 'computer', 'server'], icon: IconCpu },
  { keywords: ['network', 'cloud', 'internet', 'connect', 'lan', 'wan', 'infra'], icon: IconNetwork },
  { keywords: ['safety', 'security', 'protect', 'shield', 'risk', 'hse', 'hazard'], icon: IconShieldCheck },
  { keywords: ['mainten', 'repair', 'service', 'tool', 'fix', 'upkeep'], icon: IconTool },
  { keywords: ['inventor', 'stock', 'warehouse', 'store', 'supply', 'material'], icon: IconBox },
  { keywords: ['logistic', 'deliver', 'ship', 'transport', 'freight', 'dispatch'], icon: IconTruck },
  { keywords: ['project', 'launch', 'startup', 'innovat', 'initiative'], icon: IconRocket },
  { keywords: ['ai', 'ml', 'intelligen', 'automat', 'smart', 'robot'], icon: IconBrain },
  { keywords: ['structur', 'civil', 'construct', 'build', 'weld', 'fabricat'], icon: IconHammer },
  { keywords: ['chem', 'material', 'compound', 'substanc', 'formulat'], icon: IconAtom },
  { keywords: ['analyt', 'data', 'metric', 'kpi', 'statistic', 'dashboard'], icon: IconChartBar },
  { keywords: ['camera', 'image', 'vision', 'photo', 'video', 'optic'], icon: IconCamera },
  { keywords: ['print', 'output', 'publish', 'label'], icon: IconPrinter },
  { keywords: ['thermal', 'temperatur', 'heat', 'cool', 'hvac'], icon: IconTemperature },
  { keywords: ['wireless', 'wifi', 'bluetooth', 'rf', 'radio'], icon: IconWifi },
  { keywords: ['battery', 'charg', 'power supply', 'ups'], icon: IconBattery2 },
  { keywords: ['antenna', 'signal', 'telecom', 'communicat'], icon: IconAntenna },
]

export function getCategoryIcon(name, size = 18) {
  const lower = (name || '').toLowerCase()
  const match = ICON_MAP.find(({ keywords }) => keywords.some((k) => lower.includes(k)))
  const Icon = match ? match.icon : IconFolder
  return <Icon size={size} />
}

export function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function fileExt(name = '') {
  return name.split('.').pop().toLowerCase()
}

export function fileTypeIcon(name) {
  const ext = fileExt(name)
  if (ext === 'pdf') return <IconFileTypePdf size={18} color="var(--type-pdf)" />
  if (ext === 'docx' || ext === 'doc') return <IconFileTypeDocx size={18} color="var(--type-docx)" />
  if (['xlsx', 'xls', 'ods'].includes(ext)) return <IconFileTypeXls size={18} color="var(--type-xlsx)" />
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return <IconPhoto size={18} color="var(--type-img)" />
  return <IconFile size={18} color="var(--text-muted)" />
}

export function driveDownloadUrl(driveUrl, fileId) {
  const id = fileId || (() => {
    const m = (driveUrl || '').match(/\/d\/([a-zA-Z0-9_-]+)/) ||
              (driveUrl || '').match(/[?&]id=([a-zA-Z0-9_-]+)/)
    return m ? m[1] : null
  })()
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : (driveUrl || '')
}

export function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export const BUILT_IN_CATS = ['Mechanical', 'Electronics', 'Software']
export const DEFAULT_SUBS = ['General', 'QC', 'IQC']

export function getCatSubs(catName, categories, subSettings = {}) {
  if (BUILT_IN_CATS.includes(catName)) {
    const extra = (subSettings[catName] || []).filter((s) => !DEFAULT_SUBS.includes(s))
    return [...DEFAULT_SUBS, ...extra]
  }
  const found = categories.find((c) => c.name === catName)
  const docSubs = (found && Array.isArray(found.subs)) ? found.subs : []
  const settingSubs = (subSettings[catName] || []).filter((s) => s !== 'General' && !docSubs.includes(s))
  return ['General', ...docSubs, ...settingSubs]
}
