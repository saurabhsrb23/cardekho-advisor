import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCarsByIds } from '@/lib/cars'
import type { ShortlistActionRequest, ShortlistActionResponse, ShortlistDetailResponse } from '@/types'

// GET /api/shortlist?sessionId=uuid
// Returns full car objects for the session's saved shortlist
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const items = await prisma.shortlistItem.findMany({
    where: { sessionId },
    orderBy: { addedAt: 'asc' },
    select: { carId: true },
  })

  const cars = await getCarsByIds(items.map((i) => i.carId))

  return NextResponse.json({ cars } satisfies ShortlistDetailResponse)
}

// POST /api/shortlist
// Body: { sessionId, carId, action: "add" | "remove" }
export async function POST(request: NextRequest) {
  let body: ShortlistActionRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { sessionId, carId, action } = body

  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }
  if (!carId || typeof carId !== 'number') {
    return NextResponse.json({ error: 'carId must be a number' }, { status: 400 })
  }
  if (action !== 'add' && action !== 'remove') {
    return NextResponse.json({ error: 'action must be "add" or "remove"' }, { status: 400 })
  }

  // Ensure the session exists (upsert silently handles first-time adds)
  await prisma.session.upsert({
    where: { id: sessionId },
    create: { id: sessionId },
    update: {},
  })

  if (action === 'add') {
    // upsert — @@unique([sessionId, carId]) prevents duplicates
    await prisma.shortlistItem.upsert({
      where: { sessionId_carId: { sessionId, carId } },
      create: { sessionId, carId },
      update: {}, // already exists — no-op
    })
  } else {
    await prisma.shortlistItem.deleteMany({
      where: { sessionId, carId },
    })
  }

  // Return updated list of IDs for this session
  const remaining = await prisma.shortlistItem.findMany({
    where: { sessionId },
    orderBy: { addedAt: 'asc' },
    select: { carId: true },
  })

  const shortlist = remaining.map((i) => i.carId)

  return NextResponse.json({
    shortlist,
    count: shortlist.length,
  } satisfies ShortlistActionResponse)
}
