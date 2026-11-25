import type { ReactNode } from 'react'

interface BackButtonProps {
  onClick: () => void
  variant?: 'desktop' | 'mobile'
}

export default function BackButton({ onClick, variant = 'desktop' }: BackButtonProps): ReactNode {
  if (variant === 'mobile') {
    return <button className="mobileBack" type="button" onClick={onClick} aria-label="Volver">
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="none" stroke="#A9AFD9" strokeWidth="2" />
        <path d="m12.971 15.904-3.907-3.904 3.907-3.904 1.058 1.058-2.843 2.846 2.843 2.846-1.058 1.058Z" fill="#A9AFD9" />
      </svg>
    </button>
  }

  return <button className="backButton" type="button" onClick={onClick}>
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
      <path d="M8.5 4.75 5.25 8l3.25 3.25M5.5 8h5" />
    </svg>
    <span>Volver</span>
  </button>
}
