/**
 * Stacks Mainnet Configuration
 */

export const STACKS_MAINNET = {
  network: 'mainnet',
  chainId: 1,
  stacksApiUrl: 'https://api.hiro.so',
  explorerUrl: 'https://explorer.stacks.co',
};

export const MAINNET_CONTRACTS: Record<string, string> = {
  // To be filled after deployment
  MOCK_VAULT: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-vault',
  USDCX: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx',
};

export function isMainnet(chainId: number): boolean {
  return chainId === 1;
}
