import type { CarWithReason } from '@/types'
import { CarCard } from './CarCard'

interface RecommendationGridProps {
  cars: CarWithReason[]
  shortlist: number[]
  onShortlistToggle: (carId: number) => void
}

export function RecommendationGrid({ cars, shortlist, onShortlistToggle }: RecommendationGridProps) {
  if (cars.length === 0) return null

  return (
    <div
      className={`grid gap-3 ${
        cars.length === 1
          ? 'grid-cols-1 max-w-sm'
          : cars.length === 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          isSaved={shortlist.includes(car.id)}
          onSaveToggle={onShortlistToggle}
        />
      ))}
    </div>
  )
}
