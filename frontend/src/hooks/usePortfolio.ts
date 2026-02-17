import { useAccount, useReadContract } from 'wagmi'
import { ZENYTH_VAULT_ADDRESS, ZENYTH_VAULT_ABI } from '../lib/wagmi'
import { formatEther } from 'viem'

export function usePortfolio() {
  const { address } = useAccount()

  const { data: balance, refetch } = useReadContract({
    address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
    abi: ZENYTH_VAULT_ABI,
    functionName: 'getUserBalance',
    args: address ? [address] : undefined,
  })

  const { data: shares } = useReadContract({
    address: ZENYTH_VAULT_ADDRESS as `0x${string}`,
    abi: ZENYTH_VAULT_ABI,
    functionName: 'userShares',
    args: address ? [address] : undefined,
  })

  return {
    balance: balance ? formatEther(balance as bigint) : '0',
    shares: shares ? formatEther(shares as bigint) : '0',
    refetch,
  }
}
