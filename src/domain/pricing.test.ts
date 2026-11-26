import { describe, expect, it } from 'vitest'
import type { InsurancePlan } from './models'
import { calculatePrice, quotePlan } from './pricing'

describe('plan pricing strategy', () => {
  it('does not discount the price when quoting for yourself', () => {
    expect(calculatePrice(100, 'me')).toBe(100)
  })

  it('applies a five percent discount when quoting for someone else', () => {
    expect(calculatePrice(100, 'someone-else')).toBe(95)
  })

  it('creates a quoted plan without changing the source plan', () => {
    const plan: InsurancePlan = { name: 'Plan Base', price: 100, age: 60, description: [] }

    expect(quotePlan(plan, 'someone-else')).toEqual({ ...plan, quotedPrice: 95 })
    expect(plan.price).toBe(100)
  })
})
