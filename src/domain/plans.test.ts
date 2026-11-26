import { describe, expect, it } from 'vitest'
import type { InsurancePlan } from './models'
import { calculateAge, getEligiblePlans } from './plans'

describe('calculateAge', () => {
  const today = new Date(2026, 10, 26)

  it('accounts for whether the birthday has passed this year', () => {
    expect(calculateAge('26-11-2000', today)).toBe(26)
    expect(calculateAge('27-11-2000', today)).toBe(25)
  })

  it.each(['31-02-2000', '2000-02-31', '27-11-2030'])('rejects invalid or future birth dates: %s', (birthDay) => {
    expect(calculateAge(birthDay, today)).toBeNull()
  })
})

describe('getEligiblePlans', () => {
  const plans: InsurancePlan[] = [
    { name: 'Plan 23', price: 100, description: [], age: 23 },
    { name: 'Plan 25', price: 120, description: [], age: 25 },
    { name: 'Plan 30', price: 150, description: [], age: 30 },
  ]

  it('includes plans whose maximum age equals or exceeds the user age', () => {
    expect(getEligiblePlans(plans, 25).map((plan) => plan.name)).toEqual(['Plan 25', 'Plan 30'])
  })
})
