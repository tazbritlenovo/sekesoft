// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Merr të gjithë përdoruesit (vetëm admin ose menaxher)
router.get('/', auth(['admin', 'menaxher']), async (req, res) => {
  try {
    const users = await User.find({}, '-pin'); // mos dërgo PIN-in
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

module.exports = router;
