// ─── Domain enums ─────────────────────────────────────────────────────────────

export type BodyType = 'hatchback' | 'sedan' | 'suv' | 'muv' | 'electric' | 'luxury'
export type FuelType = 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid'
export type Transmission = 'manual' | 'automatic' | 'amt' | 'cvt' | 'dct'
export type MessageRole = 'user' | 'assistant'

// ─── Car ──────────────────────────────────────────────────────────────────────

export interface Car {
  id: number
  make: string
  model: string
  variant: string
  bodyType: BodyType
  fuelType: FuelType
  transmission: Transmission
  priceMinLakh: number
  priceMaxLakh: number
  mileageKmpl: number | null  // null for EVs
  engineCc: number | null     // null for EVs
  powerBhp: number
  torqueNm: number
  seating: number
  safetyStars: number | null  // NCAP 0–5, null if untested
  bootLitres: number | null
  groundClearanceMm: number | null
  pros: string[]              // parsed from JSON string in DB
  cons: string[]              // parsed from JSON string in DB
  bestFor: string
}

// A car with an attached recommendation reason from Claude
export type CarWithReason = Car & { whyRecommended: string }

// ─── Session / Chat ───────────────────────────────────────────────────────────

export interface ChatMessage {
  id: number
  role: MessageRole
  content: string
  carIds: number[] | null  // recommended car IDs attached to assistant messages
  createdAt: string        // ISO 8601
}

export interface SessionData {
  sessionId: string
  messages: ChatMessage[]
}

// ─── API request / response shapes ───────────────────────────────────────────

export interface ChatRequest {
  sessionId: string
  message: string
}

export interface ChatResponse {
  sessionId: string
  reply: string
  recommendations: CarWithReason[]
}

export interface ShortlistActionRequest {
  sessionId: string
  carId: number
  action: 'add' | 'remove'
}

export interface ShortlistActionResponse {
  shortlist: number[]  // all current car IDs for this session
  count: number
}

export interface ShortlistDetailResponse {
  cars: Car[]
}

// ─── Claude tool-use types ────────────────────────────────────────────────────

export interface CarRecommendation {
  carId: number
  whyRecommended: string
}

export interface RecommendCarsToolInput {
  reply: string
  recommendations: CarRecommendation[]
}

// ─── UI state ─────────────────────────────────────────────────────────────────

export interface UIMessage {
  id: string                          // client-side UUID
  role: MessageRole
  content: string
  recommendations?: CarWithReason[]   // present on assistant messages that include cars
  isLoading?: boolean                 // true while the API call is in flight
  isError?: boolean                   // true when the API call failed
}
