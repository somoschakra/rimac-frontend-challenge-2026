import { useQueryClient } from '@tanstack/react-query'
import { quotePlan } from '../domain/pricing'
import { useQuoteStore } from '../store/quoteStore'
import Header from '../components/Header'
import BackButton from '../components/BackButton'
import familyIcon from '../assets/icons/gl_family-24x24.png'
import type { InsurancePlan, User } from '../domain/models'

export default function SummaryView(): React.ReactNode {
  const documentType = useQuoteStore((state) => state.documentType)
  const documentNumber = useQuoteStore((state) => state.documentNumber)
  const phone = useQuoteStore((state) => state.phone)
  const quoteFor = useQuoteStore((state) => state.quoteFor)
  const selectedPlan = useQuoteStore((state) => state.selectedPlan)
  const setView = useQuoteStore((state) => state.setView)
  const returnToPlans = useQuoteStore((state) => state.returnToPlans)
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData<User>(['user'])
  const plans = queryClient.getQueryData<InsurancePlan[]>(['plans'])
  const plan = plans?.find((item) => item.name === selectedPlan)
  const quotedPlan = plan ? quotePlan(plan, quoteFor === 'someone-else' ? 'someone-else' : 'me') : null
  const fullName = user ? `${user.name} ${user.lastName}` : ''
  const documentLabel = `${documentType}: ${documentNumber}`

  return <main className="flowPage summaryPage">
    <Header onHome={() => setView('home')} />
    <nav className="stepper summaryStepper" aria-label="Progreso">
      <BackButton variant="mobile" onClick={returnToPlans} />
      <span className="mobileStepLabel">PASO 2 DE 2</span>
      <div className="mobileProgressBar complete" aria-hidden="true"><span /></div>
      <div className="stepProgress">
        <button type="button" onClick={returnToPlans} className="completed"><b>1</b> PLANES Y COBERTURAS</button>
        <i /><span className="active"><b>2</b> RESUMEN</span>
      </div>
    </nav>
    <section className="summarySection">
      <BackButton onClick={returnToPlans} />
      <h1>Resumen del seguro</h1>
      {(!user || !plan) && <section className="errorNotice" role="alert">
        <span className="errorNoticeIcon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8v5m0 3h.01M10.3 3.9 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
        <h2>{!user ? 'No encontramos los datos de tu cotización' : 'No encontramos el plan elegido'}</h2>
        <p>Vuelve a la pantalla de planes para cargar la información y seleccionar una opción.</p>
        <button className="errorNoticeButton" type="button" onClick={returnToPlans}>Volver a los planes</button>
      </section>}
      {user && quotedPlan && <article className="summaryCard">
        <h2>PRECIOS CALCULADOS PARA:</h2>
        <div className="summaryPerson"><img src={familyIcon} width="32" height="32" alt="" /><strong>{fullName}</strong></div>
        <hr />
        <section className="summaryData">
          <h3>Responsable de pago</h3>
          <p>{documentLabel}</p>
          <p>Celular: {phone}</p>
        </section>
        <section className="summaryData">
          <h3>Plan elegido</h3>
          <p>{quotedPlan.name}</p>
          <p>Costo del Plan: ${quotedPlan.quotedPrice % 1 === 0 ? quotedPlan.quotedPrice : quotedPlan.quotedPrice.toFixed(2)} al mes</p>
        </section>
      </article>}
    </section>
  </main>
}
