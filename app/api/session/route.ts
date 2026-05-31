import { NextRequest, NextResponse } from 'next/server'
import type { SessionData } from '@/types'

export async function GET(request: NextRequest) {
  // TODO: implement session create / retrieve
  // Query param: ?sessionId=uuid  (optional — omit to create new)
  // 1. If sessionId provided, look it up in DB
  // 2. If found: update lastActiveAt, return session + last 20 messages
  // 3. If not found / not provided: create new session, return empty messages
  // 4. Map DB messages to ChatMessage[] (parse carIds JSON string → number[])

  const _sessionId = request.nextUrl.searchParams.get('sessionId')

  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
