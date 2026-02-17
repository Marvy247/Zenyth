import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { ZENYTH_VAULT_ADDRESS, ZENYTH_VAULT_ABI } from '../lib/wagmi'
import { toast } from 'sonner'
import { Wallet, Loader2, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react'

interface DepositButtonProps {
  onSuccess?: () => void
}

export function DepositButton({ onSuccess }: DepositButtonProps) {
  const [amount, setAmount] = useState('0.1')
  const [showSuccess, setShowSuccess] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [hasShownSubmittedToast, setHasShownSubmittedToast] = useState(false)
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false)
  const { isConnected } = useAccount()
  
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
      toast.success('📤 Deposit submitted!', {
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

  // Handle success state (only once)
  useEffect(() => {
    if (isSuccess && txHash && !hasShownSuccessToast) {
      setHasShownSuccessToast(true)
      setShowSuccess(true)
      setAmount('') // Clear the input after successful deposit
      toast.success('🎉 Deposit confirmed!', {
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
      // Call onSuccess callback to refresh dashboard
      onSuccess?.()
      // Reset after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
        setTxHash(null)
        setHasShownSubmittedToast(false)
        setHasShownSuccessToast(false)
        resetWrite()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, txHash, hasShownSuccessToast, resetWrite, onSuccess])

  useEffect(() => {
    if (isWriteError && writeError) {
      toast.error(`Deposit failed: ${writeError.message.slice(0, 50)}...`)
    }
  }, [isWriteError, writeError])

  const handleDeposit = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      const value = parseEther(amount)
      setShowSuccess(false)
      setTxHash(null)
      setHasShownSubmittedToast(false)
      setHasShownSuccessToast(false)
      
      await writeContract({
        address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
        abi: ZENYTH_VAULT_ABI,
        functionName: 'deposit',
        value: value,
      })

    } catch (error: any) {
      console.error('Deposit error:', error)
    }
  }

  const isProcessing = isWriting || isConfirming

  // Success state
  if (showSuccess) {
    return (
      <div className="flex flex-col gap-3">
        <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 animate-pulse">
          <CheckCircle2 size={20} />
          <span>Deposited!</span>
        </div>
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
        <p className="text-sm text-gray-500 text-center">
          Ready to optimize with AI
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            step="0.01"
            min="0.01"
            disabled={isProcessing}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-28 text-lg font-semibold disabled:bg-gray-100"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            BNB
          </span>
        </div>
      </div>
      
      <button
        onClick={handleDeposit}
        disabled={isProcessing || !isConnected}
        className={`
          px-6 py-3 rounded-lg font-semibold 
          transition-all duration-200
          flex items-center justify-center gap-2
          ${isProcessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] hover:shadow-md'
          }
          text-white
        `}
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>{isWriting ? 'Confirm...' : 'Confirming...'}</span>
          </>
        ) : (
          <>
            <Wallet size={20} />
            <span>Deposit</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>
      
      {txHash && !showSuccess && (
        <a
          href={`https://testnet.bscscan.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-blue-500 hover:text-blue-600 underline"
        >
          <ExternalLink size={14} />
          View pending transaction
        </a>
      )}
      
      <p className="text-sm text-gray-500">
        Deposit BNB to enable AI rebalancing
      </p>
    </div>
  )
}
