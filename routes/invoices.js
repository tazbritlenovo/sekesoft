const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// Krijo faturë (kamarier, menaxher, admin)
router.post('/', authMiddleware(['kamarier', 'menaxher', 'admin']), async (req, res) => {
  try {
    const { tableNumber, products, createdBy } = req.body; // products: [{ productId, quantity }]
    if (!tableNumber || !products || products.length === 0) return res.status(400).json({ message: 'Të dhënat e faturës nuk janë të plota' });

    // Llogarit totalin
    let total = 0;
    for (const item of products) {
      const prod = await Product.findById(item.productId);
      if (!prod) return res.status(400).json({ message: `Produkti me id ${item.productId} nuk u gjet` });
      total += prod.price * item.quantity;
    }

    const invoice = new Invoice({ tableNumber, products, total, createdBy });
    await invoice.save();

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Merr të gjitha faturat (admin/menaxher)
router.get('/', authMiddleware(['admin', 'menaxher']), async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('products.productId').populate('createdBy').sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

// Gjenero PDF faturë sipas ID-së
router.get('/pdf/:id', authMiddleware(['admin', 'menaxher', 'kamarier']), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('products.productId').populate('createdBy');
    if (!invoice) return res.status(404).json({ message: 'Fatura nuk u gjet' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=fatura_${invoice._id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('FATURA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Tavolina: ${invoice.tableNumber}`);
    doc.text(`Data: ${invoice.createdAt.toLocaleString('sq-AL')}`);
    doc.text(`Krijuar nga: ${invoice.createdBy ? invoice.createdBy.name : 'I panjohur'}`);
    doc.moveDown();

    doc.fontSize(16).text('Produkte:');
    invoice.products.forEach(item => {
      doc.text(`${item.productId.name} x${item.quantity} - ${item.productId.price * item.quantity} Lekë`);
    });
    doc.moveDown();

    doc.fontSize(16).text(`Totali: ${invoice.total} Lekë`, { align: 'right' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim serveri' });
  }
});

module.exports = router;
