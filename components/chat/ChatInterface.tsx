'use client'

import { useState, useEffect } from 'react'
import type { UIMessage } from '@/types'
import { MessageThread } from './MessageThread'
import { ChatInput } from './ChatInput'
import { SuggestedPrompts } from './SuggestedPrompts'

// Top-level stateful component — owns all chat + shortlist state for the page.
// Runs entirely on the client; data is fetched via API routes.
export function ChatInterface() {
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [shortlist, setShortlist] = useState<number[]>([])  // persisted car IDs
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')

  useEffect(() => {
    // TODO: on mount —
    // 1. Read sessionId from localStorage (key: 'ca_session_id')
    // 2. Call GET /api/session?sessionId=... to create/restore session
    // 3. Read shortlist from localStorage (key: 'ca_shortlist')
    // 4. Hydrate messages + shortlist state from the response
  }, [])

  async function handleSend(text: string) {
    // TODO:
    // 1. Optimistically append user message to messages[]
    // 2. Append loading placeholder to messages[]
    // 3. POST /api/chat with { sessionId, message: text }
    // 4. Replace loading placeholder with real assistant message + recommendations
    // 5. Handle API errors gracefully
    console.log('TODO: send', text)
  }

  function handleShortlistToggle(carId: number) {
    // TODO:
    // 1. Determine action (add/remove based on current shortlist state)
    // 2. Optimistically update local shortlist state
    // 3. POST /api/shortlist with { sessionId, carId, action }
    // 4. Sync localStorage
    // 5. Roll back on error
    console.log('TODO: toggle shortlist for car', carId)
  }

  const showSuggestions = messages.length === 0 && !isLoading

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚗</span>
          <span className="font-semibold text-gray-900">CarAdvisor</span>
        </div>
        <a
          href="/shortlist"
          className="flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          Shortlist
          {shortlist.length > 0 && (
            <span className="rounded-full bg-white px-1.5 text-xs font-bold text-brand-600">
              {shortlist.length}
            </span>
          )}
        </a>
      </header>

      {/* Message thread */}
      <div className="flex-1 overflow-hidden">
        {showSuggestions ? (
          <SuggestedPrompts onSelect={(prompt) => handleSend(prompt)} />
        ) : (
          <MessageThread
            messages={messages}
            shortlist={shortlist}
            onShortlistToggle={handleShortlistToggle}
          />
        )}
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  )
}
