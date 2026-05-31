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
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm text-white">
        AI
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {/* Prose reply or loading indicator */}
        {message.isLoading ? (
          <LoadingDots />
        ) : (
          <p className="text-sm leading-relaxed text-gray-800">{message.content}</p>
        )}

        {/* Inline car recommendation cards */}
        {!message.isLoading && message.recommendations && message.recommendations.length > 0 && (
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
