import { adaptPlans, adaptUser } from '../adapters/domainAdapters'
import type { InsurancePlan, User } from '../domain/models'

const BASE = 'https://rimac-front-end-challenge.netlify.app/api'

export async function getUser(signal?: AbortSignal): Promise<User> {
  const response = await fetch(`${BASE}/user.json`, { signal })
  if (!response.ok) throw new Error('No pudimos obtener tus datos')
  const payload: unknown = await response.json()
  return adaptUser(payload)
}

export async function getPlans(signal?: AbortSignal): Promise<InsurancePlan[]> {
  const response = await fetch(`${BASE}/plans.json`, { signal })
  if (!response.ok) throw new Error('No pudimos obtener los planes')
  const payload: unknown = await response.json()
  return adaptPlans(payload)
}
