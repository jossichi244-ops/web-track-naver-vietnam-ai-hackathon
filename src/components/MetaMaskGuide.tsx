import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../assets/styles/metamask-guide.scss";

export default function MetaMaskGuide() {
  const { account, connectWallet } = useAuth();
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetaMask(true);
    }
  }, []);

  return (
    <div className="metamask-guide-container">
      <h2 className="guide-title">Guide to Connecting Wallet</h2>
      {!hasMetaMask && (
        <div className="guide-section">
          <p>
            To access Web3, you need a digital wallet. Please install the
            MetaMask extension.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="guide-link">
            Download MetaMask here
          </a>
        </div>
      )}
      {hasMetaMask && !account && (
        <div className="guide-section">
          <p>Connect your wallet to start your decentralized journey. </p>
          <button onClick={connectWallet} className="guide-button">
            Connect wallet
          </button>
        </div>
      )}
    </div>
  );
}
