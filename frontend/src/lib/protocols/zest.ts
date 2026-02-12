export interface ZestConfig {
  protocolId: 'zest';
  name: string;
  apy: number;
  tvl: number;
  poolAddress: string;
  rewardToken: string;
  depositToken: string;
}

export const ZEST_MAINNET: ZestConfig = {
  protocolId: 'zest',
  name: 'Zest Protocol',
  apy: 15.5,
  tvl: 500000,
  poolAddress: 'SP2VCQJ9EVHAZT5BFSW6C66T3VKMBGZS5R3B6CAZ.zest-pool-v1',
  rewardToken: 'STX',
  depositToken: 'usdcx',
};

export const ZEST_TESTNET: ZestConfig = {
  protocolId: 'zest',
  name: 'Zest Protocol',
  apy: 15.5,
  tvl: 50000,
  poolAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.zest-pool-v1',
  rewardToken: 'STX',
  depositToken: 'usdcx',
};

export function getZestConfig(isMainnet: boolean): ZestConfig {
  return isMainnet ? ZEST_MAINNET : ZEST_TESTNET;
}
