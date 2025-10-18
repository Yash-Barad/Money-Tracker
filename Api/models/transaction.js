const { model, Schema } = require('mongoose');

const TransactionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  datetime: { type: Date, required: true },
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, default: 'Other' }
});

const TransactionModel = model('Transaction', TransactionSchema);
module.exports = TransactionModel;
