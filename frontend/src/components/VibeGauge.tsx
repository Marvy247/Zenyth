import { useVibeScore } from '../hooks/useVibeScore'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function VibeGauge() {
  const { vibes, loading } = useVibeScore()

  if (loading || !vibes) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
  }

  const getEmoji = (score: number) => {
    if (score >= 0.8) return '🔥'
    if (score >= 0.6) return '📈'
    if (score >= 0.4) return '😐'
    return '📉'
  }

  const getIcon = () => {
    if (vibes.score >= 0.6) return <TrendingUp className="text-white" />
    if (vibes.score < 0.4) return <TrendingDown className="text-white" />
    return <Minus className="text-white" />
  }

  const percentage = Math.round(vibes.score * 100)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg vibe-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Market Vibes</h3>
        {getIcon()}
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="text-6xl">{getEmoji(vibes.score)}</div>
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-zenyth-green">
              {vibes.sentiment}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-white">
              {percentage}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300 dark:bg-gray-700">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-zenyth-green transition-all duration-500"
          ></div>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        <p>Confidence: {(vibes.confidence * 100).toFixed(0)}%</p>
        <p className="text-xs mt-1">Source: {vibes.source}</p>
      </div>
    </div>
  )
}
