export interface BitflowConfig {
  protocolId: 'bitflow';
  name: string;
  apy: number;
  tvl: number;
  poolAddress: string;
  rewardToken: string;
  depositToken: string;
}

export const BITFLOW_MAINNET: BitflowConfig = {
  protocolId: 'bitflow',
  name: 'Bitflow',
  apy: 18.2,
  tvl: 250000,
  poolAddress: 'SP2VCQJ9EVHAZT5BFSW6C66T3VKMBGZS5R3B6CAZ.bitflow-pool-v1',
  rewardToken: 'BITFLOW',
  depositToken: 'usdcx',
};

export const BITFLOW_TESTNET: BitflowConfig = {
  protocolId: 'bitflow',
  name: 'Bitflow',
  apy: 18.2,
  tvl: 25000,
  poolAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bitflow-pool-v1',
  rewardToken: 'BITFLOW',
  depositToken: 'usdcx',
};

export function getBitflowConfig(isMainnet: boolean): BitflowConfig {
  return isMainnet ? BITFLOW_MAINNET : BITFLOW_TESTNET;
}
