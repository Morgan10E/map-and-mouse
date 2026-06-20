import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (error) {
      return (
        <div style={{
          padding: '2rem',
          fontFamily: 'monospace',
          background: '#fff0f0',
          minHeight: '100dvh',
          boxSizing: 'border-box',
        }}>
          <h2 style={{ color: '#c00', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{error.message}</p>
          <pre style={{
            fontSize: '0.75rem',
            overflowX: 'auto',
            background: '#fff',
            padding: '1rem',
            border: '1px solid #fcc',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
          }}>{error.stack}</pre>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
