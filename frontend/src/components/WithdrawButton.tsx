import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { ZENYTH_VAULT_ADDRESS, ZENYTH_VAULT_ABI } from '../lib/wagmi'
import { toast } from 'sonner'
import { ArrowUpRight, Loader2, CheckCircle2, ExternalLink } from 'lucide-react'

interface WithdrawButtonProps {
  onSuccess?: () => void
}

export function WithdrawButton({ onSuccess }: WithdrawButtonProps) {
  const [amount, setAmount] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [hasShownSubmittedToast, setHasShownSubmittedToast] = useState(false)
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false)
  const { isConnected, address } = useAccount()
  
  // Get user's shares balance
  const { data: userShares } = useReadContract({
    address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
    abi: ZENYTH_VAULT_ABI,
    functionName: 'userShares',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Get user's BNB balance in vault
  const { data: userBalance } = useReadContract({
    address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
    abi: ZENYTH_VAULT_ABI,
    functionName: 'getUserBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Get total shares and total deposits for conversion
  const { data: totalShares } = useReadContract({
    address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
    abi: ZENYTH_VAULT_ABI,
    functionName: 'totalShares',
    query: {
      enabled: !!address,
    }
  })

  const { data: totalDeposits } = useReadContract({
    address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
    abi: ZENYTH_VAULT_ABI,
    functionName: 'totalDeposits',
    query: {
      enabled: !!address,
    }
  })

  // Get vault BNB balance to check if withdrawal is possible
  const { data: vaultBalance } = useReadContract({
    address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
    abi: ZENYTH_VAULT_ABI,
    functionName: 'getUserBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
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

  // Show toast when transaction is submitted
  useEffect(() => {
    if (hash && !hasShownSubmittedToast) {
      setTxHash(hash)
      setHasShownSubmittedToast(true)
      toast.success('📤 Withdrawal submitted!', {
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

  // Handle success state
  useEffect(() => {
    if (isSuccess && txHash && !hasShownSuccessToast) {
      setHasShownSuccessToast(true)
      setShowSuccess(true)
      setAmount('')
      toast.success('🎉 Withdrawal confirmed!', {
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
      onSuccess?.()
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
      const errorMsg = writeError.message
      if (errorMsg.includes('transfer failed')) {
        toast.error('❌ Withdrawal failed: Vault has no BNB', {
          description: 'Your funds were moved to a DeFi protocol. They need to be returned to the vault first.',
          duration: 8000,
        })
      } else if (errorMsg.includes('invalid shares')) {
        toast.error('❌ Invalid amount: Check your balance')
      } else {
        toast.error(`Withdrawal failed: ${errorMsg.slice(0, 50)}...`)
      }
    }
  }, [isWriteError, writeError])

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!userShares || userShares <= 0n) {
      toast.error('No shares to withdraw')
      return
    }

    if (!totalShares || !totalDeposits || totalDeposits === 0n) {
      toast.error('Cannot calculate shares - vault empty or no deposits')
      return
    }

    // Check if vault has enough BNB
    const bnbAmount = parseEther(amount)
    if (vaultBalance && bnbAmount > vaultBalance) {
      toast.error(`Vault doesn't have enough BNB. Available: ${formatEther(vaultBalance)} BNB. Your funds may be in a protocol.`)
      return
    }

    try {
      // Convert BNB amount to shares
      // shares = (amount * totalShares) / totalDeposits
      const sharesToWithdraw = (bnbAmount * totalShares) / totalDeposits
      
      // Check if user has enough shares
      if (sharesToWithdraw > userShares) {
        toast.error(`Insufficient shares. You have ${formatEther(userShares)} shares`)
        return
      }

      console.log(`Withdrawing ${amount} BNB = ${formatEther(sharesToWithdraw)} shares`)
      
      setShowSuccess(false)
      setTxHash(null)
      setHasShownSubmittedToast(false)
      setHasShownSuccessToast(false)
      
      await writeContract({
        address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
        abi: ZENYTH_VAULT_ABI,
        functionName: 'withdraw',
        args: [sharesToWithdraw],
      })

    } catch (error: any) {
      console.error('Withdraw error:', error)
    }
  }

  const handleWithdrawAll = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!userShares || userShares <= 0n) {
      toast.error('No shares to withdraw')
      return
    }

    try {
      setShowSuccess(false)
      setTxHash(null)
      setHasShownSubmittedToast(false)
      setHasShownSuccessToast(false)
      
      await writeContract({
        address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
        abi: ZENYTH_VAULT_ABI,
        functionName: 'withdraw',
        args: [userShares],
      })

    } catch (error: any) {
      console.error('Withdraw all error:', error)
    }
  }

  const isProcessing = isWriting || isConfirming

  const formattedBalance = userBalance ? formatEther(userBalance) : '0'
  const formattedVaultBalance = vaultBalance ? formatEther(vaultBalance) : '0'
  
  // Check if vault has less than user balance (funds moved to protocol)
  const hasFundsInProtocol = Boolean(vaultBalance && userBalance && vaultBalance < userBalance)

  // Success state
  if (showSuccess) {
    return (
      <div className="flex flex-col gap-3">
        <div className="px-6 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 animate-pulse">
          <CheckCircle2 size={20} />
          <span>Withdrawn!</span>
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
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Your Balance:</span>
        <span className="font-semibold">{parseFloat(formattedBalance).toFixed(4)} BNB</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.001"
            min="0.001"
            disabled={isProcessing}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full text-lg font-semibold disabled:bg-gray-100"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            BNB
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleWithdraw}
          disabled={isProcessing || !isConnected || !userShares || userShares <= 0n}
          className={`
            flex-1 px-4 py-3 rounded-lg font-semibold 
            transition-all duration-200
            flex items-center justify-center gap-2
            ${isProcessing || !userShares || userShares <= 0n
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-500 to-orange-600 hover:scale-[1.02] hover:shadow-md'
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
              <ArrowUpRight size={20} />
              <span>Withdraw</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleWithdrawAll}
          disabled={isProcessing || !isConnected || !userShares || userShares <= 0n}
          className={`
            px-4 py-3 rounded-lg font-semibold 
            transition-all duration-200
            ${isProcessing || !userShares || userShares <= 0n
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }
          `}
        >
          All
        </button>
      </div>
      
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
      
      {hasFundsInProtocol && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⚠️ Part of your funds are in a protocol. 
            Vault has {parseFloat(formattedVaultBalance).toFixed(4)} BNB available for immediate withdrawal.
          </p>
        </div>
      )}
      
      <p className="text-sm text-gray-500">
        Withdraw your BNB from the vault
      </p>
    </div>
  )
}
