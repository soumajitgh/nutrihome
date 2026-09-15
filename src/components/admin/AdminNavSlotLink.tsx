'use client'

import React from 'react'
import Link from 'next/link'

export function AdminNavSlotLink() {
  return (
    <div
      style={{
        marginTop: '0.75rem',
        borderTop: '1px solid var(--theme-elevation-150, #e5e7eb)',
        paddingTop: '0.75rem',
      }}
    >
      <div
        style={{
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--theme-elevation-400, #9ca3af)',
          padding: '0 1rem',
          marginBottom: '0.25rem',
          fontWeight: 600,
        }}
      >
        Scheduling & Slots
      </div>
      <Link
        href="/admin/slots-management"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          textDecoration: 'none',
          color: 'inherit',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100, rgba(0,0,0,0.04))'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>⏱️</span>
        <span>Slot Management</span>
      </Link>
    </div>
  )
}
