const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sekret_super_i_forte';

// Regjistrim i përdoruesve (admin do shtojë më vonë nga backend)
router.post('/register', async (req, res) => {
  try {
    const { name, pin, role } = req.body;
    if (!name || !pin) return res.status(400).json({ message: 'Emri dhe PIN janë të detyrueshëm' });

    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ message: 'Ky emër përdoruesi ekziston' });

    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    const user = new User({ name, pin: hashedPin, role: role || 'kamarier' });
    await user.save();

    res.status(201).json({ message: 'Përdoruesi u krijua me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Login me emër dhe PIN
router.post('/login', async (req, res) => {
  try {
    const { name, pin } = req.body;
    if (!name || !pin) return res.status(400).json({ message: 'Emri dhe PIN janë të nevojshëm' });

    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ message: 'Përdoruesi nuk u gjet' });

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(400).json({ message: 'PIN i pasaktë' });

    const token = jwt.sign({ userId: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '12h' });

    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

module.exports = router;
