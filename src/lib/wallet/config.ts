import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { mainnet } from 'viem/chains'

// Get projectId from WalletConnect Cloud
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// Create a metadata object
const metadata = {
  name: 'Bitcoin Neobank',
  description: 'Your digital bank for the Bitcoin economy',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://bitcoinneobank.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: [mainnet]
})

// Configure the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'github', 'apple'],
    emailShowWallets: true
  }
})

export const queryClient = new QueryClient()

// Export config for use with wagmi
export const config = wagmiAdapter.wagmiConfig