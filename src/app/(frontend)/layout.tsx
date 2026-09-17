import React from 'react'

import { baseMetadata } from '@/lib/metadata'
import './styles.css'

export const metadata = baseMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth motion-reduce:scroll-auto" lang="en">
      <body className="bg-cream font-sans text-forest antialiased">{children}</body>
    </html>
  )
}
