import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { BUILT_IN_CATS, getCatSubs } from './utils'

export default function ImportModal({ file, categories, onClose, addToast }) {
  const [category, setCategory] = useState('Software')
  const [subCategory, setSubCategory] = useState('General')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [saving, setSaving] = useState(false)

  const allCats = [...BUILT_IN_CATS, ...categories.map((c) => c.name)]
  const subs = getCatSubs(category, categories)

  async function handleImport() {
    setSaving(true)
    try {
      await addDoc(collection(db, 'documents'), {
        name: file.name,
        category,
        subCategory,
        notes: description,
        author: author || 'Gen4 Team',
        size: file.size || '—',
        date: new Date().toISOString(),
        downloadURL: '',
        driveUrl: `https://drive.google.com/file/d/${file.id}/view`,
        driveFileId: file.id,
        source: 'drive',
        downloads: 0,
      })
      addToast(`"${file.name}" imported to portal`, 'success')
      onClose()
    } catch (e) {
      addToast('Import failed: ' + e.message, 'error')
    }
    setSaving(false)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Import from Drive</h2>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="import-filename">{file.name}</p>
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
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Gen4 Team" />
          </div>
          <div className="form-group">
            <label>Description / Notes</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <div />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleImport} disabled={saving}>
              {saving ? 'Importing…' : 'Import to Portal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
