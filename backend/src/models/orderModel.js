import mongoose from "mongoose";



const orderSchema = new mongoose.Schema({
    client: {
        type: String,
        require: true,
    },
    items: [
        {
            food: {
                type: Number,
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