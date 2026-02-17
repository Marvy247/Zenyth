import { ExternalLink, History, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'
import { ZENYTH_VAULT_ADDRESS } from '../lib/wagmi'

type TransactionType = 'deposit' | 'withdraw' | 'rebalance'

interface TransactionEvent {
  txHash: `0x${string}`
  type: TransactionType
  vibeScore?: number
  amount: string
  timestamp: string
}

// Static transaction history - update this manually or via props
const STATIC_EVENTS: TransactionEvent[] = [
  // Example format - add your transactions here
  // {
  //   txHash: '0x...',
  //   type: 'deposit',
  //   amount: '0.1',
  //   timestamp: 'Just now'
  // }
]

interface TransactionHistoryProps {
  events?: TransactionEvent[]
  refreshKey?: number
}

export function TransactionHistory({ events = STATIC_EVENTS, refreshKey }: TransactionHistoryProps) {
  // refreshKey is used to trigger re-renders when transactions occur
  console.log('TransactionHistory refreshKey:', refreshKey)
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="text-green-500" size={20} />
      case 'withdraw':
        return <ArrowUpRight className="text-red-500" size={20} />
      case 'rebalance':
        return <RefreshCw className="text-blue-500" size={20} />
    }
  }

  const getTransactionLabel = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return 'Deposit'
      case 'withdraw':
        return 'Withdraw'
      case 'rebalance':
        return 'AI Rebalance'
    }
  }

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600 dark:text-green-400'
      case 'withdraw':
        return 'text-red-600 dark:text-red-400'
      case 'rebalance':
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  if (events.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-white" size={20} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Transaction History
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 space-y-4">
          <p>No transactions to display.</p>
          <a
            href={`https://testnet.bscscan.com/address/${ZENYTH_VAULT_ADDRESS}#events`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 underline"
          >
            <ExternalLink size={14} />
            View all events on BscScan
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <History className="text-white" size={20} />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Transaction History
        </h3>
        <span className="ml-auto text-sm text-gray-500">
          {events.length} transactions
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={`${event.txHash}-${index}`}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              {getTransactionIcon(event.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${getTransactionColor(event.type)}`}>
                    {getTransactionLabel(event.type)}
                  </span>
                  {event.type === 'rebalance' && event.vibeScore !== undefined && (
                    <span className="text-xs px-2 py-0.5 bg-zenyth-green/10 text-zenyth-green rounded-full">
                      Vibe: {event.vibeScore}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {event.amount} BNB • {event.timestamp}
                </div>
              </div>
            </div>
            
            <a
              href={`https://testnet.bscscan.com/tx/${event.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 shrink-0 ml-2"
            >
              <span className="hidden sm:inline">View</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <a
          href={`https://testnet.bscscan.com/address/${ZENYTH_VAULT_ADDRESS}#events`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-blue-500 hover:text-blue-600"
        >
          <ExternalLink size={14} />
          View all events on BscScan
        </a>
      </div>
    </div>
  )
}
