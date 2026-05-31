import { NextRequest, NextResponse } from 'next/server'
import type { ShortlistActionRequest, ShortlistActionResponse, ShortlistDetailResponse } from '@/types'

export async function GET(request: NextRequest) {
  // TODO: return full car objects for the session's shortlist
  // Query param: ?sessionId=uuid
  // 1. Validate sessionId
  // 2. Fetch ShortlistItems for this session, joined with Car
  // 3. Deserialize pros/cons JSON → string[]
  // 4. Return { cars: Car[] }

  const _sessionId = request.nextUrl.searchParams.get('sessionId')

  return NextResponse.json(
    { cars: [] } satisfies ShortlistDetailResponse,
    { status: 501 }
  )
}

export async function POST(request: NextRequest) {
  // TODO: add or remove a car from the shortlist
  // Body: { sessionId, carId, action: "add" | "remove" }
  // 1. Validate body
  // 2. If action === "add": upsert ShortlistItem (@@unique handles duplicates)
  // 3. If action === "remove": delete ShortlistItem where sessionId+carId match
  // 4. Return updated shortlist IDs + count

  const _body: ShortlistActionRequest = await request.json()

  return NextResponse.json(
    { shortlist: [], count: 0 } satisfies ShortlistActionResponse,
    { status: 501 }
  )
}
