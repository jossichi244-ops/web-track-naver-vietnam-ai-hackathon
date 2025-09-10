interface EthereumProvider {
  request(args: { method: "eth_requestAccounts" }): Promise<string[]>;
  request(args: {
    method: "personal_sign";
    params: [string, string];
  }): Promise<string>;
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  isMetaMask?: boolean;
}

interface Window {
  ethereum?: EthereumProvider;
}
