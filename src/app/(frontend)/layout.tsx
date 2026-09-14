import type { Metadata } from 'next'
import React from 'react'

import './styles.css'

export const metadata: Metadata = {
  description:
    'Personalised, practical nutrition support to help you feel confident and at home with food.',
  title: 'Nutrihome | Feel Good About Food',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth motion-reduce:scroll-auto" lang="en">
      <body className="bg-cream font-sans text-forest antialiased">{children}</body>
    </html>
  )
}
