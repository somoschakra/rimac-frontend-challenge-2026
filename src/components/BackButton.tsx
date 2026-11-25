import type { ReactNode } from 'react'

interface BackButtonProps {
  onClick: () => void
}

export default function BackButton({ onClick }: BackButtonProps): ReactNode {
  return <button className="backButton" type="button" onClick={onClick}>
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
      <path d="M8.5 4.75 5.25 8l3.25 3.25M5.5 8h5" />
    </svg>
    <span>Volver</span>
  </button>
}
