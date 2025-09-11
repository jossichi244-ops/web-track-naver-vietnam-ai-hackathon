import { useAuth } from "../hooks/useAuth";
// import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { shortenAddress } from "../utils/helpers";
import "../assets/styles/login.scss";
import { useEffect, useState } from "react";
import MetaMaskGuide from "../components/MetaMaskGuide";
export default function Home() {
  const { account, user, connectWallet, login } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [showMetaMaskGuide, setShowMetaMaskGuide] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      setShowMetaMaskGuide(true);
    }
  }, []);

  const variants = {
    active: {
      backgroundColor: "#f00",
    },
    inactive: {
      backgroundColor: "#fff",
      transition: { duration: 2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="web3-landing-page">
      <motion.div
        className="floating-block"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="content-container"
        variants={variants}
        initial="hidden"
        animate="visible">
        <motion.h1 className="title" variants={itemVariants}>
          Web3 Task Manager
        </motion.h1>
        <motion.p className="subtitle" variants={itemVariants}>
          Decentralized task management, on-chain.
        </motion.p>
        {!account && (
          <motion.button
            onClick={() => {
              if (typeof window.ethereum === "undefined") {
                setShowMetaMaskGuide(true);
              } else {
                connectWallet();
              }
            }}
            className="action-button connect-wallet"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <button className="button x">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                viewBox="0 0 48 48"
                height="48">
                <path fill="none" d="M0 0h48v48H0z"></path>
                <path d="M42 36v2c0 2.21-1.79 4-4 4H10c-2.21 0-4-1.79-4-4V10c0-2.21 1.79-4 4-4h28c2.21 0 4 1.79 4 4v2H24c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h18zm-18-4h20V16H24v16zm8-5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
              </svg>
              Connect Wallet
            </button>
          </motion.button>
        )}
        {account && !user && (
          <motion.button
            onClick={() => setShowGuide(true)}
            className="action-button sign-login btn-shine"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            Challenge
          </motion.button>
        )}
        {showGuide && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>How to Log In Securely Using E-Wallet</h2>
              <ol>
                <li>
                  <strong>Step 1:</strong> Click the <code>Challenge</code>
                  button to request verification from the wallet.
                </li>
                <li>
                  <strong>Step 2:</strong> The wallet will display a
                  notification asking you to sign the message.
                </li>
                <li>
                  <strong>Step 3:</strong> Accept to sign – no fee.
                </li>
                <li>
                  <strong>Step 4:</strong> After signing, you will be logged in
                  immediately.
                </li>
              </ol>

              <p>
                <strong>Why use this method?</strong>
              </p>
              <ul>
                <li>Super secure – no password needed.</li>
                <li>
                  Absolutely private – only your wallet knows who you are.
                </li>
                <li>Super fast – log in within seconds.</li>
              </ul>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowGuide(false)}>
                  Close
                </button>
                <button
                  className="confirm-button"
                  onClick={() => {
                    setShowGuide(false);
                    login(); // Gọi hàm đăng nhập sau khi user hiểu
                  }}>
                  I understand, continue.
                </button>
              </div>
            </div>
          </div>
        )}
        {user && (
          <motion.div
            className="user-info-card"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}>
            <p className="user-info-text">
              Welcome, your wallet:
              <span className="highlight-text">
                {shortenAddress(user.wallet_address)}
              </span>
            </p>
            <p className="user-info-text">
              User ID: <span className="highlight-text">{user.user_id}</span>
            </p>
          </motion.div>
        )}
        {showMetaMaskGuide && (
          <div className="modal-overlay">
            <div className="modal-content">
              <MetaMaskGuide />
              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowMetaMaskGuide(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>{" "}
      <motion.button
        onClick={() => setShowMetaMaskGuide(true)}
        className=" guide-button"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>
        Guide to connecting the wallet
      </motion.button>
    </div>
  );
}
