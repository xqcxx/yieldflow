export interface DeploymentConfig {
  network: 'mainnet' | 'testnet';
  contracts: string[];
  rpcUrl: string;
  deployerAddress: string;
}

export const MAINNET_DEPLOYMENT: DeploymentConfig = {
  network: 'mainnet',
  contracts: ['mock-vault'],
  rpcUrl: 'https://api.hiro.so',
  deployerAddress: '',
};
