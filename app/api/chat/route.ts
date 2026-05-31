import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAllCars, getCarsByIds } from '@/lib/cars'
import { chatWithClaude } from '@/lib/claude'
import type { ChatRequest, ChatResponse, ChatMessage } from '@/types'

export async function POST(request: NextRequest) {
  // ── 1. Parse and validate ────────────────────────────────────────────────
  let body: ChatRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { sessionId, message } = body

  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }

  const trimmedMessage = message.trim()

  // ── 2. Upsert session ────────────────────────────────────────────────────
  await prisma.session.upsert({
    where: { id: sessionId },
    create: { id: sessionId },
    update: { lastActiveAt: new Date() },
  })

  // ── 3. Load recent history for Claude context ────────────────────────────
  // Fetch last 40 rows (20 turns); lib/claude.ts slices to MAX_HISTORY_TURNS
  const dbMessages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
    take: 40,
  })

  const history: ChatMessage[] = dbMessages.reverse().map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    carIds: msg.carIds ? (JSON.parse(msg.carIds) as number[]) : null,
    createdAt: msg.createdAt.toISOString(),
  }))

  // ── 4. Fetch car dataset ─────────────────────────────────────────────────
  const cars = await getAllCars()

  // ── 5. Call Claude ───────────────────────────────────────────────────────
  let toolOutput
  try {
    toolOutput = await chatWithClaude(history, trimmedMessage, cars)
  } catch (err) {
    console.error('[/api/chat] Claude error:', err)
    return NextResponse.json(
      { error: 'AI service unavailable. Please try again.' },
      { status: 503 }
    )
  }

  const { reply, recommendations: rawRecs } = toolOutput

  // ── 6. Validate car IDs returned by Claude ───────────────────────────────
  // Claude may hallucinate IDs — only include ones that actually exist in DB
  const resolvedCars = await getCarsByIds(rawRecs.map((r) => r.carId))
  const carMap = new Map(resolvedCars.map((c) => [c.id, c]))

  const recommendations = rawRecs
    .filter((r) => carMap.has(r.carId))
    .map((r) => ({ ...carMap.get(r.carId)!, whyRecommended: r.whyRecommended }))

  // ── 7. Persist both messages ─────────────────────────────────────────────
  await prisma.message.createMany({
    data: [
      {
        sessionId,
        role: 'user',
        content: trimmedMessage,
        carIds: null,
      },
      {
        sessionId,
        role: 'assistant',
        content: reply,
        carIds:
          recommendations.length > 0
            ? JSON.stringify(recommendations.map((r) => r.id))
            : null,
      },
    ],
  })

  // ── 8. Return response ───────────────────────────────────────────────────
  return NextResponse.json({
    sessionId,
    reply,
    recommendations,
  } satisfies ChatResponse)
}
