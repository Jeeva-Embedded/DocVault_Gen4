import React, { useState } from 'react'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { BUILT_IN_CATS, getCatSubs } from './utils'

export default function DocModal({ doc: d, categories, subSettings = {}, onClose, addToast, afterSave }) {
  const [name, setName] = useState(d.name || '')
  const [category, setCategory] = useState(d.category || 'Mechanical')
  const [subCategory, setSubCategory] = useState(d.subCategory || 'General')
  const [notes, setNotes] = useState(d.notes || '')
  const [author, setAuthor] = useState(d.author || '')
  const [saving, setSaving] = useState(false)

  const allCats = [...BUILT_IN_CATS, ...categories.map((c) => c.name)]
  const subs = getCatSubs(category, categories, subSettings)

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      await updateDoc(doc(db, 'documents', d.id), {
        name: name.trim(),
        category,
        subCategory,
        notes,
        author,
      })
      addToast('Document updated', 'success')
      onClose()
      if (afterSave) afterSave()
    } catch (e) {
      addToast('Save failed: ' + e.message, 'error')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!window.confirm(`Permanently delete "${d.name}"?`)) return
    try {
      await deleteDoc(doc(db, 'documents', d.id))
      addToast('Document deleted', 'info')
      onClose()
      if (afterSave) afterSave()
    } catch (e) {
      addToast('Delete failed: ' + e.message, 'error')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Document</h2>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Document Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory('General') }}>
                {allCats.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Sub-Category</label>
              <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                {subs.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
