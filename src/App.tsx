import { useDeferredValue, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useQuoteStore } from './store/quoteStore'
import { useInitialQuoteForm } from './hooks/useInitialQuoteForm'
import hero from './assets/hero.webp'
import Header from './components/Header'
import DocumentTypeSelect from './components/DocumentTypeSelect'
import ViewErrorBoundary from './components/ViewErrorBoundary'
import PlansView from './views/PlansView'
import SummaryView from './views/SummaryView'
import './styles/tokens.css'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
  },
})

function Home(): React.ReactNode {
  const state = useQuoteStore()
  const { getError, touch, handleSubmit } = useInitialQuoteForm()
  const documentError = getError('documentNumber')
  const phoneError = getError('phone')
  const privacyError = getError('privacy')
  const commercialError = getError('commercial')
  return <main className="home">
    <Header />
    <section className="heroSection">
      <div className="heroCopy"><div className="mobileHero"><div><span className="badge">Seguro Salud Flexible</span><h1>Creado para ti y tu familia</h1></div><img src={hero} width="136" height="160" fetchPriority="high" alt="Familia protegiéndose con seguros Rímac" /></div><hr /><h2>Tú eliges cuánto pagar. Ingresa tus datos, cotiza y recibe nuestra asesoría. 100% online.</h2></div>
      <form className="quoteForm" noValidate onSubmit={handleSubmit}>
        <div className="fieldGroup documentGroup">
          <label className="fieldHeading" htmlFor="documentNumber">Documento</label>
          <div className="documentRow">
            <DocumentTypeSelect value={state.documentType} onChange={state.setDocumentType} />
            <label className="floating"><input id="documentNumber" value={state.documentNumber} inputMode={state.documentType === 'DNI' ? 'numeric' : 'text'} maxLength={state.documentType === 'DNI' ? 8 : 10} required aria-invalid={Boolean(documentError)} aria-describedby={documentError ? 'documentNumber-error' : undefined} onBlur={() => touch('documentNumber')} onChange={(e) => state.setDocumentNumber(e.target.value)} /></label>
          </div>
        </div>
        {documentError && <p id="documentNumber-error" className="error" role="alert">{documentError}</p>}
        <div className="fieldGroup phoneGroup">
          <label className="fieldHeading" htmlFor="phone">Celular</label>
          <label className="floating phoneInput"><input id="phone" value={state.phone} inputMode="numeric" maxLength={9} required aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? 'phone-error' : undefined} onBlur={() => touch('phone')} onChange={(e) => state.setPhone(e.target.value)} /></label>
        </div>
        {phoneError && <p id="phone-error" className="error" role="alert">{phoneError}</p>}
        <div className="check"><input id="privacyPolicy" name="policy" type="checkbox" checked={state.privacy} required aria-invalid={Boolean(privacyError)} aria-describedby={privacyError ? 'privacyPolicy-error' : undefined} onBlur={() => touch('privacy')} onChange={(e) => state.setPrivacy(e.target.checked)} /><label htmlFor="privacyPolicy"><span className="checkBox"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><polyline points="1.5 6 4.5 9 10.5 1" /></svg></span><span>Acepto la Política de Privacidad</span></label></div>
        {privacyError && <p id="privacyPolicy-error" className="error" role="alert">{privacyError}</p>}
        <div className="check"><input id="commercialPolicy" name="commercialPolicy" type="checkbox" checked={state.commercial} required aria-invalid={Boolean(commercialError)} aria-describedby={commercialError ? 'commercialPolicy-error' : undefined} onBlur={() => touch('commercial')} onChange={(e) => state.setCommercial(e.target.checked)} /><label htmlFor="commercialPolicy"><span className="checkBox"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><polyline points="1.5 6 4.5 9 10.5 1" /></svg></span><span>Acepto la Política Comunicaciones Comerciales</span></label></div>
        {commercialError && <p id="commercialPolicy-error" className="error" role="alert">{commercialError}</p>}
        <a className="terms" href="#"><b>Aplican Términos y Condiciones.</b></a><button className="primary" type="submit">Cotiza aquí</button>
      </form>
    </section>
    {/* <footer className="footer"><img src={logo} width="73" height="36" alt="Rimac" /><hr /><span>© 2023 RIMAC Seguros y Reaseguros.</span></footer> */}
  </main>
}

function AppInner(): React.ReactNode {
  const view = useQuoteStore((state) => state.view)
  const setView = useQuoteStore((state) => state.setView)
  const deferredView = useDeferredValue(view)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [view])

  if (deferredView === 'plans') {
    return <ViewErrorBoundary key={deferredView} onGoHome={() => setView('home')}>
      <PlansView />
    </ViewErrorBoundary>
  }
  if (deferredView === 'summary') {
    return <ViewErrorBoundary key={deferredView} onGoHome={() => setView('home')}>
      <SummaryView />
    </ViewErrorBoundary>
  }
  return <ViewErrorBoundary key={deferredView} onGoHome={() => setView('home')}><Home /></ViewErrorBoundary>
}
function App(): React.ReactNode { return <QueryClientProvider client={queryClient}><AppInner /></QueryClientProvider> }
export default App
