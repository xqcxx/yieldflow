import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = import.meta.env.VITE_WC_PROJECT_ID || '';

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'YieldFlow',
        description: 'Cross-Chain Capital Optimizer',
        url: 'https://yieldflow.io',
        icons: ['https://yieldflow.io/favicon.ico'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
