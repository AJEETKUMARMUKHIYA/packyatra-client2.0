import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button, Dialog, DialogContent } from "@mui/material";
import axiosClient from "../AxiosClient.jsx";
import TrackShipment from "../pages/TrackShipment.jsx";
import OtpLogin from "../components/OtpLogin.jsx";
import UserDropdown from "./UserDropdown.jsx";
import { getUserInfo, isOtpValid, clearLoginData } from "../utils/auth";
import "../styles/Header.css";

const Header = ({ onLoginStatusChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  /* ======================
     AUTO CLOSE ON ROUTE CHANGE
  ====================== */
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = "auto";
  }, [location.pathname]);

  /* ======================
     BODY SCROLL LOCK
  ====================== */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuOpen]);

  /* ======================
     ESC KEY CLOSE
  ====================== */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  /* ======================
     DESKTOP RESIZE FIX
  ====================== */
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth >= 900) setMenuOpen(false);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ======================
     LOAD USER
  ====================== */
  useEffect(() => {
    const loadUser = () => {
      const userInfo = getUserInfo();
      
      if (userInfo) {
        setUser(userInfo);
        onLoginStatusChange?.(true);
      } else {
        setUser(null);
        onLoginStatusChange?.(false);
      }
    };

    loadUser();
    
    // Listen for login/logout events
    window.addEventListener("user-login", loadUser);
    window.addEventListener("user-logout", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("user-login", loadUser);
      window.removeEventListener("user-logout", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, [onLoginStatusChange]);

  /* ======================
     HANDLERS
  ====================== */
  const openLogin = () => {
    setMenuOpen(false);
    
    // Check if already logged in
    if (isOtpValid()) {
      // Already logged in, no need to show modal
      const userInfo = getUserInfo();
      if (userInfo && !user) {
        setUser(userInfo);
        onLoginStatusChange?.(true);
      }
      return;
    }
    
    setIsLoginModalOpen(true);
  };

  const openTrackShipment = () => {
    setMenuOpen(false);
    setIsTrackModalOpen(true);
  };

  const handleLogout = () => {
    clearLoginData();
    setUser(null);
    onLoginStatusChange?.(false);
    navigate("/");
    setMenuOpen(false);
  };
const handleLogoutFromDropdown = () => {
    setUser(null);
    onLoginStatusChange?.(false);
    // UserDropdown handles the actual logout logic (clear localStorage, etc.)
    // We just need to update our local state here
  };

 
  /* ======================
     JSX
  ====================== */
  return (
    <header>
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="contact-top">
          <span><i className="fas fa-phone-alt"></i> +91 90715 35535</span>
          <span>✉ info@packyatra.com</span>
        </div>
        <UserDropdown onLogout={handleLogoutFromDropdown} />
      </div>

      {/* HEADER */}
      <div className="header">
        {/* LOGO */}
        <div className="logo-container">
          <div className="logo-main">PACKYATRA</div>
          <div className="logo-sub">Relocation Pvt.Ltd</div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="desktop-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* HAMBURGER */}
        <button
          className={`mobile-menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* OVERLAY */}
        {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

        {/* MOBILE MENU */}
        <nav className={`nav-container ${menuOpen ? "active" : ""}`}>
          <ul>
            <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink></li>
            <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
            <li>
              <a href="https://wa.me/9071535535" target="_blank" rel="noreferrer" className="whatsapp-cta">
                🟢 Continue on WhatsApp
              </a>
            </li>
          </ul>

          <div className="mobile-actions">
             {!user && <button onClick={openLogin}>Login</button>}
            {/* <button onClick={openTrackShipment}>Track Shipment</button> */}
            {/* {user ? (
              
              <button onClick={handleLogout}>Logout</button>
            ) 
            :(
              <button onClick={openLogin}>Login</button>
            )
            } */}
          </div>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="header-actions">
           {!user && <Button onClick={openLogin}>Login</Button>}
        
        </div>
      </div>

      {/* LOGIN MODAL */}
      <Dialog
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <OtpLogin 
            onSuccess={() => {
              setIsLoginModalOpen(false);
            }}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* TRACK SHIPMENT MODAL */}
      <Dialog
        open={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <TrackShipment onClose={() => setIsTrackModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;