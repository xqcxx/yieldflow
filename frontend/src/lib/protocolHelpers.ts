export function getProtocolById(id: string) {
  return PROTOCOLS_V2.find(p => p.id === id);
}
