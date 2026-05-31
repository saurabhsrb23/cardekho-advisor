import { NextRequest, NextResponse } from 'next/server'
import { getAllCars, getCarsByIds } from '@/lib/cars'

// GET /api/cars
// ?ids=1,14,22   — fetch specific cars (used by comparison page if needed)
// no params      — return all cars
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids')

  if (idsParam) {
    const ids = idsParam
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0)

    if (ids.length === 0) {
      return NextResponse.json({ error: 'ids must be comma-separated positive integers' }, { status: 400 })
    }

    const cars = await getCarsByIds(ids)
    return NextResponse.json({ cars })
  }

  const cars = await getAllCars()
  return NextResponse.json({ cars })
}
