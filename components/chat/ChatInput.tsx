'use client'

import { KeyboardEvent } from 'react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Send on Enter, allow Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    onChange('')
  }

  return (
    <div className="border-t bg-white px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-end gap-2">
        <textarea
          className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
          rows={1}
          placeholder="e.g. Family SUV under ₹15 lakhs, good mileage…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <button
          onClick={submit}
          disabled={!value.trim() || isLoading}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600 disabled:opacity-40"
          aria-label="Send message"
        >
          {/* Arrow icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <p className="mt-1.5 text-center text-xs text-gray-400">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
