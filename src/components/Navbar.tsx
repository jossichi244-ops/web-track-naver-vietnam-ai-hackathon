import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import "../assets/styles/navbar.scss";
import naverLogo from "../assets/hackathon-graphic.svg";
const shortenAddress = (address: string) => {
  if (!address) return "";
  const first = address.substring(0, 6);
  const last = address.substring(address.length - 4);
  return `${first}...${last}`;
};

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuthContext();

  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: "/", label: "Home" },
    { path: "/profile", label: "Profile" },
    { path: "/task", label: "Task" },
    { path: "/groups", label: "Groups Page" },
    { path: "/my-groups", label: "My Group Pages" },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src={naverLogo}
              alt="NAVER Vietnam AI Hackathon"
              className="logo"
            />
          </Link>
        </div>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}>
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${
                location.pathname === path ? "active" : ""
              }`}
              onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </div>

        <div className="wallet-status">
          {user && user.wallet_address ? (
            <div className="wallet-info" title={user.wallet_address}>
              <span className="address">
                {shortenAddress(user.wallet_address)}
              </span>
              <button className="logout-button" onClick={logout}>
                Disconnect
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="connect-wallet-button"
              onClick={() => setMenuOpen(false)}>
              Connect Wallet
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
