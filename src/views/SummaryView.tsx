import { useQueryClient } from '@tanstack/react-query'
import { calculatePrice } from '../domain/validation'
import { useQuoteStore } from '../store/quoteStore'
import Header from '../components/Header'
import BackButton from '../components/BackButton'
import familyIcon from '../assets/icons/gl_family-24x24.png'
import type { RawPlan, RawUser } from '../api/rimacApi'

export default function SummaryView(): React.ReactNode {
  const state = useQuoteStore()
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData<RawUser>(['user'])
  const plans = queryClient.getQueryData<RawPlan[]>(['plans'])
  const plan = plans?.find((item) => item.name === state.selectedPlan)
  const price = plan ? calculatePrice(plan.price, state.quoteFor === 'someone-else') : null
  const fullName = user ? `${user.name} ${user.lastName}` : ''
  const documentLabel = `${state.documentType}: ${state.documentNumber}`

  return <main className="flowPage summaryPage">
    <Header onHome={() => state.setView('home')} />
    <nav className="stepper summaryStepper" aria-label="Progreso">
      <BackButton variant="mobile" onClick={state.returnToPlans} />
      <span className="mobileStepLabel">PASO 2 DE 2</span>
      <div className="mobileProgressBar complete" aria-hidden="true"><span /></div>
      <div className="stepProgress">
        <button type="button" onClick={state.returnToPlans} className="completed"><b>1</b> PLANES Y COBERTURAS</button>
        <i /><span className="active"><b>2</b> RESUMEN</span>
      </div>
    </nav>
    <section className="summarySection">
      <BackButton onClick={state.returnToPlans} />
      <h1>Resumen del seguro</h1>
      {(!user || !plan) && <section className="errorNotice" role="alert">
        <span className="errorNoticeIcon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8v5m0 3h.01M10.3 3.9 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
        <h2>{!user ? 'No encontramos los datos de tu cotización' : 'No encontramos el plan elegido'}</h2>
        <p>Vuelve a la pantalla de planes para cargar la información y seleccionar una opción.</p>
        <button className="errorNoticeButton" type="button" onClick={state.returnToPlans}>Volver a los planes</button>
      </section>}
      {user && plan && price !== null && <article className="summaryCard">
        <h2>PRECIOS CALCULADOS PARA:</h2>
        <div className="summaryPerson"><img src={familyIcon} width="32" height="32" alt="" /><strong>{fullName}</strong></div>
        <hr />
        <section className="summaryData">
          <h3>Responsable de pago</h3>
          <p>{documentLabel}</p>
          <p>Celular: {state.phone}</p>
        </section>
        <section className="summaryData">
          <h3>Plan elegido</h3>
          <p>{plan.name}</p>
          <p>Costo del Plan: ${price % 1 === 0 ? price : price.toFixed(2)} al mes</p>
        </section>
      </article>}
    </section>
  </main>
}
