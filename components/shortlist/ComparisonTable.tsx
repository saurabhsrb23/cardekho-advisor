'use client'

import type { Car } from '@/types'

interface ComparisonTableProps {
  cars: Car[]
  onRemove: (carId: number) => void
}

// Spec rows to display in the comparison table, in order
const SPEC_ROWS: { label: string; key: keyof Car; format?: (val: unknown) => string }[] = [
  { label: 'Price range', key: 'priceMinLakh', format: (_v) => '' }, // handled specially below
  { label: 'Body type', key: 'bodyType' },
  { label: 'Fuel type', key: 'fuelType' },
  { label: 'Transmission', key: 'transmission' },
  { label: 'Mileage', key: 'mileageKmpl', format: (v) => (v ? `${v} kmpl` : 'EV') },
  { label: 'Engine', key: 'engineCc', format: (v) => (v ? `${v} cc` : 'Electric') },
  { label: 'Power', key: 'powerBhp', format: (v) => `${v} bhp` },
  { label: 'Torque', key: 'torqueNm', format: (v) => `${v} Nm` },
  { label: 'Seating', key: 'seating', format: (v) => `${v} seats` },
  { label: 'Safety (NCAP)', key: 'safetyStars', format: (v) => (v != null ? `${v}/5 ★` : 'Unrated') },
  { label: 'Boot space', key: 'bootLitres', format: (v) => (v ? `${v}L` : '—') },
  { label: 'Ground clearance', key: 'groundClearanceMm', format: (v) => (v ? `${v} mm` : '—') },
]

export function ComparisonTable({ cars, onRemove }: ComparisonTableProps) {
  if (cars.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {/* Sticky spec-name column */}
            <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Spec
            </th>
            {cars.map((car) => (
              <th key={car.id} className="min-w-[160px] px-4 py-3 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {car.make} {car.model}
                    </p>
                    <p className="text-xs font-normal text-gray-500">{car.variant}</p>
                  </div>
                  <button
                    onClick={() => onRemove(car.id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label={`Remove ${car.make} ${car.model} from shortlist`}
                  >
                    ✕
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Price row — special case */}
          <tr className="border-b hover:bg-gray-50">
            <td className="sticky left-0 bg-white px-4 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50">
              Price range
            </td>
            {cars.map((car) => (
              <td key={car.id} className="px-4 py-2.5 font-semibold text-brand-600">
                ₹{car.priceMinLakh}–{car.priceMaxLakh}L
              </td>
            ))}
          </tr>

          {SPEC_ROWS.filter((r) => r.key !== 'priceMinLakh').map((row) => (
            <tr key={row.label} className="border-b hover:bg-gray-50">
              <td className="sticky left-0 bg-white px-4 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50">
                {row.label}
              </td>
              {cars.map((car) => {
                const raw = car[row.key]
                const display = row.format ? row.format(raw) : String(raw ?? '—')
                return (
                  <td key={car.id} className="px-4 py-2.5 text-gray-800">
                    {display || '—'}
                  </td>
                )
              })}
            </tr>
          ))}

          {/* Pros row */}
          <tr className="border-b hover:bg-gray-50">
            <td className="sticky left-0 bg-white px-4 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50">
              Pros
            </td>
            {cars.map((car) => (
              <td key={car.id} className="px-4 py-2.5">
                <ul className="space-y-0.5">
                  {car.pros.map((p) => (
                    <li key={p} className="flex items-start gap-1 text-xs text-green-700">
                      <span>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>

          {/* Cons row */}
          <tr className="hover:bg-gray-50">
            <td className="sticky left-0 bg-white px-4 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50">
              Cons
            </td>
            {cars.map((car) => (
              <td key={car.id} className="px-4 py-2.5">
                <ul className="space-y-0.5">
                  {car.cons.map((c) => (
                    <li key={c} className="flex items-start gap-1 text-xs text-red-600">
                      <span>✗</span> {c}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
