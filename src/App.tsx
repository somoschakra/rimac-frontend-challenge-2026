import { lazy, Suspense, useDeferredValue, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useQuoteStore } from './store/quoteStore'
import { documentValidators } from './domain/validation'
import hero from './assets/hero.webp'
import Header from './components/Header'
import './styles/tokens.css'
import './App.css'

const PlansView = lazy(() => import('./views/PlansView'))
const SummaryView = lazy(() => import('./views/SummaryView'))
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 300000, retry: 1 } } })

function Home(): React.ReactNode {
  const state = useQuoteStore()
  const [touched, setTouched] = useState(false)
  const documentError = touched ? documentValidators[state.documentType].validate(state.documentNumber) : null
  const phoneError = touched && !/^9\d{8}$/.test(state.phone) ? 'Ingresa un celular válido' : null
  const submit = (): void => { setTouched(true); if (!documentError && !phoneError && state.privacy && state.commercial) state.startQuote() }
  return <main className="home">
    <Header />
    <section className="heroSection">
      <div className="heroCopy"><div className="mobileHero"><div><span className="badge">Seguro Salud Flexible</span><h1>Creado para ti y tu familia</h1></div><img src={hero} width="136" height="160" fetchPriority="high" alt="Familia protegiéndose con seguros Rímac" /></div><hr /><h2>Tú eliges cuánto pagar. Ingresa tus datos, cotiza y recibe nuestra asesoría. 100% online.</h2></div>
      <form className="quoteForm" noValidate onSubmit={(event) => { event.preventDefault(); submit() }}>
        <div className="fieldGroup documentGroup">
          <label className="fieldHeading" htmlFor="documentNumber">Documento</label>
          <div className="documentRow">
            <label className="documentSelect"><select value={state.documentType} aria-label="Tipo de documento" onChange={(e) => state.setDocumentType(e.target.value as typeof state.documentType)}><option>DNI</option><option>RUC</option><option>CE</option><option>Pasaporte</option></select></label>
            <label className="floating"><input id="documentNumber" value={state.documentNumber} inputMode="numeric" onChange={(e) => state.setDocumentNumber(e.target.value)} /></label>
          </div>
        </div>
        {documentError && <p className="error" role="alert">{documentError}</p>}
        <div className="fieldGroup phoneGroup">
          <label className="fieldHeading" htmlFor="phone">Celular</label>
          <label className="floating phoneInput"><input id="phone" value={state.phone} inputMode="numeric" onChange={(e) => state.setPhone(e.target.value)} /></label>
        </div>
        {phoneError && <p className="error" role="alert">{phoneError}</p>}
        <div className="check"><input id="privacyPolicy" name="policy" type="checkbox" checked={state.privacy} onChange={(e) => state.setPrivacy(e.target.checked)} /><label htmlFor="privacyPolicy"><span className="checkBox"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><polyline points="1.5 6 4.5 9 10.5 1" /></svg></span><span>Acepto la Política de Privacidad</span></label></div>
        <div className="check"><input id="commercialPolicy" name="commercialPolicy" type="checkbox" checked={state.commercial} onChange={(e) => state.setCommercial(e.target.checked)} /><label htmlFor="commercialPolicy"><span className="checkBox"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><polyline points="1.5 6 4.5 9 10.5 1" /></svg></span><span>Acepto la Política Comunicaciones Comerciales</span></label></div>
        <a className="terms" href="#"><b>Aplican Términos y Condiciones.</b></a><button className="primary" type="submit">Cotiza aquí</button>
      </form>
    </section>
    {/* <footer className="footer"><img src={logo} width="73" height="36" alt="Rimac" /><hr /><span>© 2023 RIMAC Seguros y Reaseguros.</span></footer> */}
  </main>
}

function AppInner(): React.ReactNode {
  const view = useQuoteStore((state) => state.view)
  const deferredView = useDeferredValue(view)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [view])

  if (deferredView === 'plans') return <Suspense fallback={<div className="loading" />}><PlansView /></Suspense>
  if (deferredView === 'summary') return <Suspense fallback={<div className="loading" />}><SummaryView /></Suspense>
  return <Home />
}
function App(): React.ReactNode { return <QueryClientProvider client={queryClient}><AppInner /></QueryClientProvider> }
export default App
