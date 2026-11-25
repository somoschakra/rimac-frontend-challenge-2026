import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type View = 'home' | 'plans' | 'summary'
export type DocumentType = 'DNI' | 'RUC' | 'CE' | 'Pasaporte'
export type QuoteFor = 'me' | 'someone-else' | null

interface QuoteState {
  view: View
  documentType: DocumentType
  documentNumber: string
  phone: string
  privacy: boolean
  commercial: boolean
  quoteFor: QuoteFor
  selectedPlan: string | null
  setView: (view: View) => void
  setDocumentType: (type: DocumentType) => void
  setDocumentNumber: (value: string) => void
  setPhone: (value: string) => void
  setPrivacy: (value: boolean) => void
  setCommercial: (value: boolean) => void
  setQuoteFor: (value: QuoteFor) => void
  setSelectedPlan: (value: string) => void
  startQuote: () => void
  returnToPlans: () => void
}

export const useQuoteStore = create<QuoteState>()(persist((set) => ({
  view: 'home', documentType: 'DNI', documentNumber: '', phone: '',
  privacy: false, commercial: false, quoteFor: null, selectedPlan: null,
  setView: (view) => set({ view }), setDocumentType: (documentType) => set({ documentType }),
  setDocumentNumber: (documentNumber) => set({ documentNumber }), setPhone: (phone) => set({ phone }),
  setPrivacy: (privacy) => set({ privacy }), setCommercial: (commercial) => set({ commercial }),
  setQuoteFor: (quoteFor) => set({ quoteFor }), setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
  startQuote: () => set({ view: 'plans', quoteFor: null, selectedPlan: null }),
  returnToPlans: () => set({ view: 'plans', selectedPlan: null }),
}), { name: 'rimac-quote-flow' }))
