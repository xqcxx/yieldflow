import React from 'react';
import { mainnet, sepolia } from 'wagmi/chains';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { switchToMainnet, switchToSepolia } from '../lib/networkSwitcher';

export function NetworkIndicator() {
  const { isConnected, chainId, networkName, isSupported } = useNetworkStatus();

  if (!isConnected) {
    return <span className="network-indicator disconnected">Wallet Not Connected</span>;
  }

  if (!isSupported) {
    return <span className="network-indicator unsupported">Unsupported Network</span>;
  }

  const isMainnet = chainId === mainnet.id;

  return (
    <span className={`network-indicator ${isMainnet ? 'mainnet' : 'testnet'}`}>
      {networkName}
    </span>
  );
}

export function NetworkSwitcher() {
  const { chainId, isSupported } = useNetworkStatus();

  if (!isSupported) {
    return (
      <div className="network-switcher">
        <p>Please switch to a supported network:</p>
        <button onClick={() => switchToMainnet()}>Switch to Mainnet</button>
        <button onClick={() => switchToSepolia()}>Switch to Sepolia</button>
      </div>
    );
  }

  return null;
}
