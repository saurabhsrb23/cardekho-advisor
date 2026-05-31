import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarAdvisor — Find Your Perfect Car',
  description:
    'AI-powered car recommendation engine. Tell us what you need, get a confident shortlist.',
  openGraph: {
    title: 'CarAdvisor — Find Your Perfect Car',
    description: 'AI-powered car buying advisor for the Indian market.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
