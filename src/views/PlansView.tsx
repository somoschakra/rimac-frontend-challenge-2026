import { memo, useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPlans, getUser } from '../api/rimacApi'
import { calculateAge, getEligiblePlans } from '../domain/plans'
import { quotePlan } from '../domain/pricing'
import type { QuotedPlan } from '../domain/models'
import { useQuoteStore } from '../store/quoteStore'
import protectionIcon from '../assets/icons/IcProtectionLight.png'
import addUserIcon from '../assets/icons/IcAddUserLight.png'
import hospitalIcon from '../assets/icons/IcHospitalLight.png'
import Header from '../components/Header'
import BackButton from '../components/BackButton'
import ApiErrorState from '../components/ApiErrorState'

function BenefitIcon({ index }: { index: number }): React.ReactNode {
  if (index % 3 === 1) {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="3" width="15" height="11" rx="1.5" /><path d="M6 17h8m-4-3v3" /></svg>
  }
  if (index % 3 === 2) {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 17V4h12v13M2.5 17h15M8 7h4m-2-2v4M7 17v-4h6v4" /></svg>
  }
  return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="5.5" r="2.5" /><path d="M4 17v-1.5a6 6 0 0 1 12 0V17M2 9h4m-2-2v4" /></svg>
}

const PlanCard = memo(function PlanCard({ plan, selected, onSelectPlan }: { plan: QuotedPlan; selected: boolean; onSelectPlan: (planName: string) => void }) {
  const icon = plan.name.includes('Clínica') ? hospitalIcon : protectionIcon
  return <article className="planCard">
    <span className="recommended">Plan recomendado</span>
    <div className="planTitleRow"><h3><b>{plan.name}</b></h3><img src={icon} width="48" height="48" alt="" /></div>
    <span className="planCost">COSTO DEL PLAN</span>
    <b className="planPrice">$ {plan.quotedPrice} al mes</b>
    <hr />
    <ul>{plan.description.map((item, index) => <li key={item}>
      <span className="benefitIcon"><BenefitIcon index={index} /></span>
      <span>{item}</span>
    </li>)}</ul>
    <button type="button" className={selected ? 'planSelected' : 'planSelect'} onClick={() => onSelectPlan(plan.name)} aria-pressed={selected}>
      {selected ? 'Seleccionado' : 'Seleccionar plan'}
    </button>
  </article>
})

