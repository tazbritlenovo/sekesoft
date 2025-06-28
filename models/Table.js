const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  status: { type: String, enum: ['free', 'occupied', 'reserved'], default: 'free' }
});

module.exports = mongoose.model('Table', tableSchema);
