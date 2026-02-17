import { useYields } from '../hooks/useYields'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function YieldChart() {
  const { yields, loading } = useYields()

  if (loading || !yields) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
  }

  const data = [
    { name: 'Venus', apy: yields.venus, fill: '#10b981' },
    { name: 'PancakeSwap', apy: yields.pancake, fill: '#8b5cf6' },
    { name: 'ListaDAO', apy: yields.lista, fill: '#3b82f6' },
    { name: 'KernelDAO', apy: yields.kernel, fill: '#f59e0b' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Protocol APYs</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            formatter={(value) => `${Number(value).toFixed(2)}%`}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Bar dataKey="apy" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
