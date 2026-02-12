export interface VelarConfig {
  protocolId: 'velar';
  name: string;
  apy: number;
  tvl: number;
  poolAddress: string;
  rewardToken: string;
  depositToken: string;
}

export const VELAR_MAINNET: VelarConfig = {
  protocolId: 'velar',
  name: 'Velar',
  apy: 16.8,
  tvl: 350000,
  poolAddress: 'SP2VCQJ9EVHAZT5BFSW6C66T3VKMBGZS5R3B6CAZ.velar-pool-v1',
  rewardToken: 'VELAR',
  depositToken: 'usdcx',
};

export const VELAR_TESTNET: VelarConfig = {
  protocolId: 'velar',
  name: 'Velar',
  apy: 16.8,
  tvl: 35000,
  poolAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar-pool-v1',
  rewardToken: 'VELAR',
  depositToken: 'usdcx',
};

export function getVelarConfig(isMainnet: boolean): VelarConfig {
  return isMainnet ? VELAR_MAINNET : VELAR_TESTNET;
}
