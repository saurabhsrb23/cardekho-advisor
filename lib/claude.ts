import Anthropic from '@anthropic-ai/sdk'
import type { Car, ChatMessage, RecommendCarsToolInput } from '@/types'
import { toCompactContext } from './cars'

const client = new Anthropic()

// Structured output tool — forces Claude to return both a prose reply and
// typed car recommendations in a single API call.
const RECOMMEND_CARS_TOOL: Anthropic.Tool = {
  name: 'recommend_cars',
  description: 'Return a conversational reply and a ranked shortlist of car recommendations.',
  input_schema: {
    type: 'object' as const,
    properties: {
      reply: {
        type: 'string',
        description:
          '2–3 sentence conversational response. Ask ONE clarifying question if the query is too vague.',
      },
      recommendations: {
        type: 'array',
        description: 'Ranked list of 0–5 cars from the dataset that match the buyer\'s needs.',
        maxItems: 5,
        items: {
          type: 'object',
          properties: {
            carId: {
              type: 'integer',
              description: 'The id field from the car dataset.',
            },
            whyRecommended: {
              type: 'string',
              description:
                'One sentence explaining why this specific car fits this buyer\'s stated needs.',
            },
          },
          required: ['carId', 'whyRecommended'],
        },
      },
    },
    required: ['reply', 'recommendations'],
  },
}

function buildSystemPrompt(cars: Car[]): string {
  // TODO: build the full system prompt with car dataset
  // The car data is injected so Claude can reason over it without a retrieval step.
  throw new Error('Not implemented — build system prompt here')
}

/**
 * Calls Claude with the full conversation history and car dataset.
 * Returns the structured tool-use output (reply + recommendations).
 */
export async function chatWithClaude(
  history: ChatMessage[],
  userMessage: string,
  cars: Car[]
): Promise<RecommendCarsToolInput> {
  // TODO: implement
  // 1. Build system prompt with toCompactContext(cars)
  // 2. Map history to Anthropic message format
  // 3. Call client.messages.create with RECOMMEND_CARS_TOOL
  // 4. Extract and return the tool_use input block
  throw new Error('Not implemented')
}
