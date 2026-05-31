interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
}

const SUGGESTED_PROMPTS = [
  'Family SUV under ₹15 lakhs with good mileage',
  'Best hatchback for daily city commute, budget ₹7–9 lakhs',
  'First car for a new driver, safe and easy to maintain',
]

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-4">
      {/* Hero */}
      <div className="text-center">
        <div className="mb-3 text-5xl">🚗</div>
        <h2 className="text-2xl font-semibold text-gray-900">Find your perfect car</h2>
        <p className="mt-2 text-sm text-gray-500">
          Tell me what you need — budget, use case, family size. I&apos;ll build your shortlist.
        </p>
      </div>

      {/* Starter prompts */}
      <div className="flex w-full max-w-lg flex-col gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-sm transition hover:border-brand-500 hover:text-brand-700"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
