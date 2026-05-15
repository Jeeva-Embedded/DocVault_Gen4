import React, { useState, useRef, useCallback } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { IconUpload, IconX, IconFile } from '@tabler/icons-react'
import { formatSize, BUILT_IN_CATS, getCatSubs } from './utils.jsx'

const ACCEPTED = '.pdf,.doc,.docx,.xlsx,.xls,.ods,.png,.jpg,.jpeg'
const MAX_MB = 50
const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // strip data URL prefix → get only base64 string
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ProgressItem({ file, progress, done, error }) {
  return (
    <div className="upload-queue-item">
      <IconFile size={16} />
      <div className="upload-queue-info">
        <span className="upload-queue-name">{file.name}</span>
        <span className="upload-queue-size">{formatSize(file.size)}</span>
        {!done && !error && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}
        {done && <span className="upload-done">✓ Saved to Drive</span>}
        {error && <span className="upload-error">{error}</span>}
      </div>
    </div>
  )
}

export default function UploadPage({ categories, subSettings = {}, addToast }) {
  const [files, setFiles] = useState([])
  const [progresses, setProgresses] = useState({})
  const [done, setDone] = useState({})
  const [errors, setErrors] = useState({})
  const [category, setCategory] = useState('Mechanical')
  const [subCategory, setSubCategory] = useState('General')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const allCats = [...BUILT_IN_CATS, ...categories.map((c) => c.name)]
  const subs = getCatSubs(category, categories, subSettings)

  function addFiles(newFiles) {
    const valid = Array.from(newFiles).filter((f) => {
      if (f.size > MAX_MB * 1024 * 1024) {
        addToast(`${f.name} exceeds 50 MB`, 'error')
        return false
      }
      return true
    })
    setFiles((prev) => [...prev, ...valid])
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [])

  function removeFile(idx) {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  function clear() {
    setFiles([])
    setProgresses({})
    setDone({})
    setErrors({})
    setDescription('')
    setAuthor('')
  }

  async function handleUpload() {
    if (files.length === 0) return
    if (!SCRIPT_URL) {
      addToast('Apps Script URL not configured yet', 'error')
      return
    }
    setUploading(true)
    let anyError = false

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgresses((prev) => ({ ...prev, [i]: 10 }))

      try {
        const base64 = await fileToBase64(file)
        setProgresses((prev) => ({ ...prev, [i]: 40 }))

        // 90-second timeout — Apps Script can be slow on first cold start
        const controller = new AbortController()
        const tid = setTimeout(() => controller.abort(), 90000)

        let rawText
        try {
          const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            signal: controller.signal,
            body: JSON.stringify({
              base64,
              mimeType: file.type || 'application/octet-stream',
              fileName: file.name,
              category,
              subCategory,
            }),
          })
          clearTimeout(tid)
          setProgresses((prev) => ({ ...prev, [i]: 80 }))
          rawText = await response.text()
        } catch (fetchErr) {
          clearTimeout(tid)
          if (fetchErr.name === 'AbortError') {
            throw new Error('Upload timed out (90s). Re-deploy the Apps Script and try again.')
          }
          throw new Error('Network error – check internet connection or Apps Script deployment.')
        }

        let result
        try {
          result = JSON.parse(rawText)
        } catch {
          throw new Error('Apps Script returned an unexpected response. Re-deploy the script as a new version.')
        }

        if (!result.success) throw new Error(result.error || 'Drive upload failed')

        await addDoc(collection(db, 'documents'), {
          name: file.name,
          category,
          subCategory,
          notes: description,
          author: author || 'Gen4 Team',
          size: formatSize(file.size),
          date: new Date().toISOString(),
          downloadURL: '',
          driveUrl: result.url,
          driveFileId: result.fileId,
          source: 'upload',
          downloads: 0,
        })

        setProgresses((prev) => ({ ...prev, [i]: 100 }))
        setDone((prev) => ({ ...prev, [i]: true }))
      } catch (err) {
        setErrors((prev) => ({ ...prev, [i]: err.message }))
        anyError = true
      }
    }

    setUploading(false)
    if (!anyError) {
      addToast('All files uploaded to Drive!', 'success')
    } else {
      addToast('Some files failed — see error below each file', 'error')
    }
  }

  return (
    <div className="page upload-page">
      <h1 className="page-title">Upload Files</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 13 }}>
        Files are saved directly to your Gen4 Google Drive folder.
      </p>

      <div
        className={`drop-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
      >
        <IconUpload size={40} color="var(--primary)" />
        <p className="drop-text">Drag & drop files here, or <span className="drop-link">click to browse</span></p>
        <p className="drop-hint">PDF, DOCX, XLSX, ODS, PNG, JPG — up to 50 MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="upload-queue">
          {files.map((f, i) => (
            <div key={i} className="upload-queue-row">
              <ProgressItem
                file={f}
                progress={progresses[i] || 0}
                done={done[i]}
                error={errors[i]}
              />
              {!uploading && !done[i] && (
                <button className="icon-btn" onClick={() => removeFile(i)}>
                  <IconX size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="upload-form">
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
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description / Notes</label>
          <textarea
            rows={3}
            placeholder="Optional notes about this file…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="upload-actions">
          <button className="btn btn-outline" onClick={clear} disabled={uploading}>Clear</button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? 'Uploading to Drive…' : `Upload ${files.length > 0 ? `(${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}
