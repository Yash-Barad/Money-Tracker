import  { useState } from 'react';
import './header.css';

const Header = ({ userName = 'User' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo"></div>
        <h2 className="app-name">Money Tracker App</h2>
      </div>

      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#dashboard" className="nav-link">Dashboard</a></li>
          <li><a href="#reports" className="nav-link">Reports</a></li>
        </ul>
        <div className="user-info">
          <div className="avatar"></div>
          <span className="user-name">{userName}</span>
          <div className="user-dropdown">
            <a href="#logout" className="dropdown-link">Logout</a>
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