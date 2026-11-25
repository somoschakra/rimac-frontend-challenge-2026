import type { ReactNode } from 'react'
import logo from '../assets/logo.png'
import phoneIcon from '../assets/icons/GlTelephoneSolid.png'

export interface HeaderProps {
  onHome?: () => void
}

export default function Header({ onHome }: HeaderProps): ReactNode {
  return <header className="header globalHeader">
    <a className="brand" href="#" aria-label="Rimac" onClick={(event) => { event.preventDefault(); onHome?.() }}>
      <img src={logo} width="73" height="36" alt="Rimac Seguros y Reaseguros" />
    </a>
    <a className="phone" href="tel:+514116001">
      <span className="phonePrompt">¡Compra por este medio!</span>
      <img src={phoneIcon} width="20" height="20" alt="" />
      <strong>(01) 411 6001</strong>
    </a>
  </header>
}
