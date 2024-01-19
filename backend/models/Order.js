const mongoose = require('mongoose')
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
    tableId:
    {
        type: String,
        required: true
    },
    items:
        [{
            name: String,
            price: Number,
            quantity: Number
        }],
    subtotal:
    {
        type: Number,
        required: true
    },
    CGST:
    {
        type: Number,
        required: true
    },
    SGST: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    isTemporary: {
        type: Boolean,
        default: true, // Set as true for temporary bills
    },
    orderDate: {
        type: Date,
        default: Date.now // Set as the current Date and Time when the order is saved
    },
    acPercentageAmount: {
        type: Number, // Add a new field for AC charges
    },
    isPrint: {
        type: Number,
        default: 0
    },
    cashAmount: {
        type: String,
        // required: true,
    },
    onlinePaymentAmount: {
        type: String,
        // required: true,
    },
    complimentaryAmount:{
        type: String,
    },
    dueAmount: {
        type: String,
        // required: true,
    },
    discount: {
        type: String,
        // required: true,
    },
    orderNumber: {
        type: String, // Assuming orderNumber is a string
        // required: true,
        unique: true,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// orderSchema.pre('save', async function (next) {
//     try {
//         // Find the highest order number in the collection
//         const highestOrder = await this.constructor.findOne({}, { orderNumber: 1 })
//             .sort({ orderNumber: -1 })
//             .limit(1);

//         let latestOrderNumber;
//         if (highestOrder) {
//             const lastOrderNumber = highestOrder.orderNumber;
//             const orderNumberSuffix = parseInt(lastOrderNumber, 10);
//             latestOrderNumber = orderNumberSuffix + 1;
//         } else {
//             // Set initial order number if no orders exist
//             latestOrderNumber = 1;
//         }

//         // Set the order number in the document
//         this.orderNumber = latestOrderNumber;

//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// orderSchema.pre('save', async function (next) {
//     try {
//         // Find the highest order number in the collection
//         const highestOrder = await this.constructor.findOne({}, { orderNumber: 1 })
//             .sort({ orderNumber: -1 })
//             .limit(1);

//         let latestOrderNumber;
//         if (highestOrder) {
//             const lastOrderNumber = highestOrder.orderNumber;
//             const orderNumberSuffix = parseInt(lastOrderNumber.replace('BILL-', ''), 10);
//             latestOrderNumber = `BILL-${orderNumberSuffix + 1}`;
//         } else {
//             // Set initial order number if no orders exist
//             latestOrderNumber = 'BILL-1000';
//         }

//         // Set the order number in the document
//         this.orderNumber = latestOrderNumber;

//         next();
//     } catch (error) {
//         next(error);
//     }
// });


orderSchema.pre('save', async function (next) {
    try {
        // Get the total count of documents in the collection
        const totalCount = await this.constructor.countDocuments();

        // Generate the new order number based on the total count
        const newOrderNumber = `${totalCount + 1}`;

        // Set the order number in the document
        this.orderNumber = newOrderNumber;

        next();
    } catch (error) {
        next(error);
}
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order

