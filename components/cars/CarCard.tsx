import type { CarWithReason } from '@/types'

interface CarCardProps {
  car: CarWithReason
  isSaved: boolean
  onSaveToggle: (carId: number) => void
}

function SafetyStars({ stars }: { stars: number | null }) {
  if (stars === null) return <span className="text-xs text-gray-400">Unrated</span>
  return (
    <span className="text-xs text-yellow-500" aria-label={`${stars} out of 5 NCAP stars`}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
    </span>
  )
}

export function CarCard({ car, isSaved, onSaveToggle }: CarCardProps) {
  const priceLabel =
    car.priceMinLakh === car.priceMaxLakh
      ? `₹${car.priceMinLakh}L`
      : `₹${car.priceMinLakh}–${car.priceMaxLakh}L`

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">
            {car.make} {car.model}
          </p>
          <p className="text-xs text-gray-500">{car.variant}</p>
        </div>
        <span className="whitespace-nowrap text-sm font-semibold text-brand-600">{priceLabel}</span>
      </div>

      {/* Key specs row */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
        <span>{car.fuelType} · {car.transmission}</span>
        <span>{car.seating} seats</span>
        {car.mileageKmpl ? (
          <span>{car.mileageKmpl} kmpl</span>
        ) : (
          <span className="text-green-600">Electric</span>
        )}
        <span><SafetyStars stars={car.safetyStars} /></span>
      </div>

      {/* Why recommended */}
      <p className="text-xs italic text-gray-500">&ldquo;{car.whyRecommended}&rdquo;</p>

      {/* Pros */}
      <ul className="space-y-0.5">
        {car.pros.slice(0, 2).map((pro) => (
          <li key={pro} className="flex items-center gap-1 text-xs text-green-700">
            <span>✓</span> {pro}
          </li>
        ))}
      </ul>

      {/* Save button */}
      <button
        onClick={() => onSaveToggle(car.id)}
        className={`mt-auto w-full rounded-lg py-2 text-xs font-medium transition ${
          isSaved
            ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-pressed={isSaved}
      >
        {isSaved ? '✓ Saved to shortlist' : '+ Save to shortlist'}
      </button>
    </div>
  )
}
