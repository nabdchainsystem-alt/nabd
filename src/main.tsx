import React from 'react';
import ReactDOM from 'react-dom/client';
// import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './auth-adapter';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!publishableKey) {
//   throw new Error("Missing Publishable Key")
// }

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Remove the initial HTML loader since React is mounting
const initialLoader = document.getElementById('initial-loader');
if (initialLoader) {
  initialLoader.remove();
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);