import React, { useState } from 'react'
import { doc, setDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase'
import { IconX } from '@tabler/icons-react'

export default function SubCatModal({ category, onClose, addToast }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      await setDoc(doc(db, 'subSettings', category), { subs: arrayUnion(trimmed) }, { merge: true })
      addToast(`Sub-category "${trimmed}" added to ${category}`, 'success')
      onClose()
    } catch (e) {
      addToast('Failed: ' + e.message, 'error')
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Sub-Category</h2>
          <button className="icon-btn" onClick={onClose}><IconX size={18} /></button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--gray-text)', fontSize: 13, marginBottom: 16 }}>
            Adding under: <strong>{category}</strong>
          </p>
          <div className="form-group">
            <label>Sub-Category Name</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Design, Testing, R&D…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!name.trim() || saving}>
            {saving ? 'Saving…' : 'Add Sub-Category'}
          </button>
        </div>
      </div>
    </div>
  )
}
