const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const authMiddleware = require('../middleware/auth');

// Krijo tavolinë (vetëm admin/menaxher)
router.post('/', authMiddleware(['admin', 'menaxher']), async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) return res.status(400).json({ message: 'Numri i tavolinës është i nevojshëm' });

    const exists = await Table.findOne({ number });
    if (exists) return res.status(400).json({ message: 'Tavolina ekziston' });

    const table = new Table({ number });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Merr të gjitha tavolinat
router.get('/', authMiddleware(['admin', 'menaxher', 'kamarier']), async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Përditëso statusin e tavolinës
router.put('/:id', authMiddleware(['admin', 'menaxher']), async (req, res) => {
  try {
    const { status } = req.body;
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: 'Tavolina nuk u gjet' });

    if (status && ['free', 'occupied', 'reserved'].includes(status)) {
      table.status = status;
      await table.save();
      res.json(table);
    } else {
      res.status(400).json({ message: 'Status i pavlefshëm' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Fshij tavolinën
router.delete('/:id', authMiddleware(['admin', 'menaxher']), async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tavolina u fshi' });
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

module.exports = router;
