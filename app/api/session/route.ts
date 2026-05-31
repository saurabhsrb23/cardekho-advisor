import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/db'
import type { SessionData, ChatMessage } from '@/types'

// Converts a Prisma message row to the shared ChatMessage shape
function toClientMessage(msg: {
  id: number
  role: string
  content: string
  carIds: string | null
  createdAt: Date
}): ChatMessage {
  return {
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    carIds: msg.carIds ? (JSON.parse(msg.carIds) as number[]) : null,
    createdAt: msg.createdAt.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId')

  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 50, // return last 50 messages for chat history rendering
        },
      },
    })

    if (session) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { lastActiveAt: new Date() },
      })

      // reverse so messages are oldest-first for the UI
      const messages = session.messages.reverse().map(toClientMessage)

      return NextResponse.json({ sessionId, messages } satisfies SessionData)
    }
  }

  // No sessionId provided, or ID not found — create a fresh session
  const newId = uuidv4()
  await prisma.session.create({ data: { id: newId } })

  return NextResponse.json({ sessionId: newId, messages: [] } satisfies SessionData)
}
