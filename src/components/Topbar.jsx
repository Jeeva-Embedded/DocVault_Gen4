import React from 'react'
import { IconMenu2 } from '@tabler/icons-react'

export default function Topbar({ onMenuClick }) {
  return (
    <header className="topbar">
      <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <IconMenu2 size={22} />
      </button>
      <div className="topbar-title">
        <span className="topbar-company">Gen4 Manufacturing Pvt. Ltd.</span>
        <span className="topbar-sub">Document Management Portal</span>
      </div>
    </header>
  )
}
