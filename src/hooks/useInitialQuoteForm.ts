import { useState, type FormEvent } from 'react'
import { documentValidators, validatePhone } from '../domain/validation'
import { useQuoteStore } from '../store/quoteStore'

type FormField = 'documentNumber' | 'phone' | 'privacy' | 'commercial'
type FormErrors = Partial<Record<FormField, string>>

export function useInitialQuoteForm(): {
  getError: (field: FormField) => string | undefined
  touch: (field: FormField) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
} {
  const documentType = useQuoteStore((state) => state.documentType)
  const documentNumber = useQuoteStore((state) => state.documentNumber)
  const phone = useQuoteStore((state) => state.phone)
  const privacy = useQuoteStore((state) => state.privacy)
  const commercial = useQuoteStore((state) => state.commercial)
  const startQuote = useQuoteStore((state) => state.startQuote)
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors: FormErrors = {
    documentNumber: documentValidators[documentType].validate(documentNumber) ?? undefined,
    phone: validatePhone(phone) ?? undefined,
    privacy: privacy ? undefined : 'Debes aceptar la Política de Privacidad',
    commercial: commercial ? undefined : 'Debes aceptar la Política de Comunicaciones Comerciales',
  }

  const getError = (field: FormField): string | undefined =>
    (submitted || touched[field]) ? errors[field] : undefined

  const touch = (field: FormField): void => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.values(errors).every((error) => !error)) startQuote()
  }

  return { getError, touch, handleSubmit }
}
