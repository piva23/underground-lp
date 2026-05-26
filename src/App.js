import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider }       from 'react-redux';

import store        from './store';
import AuthProvider from './providers/AuthProvider';
import Loading      from './components/Loading';

// Lazy load para divisão de bundle
const Underground = lazy(() => import('./pages/underground/Underground'));

// ─────────────────────────────────────────────────────────────────────────────
// Estrutura espelho do App.js principal:
//   Provider (Redux) → AuthProvider (Firebase listener) → BrowserRouter → Routes
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/"  element={<Underground />} />
              <Route path="*"  element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
