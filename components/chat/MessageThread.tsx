'use client'

import { useEffect, useRef } from 'react'
import type { UIMessage } from '@/types'
import { UserBubble } from './UserBubble'
import { AIMessage } from './AIMessage'

interface MessageThreadProps {
  messages: UIMessage[]
  shortlist: number[]
  onShortlistToggle: (carId: number) => void
}

export function MessageThread({ messages, shortlist, onShortlistToggle }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="scrollbar-thin h-full overflow-y-auto px-4 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <UserBubble key={msg.id} content={msg.content} />
          ) : (
            <AIMessage
              key={msg.id}
              message={msg}
              shortlist={shortlist}
              onShortlistToggle={onShortlistToggle}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
