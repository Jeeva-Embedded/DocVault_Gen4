import React, { useState, useCallback } from 'react'
import { BrowserRouter, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import Documents from './components/Documents'
import UploadPage from './components/UploadPage'
import DriveFiles from './components/DriveFiles'
import ViewerPanel from './components/ViewerPanel'
import { useDocs, useCategories, useSubSettings } from './hooks/useDocs'

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => onRemove(t.id)}>×</button>
        </div>
      ))}
    </div>
  )
}

function AppShell() {
  const { docs, loading } = useDocs()
  const categories = useCategories()
  const subSettings = useSubSettings()
  const [viewDoc, setViewDoc] = useState(null)
  const [toasts, setToasts] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const path = location.pathname
  const isDash = path === '/' || path === '/dashboard'
  const isDocs = path.startsWith('/documents')
  const isUpload = path === '/upload'
  const isDrive = path === '/drive'

  return (
    <div className="app-shell">
      <Sidebar
        categories={categories}
        subSettings={subSettings}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        addToast={addToast}
      />
      <div className="main-area">
        <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="page-content">
          <div className={`page-slot${isDash ? ' active' : ''}`}>
            <Dashboard docs={docs} categories={categories} loading={loading} onView={setViewDoc} />
          </div>
          <div className={`page-slot${isDocs ? ' active' : ''}`}>
            <Documents
              docs={docs}
              categories={categories}
              subSettings={subSettings}
              loading={loading}
              onView={setViewDoc}
              addToast={addToast}
            />
          </div>
          <div className={`page-slot${isUpload ? ' active' : ''}`}>
            <UploadPage categories={categories} subSettings={subSettings} addToast={addToast} />
          </div>
          <div className={`page-slot${isDrive ? ' active' : ''}`}>
            <DriveFiles docs={docs} categories={categories} addToast={addToast} onView={setViewDoc} />
          </div>
          {!isDash && !isDocs && !isUpload && !isDrive && (
            <Navigate to="/dashboard" replace />
          )}
        </div>
      </div>
      {viewDoc && (
        <ViewerPanel
          doc={viewDoc}
          categories={categories}
          subSettings={subSettings}
          onClose={() => setViewDoc(null)}
          addToast={addToast}
        />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell />
    </BrowserRouter>
  )
}
