import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './lib/wagmi'
import { Dashboard } from './pages/Dashboard'
import { WalletButton } from './components/WalletButton'
import { Toaster } from 'sonner'
import { Zap } from 'lucide-react'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
          <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3">
                  <Zap className="text-[#f59e0b]" size={32} />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Zenyth
                  </h1>
                </div>
                <WalletButton />
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Dashboard />
          </main>

          <footer className="text-center py-8 text-gray-600 dark:text-gray-400">
            <p>🔥 Good Vibes Only: OpenClaw Edition</p>
          </footer>
        </div>
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
