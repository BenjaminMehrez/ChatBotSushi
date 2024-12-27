import mongoose from "mongoose";



const orderSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Relacion con el esquema de Cliente
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
    total: {
        type: Number,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
}, {timestamps: true}); // Agregar campo createdAt y updatedAt automáticamente



export default mongoose.model('Order', orderSchema);