const BASE = 'https://rimac-front-end-challenge.netlify.app/api'

export interface RawUser { name: string; lastName: string; birthDay: string }
export interface RawPlan { name: string; price: number; description: string[]; age: number }

export async function getUser(): Promise<RawUser> {
  const response = await fetch(`${BASE}/user.json`)
  if (!response.ok) throw new Error('No pudimos obtener tus datos')
  return response.json() as Promise<RawUser>
}

export async function getPlans(): Promise<RawPlan[]> {
  const response = await fetch(`${BASE}/plans.json`)
  if (!response.ok) throw new Error('No pudimos obtener los planes')
  const data = await response.json() as { list: RawPlan[] }
  return data.list
}
