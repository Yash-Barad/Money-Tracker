import  { useState } from 'react';
import './header.css';
import { useAuth } from '../components/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo"></div>
        <h2 className="app-name">Money Tracker Pro</h2>
      </div>

      <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#dashboard" className="nav-link">Dashboard</a></li>
          <li><a href="#reports" className="nav-link">Reports</a></li>
          <li><a href="#settings" className="nav-link">Settings</a></li>
        </ul>
        <div className="user-info">
          <div className="avatar"></div>
          <span className="user-name">{user?.username || 'User'}</span>
          <div className="user-dropdown">
            <a href="#profile" className="dropdown-link">Profile</a>
            <a href="#settings" className="dropdown-link">Settings</a>
            <button onClick={handleLogout} className="dropdown-link logout-btn">
              Logout
            </button>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
      </nav>
    </header>
  );
};

export default Header;
