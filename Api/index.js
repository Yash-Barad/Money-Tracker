const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Transaction = require('./models/transaction');
const app = express();

// Use cors to set Origin whether data is fetching from This Site
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

//Connect with the Mongoose (Default 27017 Localhost)
mongoose.connect('mongodb://localhost:27017/App', {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
})
  .then(() => console.log('Connected to MongoDB (app database)'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Add Response Whether Response is Fetched
app.get('/api/test', (req, res) => {
  console.log('GET /api/test called');
  res.json({ message: 'test ok' });
});

// Add Transactions

app.post('/api/transaction', async (req, res) => {
  try {
    console.log('POST /api/transaction called with body:', req.body);
    const { name, description, datetime, amount } = req.body;
    if (!name || !description || !datetime || !amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const transaction = new Transaction({ name, description, datetime, amount });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// Fetch all the Transactions

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ datetime: -1 });
    // Send as a Json Object to use up with Map Function
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Calculate Balance (It work all the time whether the transaction is Added or Deleted)

app.get('/api/balance', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const balance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    res.json({ balance });
  } catch (error) {
    console.error('Error calculating balance:', error);
    res.status(500).json({ error: 'Failed to calculate balance' });
  }
});

// Delete The Transaction

app.delete('/api/transaction/:id', async (req, res) => {
  try {
    console.log('DELETE /api/transaction called with id:', req.params.id);
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});


// Run this Server Using Nodemon on Local Host 4040
app.listen(4040, () => {
  console.log('Server running on http://localhost:4040');
});