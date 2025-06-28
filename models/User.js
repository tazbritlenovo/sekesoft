const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  pin: { type: String, required: true }, // do ruajmë PIN-in e kriptuar
  role: { type: String, enum: ['kamarier', 'admin', 'menaxher'], default: 'kamarier' }
});

module.exports = mongoose.model('User', userSchema);
