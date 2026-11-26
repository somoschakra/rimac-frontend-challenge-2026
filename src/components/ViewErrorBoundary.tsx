import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ViewErrorBoundaryProps {
  children: ReactNode
  onGoHome: () => void
}

interface ViewErrorBoundaryState {
  hasError: boolean
}

export default class ViewErrorBoundary extends Component<ViewErrorBoundaryProps, ViewErrorBoundaryState> {
  state: ViewErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ViewErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error al renderizar una vista:', error, errorInfo.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <main className="flowPage errorPage">
        <section className="errorNotice" role="alert">
          <span className="errorNoticeIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 8v5m0 3h.01M10.3 3.9 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </span>
          <h1>Ocurrió un problema</h1>
          <p>No pudimos mostrar esta pantalla. Intenta cargarla nuevamente o vuelve al inicio.</p>
          <div className="errorNoticeActions">
            <button className="errorNoticeButton" type="button" onClick={() => this.setState({ hasError: false })}>
              Intentar nuevamente
            </button>
            <button className="errorNoticeSecondary" type="button" onClick={this.props.onGoHome}>
              Volver al inicio
            </button>
          </div>
        </section>
      </main>
    }

    return this.props.children
  }
}
