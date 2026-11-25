import { useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react'
import type { DocumentType } from '../store/quoteStore'

const DOCUMENT_TYPES: readonly DocumentType[] = ['DNI', 'RUC', 'CE', 'Pasaporte']

interface DocumentTypeSelectProps {
  value: DocumentType
  onChange: (value: DocumentType) => void
}

export default function DocumentTypeSelect({ value, onChange }: DocumentTypeSelectProps): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = DOCUMENT_TYPES.indexOf(value)

  const openMenu = (index: number): void => {
    setIsOpen(true)
    window.requestAnimationFrame(() => optionRefs.current[index]?.focus())
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false)
    }
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      openMenu((selectedIndex + direction + DOCUMENT_TYPES.length) % DOCUMENT_TYPES.length)
    }
  }

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const nextIndex = (index + direction + DOCUMENT_TYPES.length) % DOCUMENT_TYPES.length
      optionRefs.current[nextIndex]?.focus()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus()
    }
  }

  return <div className={`documentSelect${isOpen ? ' isOpen' : ''}`} onBlur={handleBlur}>
    <button
      ref={triggerRef}
      className="documentTypeTrigger"
      type="button"
      role="combobox"
      aria-label="Tipo de documento"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls="document-type-options"
      onClick={() => isOpen ? setIsOpen(false) : openMenu(selectedIndex)}
      onKeyDown={handleTriggerKeyDown}
    >
      <span>{value}</span>
      <svg className="selectChevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 8.5 7 7 7-7" /></svg>
    </button>
    {isOpen && <ul className="documentOptions" id="document-type-options" role="listbox" aria-label="Tipo de documento">
      {DOCUMENT_TYPES.map((type, index) => <li key={type} role="none">
        <button
          ref={(element) => { optionRefs.current[index] = element }}
          className="documentOption"
          type="button"
          role="option"
          aria-selected={value === type}
          onClick={() => { onChange(type); setIsOpen(false); triggerRef.current?.focus() }}
          onKeyDown={(event) => handleOptionKeyDown(event, index)}
        >
          {type}
        </button>
      </li>)}
    </ul>}
  </div>
}
