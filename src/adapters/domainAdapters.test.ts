import { describe, expect, it } from 'vitest'
import { adaptPlans, adaptUser } from './domainAdapters'

describe('adaptUser', () => {
  it('maps a valid API payload to the user domain model', () => {
    expect(adaptUser({ name: 'Rocío', lastName: 'Miranda', birthDay: '01-01-1990' })).toEqual({
      name: 'Rocío',
      lastName: 'Miranda',
      birthDay: '01-01-1990',
    })
  })

  it('rejects incomplete or malformed API payloads', () => {
    expect(() => adaptUser({ name: 'Rocío' })).toThrow('formato válido')
    expect(() => adaptUser({ name: 'Rocío', lastName: 'Miranda', birthDay: 'fecha' })).toThrow('formato válido')
  })
})

describe('adaptPlans', () => {
  it('maps valid plan data from the API list', () => {
    expect(adaptPlans({
      list: [{ name: 'Plan Base', price: 100, description: ['Atención médica'], age: 60 }],
    })).toEqual([{ name: 'Plan Base', price: 100, description: ['Atención médica'], age: 60 }])
  })

  it('rejects invalid plan data instead of returning incomplete plans', () => {
    expect(() => adaptPlans({})).toThrow('formato válido')
    expect(() => adaptPlans({ list: [{ name: 'Plan Base', price: -1, description: [], age: 60 }] })).toThrow('formato válido')
  })
})
