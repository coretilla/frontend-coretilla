import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { QueryClient } from "@tanstack/react-query";
import { defineChain } from "viem";

const coreDaoMainnet = defineChain({
  id: 1116,
  name: "Core Blockchain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "CORE",
    symbol: "CORE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.coredao.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "CORE Explorer",
      url: "https://scan.coredao.org",
    },
  },
  testnet: false,
});

export const projectId = "277d6e587f3677cbf7b7718f4175e24b";

const metadata = {
  name: "Coretilla",
  description: "Your digital bank for the CoreDAO economy",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "https://coretilla.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: [coreDaoMainnet],
});

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [coreDaoMainnet],
  defaultNetwork: coreDaoMainnet,
  metadata: metadata,
  features: {
    analytics: true,
    email: true,
    socials: ["google", "github", "apple"],
    emailShowWallets: true,
  },
});

export const queryClient = new QueryClient();

export const config = wagmiAdapter.wagmiConfig;
