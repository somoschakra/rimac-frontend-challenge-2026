import { useQuery } from '@tanstack/react-query'
import { getPlans, getUser } from '../api/rimacApi'
import { calculatePrice } from '../domain/validation'
import { useQuoteStore } from '../store/quoteStore'
import Header from '../components/Header'
import BackButton from '../components/BackButton'
import familyIcon from '../assets/icons/gl_family-24x24.png'

export default function SummaryView(): React.ReactNode {
  const state = useQuoteStore()
  const user = useQuery({ queryKey: ['user'], queryFn: getUser })
  const plans = useQuery({ queryKey: ['plans'], queryFn: getPlans, enabled: user.isSuccess })
  const plan = plans.data?.find((item) => item.name === state.selectedPlan)
  const price = plan ? calculatePrice(plan.price, state.quoteFor === 'someone-else') : 0
  const fullName = user.data ? `${user.data.name} ${user.data.lastName}` : 'Rocío Miranda Díaz'
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
      <article className="summaryCard">
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
          <p>{plan?.name ?? state.selectedPlan}</p>
          <p>Costo del Plan: ${price % 1 === 0 ? price : price.toFixed(2)} al mes</p>
        </section>
      </article>
    </section>
  </main>
}
