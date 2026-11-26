interface ApiErrorStateProps {
  title: string
  message: string
  onRetry: () => void
  isRetrying: boolean
}

export default function ApiErrorState({
  title,
  message,
  onRetry,
  isRetrying,
}: ApiErrorStateProps): React.ReactNode {
  return <section className="errorNotice" role="alert" aria-live="polite">
    <span className="errorNoticeIcon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 8v5m0 3h.01M10.3 3.9 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
    </span>
    <h2>{title}</h2>
    <p>{message}</p>
    <button className="errorNoticeButton" type="button" onClick={onRetry} disabled={isRetrying}>
      {isRetrying ? 'Reintentando...' : 'Intentar nuevamente'}
    </button>
  </section>
}
