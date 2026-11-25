import type { DocumentType } from '../store/quoteStore'

export interface DocumentValidator { validate(value: string): string | null }

const dni: DocumentValidator = { validate: (value) => /^\d{8}$/.test(value) ? null : 'Ingresa 8 dígitos para tu DNI' }
const ce: DocumentValidator = { validate: (value) => /^[A-Za-z0-9]{9,12}$/.test(value) ? null : 'Ingresa un CE válido' }
const ruc: DocumentValidator = { validate: (value) => /^\d{11}$/.test(value) ? null : 'Ingresa 11 dígitos para tu RUC' }
const passport: DocumentValidator = { validate: (value) => /^[A-Za-z0-9]{6,12}$/.test(value) ? null : 'Ingresa un pasaporte válido' }

export const documentValidators: Record<DocumentType, DocumentValidator> = { DNI: dni, CE: ce, RUC: ruc, Pasaporte: passport }
export const calculatePrice = (cost: number, forSomeoneElse: boolean): number => forSomeoneElse ? cost * 0.95 : cost
