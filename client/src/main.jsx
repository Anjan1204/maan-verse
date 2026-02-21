import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

import { SocketProvider } from './context/SocketContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </SocketProvider>
  </StrictMode>,
)
