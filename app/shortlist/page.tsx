'use client'

import { useState, useEffect } from 'react'
import type { Car } from '@/types'
import { ComparisonTable } from '@/components/shortlist/ComparisonTable'
import { EmptyState } from '@/components/shortlist/EmptyState'

const SHORTLIST_KEY = 'ca_shortlist'
const SESSION_KEY = 'ca_session_id'

export default function ShortlistPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const sessionId = localStorage.getItem(SESSION_KEY)
      if (!sessionId) { setIsLoading(false); return }

      try {
        const res = await fetch(`/api/shortlist?sessionId=${sessionId}`)
        const data = await res.json() as { cars: Car[] }
        setCars(data.cars)
      } catch {
        // fallback: nothing to show
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  function handleRemove(carId: number) {
    const sessionId = localStorage.getItem(SESSION_KEY) ?? ''

    // Optimistic removal
    setCars((prev) => prev.filter((c) => c.id !== carId))

    // Sync localStorage shortlist
    const stored = localStorage.getItem(SHORTLIST_KEY)
    if (stored) {
      try {
        const ids = JSON.parse(stored) as number[]
        localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids.filter((id) => id !== carId)))
      } catch { /* ignore */ }
    }

    // Sync DB
    fetch('/api/shortlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, carId, action: 'remove' }),
    }).catch(console.error)
  }

  return (
    <main className="min-h-full bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <h1 className="text-lg font-semibold text-gray-900">My Shortlist</h1>
            {cars.length > 0 && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                {cars.length} car{cars.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <a href="/" className="text-sm text-brand-600 hover:underline">
            ← Back to chat
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              Loading your shortlist…
            </div>
          </div>
        ) : cars.length === 0 ? (
          <EmptyState />
        ) : (
          <ComparisonTable cars={cars} onRemove={handleRemove} />
        )}
      </div>
    </main>
  )
}
