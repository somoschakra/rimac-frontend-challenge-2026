import { describe, expect, it } from 'vitest'
import type { DocumentType } from '../store/quoteStore'
import { calculatePrice, documentValidators, validateInitialQuote, validatePhone } from './validation'

describe('document validation', () => {
  it.each([
    ['DNI', '12345678'],
    ['CE', 'AB123456'],
    ['RUC', '12345678'],
    ['Pasaporte', 'P1234567'],
  ] as const)('accepts a valid %s', (type, value) => {
    expect(documentValidators[type].validate(value)).toBeNull()
  })

  it('requires exactly eight numeric digits for a DNI', () => {
    expect(documentValidators.DNI.validate('1234567')).not.toBeNull()
    expect(documentValidators.DNI.validate('1234AB78')).not.toBeNull()
    expect(documentValidators.DNI.validate('')).not.toBeNull()
  })

  it.each(['CE', 'RUC', 'Pasaporte'] as const)('requires 8–10 alphanumeric characters for %s', (type: DocumentType) => {
    expect(documentValidators[type].validate('ABC1234')).not.toBeNull()
    expect(documentValidators[type].validate('ABC1234567')).toBeNull()
    expect(documentValidators[type].validate('ABC12345678')).not.toBeNull()
    expect(documentValidators[type].validate('ABC-12345')).not.toBeNull()
  })
})

describe('phone validation', () => {
  it('requires nine digits starting with 9', () => {
    expect(validatePhone('912345678')).toBeNull()
    expect(validatePhone('812345678')).not.toBeNull()
    expect(validatePhone('91234567')).not.toBeNull()
    expect(validatePhone('9123456780')).not.toBeNull()
    expect(validatePhone('')).not.toBeNull()
  })
})

describe('initial quote validation', () => {
  const validForm = {
    documentType: 'DNI' as const,
    documentNumber: '12345678',
    phone: '912345678',
    privacy: true,
    commercial: true,
  }

  it('requires every field and both consent checkboxes', () => {
    expect(validateInitialQuote({
      documentType: 'DNI',
      documentNumber: '',
      phone: '',
      privacy: false,
      commercial: false,
    })).toEqual({
      documentNumber: 'Este campo es obligatorio',
      phone: 'Este campo es obligatorio',
      privacy: 'Debes aceptar la Política de Privacidad',
      commercial: 'Debes aceptar la Política de Comunicaciones Comerciales',
    })
  })

  it('returns no errors when all fields are valid', () => {
    expect(Object.values(validateInitialQuote(validForm)).every((error) => !error)).toBe(true)
  })
})

describe('plan pricing', () => {
  it('applies a five percent discount only when quoting for someone else', () => {
    expect(calculatePrice(100, false)).toBe(100)
    expect(calculatePrice(100, true)).toBe(95)
  })
})
