import { ChatInterface } from '@/components/chat/ChatInterface'

export default function HomePage() {
  return (
    <main className="flex h-full flex-col">
      {/* TODO: uncomment once ChatInterface is implemented */}
      {/* <ChatInterface /> */}

      {/* Placeholder — remove when ChatInterface is ready */}
      <div className="m-auto flex flex-col items-center gap-3 text-center">
        <span className="text-4xl">🚗</span>
        <h1 className="text-2xl font-semibold text-gray-800">CarAdvisor</h1>
        <p className="text-sm text-gray-500">
          AI-powered car buying advisor — scaffolding complete, implementation pending.
        </p>
      </div>
    </main>
  )
}
