import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { StacksWalletButton } from './components/StacksWalletButton';
import { StrategyCard } from './components/StrategyCard';
import { ZapFlow } from './components/ZapFlow';
import { STRATEGIES } from './lib/constants';

function App() {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const strategy = STRATEGIES.find((s) => s.id === selectedStrategy);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              YieldFlow
            </h1>
            <p className="text-sm text-slate-400">
              Cross-Chain Yield Aggregator
            </p>
          </div>
          
          <div className="flex gap-3">
            <ConnectButton />
            <StacksWalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">
            Zap from Ethereum to Stacks DeFi
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Bridge USDC from Ethereum and automatically deposit into
            high-yield Stacks strategies. One click, maximum efficiency.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-3xl font-bold text-green-400 mb-1">
              Up to 18%
            </div>
            <div className="text-slate-400">APY on Stacks</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              5-20 min
            </div>
            <div className="text-slate-400">Bridge Time</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-3xl font-bold text-orange-400 mb-1">
              Circle xReserve
            </div>
            <div className="text-slate-400">Secure Bridging</div>
          </div>
        </div>

        {/* Strategies */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Available Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STRATEGIES.map((strat) => (
              <StrategyCard
                key={strat.id}
                name={strat.name}
                apy={strat.apy}
                tvl={strat.tvl}
                description={strat.description}
                disabled={strat.disabled}
                onSelect={() => setSelectedStrategy(strat.id)}
              />
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Connect Wallets', desc: 'MetaMask + Leather' },
              { step: '2', title: 'Select Strategy', desc: 'Choose your yield' },
              { step: '3', title: 'Bridge USDC', desc: 'via Circle xReserve' },
              { step: '4', title: 'Earn Yield', desc: 'On Stacks DeFi' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zap Flow Modal */}
      {selectedStrategy && strategy && (
        <ZapFlow
          strategyName={strategy.name}
          onClose={() => setSelectedStrategy(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>
            Built for Programming USDCx on Stacks Builder Challenge
          </p>
          <p className="mt-1">
            Powered by Circle xReserve • Stacks • Bitcoin
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
