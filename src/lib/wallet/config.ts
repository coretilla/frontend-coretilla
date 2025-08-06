import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { defineChain } from 'viem'

// Define CoreDAO Testnet
const coreDAOTestnet = defineChain({
  id: 1114,
  name: 'Core Blockchain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tCORE',
    symbol: 'tCORE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test2.btcs.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CoreScan2 Testnet',
      url: 'https://scan.test2.btcs.network/',
    },
  },
  testnet: true,
})

// Get projectId from WalletConnect Cloud
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// Create a metadata object
const metadata = {
  name: 'Coretilla',
  description: 'Your digital bank for the CoreDAO economy',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://coretilla.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: [coreDAOTestnet]
})

// Configure the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [coreDAOTestnet],
  defaultNetwork: coreDAOTestnet,
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