import { useState, useEffect } from 'react';
import { PROTOCOLS, ProtocolConfig } from '../lib/protocols';

interface ProtocolData {
  protocol: ProtocolConfig;
  tvl: number;
  apy: number;
  lastUpdated: number;
}

const fetchProtocolData = async (): Promise<ProtocolData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return PROTOCOLS.map(protocol => ({
    protocol,
    tvl: protocol.tvl,
    apy: protocol.apy + (Math.random() * 2 - 1),
    lastUpdated: Date.now(),
  }));
};

export function useProtocols(isMainnet: boolean) {
  const [data, setData] = useState<ProtocolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const protocolData = await fetchProtocolData();
        setData(protocolData);
        setError(null);
      } catch (err) {
        setError('Failed to load protocol data');
        console.error('Protocol fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, [isMainnet]);

  return {
    protocols: data,
    isLoading,
    error,
  };
}

export function useProtocol(protocolId: string) {
  const { protocols, isLoading, error } = useProtocols(false);
  
  const protocol = protocols.find(p => p.protocol.id === protocolId);
  
  return {
    data: protocol,
    isLoading,
    error,
  };
}
