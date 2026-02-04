// Sepolia Testnet Addresses
export const SEPOLIA_USDC = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
export const SEPOLIA_XRESERVE = '0x008888878f94C0d87defdf0B07f46B93C1934442';

// Stacks Testnet Addresses
export const STACKS_USDCX = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx';
export const STACKS_MOCK_VAULT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-vault'; // Will update after deployment

// Mock strategies for demo
export const STRATEGIES = [
  {
    id: 'mock-vault',
    name: 'YieldFlow Mock Vault',
    apy: 12.0,
    tvl: '0',
    description: 'Simulated yield-bearing vault for USDCx',
    contract: STACKS_MOCK_VAULT,
  },
  {
    id: 'zest-lending',
    name: 'Zest Lending',
    apy: 8.5,
    tvl: '2.4M',
    description: 'Lend USDCx on Zest Protocol (Coming Soon)',
    contract: '',
    disabled: true,
  },
  {
    id: 'bitflow-lp',
    name: 'Bitflow STX-USDCx LP',
    apy: 18.2,
    tvl: '890K',
    description: 'Provide liquidity on Bitflow DEX (Coming Soon)',
    contract: '',
    disabled: true,
  },
];

// ERC20 ABI (minimal)
export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// xReserve ABI (simplified for depositForBurn)
export const XRESERVE_ABI = [
  {
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'mintRecipient', type: 'bytes32' },
    ],
    name: 'depositForBurn',
    outputs: [{ name: 'nonce', type: 'uint64' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
