const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Krijo produkt (vetëm admin/menaxher)
router.post('/', authMiddleware(['admin', 'menaxher']), async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) return res.status(400).json({ message: 'Plotësoni të gjitha fushat' });

    const product = new Product({ name, category, price });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Merr të gjithë produktet
router.get('/', authMiddleware(['admin', 'menaxher', 'kamarier']), async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Përditëso produktin
router.put('/:id', authMiddleware(['admin', 'menaxher']), async (req, res) => {
  try {
    const { name, category, price, active } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produkti nuk u gjet' });

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    if (active !== undefined) product.active = active;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Fshij produktin (mund të bëhet inactive)
router.delete('/:id', authMiddleware(['admin', 'menaxher']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produkti nuk u gjet' });

    product.active = false;
    await product.save();
    res.json({ message: 'Produkti u deaktivizua' });
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

module.exports = router;
