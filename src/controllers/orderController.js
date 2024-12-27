import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';

export const createOrder = async (req, res) => {
    try {
        const { client, items } = req.body;

        if (!client || !items || items.length === 0) {
            return res.status(400).json({ message: 'Datos inválidos. El cliente o los productos no fueron proporcionados.' });
        }

        let total = 0;

        // Validar productos y calcular total
        for (const item of items) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado.` });
            }
            total += product.price * item.quantity;
        }

        // Crear pedido
        const newOrder = new orderModel({ client, items, total });
        await newOrder.save();

        res.status(201).json({ message: 'Pedido creado exitosamente.', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido.', error: error.message });
    }
};
