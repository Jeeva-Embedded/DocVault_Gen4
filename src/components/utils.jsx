import React from 'react'
import {
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFileTypeXls,
  IconPhoto,
  IconFile,
} from '@tabler/icons-react'

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
