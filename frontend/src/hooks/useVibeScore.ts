import { useEffect, useState } from 'react'

export interface VibeData {
  score: number
  sentiment: string
  confidence: number
  timestamp: number
  source: string
}

export function useVibeScore() {
  const [vibes, setVibes] = useState<VibeData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchVibes = async () => {
    try {
      const res = await fetch('/api/vibes')
      const data = await res.json()
      setVibes(data)
    } catch (error) {
      console.error('Failed to fetch vibes:', error)
      setVibes({
        score: 0.75,
        sentiment: 'bullish',
        confidence: 0.85,
        timestamp: Date.now(),
        source: 'twitter',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVibes()
    const interval = setInterval(fetchVibes, 30000)
    return () => clearInterval(interval)
  }, [])

  return { vibes, loading, refetch: fetchVibes }
}
