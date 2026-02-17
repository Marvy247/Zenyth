import { VibeGauge } from '../components/VibeGauge'
import { YieldChart } from '../components/YieldChart'
import { OptimizeButton } from '../components/OptimizeButton'
import { PortfolioCard } from '../components/PortfolioCard'
import { DepositButton } from '../components/DepositButton'
import { WithdrawButton } from '../components/WithdrawButton'
import { TransactionHistory } from '../components/TransactionHistory'
import { AutonomousAgentPanel } from '../components/AutonomousAgentPanel'
import { useAccount } from 'wagmi'
import { Wallet, TrendingUp, Zap, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

export function Dashboard() {
  const { isConnected } = useAccount()
  const [refreshKey, setRefreshKey] = useState(0)
  
  const handleRebalanceSuccess = () => {
    // Trigger refresh
    setRefreshKey(prev => prev + 1)
    console.log('Transaction successful')
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-zenyth-green to-zenyth-yellow rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <Zap size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-zenyth-green to-zenyth-yellow bg-clip-text text-transparent">
              Welcome to Zenyth
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              AI-powered yield optimization with real-time sentiment analysis
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Wallet size={16} />
            <span>Connect your wallet to start</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Optimize your yields with AI-powered rebalancing
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Live on BNB Testnet
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Vibe Gauge */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <VibeGauge />
          </div>

          {/* Portfolio */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <PortfolioCard />
          </div>

          {/* Deposit */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="text-white" size={20} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Deposit Funds
              </h3>
            </div>
            <DepositButton onSuccess={handleRebalanceSuccess} />
          </div>

          {/* Withdraw */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-lg border border-red-100 dark:border-red-800">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight className="text-white" size={20} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Withdraw Funds
              </h3>
            </div>
            <WithdrawButton onSuccess={handleRebalanceSuccess} />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Yield Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-white" size={20} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Yield Opportunities
              </h3>
            </div>
            <YieldChart />
          </div>

          {/* AI Optimization */}
          <div className="bg-gradient-to-br from-zenyth-green/10 to-zenyth-yellow/10 dark:from-zenyth-green/20 dark:to-zenyth-yellow/20 rounded-2xl p-8 shadow-lg border border-zenyth-green/20">
            <div className="text-center space-y-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-zenyth-green to-zenyth-yellow rounded-xl mx-auto flex items-center justify-center shadow-lg">
                <Zap size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Manual Optimization
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
                  Manually trigger AI optimization based on current market conditions.
                </p>
              </div>
            </div>
            <OptimizeButton onSuccess={handleRebalanceSuccess} />
          </div>

          {/* Autonomous Agent */}
          <AutonomousAgentPanel />

          {/* Transaction History */}
          <TransactionHistory refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  )
}
