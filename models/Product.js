const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },  // në lekë
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
