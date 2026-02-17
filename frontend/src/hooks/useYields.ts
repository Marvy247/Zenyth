import { useEffect, useState } from 'react'

export interface YieldData {
  venus: number
  pancake: number
  lista: number
  kernel: number
}

export function useYields() {
  const [yields, setYields] = useState<YieldData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchYields = async () => {
    try {
      const res = await fetch('/api/yields')
      const data = await res.json()
      setYields(data)
    } catch (error) {
      console.error('Failed to fetch yields:', error)
      setYields({
        venus: 8.5 + Math.random() * 2,
        pancake: 12.3 + Math.random() * 3,
        lista: 9.8 + Math.random() * 2.5,
        kernel: 11.2 + Math.random() * 2.8,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchYields()
    const interval = setInterval(fetchYields, 30000)
    return () => clearInterval(interval)
  }, [])

  return { yields, loading, refetch: fetchYields }
}
