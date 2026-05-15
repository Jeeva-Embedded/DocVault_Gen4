import React, { useState } from 'react'
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase'
import { IconX, IconPlus, IconTrash } from '@tabler/icons-react'

export default function EditCatModal({ cat, subSettings = {}, onClose, addToast }) {
  const [name, setName] = useState(cat.name)
  const [newSub, setNewSub] = useState('')
  const [saving, setSaving] = useState(false)

  // Merge subs from category document and from subSettings
  const docSubs = Array.isArray(cat.subs) ? cat.subs : []
  const settingSubs = (subSettings[cat.name] || []).filter((s) => !docSubs.includes(s))
  const allSubs = [...docSubs, ...settingSubs]

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    if (trimmed === cat.name) { onClose(); return }
    setSaving(true)
    try {
      await updateDoc(doc(db, 'categories', cat.id), { name: trimmed })
      addToast('Category renamed', 'success')
      onClose()
    } catch (e) {
      addToast('Failed: ' + e.message, 'error')
      setSaving(false)
    }
  }

  async function handleAddSub() {
    const trimmed = newSub.trim()
    if (!trimmed) return
    if (allSubs.includes(trimmed)) {
      addToast('Sub-category already exists', 'error')
      return
    }
    try {
      await updateDoc(doc(db, 'categories', cat.id), { subs: arrayUnion(trimmed) })
      addToast(`"${trimmed}" added`, 'success')
      setNewSub('')
    } catch (e) {
      addToast('Failed: ' + e.message, 'error')
    }
  }

  async function handleRemoveSub(sub) {
    try {
      await updateDoc(doc(db, 'categories', cat.id), { subs: arrayRemove(sub) })
      addToast(`"${sub}" removed`, 'info')
    } catch (e) {
      addToast('Failed: ' + e.message, 'error')
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete category "${cat.name}"? Documents inside it will not be deleted.`)) return
    try {
      await deleteDoc(doc(db, 'categories', cat.id))
      addToast(`"${cat.name}" deleted`, 'info')
      onClose()
    } catch (e) {
      addToast('Failed: ' + e.message, 'error')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Category</h2>
          <button className="icon-btn" onClick={onClose}><IconX size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Category Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className="form-group">
            <label>Sub-Categories</label>
            {allSubs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>No sub-categories yet.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {allSubs.map((s) => (
                  <span
                    key={s}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'var(--bg-2, #f0f0f0)',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      padding: '2px 8px',
                      fontSize: 13,
                    }}
                  >
                    {s}
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: 'var(--text-muted)' }}
                      title={`Remove "${s}"`}
                      onClick={() => handleRemoveSub(s)}
                    >
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSub()}
                placeholder="Add sub-category…"
                style={{ flex: 1 }}
              />
              <button className="btn btn-outline" onClick={handleAddSub} disabled={!newSub.trim()}>
                <IconPlus size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={handleDelete}>
            <IconTrash size={14} style={{ marginRight: 4 }} />
            Delete Category
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || saving}>
              {saving ? 'Saving…' : 'Save Name'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
