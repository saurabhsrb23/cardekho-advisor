import { NextRequest, NextResponse } from 'next/server'
import type { Car } from '@/types'

export async function GET(request: NextRequest) {
  // TODO: implement car retrieval with optional filters
  // Query params (all optional):
  //   ?ids=1,14,22          — fetch specific cars by ID (used by comparison page)
  //   ?bodyType=suv         — filter by body type
  //   ?fuelType=petrol      — filter by fuel type
  //   ?maxPrice=15          — filter by max price (in lakhs)
  //
  // If no params: return all cars (used by Claude system prompt builder)

  const _ids = request.nextUrl.searchParams.get('ids')
  const _bodyType = request.nextUrl.searchParams.get('bodyType')

  return NextResponse.json(
    { cars: [] } satisfies { cars: Car[] },
    { status: 501 }
  )
}
