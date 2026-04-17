import React from 'react'

export class Canvas3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Canvas Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #708090, #FAF3E0)',
            borderRadius: '0.5rem',
            minHeight: '300px',
          }}
        >
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>3D Graphics Error</p>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>{this.state.error?.message || 'WebGL not available'}</p>
            <p style={{ fontSize: '10px', opacity: 0.6, marginTop: '8px' }}>Check browser console for details</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
