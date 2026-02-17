import { useConnect, useAccount, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Wallet, ChevronDown, LogOut, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef, useEffect } from 'react'

export function WalletButton() {
  const { connect, isPending } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleConnect = async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        toast.error('MetaMask not found. Please install MetaMask extension.')
        return
      }
      connect({ connector: injected({ target: 'metaMask' }) })
    } catch (err: any) {
      console.error('Connection error:', err)
      toast.error(err?.message || 'Failed to connect wallet')
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied!')
    }
  }

  if (isConnected) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-6 py-2 bg-zenyth-yellow text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2 font-medium"
        >
          <Wallet size={18} />
          {address?.slice(0, 6)}...{address?.slice(-4)}
          <ChevronDown size={16} />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Connected Wallet</p>
              <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">{address}</p>
            </div>
            <button
              onClick={copyAddress}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Copy size={16} />
              Copy Address
            </button>
            <button
              onClick={() => {
                disconnect()
                setShowDropdown(false)
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <LogOut size={16} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isPending}
      className="px-6 py-2 bg-zenyth-yellow text-white rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 font-medium"
    >
      <Wallet size={18} />
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
