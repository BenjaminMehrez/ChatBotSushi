import productModel from "../models/productModel.js";

export const getFAQs = async (req, res) => {
    try {

        // Obtener todos los productos
        const products = await productModel.find({})
        const faqs = [
            { question: '¿Cuánto tarda en llegar mi pedido?', answer: 'El tiempo promedio de entrega es de 30 a 45 minutos.' },
            { question: '¿Cuál es el costo de envío?', answer: 'El costo de envío es de $200.' },
            { question: '¿Aceptan diferentes métodos de pago?', answer: 'Solo aceptamos pagos en efectivo' },
            { question: '¿Cuáles son sus platos más populares?', answer: 'Los platos populares son Uramaki dragón y Sashimi mixto.' },
        ];


        // Obtener la pregunta enviada desde el cliente
        const { question } = req.body;

        if (!question) return res.status(400).json({ message: 'Debes enviar una pregunta.' });

        // Manejar la pregunta 'Menu'
        if (question.toLowerCase() === 'menu'){
            return res.status(200).json({ answer: products })
        }

        // Buscar la respuesta en las preguntas frecuentes
        const faq = faqs.find(faq => faq.question.toLowerCase() === question.toLowerCase());

        if (faq) {
            return res.status(200).json({ answer: faq.answer }); 
        } else {
            return res.status(404).json({ message: 'No encontré una respuesta a tu pregunta.' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las preguntas frecuentes.', error: error.message });
    }
};

