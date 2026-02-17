import { useEffect, useState } from 'react'
import { useAccount, useWriteContract, usePublicClient } from 'wagmi'
import { ZENYTH_VAULT_ADDRESS, ZENYTH_VAULT_ABI } from '../lib/wagmi'
import { useVibeScore } from './useVibeScore'
import { useYields } from './useYields'
import { toast } from 'sonner'

interface AutoRebalanceConfig {
  enabled: boolean
  minVibeChange: number // Minimum vibe score change to trigger rebalance
  minYieldDiff: number // Minimum yield difference (in %) to trigger rebalance
  checkInterval: number // How often to check (in ms)
}

export function useAutonomousAgent() {
  const [config, setConfig] = useState<AutoRebalanceConfig>({
    enabled: false,
    minVibeChange: 0.15, // 15% change in vibe score
    minYieldDiff: 2, // 2% yield difference
    checkInterval: 30000, // Check every 30 seconds
  })
  
  const [lastVibeScore, setLastVibeScore] = useState<number | null>(null)
  const [lastRebalance, setLastRebalance] = useState<number>(Date.now())
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { address, isConnected } = useAccount()
  const { vibes } = useVibeScore()
  const { yields } = useYields()
  const { writeContract } = useWriteContract()
  const publicClient = usePublicClient()

  // Check if rebalance is needed
  const shouldRebalance = async (): Promise<{ should: boolean; reason: string }> => {
    if (!vibes || !yields || !address) {
      return { should: false, reason: 'Missing data' }
    }

    // Check vault balance
    const balance = await publicClient?.getBalance({
      address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
    })
    
    const vaultBalanceBNB = balance ? Number(balance) / 1e18 : 0
    if (vaultBalanceBNB < 0.01) {
      return { should: false, reason: 'Insufficient vault balance' }
    }

    // Check time since last rebalance (minimum 5 minutes)
    const timeSinceLastRebalance = Date.now() - lastRebalance
    if (timeSinceLastRebalance < 300000) {
      return { should: false, reason: 'Too soon since last rebalance' }
    }

    // Check vibe score change
    if (lastVibeScore !== null) {
      const vibeChange = Math.abs(vibes.score - lastVibeScore)
      if (vibeChange >= config.minVibeChange) {
        return { 
          should: true, 
          reason: `Vibe score changed by ${(vibeChange * 100).toFixed(1)}%` 
        }
      }
    }

    // Check yield differences
    const yieldValues = [yields.venus, yields.pancake, yields.lista, yields.kernel]
    const maxYield = Math.max(...yieldValues)
    const minYield = Math.min(...yieldValues)
    const yieldDiff = maxYield - minYield

    if (yieldDiff >= config.minYieldDiff) {
      return { 
        should: true, 
        reason: `Yield spread is ${yieldDiff.toFixed(2)}% (max opportunity)` 
      }
    }

    return { should: false, reason: 'No significant changes detected' }
  }

  // Execute autonomous rebalance
  const executeRebalance = async () => {
    if (isProcessing || !vibes || !yields || !address) return

    setIsProcessing(true)
    
    try {
      // Get AI recommendation
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibes, yields }),
      })
      const { protocol, confidence } = await res.json()

      // Get vault balance
      const balance = await publicClient?.getBalance({
        address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
      })
      const vaultBalanceBNB = balance ? Number(balance) / 1e18 : 0
      
      // Calculate rebalance amount (30% of vault balance, max 0.3 BNB for autonomous)
      const rebalanceAmount = Math.min(vaultBalanceBNB * 0.3, 0.3)
      const amountWei = BigInt(Math.floor(rebalanceAmount * 1e18))

      const vibeScore = Math.round(vibes.score * 100)
      const targetProtocol = '0xc6dFd5ad02d877582A4c81840Ab4E944c608021a'

      console.log(`🤖 Autonomous rebalance: ${protocol} (${(confidence * 100).toFixed(0)}% confidence)`)
      
      toast.info(`🤖 Autonomous Agent: Rebalancing ${rebalanceAmount.toFixed(3)} BNB to ${protocol}`, {
        description: `Confidence: ${(confidence * 100).toFixed(0)}% | Vibe: ${vibes.score.toFixed(2)}`,
      })

      await writeContract({
        address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
        abi: ZENYTH_VAULT_ABI,
        functionName: 'executeVibeRebalance',
        args: [BigInt(vibeScore), targetProtocol as `0x${string}`, amountWei],
      })

      setLastVibeScore(vibes.score)
      setLastRebalance(Date.now())
      
      toast.success('🤖 Autonomous rebalance executed successfully!')
    } catch (error: any) {
      console.error('Autonomous rebalance failed:', error)
      toast.error('Autonomous rebalance failed', {
        description: error.message?.slice(0, 100),
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Autonomous monitoring loop
  useEffect(() => {
    if (!config.enabled || !isConnected) return

    const checkAndRebalance = async () => {
      const { should, reason } = await shouldRebalance()
      
      console.log(`🤖 Autonomous check: ${reason}`)
      
      if (should) {
        console.log('🤖 Triggering autonomous rebalance...')
        await executeRebalance()
      }
    }

    // Initial check
    checkAndRebalance()

    // Set up interval
    const interval = setInterval(checkAndRebalance, config.checkInterval)

    return () => clearInterval(interval)
  }, [config.enabled, config.checkInterval, isConnected, vibes, yields])

  return {
    config,
    setConfig,
    isProcessing,
    lastRebalance,
    enabled: config.enabled,
    toggleAutonomous: () => setConfig(prev => ({ ...prev, enabled: !prev.enabled })),
  }
}
