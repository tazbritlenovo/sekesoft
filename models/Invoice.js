const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
