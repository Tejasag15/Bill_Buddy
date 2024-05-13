import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaStar, FaEnvelope, FaSignInAlt, FaBars } from 'react-icons/fa';
import Logo from '../assets/images/logob.jpeg';
import { FaSignOutAlt } from 'react-icons/fa';
import '../styles/NavBar.css';

const Navbar = () => {
  const navbarRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userIsLoggedIn = checkAuthenticationStatus();
    setIsLoggedIn(userIsLoggedIn);

    if (userIsLoggedIn) {
      const fetchedUsername = fetchUsername();
      setUsername(fetchedUsername);

      const isAdminUser = checkAdminStatus();
      setIsAdmin(isAdminUser);
    }
  }, []);

  const checkAuthenticationStatus = () => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    return isAuthenticated;
  };

  const fetchUsername = () => {
    const storedUsername = localStorage.getItem('username');
    return storedUsername || '';
  };

  const checkAdminStatus = () => {
    const isAdminUser = localStorage.getItem('role') === 'admin';
    return isAdminUser;
  };

  const navbarHandler = () => {
    navbarRef.current.classList.toggle('active');
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');

    if (isAdmin) {
      localStorage.removeItem('role');
      setIsAdmin(false);
    } else {
      localStorage.removeItem('username');
      setUsername('');
    }

    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src={Logo} alt="" />
        </div>

        <nav className="navbar" ref={navbarRef}>
          {isAdmin ? (
            // If admin, show admin links
            <>
              <Link to="/admin-dashboard" className={location.pathname === '/admin-dashboard' ? 'selected' : ''}>
                <FaHome /> Admin Dashboard
              </Link>
              <div className="user-container">
                <div className="icons">
                  <div className="fas fa-bars" id="menu-btn" onClick={navbarHandler}>
                    <FaBars />
                  </div>
                </div>
                {isLoggedIn && isAdmin && (
                  <div className="user-actions">
                    <div className="username">
                      <FaUser /> {username}
                    </div>
                    <Link to="/login" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            // If not admin, show regular links
            <>
              <Link to="/home" className={location.pathname === '/home' ? 'selected' : ''}>
                <FaHome /> Home
              </Link>
              <Link to="/about" className={location.pathname === '/about' ? 'selected' : ''}>
                <FaUser /> About
              </Link>
              <Link to="/review" className={location.pathname === '/review' ? 'selected' : ''}>
                <FaStar /> Review
              </Link>
              <Link to="/contact" className={location.pathname === '/contact' ? 'selected' : ''}>
                <FaEnvelope /> Contact
              </Link>
              <div className="user-container">
                <div className="icons">
                  <div className="fas fa-bars" id="menu-btn" onClick={navbarHandler}>
                    <FaBars />
                  </div>
                </div>
                {isLoggedIn && !isAdmin && (
                  <div className="user-actions">
                    <div className="username">
                      <FaUser /> {username}
                    </div>
                    <Link to="/home" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </Link>
                  </div>
                )}
                {!isLoggedIn && (
                  <div className="login-links">
                    <Link to="/login">
                      <FaSignInAlt /> Login
                    </Link>
                    <Link to="/register">
                      <FaUser /> Register
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
