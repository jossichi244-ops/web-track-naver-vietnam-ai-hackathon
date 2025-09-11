import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react";
import "../assets/styles/navbar.scss";
import naverLogo from "../assets/hackathon-graphic.svg";
import { Home, User, ListChecks, Users, Folder } from "lucide-react";
// Import thêm một icon để tạo điểm nhấn
import { Zap } from "lucide-react";

// Tối ưu hóa hàm shortenAddress
const shortenAddress = (address: string) => {
  if (!address) return "0x000...0000"; // Giá trị mặc định
  const first = address.substring(0, 6);
  const last = address.substring(address.length - 4);
  return `${first}...${last}`;
};

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);

  // Thêm hiệu ứng đóng menu khi click ra ngoài
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const navbar = document.querySelector(".navbar-container");
      if (navbar && !navbar.contains(event.target as Node) && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  const links = [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
    { path: "/task", label: "Task", icon: <ListChecks size={20} /> },
    { path: "/groups", label: "Groups Page", icon: <Users size={20} /> },
    { path: "/my-groups", label: "My Groups", icon: <Folder size={20} /> },
  ];

  return (
    <nav className="navbar-cyb">
      <div className="navbar-container-cyb">
        <div className="logo-cyb">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src={naverLogo}
              alt="NAVER Vietnam AI Hackathon"
              className="logo-img-cyb"
            />
          </Link>
        </div>

        <button
          className={`hamburger-cyb ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}>
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </button>

        <div className={`nav-links-cyb ${menuOpen ? "open" : ""}`}>
          {links.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link-cyb ${
                location.pathname === path ? "active" : ""
              }`}
              onClick={() => setMenuOpen(false)}
              title={label}>
              <div className="icon-wrapper">{icon}</div>
              <span className="label-text">{label}</span>
            </Link>
          ))}
        </div>

        <div className="wallet-status-cyb">
          {user && user.wallet_address ? (
            <div className="wallet-info-cyb" title={user.wallet_address}>
              <span className="address-cyb">
                {shortenAddress(user.wallet_address)}
              </span>
              <button className="logout-button-cyb" onClick={logout}>
                <Zap size={16} /> Disconnect
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="connect-wallet-button-cyb"
              onClick={() => setMenuOpen(false)}>
              <Zap size={16} /> Connect Wallet
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
