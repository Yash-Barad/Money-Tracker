import './App.css';
import Header from './components/header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { useState, useEffect } from 'react';
import { useAuth } from './components/AuthContext';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');
  
  const { user, login, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchBalance();
    }
  }, [isAuthenticated]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${process.env.REACT_APP_API_URL}/transactions`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(`Failed to fetch transactions: ${error.message}`);
    }
  };

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${process.env.REACT_APP_API_URL}/balance`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError(`Failed to fetch balance: ${error.message}`);
    }
  };

  const addNewTransaction = async (e) => {
    e.preventDefault();
    if (!name || !datetime || !description || !amount) {
      setError('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = `${process.env.REACT_APP_API_URL}/transaction`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          datetime,
          amount: parseFloat(amount),
          category
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      console.log('Transaction added:', json);

      setName('');
      setDatetime('');
      setDescription('');
      setAmount('');
      setCategory('Other');
      setError(null);

      await fetchTransactions();
      await fetchBalance();
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError(`Failed to add transaction: ${error.message}`);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${process.env.REACT_APP_API_URL}/transaction/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('Transaction deleted:', id);
      await fetchTransactions();
      await fetchBalance();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError(`Failed to delete transaction: ${error.message}`);
    }
  };

  // Show authentication pages if not logged in
  if (!isAuthenticated) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </>
    );
  }

  // Main app when authenticated
  return (
    <>
      <Header />
      <main>
        <div className="app-tabs">
          <button 
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            💰 Transactions
          </button>
        </div>

        {activeTab === 'dashboard' && <Dashboard />}

        {activeTab === 'transactions' && (
          <>
            <h1>
              ${Math.abs(balance).toFixed(2)}
              <span>{balance < 0 ? ' (Owned)' : ''}</span>
            </h1>

            {error && <p className="error">{error}</p>}

            <form onSubmit={addNewTransaction}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="New Item"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount (positive/negative)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit">Add Transaction</button>
            </form>

            <div className="transactions">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="transaction">
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                    <div className="category">{transaction.category}</div>
                  </div>
                  <div className="right">
                    <div className={`price ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                      {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <div className="datetime">
                      {new Date(transaction.datetime).toLocaleString()}
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTransaction(transaction._id)}
                      title="Delete Transaction"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
