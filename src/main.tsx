import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { AuthProvider } from './lib/sync/AuthProvider';
import { SyncProvider } from './lib/sync/SyncProvider';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const hadServiceWorkerController = Boolean(navigator.serviceWorker?.controller);
let refreshingForServiceWorkerUpdate = false;

navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (!hadServiceWorkerController || refreshingForServiceWorkerUpdate) return;
  refreshingForServiceWorkerUpdate = true;
  window.location.reload();
});

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    void updateSW(true);
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SyncProvider>
          <App />
        </SyncProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
