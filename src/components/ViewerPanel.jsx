import React, { useState } from 'react'
import {
  IconX,
  IconDownload,
  IconPencil,
  IconExternalLink,
  IconFile,
} from '@tabler/icons-react'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../firebase'
import { formatDate, fileExt } from './utils'
import DocModal from './DocModal'

function MetaItem({ label, value }) {
  return (
    <div className="meta-item">
      <span className="meta-label">{label}</span>
      <span className="meta-value">{value || '—'}</span>
    </div>
  )
}

function FilePreview({ doc: d }) {
  const ext = fileExt(d.name)
  const url = d.downloadURL || d.driveUrl

  if (!url) return <div className="preview-placeholder"><IconFile size={48} /><p>No preview available</p></div>

  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
    return <img src={url} alt={d.name} className="preview-image" />
  }

  if (ext === 'pdf') {
    return <iframe src={url} title={d.name} className="preview-iframe" />
  }

  return (
    <div className="preview-placeholder">
      <IconFile size={48} />
      <p>{d.name}</p>
      <a href={url} download className="btn btn-primary">Download to view</a>
    </div>
  )
}

export default function ViewerPanel({ doc: d, categories, subSettings = {}, onClose, addToast }) {
  const [editing, setEditing] = useState(false)

  async function handleDownload() {
    const url = d.downloadURL || d.driveUrl
    if (!url) return
    window.open(url, '_blank')
    try {
      await updateDoc(doc(db, 'documents', d.id), { downloads: increment(1) })
    } catch {}
  }

  return (
    <>
      <div className="viewer-backdrop" onClick={onClose} />
      <div className="viewer-panel">
        <div className="viewer-toolbar">
          <div className="viewer-filename">{d.name}</div>
          <div className="viewer-toolbar-actions">
            <button className="icon-btn" title="Download" onClick={handleDownload}>
              <IconDownload size={18} />
            </button>
            <button className="icon-btn" title="Edit" onClick={() => setEditing(true)}>
              <IconPencil size={18} />
            </button>
            {d.driveUrl && (
              <a href={d.driveUrl} target="_blank" rel="noopener noreferrer" className="icon-btn" title="Open in Drive">
                <IconExternalLink size={18} />
              </a>
            )}
            <button className="icon-btn" title="Close" onClick={onClose}>
              <IconX size={18} />
            </button>
          </div>
        </div>

        <div className="viewer-body">
          <div className="viewer-badges">
            <span className={`badge badge-${d.category.toLowerCase().replace(/\s+/g, '-')}`}>{d.category}</span>
            {d.subCategory && <span className="badge badge-sub">{d.subCategory}</span>}
            {d.source && <span className="badge badge-source">{d.source}</span>}
          </div>

          <div className="viewer-preview">
            <FilePreview doc={d} />
          </div>

          <div className="viewer-meta">
            <MetaItem label="Category" value={d.category} />
            <MetaItem label="Sub-Category" value={d.subCategory} />
            <MetaItem label="Modified" value={formatDate(d.date)} />
            <MetaItem label="Author" value={d.author} />
            <MetaItem label="Size" value={d.size} />
            <MetaItem label="Source" value={d.source} />
            <MetaItem label="Downloads" value={d.downloads || 0} />
          </div>

          {d.notes && (
            <div className="viewer-notes">
              <div className="viewer-notes-label">Notes</div>
              <p>{d.notes}</p>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <DocModal
          doc={d}
          categories={categories}
          subSettings={subSettings}
          onClose={() => setEditing(false)}
          addToast={addToast}
          afterSave={onClose}
        />
      )}
    </>
  )
}
