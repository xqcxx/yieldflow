import { defineChain } from 'viem';

export const ethereumMainnet = defineChain({
  id: 1,
  name: 'Ethereum Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://eth-mainnet.g.alchemy.com/v2'] },
    public: { http: ['https://cloudflare-eth.com'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://etherscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 14353601,
    },
  },
});
