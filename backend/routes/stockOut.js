// routes/stockOutwardRoutes.js
const express = require('express');
const StockOut = require('../models/StockOut');
const router = express.Router();


router.post('/stockOut/addItems', async (req, res) => {
    try {
        const { waiterName, productName, stockQty } = req.body;

        // Validate the inputs if needed

        // Assuming you have a StockOutward model, you can save the entry to the database
        const stockOutwardEntry = new StockOut({
            waiterName,
            productName,
            stockQty,
            date: new Date(),
        });

        await stockOutwardEntry.save();

        res.status(201).json({ message: 'Items added to stock outward entries successfully.' });
    } catch (error) {
        console.error('Error adding items to stock outward entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create stock outward entry
router.post('/stockOut', async (req, res) => {
    try {
        const { waiterName, productName, stockQty } = req.body;
        
        const stockOut = new StockOut({
            waiterName,
            productName,
            stockQty,
        });

        const savedStockOut = await stockOut.save();
        res.json(savedStockOut);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get list of stock outward entries
router.get('/stockOut', async (req, res) => {
    try {
        const stockOutwardList = await StockOut.find();
        res.json(stockOutwardList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get stock reports
router.get('/stockReport', async (req, res) => {
    try {
        // Aggregate data to calculate taken and remaining quantities
        const stockReports = await StockOut.aggregate([
            {
                $group: {
                    _id: {
                        waiterName: '$waiterName',
                        productName: '$productName',
                    },
                    stockQty: { $sum: '$stockQty' },
                },
            },
            {
                $project: {
                    _id: 0,
                    waiterName: '$_id.waiterName',
                    productName: '$_id.productName',
                    stockQty: 1,
                },
            },
        ]);

        // Fetch additional details for each stock report
        const detailedStockReports = await Promise.all(
            stockReports.map(async (report) => {
                const totalTakenQty = await StockOut.aggregate([
                    {
                        $match: {
                            waiterName: report.waiterName,
                            productName: report.productName,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalTakenQty: { $sum: '$stockQty' },
                        },
                    },
                ]);

                report.takenQty = totalTakenQty.length ? totalTakenQty[0].totalTakenQty : 0;
                report.remainingQty = report.stockQty - report.takenQty;

                return report;
            })
        );

        res.json(detailedStockReports);
    } catch (error) {
        console.error('Error fetching stock reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;