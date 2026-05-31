import { ComparisonTable } from '@/components/shortlist/ComparisonTable'
import { EmptyState } from '@/components/shortlist/EmptyState'

export const metadata = {
  title: 'My Shortlist — CarAdvisor',
}

export default function ShortlistPage() {
  return (
    <main className="min-h-full bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">My Shortlist</h1>
          <a href="/" className="text-sm text-brand-600 hover:underline">
            ← Back to chat
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* TODO: load shortlist from API (sessionId from localStorage) */}
        {/* <ComparisonTable cars={[]} onRemove={() => {}} /> */}

        {/* Placeholder — remove when ComparisonTable is implemented */}
        <EmptyState />
      </div>
    </main>
  )
}
