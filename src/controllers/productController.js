import productModel from '../models/productModel.js';


export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        if (products.length === 0) {
            return res.status(404).json({ message: 'No hay productos disponibles.' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};


export const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const newProduct = new productModel({ name, price, description });
        await newProduct.save();
        res.status(201).json({ message: 'Producto creado exitosamente.', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto.', error: error.message });
    }
}