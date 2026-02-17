import { usePortfolio } from '../hooks/usePortfolio'
import { Wallet, TrendingUp } from 'lucide-react'

export function PortfolioCard() {
  const { balance, shares } = usePortfolio()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Portfolio</h3>
        <Wallet className="text-white" size={24} />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
          <p className="text-3xl font-bold text-zenyth-green">{Number(balance).toFixed(4)} BNB</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Shares</p>
          <p className="text-2xl font-semibold text-white">{Number(shares).toFixed(4)}</p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-green-500">
            <TrendingUp size={18} className="text-white" />
            <span className="text-sm font-medium text-white">+12.4% (30d)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
