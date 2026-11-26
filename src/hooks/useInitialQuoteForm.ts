import { useState, type FormEvent } from 'react'
import { validateInitialQuote, type InitialQuoteField } from '../domain/validation'
import { useQuoteStore } from '../store/quoteStore'

export function useInitialQuoteForm(): {
  getError: (field: InitialQuoteField) => string | undefined
  touch: (field: InitialQuoteField) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
} {
  const documentType = useQuoteStore((state) => state.documentType)
  const documentNumber = useQuoteStore((state) => state.documentNumber)
  const phone = useQuoteStore((state) => state.phone)
  const privacy = useQuoteStore((state) => state.privacy)
  const commercial = useQuoteStore((state) => state.commercial)
  const startQuote = useQuoteStore((state) => state.startQuote)
  const [touched, setTouched] = useState<Partial<Record<InitialQuoteField, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validateInitialQuote({ documentType, documentNumber, phone, privacy, commercial })

  const getError = (field: InitialQuoteField): string | undefined =>
    (submitted || touched[field]) ? errors[field] : undefined

  const touch = (field: InitialQuoteField): void => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.values(errors).every((error) => !error)) startQuote()
  }

  return { getError, touch, handleSubmit }
}
