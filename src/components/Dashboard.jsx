import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconFiles,
  IconCategory,
  IconDownload,
  IconRefresh,
  IconSettings2,
  IconCircuitDiode,
  IconCode,
} from '@tabler/icons-react'
import { formatDate, fileTypeIcon, getCategoryIcon } from './utils'

const BUILT_IN_CATS = [
  { name: 'Mechanical', slug: 'mechanical', icon: <IconSettings2 size={28} />, color: 'var(--badge-mechanical)' },
  { name: 'Electronics', slug: 'electronics', icon: <IconCircuitDiode size={28} />, color: 'var(--badge-electronics)' },
  { name: 'Software', slug: 'software', icon: <IconCode size={28} />, color: 'var(--badge-software)' },
]

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: accent }}>{icon}</div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  )
}

export default function Dashboard({ docs, categories, loading, onView }) {
  const navigate = useNavigate()
  const totalDownloads = docs.reduce((acc, d) => acc + (d.downloads || 0), 0)
  const recentDocs = docs.slice(0, 6)
  const allCats = [...BUILT_IN_CATS, ...categories.map((c) => ({
    name: c.name,
    slug: c.name.toLowerCase().replace(/\s+/g, '-'),
    icon: getCategoryIcon(c.name, 28),
    color: 'var(--badge-custom)',
  }))]

  return (
    <div className="page dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-row">
        <StatCard
          icon={<IconFiles size={22} color="#fff" />}
          label="Total Documents"
          value={loading ? '…' : docs.length}
          accent="var(--primary)"
        />
        <StatCard
          icon={<IconCategory size={22} color="#fff" />}
          label="Categories"
          value={3 + categories.length}
          accent="var(--accent)"
        />
        <StatCard
          icon={<IconDownload size={22} color="#fff" />}
          label="Total Downloads"
          value={totalDownloads}
          accent="#e67e22"
        />
        <StatCard
          icon={<IconRefresh size={22} color="#fff" />}
          label="Team Sync"
          value="Live"
          accent="#27ae60"
        />
      </div>

      <h2 className="section-title">Categories</h2>
      <div className="cat-grid">
        {allCats.map((cat) => {
          const count = docs.filter(
            (d) => d.category.toLowerCase() === cat.name.toLowerCase()
          ).length
          return (
            <div
              key={cat.slug}
              className="cat-card"
              onClick={() => navigate(`/documents/${cat.slug}`)}
            >
              <div className="cat-card-icon" style={{ color: cat.color }}>{cat.icon}</div>
              <div className="cat-card-name">{cat.name}</div>
              <div className="cat-card-count">{count} docs</div>
            </div>
          )
        })}
      </div>

      <h2 className="section-title">Recent Documents</h2>
      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : recentDocs.length === 0 ? (
        <div className="empty-state">No documents yet. Upload one to get started.</div>
      ) : (
        <table className="doc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Modified</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {recentDocs.map((doc) => (
              <tr key={doc.id} onClick={() => onView(doc)} className="doc-row clickable">
                <td className="doc-name-cell">
                  {fileTypeIcon(doc.name)}
                  <span>{doc.name}</span>
                </td>
                <td><span className={`badge badge-${doc.category.toLowerCase()}`}>{doc.category}</span></td>
                <td>{doc.subCategory || '—'}</td>
                <td>{formatDate(doc.date)}</td>
                <td>{doc.size || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
