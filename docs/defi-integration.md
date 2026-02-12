## DeFi Protocol Integration

### Supported Protocols

#### Zest Protocol
- **Website:** https://zestprotocol.com
- **APY:** 15.5%
- **TVL:** $500K
- **Risk Level:** Medium
- **Type:** Lending protocol

#### Bitflow
- **Website:** https://bitflow.io
- **APY:** 18.2%
- **TVL:** $250K
- **Risk Level:** High
- **Type:** Liquidity marketplace

#### Velar
- **Website:** https://velar.finance
- **APY:** 16.8%
- **TVL:** $350K
- **Risk Level:** Medium
- **Type:** DeFi aggregator

### Integration Architecture

```
frontend/
├── src/
│   ├── lib/
│   │   └── protocols/
│   │       ├── index.ts      # Protocol interfaces
│   │       ├── zest.ts       # Zest config
│   │       ├── bitflow.ts    # Bitflow config
│   │       └── velar.ts      # Velar config
│   ├── hooks/
│   │   └── useProtocols.ts   # Protocol data hooks
│   └── components/
│       ├── ProtocolCard.tsx  # Protocol display
│       └── ProtocolList.tsx  # Protocol selection
```

### Adding New Protocols

1. Create config file in `lib/protocols/`
2. Export mainnet and testnet configs
3. Add to PROTOCOLS array in `index.ts`
4. Create protocol card if needed
5. Update documentation

### API Reference

#### ProtocolConfig
```typescript
interface ProtocolConfig {
  id: string;
  name: string;
  description: string;
  apy: number;
  tvl: number;
  riskLevel: 'low' | 'medium' | 'high';
  website: string;
  docs: string;
  getConfig: (isMainnet: boolean) => ProtocolSpecificConfig;
}
```

#### Hooks
- `useProtocols(isMainnet)` - Fetch all protocol data
- `useProtocol(protocolId)` - Fetch single protocol
