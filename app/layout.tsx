import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Personality Survey',
  description: 'Create and take personality tests',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
