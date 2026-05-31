'use client'

import { useState, useEffect } from 'react'
import type { UIMessage, ChatResponse, SessionData } from '@/types'
import { MessageThread } from './MessageThread'
import { ChatInput } from './ChatInput'
import { SuggestedPrompts } from './SuggestedPrompts'

const SESSION_KEY = 'ca_session_id'
const SHORTLIST_KEY = 'ca_shortlist'

export function ChatInterface() {
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [shortlist, setShortlist] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')

  // ── Session + shortlist init ───────────────────────────────────────────────
  useEffect(() => {
    // Restore shortlist synchronously — avoids flicker on card Save buttons
    const storedShortlist = localStorage.getItem(SHORTLIST_KEY)
    if (storedShortlist) {
      try { setShortlist(JSON.parse(storedShortlist) as number[]) } catch { /* ignore */ }
    }

    // Init session from server (creates new or restores existing)
    const storedId = localStorage.getItem(SESSION_KEY) ?? ''
    const url = storedId ? `/api/session?sessionId=${storedId}` : '/api/session'

    fetch(url)
      .then((r) => r.json() as Promise<SessionData>)
      .then((data) => {
        localStorage.setItem(SESSION_KEY, data.sessionId)
        setSessionId(data.sessionId)

        // Rebuild UI messages from history (text only on restore — no card re-fetch)
        if (data.messages.length > 0) {
          setMessages(
            data.messages.map((m) => ({
              id: String(m.id),
              role: m.role,
              content: m.content,
              // Car cards are not re-fetched on restore; user can ask again
            }))
          )
        }
      })
      .catch(() => {
        // If the session API is unreachable, generate a local fallback ID
        const fallback = globalThis.crypto.randomUUID()
        localStorage.setItem(SESSION_KEY, fallback)
        setSessionId(fallback)
      })
  }, [])

  // ── Send message ──────────────────────────────────────────────────────────
  async function handleSend(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading || !sessionId) return

    const loadingId = `loading-${Date.now()}`

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', content: trimmed },
      { id: loadingId, role: 'assistant', content: '', isLoading: true },
    ])
    setIsLoading(true)
    setInput('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: trimmed }),
      })

      if (!res.ok) {
        const err = (await res.json()) as { error?: string }
        throw new Error(err.error ?? `Request failed (${res.status})`)
      }

      const data: ChatResponse = await res.json()

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                id: loadingId,
                role: 'assistant' as const,
                content: data.reply,
                recommendations: data.recommendations.length > 0 ? data.recommendations : undefined,
              }
            : m
        )
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId ? { id: loadingId, role: 'assistant' as const, content: msg } : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ── Shortlist toggle ──────────────────────────────────────────────────────
  function handleShortlistToggle(carId: number) {
    setShortlist((prev) => {
      const isSaved = prev.includes(carId)
      const next = isSaved ? prev.filter((id) => id !== carId) : [...prev, carId]

      // Persist to localStorage immediately (source of truth for this page)
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next))

      // Fire-and-forget sync to DB — UI is already updated optimistically
      fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, carId, action: isSaved ? 'remove' : 'add' }),
      }).catch(console.error)

      return next
    })
  }

  const showSuggestions = messages.length === 0 && !isLoading

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚗</span>
          <span className="font-semibold text-gray-900">CarAdvisor</span>
          <span className="hidden text-xs text-gray-400 sm:inline">— AI car buying advisor</span>
        </div>
        <a
          href="/shortlist"
          className="flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          Shortlist
          {shortlist.length > 0 && (
            <span className="rounded-full bg-white px-1.5 text-xs font-bold text-brand-600">
              {shortlist.length}
            </span>
          )}
        </a>
      </header>

      {/* Main area */}
      <div className="flex-1 overflow-hidden">
        {showSuggestions ? (
          <SuggestedPrompts onSelect={handleSend} />
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
