import React from "react"
import type { Metadata } from 'next'
import { Libre_Baskerville, Inconsolata } from 'next/font/google'

import './globals.css'

const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif'
})

const inconsolata = Inconsolata({ 
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Alejandro | Desarrollador Backend',
  description: 'Backend Developer especializado en Node.js, TypeScript, PostgreSQL, Docker y AWS',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${libreBaskerville.variable} ${inconsolata.variable} dark`}>
      <body className="font-serif antialiased">{children}</body>
    </html>
  )
}
