import { calculateAge } from '../domain/plans'
import type { InsurancePlan, User } from '../domain/models'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item: unknown) => typeof item === 'string')
}

export function adaptUser(payload: unknown): User {
  if (
    !isRecord(payload) ||
    typeof payload.name !== 'string' ||
    typeof payload.lastName !== 'string' ||
    typeof payload.birthDay !== 'string' ||
    !payload.name.trim() ||
    !payload.lastName.trim() ||
    calculateAge(payload.birthDay) === null
  ) {
    throw new Error('La respuesta del servicio de usuario no tiene un formato válido')
  }

  return {
    name: payload.name,
    lastName: payload.lastName,
    birthDay: payload.birthDay,
  }
}

export function adaptPlans(payload: unknown): InsurancePlan[] {
  if (!isRecord(payload) || !Array.isArray(payload.list)) {
    throw new Error('La respuesta del servicio de planes no tiene un formato válido')
  }

  return payload.list.map((item, index) => {
    if (
      !isRecord(item) ||
      typeof item.name !== 'string' ||
      !item.name.trim() ||
      typeof item.price !== 'number' ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !isStringArray(item.description) ||
      typeof item.age !== 'number' ||
      !Number.isFinite(item.age) ||
      item.age < 0
    ) {
      throw new Error(`El plan ${index + 1} recibido del servicio no tiene un formato válido`)
    }

    return {
      name: item.name,
      price: item.price,
      description: item.description,
      age: item.age,
    }
  })
}
