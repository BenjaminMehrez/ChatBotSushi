export const getFAQs = async (req, res) => {
    try {
        const faqs = [
            { question: '¿Están abiertos?', answer: 'Sí, estamos abiertos de lunes a viernes de 10:00 a 20:00.' },
            { question: '¿Cómo hago un pedido?', answer: 'Para hacer un pedido, selecciona los productos que deseas y haz clic en "Hacer pedido".' },
            { question: '¿Cuánto tarda en llegar mi pedido?', answer: 'El tiempo promedio de entrega es de 30 a 45 minutos.' },
            { question: '¿Puedo cancelar mi pedido?', answer: 'Sí, siempre y cuando no haya sido despachado. Contáctanos a través del chat en línea.' },
            { question: '¿Cuál es el costo de envío?', answer: 'El costo de envío es de $200.' },
        ];


        // Obtener la pregunta enviada desde el cliente
        const { question } = req.body;

        if (!question) return res.status(400).json({ message: 'Debes enviar una pregunta.' });

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

