import type { UIMessage } from '@/types'
import { RecommendationGrid } from '@/components/cars/RecommendationGrid'
import { LoadingDots } from '@/components/ui/LoadingDots'

interface AIMessageProps {
  message: UIMessage
  shortlist: number[]
  onShortlistToggle: (carId: number) => void
}

export function AIMessage({ message, shortlist, onShortlistToggle }: AIMessageProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
        AI
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {/* Loading indicator */}
        {message.isLoading && <LoadingDots />}

        {/* Error state */}
        {!message.isLoading && message.isError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <span className="mt-0.5 flex-shrink-0">⚠️</span>
            <div>
              <p>{message.content}</p>
              <p className="mt-1 text-xs text-red-500">Type your question again to retry.</p>
            </div>
          </div>
        )}

        {/* Normal reply */}
        {!message.isLoading && !message.isError && (
          <p className="text-sm leading-relaxed text-gray-800">{message.content}</p>
        )}

        {/* Car recommendation cards */}
        {!message.isLoading && !message.isError && message.recommendations && message.recommendations.length > 0 && (
          <RecommendationGrid
            cars={message.recommendations}
            shortlist={shortlist}
            onShortlistToggle={onShortlistToggle}
          />
        )}
      </div>
    </div>
  )
}
