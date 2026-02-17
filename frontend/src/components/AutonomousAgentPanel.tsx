import { useAutonomousAgent } from '../hooks/useAutonomousAgent'
import { Bot, Power, Settings } from 'lucide-react'
import { useState } from 'react'

export function AutonomousAgentPanel() {
  const { config, setConfig, isProcessing, lastRebalance, enabled, toggleAutonomous } = useAutonomousAgent()
  const [showSettings, setShowSettings] = useState(false)

  const timeSinceLastRebalance = Math.floor((Date.now() - lastRebalance) / 1000)
  const minutes = Math.floor(timeSinceLastRebalance / 60)
  const seconds = timeSinceLastRebalance % 60

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${enabled ? 'bg-green-500' : 'bg-gray-400'}`}>
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Autonomous Agent
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {enabled ? '🟢 Active' : '⚫ Inactive'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition"
        >
          <Settings className="text-gray-600 dark:text-gray-400" size={20} />
        </button>
      </div>

      {/* Status */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {isProcessing ? '⚡ Processing...' : enabled ? '👀 Monitoring' : '💤 Sleeping'}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Last Check</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {minutes}m {seconds}s ago
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Check Interval</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {config.checkInterval / 1000}s
          </span>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="space-y-3 mb-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Agent Settings</h4>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Min Vibe Change: {(config.minVibeChange * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={config.minVibeChange * 100}
              onChange={(e) => setConfig({ ...config, minVibeChange: Number(e.target.value) / 100 })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Min Yield Diff: {config.minYieldDiff.toFixed(1)}%
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={config.minYieldDiff}
              onChange={(e) => setConfig({ ...config, minYieldDiff: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Check Interval: {config.checkInterval / 1000}s
            </label>
            <input
              type="range"
              min="10"
              max="120"
              step="10"
              value={config.checkInterval / 1000}
              onChange={(e) => setConfig({ ...config, checkInterval: Number(e.target.value) * 1000 })}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleAutonomous}
        disabled={isProcessing}
        className={`
          w-full px-6 py-3 rounded-xl font-bold text-white
          transition-all duration-300 transform
          flex items-center justify-center gap-2
          ${enabled 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
        `}
      >
        <Power size={20} />
        {enabled ? 'Disable Autonomous Mode' : 'Enable Autonomous Mode'}
      </button>

      {enabled && (
        <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
          Agent will automatically rebalance when conditions are met
        </p>
      )}
    </div>
  )
}
