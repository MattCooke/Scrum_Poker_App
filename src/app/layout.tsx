import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scrum Poker - Team Voting App',
  description: 'Real-time Scrum Poker voting application for agile teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
