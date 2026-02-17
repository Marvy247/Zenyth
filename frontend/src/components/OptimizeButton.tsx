import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSwitchChain, useBalance } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { ZENYTH_VAULT_ADDRESS, ZENYTH_VAULT_ABI } from '../lib/wagmi'
import { toast } from 'sonner'
import { Sparkles, Loader2, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { useVibeScore } from '../hooks/useVibeScore'
import { useYields } from '../hooks/useYields'

interface OptimizeButtonProps {
  onSuccess?: () => void
}

export function OptimizeButton({ onSuccess }: OptimizeButtonProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasShownSubmittedToast, setHasShownSubmittedToast] = useState(false)
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false)
  const { vibes } = useVibeScore()
  const { yields } = useYields()
  const { isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  
  // Check vault balance
  const { data: vaultBalance } = useBalance({
    address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
  })
  const { 
    writeContract, 
    data: hash, 
    isPending: isWriting,
    error: writeError,
    isError: isWriteError,
    reset: resetWrite 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}` | undefined,
  })

  // Show toast when transaction is submitted (only once)
  useEffect(() => {
    if (hash && !hasShownSubmittedToast) {
      setTxHash(hash)
      setHasShownSubmittedToast(true)
      toast.success('📤 Transaction submitted!', {
        description: (
          <a
            href={`https://testnet.bscscan.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline flex items-center gap-1"
          >
            View on BscScan <ExternalLink size={12} />
          </a>
        ),
        duration: 10000,
      })
    }
  }, [hash, hasShownSubmittedToast])

  // Show success toast when confirmed (only once)
  useEffect(() => {
    if (isSuccess && txHash && !hasShownSuccessToast) {
      setHasShownSuccessToast(true)
      setShowSuccess(true)
      setIsOptimizing(false)
      toast.success('🎉 Rebalance confirmed!', {
        description: (
          <a
            href={`https://testnet.bscscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline flex items-center gap-1"
          >
            View on BscScan <ExternalLink size={12} />
          </a>
        ),
      })
      // Call onSuccess immediately to trigger refresh
      onSuccess?.()
      // Reset after 3 seconds
      const resetTimer = setTimeout(() => {
        setShowSuccess(false)
        setTxHash(null)
        setHasShownSubmittedToast(false)
        setHasShownSuccessToast(false)
        resetWrite()
      }, 3000)
      return () => {
        clearTimeout(resetTimer)
      }
    }
  }, [isSuccess, txHash, hasShownSuccessToast, resetWrite, onSuccess])

  useEffect(() => {
    if (isWriteError && writeError) {
      setIsOptimizing(false)
      // Only show error toast, no spam
      toast.error(`Failed: ${writeError.message.slice(0, 50)}...`)
    }
  }, [isWriteError, writeError])

  const handleOptimize = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (chainId !== bscTestnet.id) {
      toast.info('Switching network...')
      try {
        await switchChain({ chainId: bscTestnet.id })
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch {
        toast.error('Please switch to BNB Chain Testnet')
        return
      }
    }

    if (!vibes || !yields) {
      toast.error('Loading data...')
      return
    }

    // Check if vault has enough balance (minimum 0.01 BNB)
    const vaultBalanceBNB = vaultBalance ? Number(vaultBalance.value) / 1e18 : 0
    if (vaultBalanceBNB < 0.01) {
      toast.error('Vault has insufficient balance', {
        description: `Current: ${vaultBalanceBNB.toFixed(4)} BNB. Please deposit at least 0.01 BNB first.`,
      })
      return
    }

      setIsOptimizing(true)
      setTxHash(null)
      setShowSuccess(false)
      setHasShownSubmittedToast(false)
      setHasShownSuccessToast(false)


    try {
      // Get AI recommendation
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibes, yields }),
      })
      const { protocol, confidence } = await res.json()

      // Calculate rebalance amount (50% of vault balance, max 0.5 BNB)
      const rebalanceAmount = Math.min(vaultBalanceBNB * 0.5, 0.5)
      const amountWei = BigInt(Math.floor(rebalanceAmount * 1e18))

      // Single toast for recommendation
      toast.success(`${protocol} selected (${(confidence * 100).toFixed(0)}% confidence) - Rebalancing ${rebalanceAmount.toFixed(3)} BNB`)

      // Execute rebalance
      const vibeScore = Math.round(vibes.score * 100)
      const targetProtocol = '0xc6dFd5ad02d877582A4c81840Ab4E944c608021a'

      await writeContract({
        address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
        abi: ZENYTH_VAULT_ABI,
        functionName: 'executeVibeRebalance',
        args: [BigInt(vibeScore), targetProtocol as `0x${string}`, amountWei],
      })

    } catch (error: any) {
      console.error('Optimize error:', error)
      setIsOptimizing(false)
    }
  }


  const isProcessing = isOptimizing || isWriting || isConfirming
  const vaultBalanceBNB = vaultBalance ? Number(vaultBalance.value) / 1e18 : 0
  const hasEnoughBalance = vaultBalanceBNB >= 0.01

  // Show warning if vault is empty
  if (!hasEnoughBalance && isConnected) {
    return (
      <div className="w-full px-6 py-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              Deposit Required
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Vault balance: <span className="font-mono font-bold">{vaultBalanceBNB.toFixed(4)} BNB</span>
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Deposit at least 0.01 BNB to enable AI rebalancing
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleOptimize}
        disabled={isProcessing || showSuccess}
        className={`
          w-full px-8 py-4 rounded-xl font-bold text-lg 
          transition-all duration-300 transform
          flex items-center justify-center gap-3
          ${isProcessing || showSuccess
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-zenyth-green to-zenyth-yellow hover:scale-[1.02] hover:shadow-lg'
          }
          ${showSuccess ? 'bg-green-500' : ''}
          text-white
        `}
      >
        {showSuccess ? (
          <>
            <CheckCircle2 size={24} />
            <span>Rebalance Complete!</span>
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            <span>
              {isWriting ? 'Confirm in wallet...' : 
               isConfirming ? 'Confirming...' : 
               'Optimizing...'}
            </span>
          </>
        ) : (
          <>
            <Sparkles size={24} className="animate-pulse" />
            <span>Optimize with AI</span>
          </>
        )}
      </button>
      
      {/* Transaction History Link */}
      {txHash && (
        <a
          href={`https://testnet.bscscan.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-blue-500 hover:text-blue-600 underline"
        >
          <ExternalLink size={14} />
          View transaction on BscScan
        </a>
      )}
    </div>
  )
}