export default function PlansView(): React.ReactNode {
  const quoteFor = useQuoteStore((state) => state.quoteFor)
  const selectedPlan = useQuoteStore((state) => state.selectedPlan)
  const setQuoteFor = useQuoteStore((state) => state.setQuoteFor)
  const setSelectedPlan = useQuoteStore((state) => state.setSelectedPlan)
  const setView = useQuoteStore((state) => state.setView)
  const [filter, setFilter] = useState<'all' | 'recommended'>('all')
  const deferredFilter = useDeferredValue(filter)
  const [cardIndex, setCardIndex] = useState(0)
  const userQuery = useQuery({ queryKey: ['user'], queryFn: ({ signal }) => getUser(signal) })
  const plansQuery = useQuery({ queryKey: ['plans'], queryFn: ({ signal }) => getPlans(signal), enabled: userQuery.isSuccess })
  const userBirthDay = userQuery.data?.birthDay
  const age = userBirthDay ? calculateAge(userBirthDay) : null
  const ageEligiblePlans = useMemo(
    () => age === null ? [] : getEligiblePlans(plansQuery.data ?? [], age),
    [age, plansQuery.data],
  )
  const shown = useMemo(
    () => quoteFor === null
      ? []
      : deferredFilter === 'recommended'
        ? ageEligiblePlans.filter((_, index) => index === 1)
        : ageEligiblePlans,
    [ageEligiblePlans, deferredFilter, quoteFor],
  )
  const quotedPlans = useMemo(
    () => shown.map((plan) => quotePlan(plan, quoteFor === 'someone-else' ? 'someone-else' : 'me')),
    [quoteFor, shown],
  )
  const handlePlanSelect = useCallback((planName: string): void => {
    setSelectedPlan(planName)
    setView('summary')
  }, [setSelectedPlan, setView])
  const visiblePlan = quotedPlans.length
    ? quotedPlans[shown.length === 1 ? 0 : cardIndex % shown.length]
    : undefined
  const name = userQuery.data ? `${userQuery.data.name} ${userQuery.data.lastName}` : ''
  return <main className="flowPage">
    <Header onHome={() => setView('home')} />
    <nav className="stepper" aria-label="Progreso">
      <BackButton variant="mobile" onClick={() => setView('home')} />
      <span className="mobileStepLabel">PASO 1 DE 2</span>
      <div className="mobileProgressBar" aria-hidden="true"><span /></div>
      <div className="stepProgress">
        <span className="active"><b>1</b> Planes y coberturas</span><i /><span><b>2</b> Resumen</span>
      </div>
    </nav>
    <section className="plansSection">
      <BackButton onClick={() => setView('home')} />
      <h1>
        {userQuery.data
          ? <>{name}, ¿para quién deseas cotizar?</>
          : <>{userQuery.isLoading && <span className="nameSkeleton" role="status" aria-label="Cargando nombre" />} ¿para quién deseas cotizar?</>}
      </h1>
      <p className="plansSubtitle">Selecciona la opción que se ajuste más a tus necesidades.</p>
      <div className="selectionCards" role="radiogroup">
        <button className={quoteFor === 'me' ? 'selection active' : 'selection'} role="radio" aria-checked={quoteFor === 'me'} onClick={() => setQuoteFor('me')}>
          <img src={protectionIcon} width="56" height="56" alt="" />
          <div><b>Para mí</b><span>Cotiza tu seguro de salud y agrega familiares si así lo deseas.</span></div>
          <span className="radioMark" />
        </button>
        <button className={quoteFor === 'someone-else' ? 'selection active' : 'selection'} role="radio" aria-checked={quoteFor === 'someone-else'} onClick={() => setQuoteFor('someone-else')}>
          <img src={addUserIcon} width="56" height="56" alt="" />
          <div><b>Para alguien más</b><span>Realiza una cotización para uno de tus familiares o cualquier persona.</span></div>
          <span className="radioMark" />
        </button>
      </div>
      <button className="desktopFilter" type="button" onClick={() => setFilter(deferredFilter === 'all' ? 'recommended' : 'all')}>
        {deferredFilter === 'all' ? 'Mostrar recomendados' : 'Mostrar todos'}
      </button>
      {userQuery.isError && <ApiErrorState
        title={userQuery.data ? 'No pudimos actualizar tus datos' : 'No pudimos cargar tus datos'}
        message={userQuery.data ? 'Revisa tu conexión e inténtalo nuevamente.' : 'Revisa tu conexión e inténtalo nuevamente para continuar.'}
        onRetry={() => { void userQuery.refetch() }}
        isRetrying={userQuery.isFetching}
      />}
      {quoteFor !== null && !userQuery.isError && plansQuery.isError && <ApiErrorState
        title={plansQuery.data ? 'No pudimos actualizar los planes' : 'No pudimos cargar los planes'}
        message={plansQuery.data ? 'Puedes seguir viendo la información disponible o volver a intentar.' : 'Revisa tu conexión e inténtalo nuevamente para ver las opciones.'}
        onRetry={() => { void plansQuery.refetch() }}
        isRetrying={plansQuery.isFetching}
      />}
      {quoteFor !== null && (userQuery.isLoading || plansQuery.isLoading) && <div className="loadingCards" role="status" aria-label="Cargando planes"><div /><div /><div /></div>}
      <div className="plansGrid desktopPlans">
        {quotedPlans.map((plan) => <PlanCard key={plan.name} plan={plan} selected={selectedPlan === plan.name} onSelectPlan={handlePlanSelect} />)}
      </div>
      <div className="mobilePlans">
        <div className="mobilePlanList">
          {visiblePlan && <PlanCard key={visiblePlan.name} plan={visiblePlan} selected={selectedPlan === visiblePlan.name} onSelectPlan={handlePlanSelect} />}
        </div>
        {shown.length > 0 && <nav className="planPager" aria-label="Carrusel de planes">
          <button type="button" aria-label="Plan anterior" onClick={() => setCardIndex((cardIndex - 1 + shown.length) % shown.length)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" /><path d="m12.971 15.904-3.907-3.904 3.907-3.904 1.058 1.058-2.843 2.846 2.843 2.846-1.058 1.058Z" /></svg>
          </button>
          <span>{shown.length ? cardIndex + 1 : 0} / {shown.length}</span>
          <button className="next" type="button" aria-label="Plan siguiente" onClick={() => setCardIndex((cardIndex + 1) % shown.length)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" /><path d="m12.971 15.904-3.907-3.904 3.907-3.904 1.058 1.058-2.843 2.846 2.843 2.846-1.058 1.058Z" /></svg>
          </button>
        </nav>}
      </div>
    </section>
  </main>
}
