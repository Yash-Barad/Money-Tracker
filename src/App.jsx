import './App.css';
import Header from './components/header';
import { useState, useEffect } from 'react';

function App() {

  // By Usestate Hook set all the Values to the Initial Values

  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  // By UseEffect Hook try to render only when the site is loaded for forst time (Performance optimization)
  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  // Fetching Transactions

  const fetchTransactions = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/transactions`;
      console.log('Fetching transactions from:', url);
      const response = await fetch(url);
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

  // Fetch Balance 
  const fetchBalance = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/balance`;
      console.log('Fetching balance from:', url);
      const response = await fetch(url);
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

  // Add New Transaction

  const addNewTransaction = async (e) => {
    e.preventDefault();
    if (!name || !datetime || !description || !amount) {
      setError('Please fill all fields');
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/transaction`;
    console.log('Posting to:', url, { name, description, datetime, amount });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          datetime,
          amount: parseFloat(amount),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();

      // Log that Transaction is Added 
      console.log('Transaction added:', json);

      // Set All the Field Empty because all Transactions are stored into the Database(to Function Redundanchy)
      setName('');
      setDatetime('');
      setDescription('');
      setAmount('');
      setError(null);

      // Wait for Transaction adding or Deleting Process
      await fetchTransactions();
      await fetchBalance();
      // Handle Error(Exception) that Server is Not Responding 
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError(`Failed to add transaction: ${error.message}`);
    }
  };

  // To Delete Transactions via Id 

  const deleteTransaction = async (id) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/transaction/${id}`;
      console.log('Deleting transaction at:', url);
      const response = await fetch(url, {
        method: 'DELETE',
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

  // Render Part Start
  return (
    <>
      <Header />
      <main>
       {/* Balance */}
        <h1>
          ${Math.abs(balance).toFixed(2)}
          <span>{balance < 0 ? ' (Owned)' : ''}</span>
        </h1>

        {error && <p className="error">{error}</p>}
      {/*  Form for adding or Deleting Transactions */}
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
          <button type="submit">Add Transaction</button>
        </form>

        {/* Displaying Transactions from Database */}
        <div className="transactions">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
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
      </main>
    </>
  );
}

export default App;