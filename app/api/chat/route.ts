import { NextRequest, NextResponse } from 'next/server'
import type { ChatRequest, ChatResponse } from '@/types'

export async function POST(request: NextRequest) {
  // TODO: implement full pipeline
  // 1. Parse + validate body: { sessionId, message }
  // 2. Upsert session (create if new, update lastActiveAt if existing)
  // 3. Load last 10 messages for this session from DB
  // 4. Fetch all cars via getAllCars()
  // 5. Call chatWithClaude(history, message, cars)
  // 6. Resolve carIds from Claude's response against the DB (validate they exist)
  // 7. Persist user message + assistant message (with carIds) to messages table
  // 8. Return ChatResponse

  const _body: ChatRequest = await request.json()

  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
