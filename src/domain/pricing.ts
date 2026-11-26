import type { InsurancePlan, QuotedPlan } from './models'

export type QuoteTarget = 'me' | 'someone-else'

type PriceStrategy = (basePrice: number) => number

const priceStrategies: Record<QuoteTarget, PriceStrategy> = {
  me: (basePrice) => basePrice,
  'someone-else': (basePrice) => basePrice * 0.95,
}

export function calculatePrice(basePrice: number, target: QuoteTarget): number {
  return priceStrategies[target](basePrice)
}

export function quotePlan(plan: InsurancePlan, target: QuoteTarget): QuotedPlan {
  return { ...plan, quotedPrice: calculatePrice(plan.price, target) }
}
