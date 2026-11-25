import type { RawUser, RawPlan } from '../api/rimacApi'

export interface User { name: string; lastName: string; birthDay: string }
export interface InsurancePlan { name: string; price: number; description: string[]; age: number }

export const adaptUser = (raw: RawUser): User => ({ name: raw.name, lastName: raw.lastName, birthDay: raw.birthDay })
export const adaptPlans = (raw: RawPlan[]): InsurancePlan[] => raw.map((plan) => ({ name: plan.name, price: plan.price, description: plan.description, age: plan.age }))
