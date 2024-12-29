import mongoose from "mongoose";



const orderSchema = new mongoose.Schema({
    cliente: {
        type: String,
        require: true,
    },
    items: [
        {
            _id: {
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
    }
}, {timestamps: true}); // Agregar campo createdAt y updatedAt automáticamente



export default mongoose.model('Order', orderSchema);