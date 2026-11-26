import type { InsurancePlan } from './models'

export function calculateAge(birthDay: string, today: Date = new Date()): number | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(birthDay)
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const birthDate = new Date(year, month - 1, day)

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate > today
  ) return null

  let age = today.getFullYear() - year
  const birthdayHasNotOccurred =
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)

  if (birthdayHasNotOccurred) age -= 1
  return age
}

export function getEligiblePlans(plans: InsurancePlan[], userAge: number): InsurancePlan[] {
  return plans.filter((plan) => userAge <= plan.age)
}
