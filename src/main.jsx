import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Plot360 Root Runtime Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', background: '#050b17', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#0b162c', border: '1px solid #ef4444', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ color: '#ef4444', margin: '0 0 10px' }}>⚠️ Application Runtime Error</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>The application encountered an unexpected runtime exception:</p>
            <pre style={{ background: '#030712', padding: '14px', borderRadius: '8px', color: '#fca5a5', overflowX: 'auto', fontSize: '12px' }}>
              {this.state.error?.toString()}
              {'\n'}
              {this.state.errorInfo?.componentStack}
            </pre>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{ marginTop: '16px', padding: '10px 18px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
            >
              Clear Cache &amp; Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
