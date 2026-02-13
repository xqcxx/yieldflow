export const STACKS_MAINNET = {
  network: 'mainnet',
  chainId: 1,
  apiUrl: 'https://api.hiro.so',
  explorerUrl: 'https://explorer.stacks.co',
};

export const STACKS_TESTNET = {
  network: 'testnet',
  networkId: 2147483648,
  apiUrl: 'https://api.testnet.hiro.so',
  explorerUrl: 'https://explorer.testnet.stacks.co',
};

export function getStacksNetwork(isMainnet: boolean) {
  return isMainnet ? STACKS_MAINNET : STACKS_TESTNET;
}
