import type { DocumentType } from '../store/quoteStore'

export interface DocumentValidator { validate(value: string): string | null }

export type InitialQuoteField = 'documentNumber' | 'phone' | 'privacy' | 'commercial'
export type InitialQuoteErrors = Partial<Record<InitialQuoteField, string>>

export interface InitialQuoteValues {
  documentType: DocumentType
  documentNumber: string
  phone: string
  privacy: boolean
  commercial: boolean
}

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

export const validateInitialQuote = ({
  documentType,
  documentNumber,
  phone,
  privacy,
  commercial,
}: InitialQuoteValues): InitialQuoteErrors => ({
  documentNumber: documentValidators[documentType].validate(documentNumber) ?? undefined,
  phone: validatePhone(phone) ?? undefined,
  privacy: privacy ? undefined : 'Debes aceptar la Política de Privacidad',
  commercial: commercial ? undefined : 'Debes aceptar la Política de Comunicaciones Comerciales',
})

export const calculatePrice = (cost: number, forSomeoneElse: boolean): number => forSomeoneElse ? cost * 0.95 : cost
