import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error caught by Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0c0e] text-[#fbf9f5] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#12151c] border border-[#c49750]/40 rounded-2xl p-8 shadow-2xl">
            <h1 className="font-serif text-2xl uppercase tracking-wider text-[#c49750] mb-3">
              Abdellah Lasri
            </h1>
            <p className="text-sm text-[#b5b1a6] mb-6">
              Beyond Magic · Masterclasses & Vocal Coaching
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#c49750] text-black text-xs font-mono uppercase tracking-widest rounded-full font-semibold hover:bg-[#dfb26b] transition-colors"
            >
              Reload Experience
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function mountApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    );
    if (typeof window !== 'undefined') {
      const win = window as unknown as { __dismissShell?: () => void };
      if (typeof win.__dismissShell === 'function') {
        win.__dismissShell();
      }
    }
  } else {
    // Retry as soon as DOM finishes loading
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountApp, { once: true });
    } else {
      setTimeout(mountApp, 25);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp, { once: true });
} else {
  mountApp();
}
