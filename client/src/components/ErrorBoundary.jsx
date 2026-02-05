import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("DEBUG ERROR CAPTURED:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: '#ff5555', fontFamily: 'monospace', minHeight: '100vh' }}>
                    <h1>Something went wrong.</h1>
                    <p>This is the MAAN-verse Debugging Screen.</p>
                    <div style={{ backgroundColor: '#000', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
                        <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                        <br /><br />
                        <strong>Component Stack:</strong>
                        <pre style={{ fontSize: '12px', color: '#888' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff5555', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
