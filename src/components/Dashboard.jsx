import './Dashboard.css';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    transactionCount: 0
  });
  const [chartData, setChartData] = useState({ monthlyData: {}, categoryData: {} });

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Balance</h3>
            <p className="stat-value">${Math.abs(stats.balance).toFixed(2)}</p>
            <p className="stat-label">{stats.balance < 0 ? 'You owe' : 'Available'}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Total Income</h3>
            <p className="stat-value positive">${stats.income.toFixed(2)}</p>
            <p className="stat-label">This month</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📉</div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <p className="stat-value negative">${stats.expenses.toFixed(2)}</p>
            <p className="stat-label">This month</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Transactions</h3>
            <p className="stat-value">{stats.transactionCount}</p>
            <p className="stat-label">Total count</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Overview</h3>
          <div className="chart-placeholder">
            {Object.keys(chartData.monthlyData).length > 0 ? (
              <div className="bar-chart">
                {Object.entries(chartData.monthlyData).map(([month, data]) => (
                  <div key={month} className="bar-group">
                    <div className="bar-label">{month}</div>
                    <div className="bars">
                      <div 
                        className="bar income-bar" 
                        style={{ height: `${(data.income / Math.max(stats.income, 1)) * 100}%` }}
                        title={`Income: $${data.income}`}
                      ></div>
                      <div 
                        className="bar expense-bar" 
                        style={{ height: `${(data.expenses / Math.max(stats.expenses, 1)) * 100}%` }}
                        title={`Expenses: $${data.expenses}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <div className="chart-placeholder">
            {Object.keys(chartData.categoryData).length > 0 ? (
              <div className="pie-chart">
                {Object.entries(chartData.categoryData).map(([category, amount]) => (
                  <div key={category} className="category-item">
                    <span className="category-name">{category}</span>
                    <span className="category-amount">${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;