import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
    food: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {timestamps: true});


// Middleware para incertar el numero de food
ProductSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastProduct = await mongoose.model('Product').findOne().sort({ food: -1 });
        this.food = lastProduct ? lastProduct.food + 1 : 1; // Incrementa el valor o inicia en 1
    }
    next()
})


export default mongoose.model("Product", ProductSchema);