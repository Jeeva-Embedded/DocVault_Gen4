import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  IconLayoutDashboard,
  IconFiles,
  IconUpload,
  IconBrandGoogleDrive,
  IconSettings2,
  IconCircuitDiode,
  IconCode,
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import CatModal from './CatModal'
import EditCatModal from './EditCatModal'

const BUILT_IN = [
  { name: 'Mechanical', icon: <IconSettings2 size={18} />, slug: 'mechanical', subs: ['QC', 'IQC'] },
  { name: 'Electronics', icon: <IconCircuitDiode size={18} />, slug: 'electronics', subs: ['QC', 'IQC'] },
  { name: 'Software', icon: <IconCode size={18} />, slug: 'software', subs: ['QC', 'IQC'] },
]

function CatItem({ cat, slug, catData, subSettings = {}, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const docSubs = cat.subs || []
  const extraSubs = (subSettings[cat.name] || []).filter((s) => !docSubs.includes(s))
  const allSubs = [...docSubs, ...extraSubs]

  return (
    <div className="sidebar-cat-item">
      <div className="sidebar-cat-row">
        <button className="sidebar-cat-btn" onClick={() => setOpen((v) => !v)}>
          <span className="cat-icon">{cat.icon}</span>
          <span>{cat.name}</span>
          <span className="cat-chevron">
            {open ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
          </span>
        </button>
        {catData && (
          <div className="cat-manage-btns">
            <button
              className="cat-manage-btn"
              title="Edit"
              onClick={(e) => { e.stopPropagation(); onEdit(catData) }}
            >
              <IconPencil size={12} />
            </button>
            <button
              className="cat-manage-btn cat-manage-delete"
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDelete(catData) }}
            >
              <IconTrash size={12} />
            </button>
          </div>
        )}
      </div>
      {open && (
        <div className="sidebar-sub-list">
          <button className="sidebar-sub-btn" onClick={() => navigate(`/documents/${slug}`)}>All</button>
          {allSubs.map((s) => (
            <button key={s} className="sidebar-sub-btn" onClick={() => navigate(`/documents/${slug}?sub=${s}`)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ categories, subSettings = {}, open, onClose, addToast }) {
  const [showCatModal, setShowCatModal] = useState(false)
  const [editCat, setEditCat] = useState(null)

  async function handleDeleteCat(cat) {
    if (!window.confirm(`Delete category "${cat.name}"? Documents inside it will not be deleted.`)) return
    try {
      await deleteDoc(doc(db, 'categories', cat.id))
      addToast(`"${cat.name}" deleted`, 'info')
    } catch (e) {
      addToast('Failed: ' + e.message, 'error')
    }
  }

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ flex: 1 }}>
            <div className="sidebar-brand-name">Gen4<span> Manufacturing</span></div>
            <div className="sidebar-tagline">Embracing Industry 4.0</div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <IconLayoutDashboard size={18} /><span>Dashboard</span>
          </NavLink>
          <NavLink to="/documents" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <IconFiles size={18} /><span>All Documents</span>
          </NavLink>
          <NavLink to="/upload" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <IconUpload size={18} /><span>Upload File</span>
          </NavLink>
          <NavLink to="/drive" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <IconBrandGoogleDrive size={18} /><span>Google Drive Files</span>
          </NavLink>

          <div className="sidebar-section-label">Categories</div>
          {BUILT_IN.map((cat) => (
            <CatItem key={cat.slug} cat={cat} slug={cat.slug} />
          ))}

          {categories.length > 0 && (
            <div className="sidebar-section-label">Custom</div>
          )}
          {categories.map((cat) => (
            <CatItem
              key={cat.id}
              cat={{ ...cat, icon: <span className={`ti ${cat.icon}`} style={{ fontSize: 16 }} /> }}
              slug={cat.name.toLowerCase().replace(/\s+/g, '-')}
              catData={cat}
              subSettings={subSettings}
              onEdit={setEditCat}
              onDelete={handleDeleteCat}
            />
          ))}

          <button className="sidebar-add-cat-btn" onClick={() => setShowCatModal(true)}>
            <IconPlus size={15} /><span>Add Category</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">G4</div>
            <span className="user-name">Gen4 Team</span>
          </div>
        </div>
      </aside>

      {showCatModal && <CatModal onClose={() => setShowCatModal(false)} />}
      {editCat && (
        <EditCatModal
          cat={editCat}
          subSettings={subSettings}
          onClose={() => setEditCat(null)}
          addToast={addToast}
        />
      )}
    </>
  )
}
