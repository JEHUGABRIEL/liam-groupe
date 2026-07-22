import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import './index.css'
import './i18n.js'
import App from './App.jsx'
import GlobalLoader from './components/GlobalLoader.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 1000 * 60 * 60 * 24, 
      staleTime: 1000 * 60 * 30, 
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'liam-query-cache',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, 
      }}
    >
      <Suspense fallback={<GlobalLoader />}>
        <App />
      </Suspense>
    </PersistQueryClientProvider>
  </StrictMode>,
)
