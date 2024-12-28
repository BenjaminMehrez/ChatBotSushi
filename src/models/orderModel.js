import mongoose from "mongoose";



const orderSchema = new mongoose.Schema({
    cliente: {
        type: String,
        require: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true,
            },
            quantity: {
                type: Number,
                required: true,
                min:1,
            }
        }
    ],
    address: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
}, {timestamps: true}); // Agregar campo createdAt y updatedAt automáticamente



export default mongoose.model('Order', orderSchema);