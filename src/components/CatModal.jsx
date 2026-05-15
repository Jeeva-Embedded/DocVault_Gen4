import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function CatModal({ onClose }) {
  const [name, setName] = useState('')
  const [subs, setSubs] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) { setError('Category name is required'); return }
    setSaving(true)
    try {
      const subList = subs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      await addDoc(collection(db, 'categories'), {
        name: name.trim(),
        subs: subList,
        createdAt: new Date().toISOString(),
      })

      onClose()
    } catch (e) {
      setError('Failed: ' + e.message)
    }
    setSaving(false)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Category</h2>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label>Category Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="e.g. Electrical, Production, R&D…"
            />
            <small className="form-hint">An icon will be chosen automatically from the name.</small>
          </div>
          <div className="form-group">
            <label>Sub-categories <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(comma separated, optional)</span></label>
            <input
              value={subs}
              onChange={(e) => setSubs(e.target.value)}
              placeholder="e.g. Drawings, BOMs, Revisions"
            />
          </div>
        </div>
        <div className="modal-footer">
          <div />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Add Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
