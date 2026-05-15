import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function CatModal({ onClose }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('ti-folder')
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

      const catData = {
        name: name.trim(),
        icon: icon.trim() || 'ti-folder',
        subs: subList,
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, 'categories'), catData)

      // localStorage fallback
      try {
        const existing = JSON.parse(localStorage.getItem('gen4_categories') || '[]')
        localStorage.setItem('gen4_categories', JSON.stringify([...existing, catData]))
      } catch {}

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Electrical"
            />
          </div>
          <div className="form-group">
            <label>Icon (Tabler icon class)</label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. ti-bolt"
            />
            <small className="form-hint">Any class from tabler-icons.io</small>
          </div>
          <div className="form-group">
            <label>Sub-categories (comma separated)</label>
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
