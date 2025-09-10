// src/utils/helpers.ts
export function shortenAddress(addr?: string, length = 6): string {
  if (!addr) return "";
  return `${addr.slice(0, length)}...${addr.slice(-length)}`;
}
