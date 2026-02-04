import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { useAppStore } from '../stores/appStore';
import { useState, useEffect } from 'react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function StacksWalletButton() {
  const { stacksWallet, setStacksWallet } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is already signed in
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setStacksWallet({
        address: userData.profile.stxAddress.testnet,
        network: 'testnet',
      });
    }
  }, [setStacksWallet]);

  const connectStacksWallet = () => {
    showConnect({
      appDetails: {
        name: 'YieldFlow',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setStacksWallet({
          address: userData.profile.stxAddress.testnet,
          network: 'testnet',
        });
      },
      userSession,
    });
  };

  const disconnectStacksWallet = () => {
    userSession.signUserOut();
    setStacksWallet(null);
  };

  if (!mounted) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-orange-600/50 rounded-lg font-medium cursor-not-allowed"
      >
        Connect Stacks Wallet
      </button>
    );
  }

  if (stacksWallet) {
    return (
      <button
        onClick={disconnectStacksWallet}
        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
      >
        {stacksWallet.address.slice(0, 6)}...{stacksWallet.address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={connectStacksWallet}
      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
    >
      Connect Stacks Wallet
    </button>
  );
}
