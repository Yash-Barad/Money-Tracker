import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Money Tracker</h3>
          <p>Take control of your finances with our powerful tracking tools.</p>
        </div>
        
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li><a href="#expense-tracking">Expense Tracking</a></li>
            <li><a href="#budgeting">Budgeting</a></li>
            <li><a href="#reports">Financial Reports</a></li>
            <li><a href="#categories">Category Management</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="#twitter" aria-label="Twitter">🐦</a>
            <a href="#facebook" aria-label="Facebook">📘</a>
            <a href="#linkedin" aria-label="LinkedIn">💼</a>
            <a href="#github" aria-label="GitHub">🐙</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Money Tracker App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;