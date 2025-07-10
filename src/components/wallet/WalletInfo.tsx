"use client";

import { useWallet } from '@/hooks/useWallet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Example component showing how to use the wallet throughout the app
 * This can be used on dashboard pages or wherever wallet info is needed
 */
export function WalletInfo() {
  const { 
    isConnected, 
    address, 
    balance, 
    chainId,
    connect, 
    disconnect 
  } = useWallet()

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  const copyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      toast.success('Address copied!')
    } catch (error) {
      toast.error('Failed to copy address')
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to start using Bitcoin Neobank features
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={connect} className="w-full">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Wallet Connected</CardTitle>
          <Badge variant="secondary">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Chain {chainId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Address</p>
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <code className="flex-1 text-sm font-mono">
              {formatAddress(address || '')}
            </code>
            <Button size="sm" variant="ghost" onClick={copyAddress}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Balance */}
        {balance && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Balance</p>
            <div className="p-2 bg-muted rounded-md">
              <p className="text-lg font-mono font-semibold">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={disconnect}
            className="w-full"
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}