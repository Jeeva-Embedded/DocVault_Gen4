import React, { useState, useMemo } from 'react'
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import {
  IconEye,
  IconDownload,
  IconPencil,
  IconTrash,
  IconSearch,
} from '@tabler/icons-react'
import { doc, updateDoc, deleteDoc, increment, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase'
import { formatDate, fileTypeIcon, BUILT_IN_CATS, getCatSubs } from './utils'
import DocModal from './DocModal'
import SubCatModal from './SubCatModal'

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''
const ALL_CATS = ['All', ...BUILT_IN_CATS]

export default function Documents({ docs, categories, subSettings = {}, loading, onView, addToast }) {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const catSlug = location.pathname.startsWith('/documents/')
    ? location.pathname.slice('/documents/'.length)
    : undefined

  const subParam = searchParams.get('sub') || 'All'
  const [search, setSearch] = useState('')
  const [editDoc, setEditDoc] = useState(null)
  const [showSubModal, setShowSubModal] = useState(false)

  const customCats = categories.map((c) => c.name)
  const allTabs = [...ALL_CATS, ...customCats]

  const activeCat = useMemo(() => {
    if (!catSlug) return 'All'
    return allTabs.find(
      (t) => t.toLowerCase().replace(/\s+/g, '-') === catSlug
    ) || 'All'
  }, [catSlug, allTabs])

  const customSubs = useMemo(() => subSettings[activeCat] || [], [subSettings, activeCat])

  const subTabs = useMemo(() => {
    if (activeCat === 'All') return []
    return ['All', ...getCatSubs(activeCat, categories, subSettings)]
  }, [activeCat, categories, subSettings])

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      const catMatch =
        activeCat === 'All' ||
        d.category.toLowerCase() === activeCat.toLowerCase()
      const subMatch =
        subParam === 'All' || d.subCategory === subParam
      const q = search.toLowerCase()
      const textMatch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.notes || '').toLowerCase().includes(q)
      return catMatch && subMatch && textMatch
    })
  }, [docs, activeCat, subParam, search])

  async function handleDownload(d) {
    const url = d.downloadURL || d.driveUrl
    if (!url) return
    window.open(url, '_blank')
    try {
      await updateDoc(doc(db, 'documents', d.id), { downloads: increment(1) })
    } catch {}
  }

  async function handleDelete(d) {
    if (!window.confirm(`Delete "${d.name}" from the portal and Google Drive?`)) return
    try {
      await deleteDoc(doc(db, 'documents', d.id))

      // Resolve fileId: stored field first, then extract from driveUrl
      let fileId = d.driveFileId
      if (!fileId && d.driveUrl) {
        const m = d.driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || d.driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/)
        if (m) fileId = m[1]
      }

      if (fileId && SCRIPT_URL) {
        try {
          const res = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', fileId }),
          })
          const result = await res.json()
          if (result.success) {
            addToast('Deleted from portal and Drive', 'info')
          } else {
            addToast('Portal: deleted. Drive error: ' + (result.error || 'unknown'), 'error')
          }
        } catch (driveErr) {
          addToast('Portal: deleted. Drive unreachable — delete manually.', 'error')
        }
      } else {
        addToast('Deleted from portal (no Drive file linked)', 'info')
      }
    } catch (e) {
      addToast('Delete failed: ' + e.message, 'error')
    }
  }

  async function handleDeleteSub(sub) {
    if (!window.confirm(`Remove sub-category "${sub}" from ${activeCat}?`)) return
    try {
      await updateDoc(doc(db, 'subSettings', activeCat), { subs: arrayRemove(sub) })
      if (subParam === sub) setSearchParams({})
      addToast(`"${sub}" removed`, 'info')
    } catch (e) {
      addToast('Failed: ' + e.message, 'error')
    }
  }

  function navCat(cat) {
    if (cat === 'All') {
      navigate('/documents')
    } else {
      navigate(`/documents/${cat.toLowerCase().replace(/\s+/g, '-')}`)
    }
  }

  function navSub(sub) {
    if (sub === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ sub })
    }
  }

  return (
    <div className="page documents">
      <div className="page-header">
        <h1 className="page-title">Documents</h1>
        <div className="search-bar">
          <IconSearch size={16} />
          <input
            type="text"
            placeholder="Search by name or notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="tab-bar">
        {allTabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeCat === tab ? 'active' : ''}`}
            onClick={() => navCat(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {subTabs.length > 0 && (
        <div className="sub-tab-bar">
          {subTabs.map((sub) => {
            const isCustom = sub !== 'All' && customSubs.includes(sub)
            return (
              <button
                key={sub}
                className={`sub-tab-btn ${subParam === sub ? 'active' : ''}`}
                onClick={() => navSub(sub)}
              >
                {sub}
                {isCustom && (
                  <span
                    className="sub-del-x"
                    title="Remove sub-category"
                    onClick={(e) => { e.stopPropagation(); handleDeleteSub(sub) }}
                  >
                    ×
                  </span>
                )}
              </button>
            )
          })}
          <button className="sub-add-btn" onClick={() => setShowSubModal(true)}>
            + Add Sub
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {search ? 'No documents match your search.' : 'No documents in this category yet.'}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Size</th>
                <th>Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="doc-row">
                  <td className="doc-name-cell">
                    {fileTypeIcon(d.name)}
                    <span>{d.name}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${d.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      {d.category}
                    </span>
                  </td>
                  <td>{d.subCategory || '—'}</td>
                  <td>{d.size || '—'}</td>
                  <td>{formatDate(d.date)}</td>
                  <td className="actions-cell">
                    <button className="icon-btn" title="View" onClick={() => onView(d)}>
                      <IconEye size={16} />
                    </button>
                    <button className="icon-btn" title="Download" onClick={() => handleDownload(d)}>
                      <IconDownload size={16} />
                    </button>
                    <button className="icon-btn" title="Edit" onClick={() => setEditDoc(d)}>
                      <IconPencil size={16} />
                    </button>
                    <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => handleDelete(d)}>
                      <IconTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editDoc && (
        <DocModal
          doc={editDoc}
          categories={categories}
          subSettings={subSettings}
          onClose={() => setEditDoc(null)}
          addToast={addToast}
        />
      )}

      {showSubModal && (
        <SubCatModal
          category={activeCat}
          onClose={() => setShowSubModal(false)}
          addToast={addToast}
        />
      )}
    </div>
  )
}
