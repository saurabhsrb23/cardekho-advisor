import { prisma } from './db'
import type { Car } from '@/types'

// Deserializes the JSON string columns (pros, cons) back into string arrays
function deserializeCar(raw: {
  pros: string
  cons: string
  [key: string]: unknown
}): Car {
  return {
    ...(raw as Omit<Car, 'pros' | 'cons'>),
    pros: JSON.parse(raw.pros) as string[],
    cons: JSON.parse(raw.cons) as string[],
  }
}

export async function getAllCars(): Promise<Car[]> {
  const rows = await prisma.car.findMany({ orderBy: { id: 'asc' } })
  return rows.map(deserializeCar)
}

export async function getCarsByIds(ids: number[]): Promise<Car[]> {
  if (ids.length === 0) return []
  const rows = await prisma.car.findMany({
    where: { id: { in: ids } },
    orderBy: { id: 'asc' },
  })
  return rows.map(deserializeCar)
}

// Returns a compact representation used to build Claude's system prompt.
// Keeping this small (~150 tokens/car) ensures the full dataset fits in context.
export function toCompactContext(cars: Car[]): string {
  return JSON.stringify(
    cars.map((c) => ({
      id: c.id,
      name: `${c.make} ${c.model} ${c.variant}`,
      body: c.bodyType,
      fuel: c.fuelType,
      transmission: c.transmission,
      price: `₹${c.priceMinLakh}–${c.priceMaxLakh}L`,
      mileage: c.mileageKmpl ? `${c.mileageKmpl} kmpl` : 'EV',
      seats: c.seating,
      safety: c.safetyStars != null ? `${c.safetyStars}★` : 'unrated',
      pros: c.pros,
      cons: c.cons,
      bestFor: c.bestFor,
    }))
  )
}
