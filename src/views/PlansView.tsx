import { memo, useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPlans, getUser } from '../api/rimacApi'
import { calculatePrice } from '../domain/validation'
import { useQuoteStore } from '../store/quoteStore'
import protectionIcon from '../assets/icons/IcProtectionLight.png'
import addUserIcon from '../assets/icons/IcAddUserLight.png'
import hospitalIcon from '../assets/icons/IcHospitalLight.png'
import Header from '../components/Header'
import BackButton from '../components/BackButton'

const PlanCard = memo(function PlanCard({ plan, selected, onSelect }: { plan: { name: string; price: number; description: string[] }; selected: boolean; onSelect: () => void }) {
  const icon = plan.name.includes('Clínica') ? hospitalIcon : protectionIcon
  return <article className="planCard"><span className="recommended">Plan recomendado</span><div className="planTitleRow"><h3>{plan.name}</h3><img src={icon} width="48" height="48" alt="" /></div><span className="planCost">COSTO DEL PLAN</span><strong>$ {plan.price} al mes</strong><hr /><ul>{plan.description.map((item) => <li key={item}>{item}</li>)}</ul><button type="button" className={selected ? 'planSelected' : 'planSelect'} onClick={onSelect} aria-pressed={selected}>{selected ? 'Seleccionado' : 'Seleccionar plan'}</button></article>
})

export default function PlansView(): React.ReactNode {
  const state = useQuoteStore()
  const [filter, setFilter] = useState<'all' | 'recommended'>('all')
  const deferredFilter = useDeferredValue(filter)
  const [cardIndex, setCardIndex] = useState(0)
  const userQuery = useQuery({ queryKey: ['user'], queryFn: getUser })
  const plansQuery = useQuery({ queryKey: ['plans'], queryFn: getPlans, enabled: userQuery.isSuccess })
  const plans = plansQuery.data ?? []
  const userBirthDay = userQuery.data?.birthDay
  const age = userBirthDay ? (() => { const [day, month, year] = userBirthDay.split('-').map(Number); const today = new Date(); let result = today.getFullYear() - year; const monthDelta = today.getMonth() + 1 - month; if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < day)) result -= 1; return result })() : 0
  const ageEligiblePlans = plans.filter((plan) => age <= plan.age)
  const shown = state.quoteFor === null ? [] : deferredFilter === 'recommended' ? ageEligiblePlans.filter((_, index) => index === 1) : ageEligiblePlans
  const visiblePlans = shown.length ? (shown.length === 1 ? shown : [shown[cardIndex % shown.length]]) : []
  const name = userQuery.data ? `${userQuery.data.name} ${userQuery.data.lastName}` : 'Rocío'
  return <main className="flowPage">
    <Header onHome={() => state.setView('home')} />
    <nav className="stepper" aria-label="Progreso">
      <button className="mobileBack" type="button" onClick={() => state.setView('home')} aria-label="Volver">‹</button>
      <span className="mobileStepLabel">PASO 1 DE 2</span>
      <div className="mobileProgressBar" aria-hidden="true"><span /></div>
      <div className="stepProgress">
        <span className="active"><b>1</b> PLANES Y COBERTURAS</span><i /><span><b>2</b> RESUMEN</span>
      </div>
    </nav>
    <section className="plansSection">
      <BackButton onClick={() => state.setView('home')} />
      <h1>{name} ¿Para quién deseas cotizar?</h1>
      <p className="plansSubtitle">Selecciona la opción que se ajuste más a tus necesidades.</p>
      <div className="selectionCards" role="radiogroup">
        <button className={state.quoteFor === 'me' ? 'selection active' : 'selection'} role="radio" aria-checked={state.quoteFor === 'me'} onClick={() => state.setQuoteFor('me')}>
          <img src={protectionIcon} width="56" height="56" alt="" />
          <div><b>Para mí</b><span>Cotiza tu seguro de salud y agrega familiares si así lo deseas.</span></div>
          <span className="radioMark" />
        </button>
        <button className={state.quoteFor === 'someone-else' ? 'selection active' : 'selection'} role="radio" aria-checked={state.quoteFor === 'someone-else'} onClick={() => state.setQuoteFor('someone-else')}>
          <img src={addUserIcon} width="56" height="56" alt="" />
          <div><b>Para alguien más</b><span>Realiza una cotización para uno de tus familiares o cualquier persona.</span></div>
          <span className="radioMark" />
        </button>
      </div>
      <button className="desktopFilter" type="button" onClick={() => setFilter(deferredFilter === 'all' ? 'recommended' : 'all')}>
        {deferredFilter === 'all' ? 'Mostrar recomendados' : 'Mostrar todos'}
      </button>
      {plansQuery.isLoading && <div className="loadingCards"><div /><div /><div /></div>}
      <div className="plansGrid desktopPlans">
        {shown.map((plan) => {
          const price = calculatePrice(plan.price, state.quoteFor === 'someone-else')
          return <PlanCard key={plan.name} plan={{ ...plan, price }} selected={state.selectedPlan === plan.name} onSelect={() => { state.setSelectedPlan(plan.name); state.setView('summary') }} />
        })}
      </div>
      <div className="mobilePlans">
        <div className="mobilePlanList">
          {visiblePlans.map((plan) => {
            const price = calculatePrice(plan.price, state.quoteFor === 'someone-else')
            return <PlanCard key={plan.name} plan={{ ...plan, price }} selected={state.selectedPlan === plan.name} onSelect={() => { state.setSelectedPlan(plan.name); state.setView('summary') }} />
          })}
        </div>
        {shown.length > 0 && <nav className="planPager" aria-label="Carrusel de planes">
          <button type="button" aria-label="Plan anterior" onClick={() => setCardIndex((cardIndex - 1 + shown.length) % shown.length)}>‹</button>
          <span>{shown.length ? cardIndex + 1 : 0} / {shown.length}</span>
          <button className="next" type="button" aria-label="Plan siguiente" onClick={() => setCardIndex((cardIndex + 1) % shown.length)}>›</button>
        </nav>}
      </div>
    </section>
  </main>
}
