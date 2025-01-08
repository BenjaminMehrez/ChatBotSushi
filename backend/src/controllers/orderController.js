import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';

export const createOrder = async (req, res) => {
    try {
        // console.log('Datos recibidos en el servidor:', req.body); // Verifica los datos aquí
        const { client, items, address } = req.body;
        

        if (!client || !items || items.length === 0 || !address) {
            return res.status(400).json({ message: 'Datos inválidos. El cliente o los productos no fueron proporcionados.' });            
        }

        let total = 0;

        // Validar productos y calcular total
        for (const item of items) {
            const product = await productModel.findOne({ food: item.food });
            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${item.food} no encontrado.` });
            }
            total += product.price * item.quantity;
        }

        // Crear pedido
        const newOrder = new orderModel({ client, items, address, total });
        await newOrder.save();

        res.status(201).json({ message: 'Pedido creado exitosamente.', order: newOrder });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el pedido.', error: error.message });
    }
};



export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No hay pedidos disponibles.' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos.', error: error.message });
    }

}