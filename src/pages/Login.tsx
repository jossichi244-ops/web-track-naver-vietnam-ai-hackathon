import { useAuth } from "../hooks/useAuth";
// import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { shortenAddress } from "../utils/helpers";
import "../assets/styles/login.scss";
import { useState } from "react";
export default function Home() {
  const { account, user, connectWallet, login } = useAuth();
  const [showGuide, setShowGuide] = useState(false);

  // const containerVariants = {
  //   hidden: { opacity: 0, y: -20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       type: "spring",
  //       stiffness: 100,
  //       damping: 10,
  //       delayChildren: 0.3,
  //       staggerChildren: 0.2,
  //     },
  //   },
  //   active: {
  //     backgroundColor: "#f00",
  //   },
  //   inactive: {
  //     backgroundColor: "#fff",
  //     transition: { duration: 2 },
  //   },
  // };
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
          Quản lý công việc phi tập trung, on-chain.
        </motion.p>

        {!account && (
          <motion.button
            onClick={connectWallet}
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
              <h2>Cách Đăng Nhập An Toàn Bằng Ví Điện Tử</h2>
              <ol>
                <li>
                  <strong>Bước 1:</strong> Bấm vào nút <code>Challenge</code> để
                  yêu cầu xác thực từ ví.
                </li>
                <li>
                  <strong>Bước 2:</strong> Ví sẽ hiện thông báo yêu cầu bạn ký
                  thông điệp.
                </li>
                <li>
                  <strong>Bước 3:</strong> Chấp nhận ký (Sign) – không tốn phí.
                </li>
                <li>
                  <strong>Bước 4:</strong> Sau khi ký, bạn sẽ được đăng nhập
                  ngay.
                </li>
              </ol>

              <p>
                <strong>Tại sao lại dùng cách này?</strong>
              </p>
              <ul>
                <li>Siêu bảo mật – không cần mật khẩu.</li>
                <li>Riêng tư tuyệt đối – chỉ ví của bạn biết bạn là ai.</li>
                <li>Siêu nhanh – đăng nhập trong vài giây.</li>
              </ul>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowGuide(false)}>
                  Đóng
                </button>
                <button
                  className="confirm-button"
                  onClick={() => {
                    setShowGuide(false);
                    login(); // Gọi hàm đăng nhập sau khi user hiểu
                  }}>
                  Tôi đã hiểu, tiếp tục
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
              Chào mừng, ví của bạn:{" "}
              <span className="highlight-text">
                {shortenAddress(user.wallet_address)}
              </span>
            </p>
            <p className="user-info-text">
              ID người dùng:{" "}
              <span className="highlight-text">{user.user_id}</span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
