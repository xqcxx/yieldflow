import { mainnet, testnet } from '@stacks/network';

export const STACKS_MAINNET = new mainnet();
export const STACKS_TESTNET = new testnet();

export const STACKS_NETWORKS = {
  mainnet: STACKS_MAINNET,
  testnet: STACKS_TESTNET,
};

export function getStacksNetwork(isMainnet: boolean) {
  return isMainnet ? STACKS_MAINNET : STACKS_TESTNET;
}

export const STACKS_API_URLS = {
  mainnet: 'https://api.hiro.so',
  testnet: 'https://api.testnet.hiro.so',
};

export function getStacksApiUrl(isMainnet: boolean): string {
  return isMainnet ? STACKS_API_URLS.mainnet : STACKS_API_URLS.testnet;
}
