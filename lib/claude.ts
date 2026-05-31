import Anthropic from '@anthropic-ai/sdk'
import type { Car, ChatMessage, RecommendCarsToolInput } from '@/types'
import { toCompactContext } from './cars'

const client = new Anthropic()

const MODEL = 'claude-sonnet-4-6'

// Max conversation turns to send — keeps token usage bounded
const MAX_HISTORY_TURNS = 10

// ─── Tool definition ──────────────────────────────────────────────────────────
// Forces Claude to always return both a prose reply AND structured car IDs.
// Using tool_choice "any" means Claude must call this tool on every turn.

const RECOMMEND_CARS_TOOL: Anthropic.Tool = {
  name: 'recommend_cars',
  description:
    'Always call this tool to respond. Return a conversational reply and a ranked shortlist of car recommendations from the dataset.',
  input_schema: {
    type: 'object' as const,
    properties: {
      reply: {
        type: 'string',
        description:
          '2–3 sentence conversational response to the user. If the query is too vague, ask ONE specific clarifying question and return an empty recommendations array.',
      },
      recommendations: {
        type: 'array',
        description:
          'Ranked list of 0–5 cars from the dataset that best match the buyer\'s stated needs. Return empty array [] when asking a clarifying question.',
        maxItems: 5,
        items: {
          type: 'object',
          properties: {
            carId: {
              type: 'integer',
              description: 'The numeric id field from the car dataset.',
            },
            whyRecommended: {
              type: 'string',
              description:
                'One specific sentence explaining why this car fits THIS buyer\'s stated needs.',
            },
          },
          required: ['carId', 'whyRecommended'],
        },
      },
    },
    required: ['reply', 'recommendations'],
  },
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(cars: Car[]): string {
  return `You are an expert car buying advisor for the Indian market. Your job is to help confused buyers confidently shortlist the right car.

RULES:
1. Always call the recommend_cars tool — never reply in plain text only.
2. Only recommend cars from the dataset below. Never invent cars.
3. If no car matches well, say so honestly and suggest the closest option.
4. If the query is too vague (e.g. "show me cars"), ask ONE focused clarifying question — budget, use case, or fuel preference.
5. Keep your reply conversational (2–3 sentences max). Let the car cards provide the detail.
6. When the user says "only diesel" or "under 10 lakhs", re-filter your previous answer — do not start from scratch.
7. Safety ratings are NCAP stars (1–5). Null means untested, not unsafe.
8. EV mileage is listed as null — mention range in km instead.

CAR DATASET (${cars.length} cars):
${toCompactContext(cars)}`
}

// ─── History mapper ───────────────────────────────────────────────────────────
// Converts DB ChatMessage[] → Anthropic MessageParam[].
// Keeps only the last N turns to stay within context budget.

function toAnthropicHistory(history: ChatMessage[]): Anthropic.MessageParam[] {
  const recent = history.slice(-MAX_HISTORY_TURNS * 2)

  return recent.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function chatWithClaude(
  history: ChatMessage[],
  userMessage: string,
  cars: Car[]
): Promise<RecommendCarsToolInput> {
  const messages: Anthropic.MessageParam[] = [
    ...toAnthropicHistory(history),
    { role: 'user', content: userMessage },
  ]

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(cars),
    tools: [RECOMMEND_CARS_TOOL],
    // Force Claude to always call the tool — no free-text fallback
    tool_choice: { type: 'any' },
    messages,
  })

  // Extract the tool_use block from the response
  const toolUseBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
  )

  if (!toolUseBlock) {
    // Fallback: extract any text content and wrap it
    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )
    return {
      reply: textBlock?.text ?? 'Sorry, I could not process that. Please try again.',
      recommendations: [],
    }
  }

  return toolUseBlock.input as RecommendCarsToolInput
}
