import type { DocumentType } from '../store/quoteStore'

export interface DocumentValidator { validate(value: string): string | null }

const validateDni = (value: string): string | null => {
  if (!value.trim()) return 'Este campo es obligatorio'
  return /^\d{8}$/.test(value) ? null : 'Ingresa 8 dígitos numéricos para tu DNI'
}

const validateOtherDocument = (value: string, type: string): string | null => {
  if (!value.trim()) return 'Este campo es obligatorio'
  return /^[A-Za-z0-9]{8,10}$/.test(value) ? null : `Ingresa de 8 a 10 caracteres alfanuméricos para tu ${type}`
}

const dni: DocumentValidator = { validate: validateDni }
const ruc: DocumentValidator = { validate: (value) => validateOtherDocument(value, 'RUC') }
const ce: DocumentValidator = { validate: (value) => validateOtherDocument(value, 'CE') }
const passport: DocumentValidator = { validate: (value) => validateOtherDocument(value, 'pasaporte') }

export const documentValidators: Record<DocumentType, DocumentValidator> = { DNI: dni, CE: ce, RUC: ruc, Pasaporte: passport }
export const validatePhone = (value: string): string | null => {
  if (!value.trim()) return 'Este campo es obligatorio'
  return /^9\d{8}$/.test(value) ? null : 'Ingresa un celular de 9 dígitos que empiece con 9'
}
export const calculatePrice = (cost: number, forSomeoneElse: boolean): number => forSomeoneElse ? cost * 0.95 : cost
