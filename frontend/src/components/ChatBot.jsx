import React, { useState, useEffect, useRef } from "react";


const ChatBot = () => {

    const [messages, setMessages] = useState([{ sender: 'bot', text: '¡Hola! 👋 ¿En qué puedo ayudarte hoy? Selecciona una opción abajo para comenzar.' }]);
    const [showFAQButtons, setShowFAQButtons] = useState(false); // Estado para mostrar las preguntas frecuentes
    const [orderFlow, setOrderFlow] = useState(false); // Estado para mostrar el flujo de pedido
    const [orderStep, setOrderStep] = useState(0); // Estado para controlar el paso del pedido
    const [orderData, setOrderData] = useState({}); // Estado para almacenar los datos del pedido
    const [orderInput, setOrderInput] = useState(''); // Estado para almacenar el input del pedido

    // Obtener la fecha actual
    const date = new Date()
    const opcions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateSpanish = new Intl.DateTimeFormat('es-ES', opcions).format(date)
 
    // Preguntas frecuentes
    const faqs = [
        '¿Cuánto tarda en llegar mi pedido?',
        '¿Cuál es el costo de envío?',
        '¿Aceptan diferentes métodos de pago?',
        '¿Cuáles son sus platos más populares?'
    ];

    // Referencia el ultimo mensaje
    const messagesEndRef = useRef(null);

    // Funcion para desplazar automaticamente al final
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Usar efecto para desplegar el scroll al final cuando los mensajes cambien
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // Manejar la accion segun el boton seleccionado
    const handleActionClick = async (action) => {
        // Agregar el mensaje del cliente al historial
        const userMessage = {
            sender: "client",
            text: action === "menu"
                ? "Quiero ver el menú."
                : action === "pedido"
                ? "Quiero hacer un pedido."
                : action === "preguntas"
                ? "Tengo algunas preguntas"
                : action === "abiertos"
                ? "¿Están abiertos?"
                : "Acción no reconocida."
        };

        // Agregar mensaje del usuario primero
        setMessages((prevMessages) => [...prevMessages, userMessage]);


        // Determinar la respuesta del bot
        let botMessage;

        if (action === "menu") {
            
            try {
                const response = await fetch('http://localhost:3000/products');
                const products = await response.json();

                botMessage = {
                    sender: "bot",
                    text: (
                        <div>
                            <p>Menú:</p>
                            <ul>
                                {products.map((product) => (
                                    <li key={product._id}>
                                        <strong>ID: {product._id}</strong> - {product.name} - ${product.price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            } catch (error) {
                botMessage = { sender: "bot", text: "No se pudo cargar el menú en este momento." };
            }

        } else if (action === "pedido") {
            setOrderFlow(true); // Activar flujo de pedido
            setOrderStep(0); // Reiniciar el paso del flujo
            botMessage = { sender: "bot", text: "Por favor, dime tu nombre para comenzar con el pedido." };
        } else if (action === "preguntas") {
            // Logica para preguntas frecuentes
            setShowFAQButtons(true);
            botMessage = {
                sender: "bot",
                text: "Aquí están algunas preguntas frecuentes. Selecciona una para obtener más información.",
            };
        } else if (action === "abiertos") {
            botMessage = {
                sender: "bot",
                text: date.getHours() >= 10 && date.getHours() < 20
                        ? "Sí, estamos abiertos."
                        : "Lo siento, estamos cerrados. Nuestro horario es de lunes a viernes de 10:00 a 20:00.",
            };
        } else {
            botMessage = {
                sender: "bot",
                text: "Lo siento, no entendí tu solicitud.",
            };
        }

        setMessages((prevMessages) => [...prevMessages, botMessage]);
    }


    const handleFAQClick = async (question) => {
        setShowFAQButtons(false); // Cierra las preguntas frecuentes
        const userMessage = { sender: 'client', text: question}
        setMessages((prevMessages) => [...prevMessages, userMessage])

        try {
            const response = await fetch('http://localhost:3000/faq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: data.answer || 'Lo siento, no encontré una respuesta.' }
                ]);
            } else {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: 'Hubo un problema con la respuesta.' }
                ]);
            }
        } catch (error) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Lo siento, no puedo responder en este momento' }
            ]);
        }
    }

    const handleOrderStep = async (input) => {
        const newOrderData = {...orderData} // Copiar datos previos 
        let botMessage;

        switch (orderStep) {
            case 0: // Paso para ingresar el nombre completo
                newOrderData.client = input;
                botMessage = 'Por favor, elige un producto del menú. Ingresa el ID del producto.';
                // console.log('case0',newOrderData);
                break;
            case 1: // Paso para monstrar menú y recibir ID del producto
                const productResponse = await fetch('http://localhost:3000/products');
                const products = await productResponse.json();

                if (!products.find(p => p._id === input)) {
                    botMessage = 'El ID del producto no es válido. Por favor, ingrese un ID válido.';
                    setOrderStep(orderStep); // Repetir paso
                    break;
                }
                
                newOrderData.items = [{ _id: input, quantity: 0 }]; // Agregar producto al pedido
                botMessage = '¿Cuántas unidades de este producto deseas?';
                // console.log('case1',newOrderData);
                break;
            case 2: // Paso para pedir la cantidad de productos
                if (isNaN(input) || parseInt(input, 10) < 1) {
                    botMessage = 'Por favor, ingresa una cantidad válida.';
                    setOrderStep(orderStep); // Repetir paso
                    break;
                }    

                newOrderData.items[0].quantity = parseInt(input, 10);
                botMessage = 'Por favor, ingresa tu dirección de envío.';
                // console.log('case2',newOrderData);
                break;
            case 3: 
                newOrderData.address = input;
                    
                try {
                    // Enviar pedido al backend
                    const response = await fetch('http://localhost:3000/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newOrderData),
                    })

                    const data = await response.json();
                    // console.log(data);
                    

                    if (response.ok) {
                        botMessage = `Pedido realizado con éxito. Resumen del pedido: 
                        Cliente: ${newOrderData.client}
                        Producto(s): ${data.order.items.map(item => `${item._id} x ${item.quantity}`).join(', ')}
                        Total a pagar: $${data.order.total}.
                        Dirección de envío: ${data.order.address}`;
                    } else {
                        botMessage = `Hubo un problema al procesar tu pedido: ${data.message}`;
                    }

                } catch (error) {
                    botMessage = "Error al procesar el pedido. Inténtalo más tarde.";
                }
                // console.log('case3',newOrderData);
                
                setOrderFlow(false); // Finalizar flujo de pedido
                break;
                
            default:
                botMessage = "Algo salió mal. Por favor, intenta nuevamente.";
                setOrderFlow(false); // Terminar flujo en caso de error
                break;
        }

        // Actualizar datos del pedido
        setOrderData(newOrderData);
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botMessage}])

        // Avanzar al siguiente paso de pedido
        if (orderStep < 3) {
            setOrderStep(orderStep + 1);
        }

    }

    const handleOrderInput = (input) => {
        if (input.trim()) {
            setMessages((prevMessages) => [...prevMessages, { sender: 'client', text: input }])
            handleOrderStep(input);
            setOrderInput('') // Limpiar el input
        }
    };
    

    return (
        <div className="flex flex-col justify-between max-w-md mx-auto h-5/6 bg-gray-100 border border-gray-300 rounded-md shadow-lg">
            {/* Header */}
            <div className="shadow-md py-4 px-6 rounded-t-md text-center">
                <h1 className="text-lg font-semibold">ChatBot Sushi</h1>
                <span className="text-sm">{dateSpanish}</span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && (
                            <img src="/bot.png" alt="Bot" className="w-8 h-8 rounded-full mr-2" />
                        )}
                        <span className={`inline-block px-4 py-2 rounded-lg text-sm w-60 drop-shadow-md 
                            ${msg.sender === 'client' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Action Buttons */}
            {!showFAQButtons && (
                <div className="p-4 space-y-2">
                    <h2 className="text-center text-gray-700 font-semibold mb-2">¿En qué puedo ayudarte?</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleActionClick('menu')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm">Menu</button>
                        <button onClick={() => handleActionClick('pedido')} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded text-sm">Hacer Pedido</button>
                        <button onClick={() => handleActionClick('preguntas')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded text-sm">Preguntas Frecuentes</button>
                        <button onClick={() => handleActionClick('abiertos')} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded text-sm">¿Están abiertos?</button>
                    </div>
                </div>
            )}

            {/* FAQ Buttons */}
            {showFAQButtons && (
                <div className="p-4 space-y-2">
                    <h2 className="text-center text-gray-700 font-semibold mb-2">Preguntas Frecuentes</h2>
                    <div className="grid grid-cols-1 gap-2">
                        {faqs.map((question, index) => (
                            <button key={index} onClick={() => handleFAQClick(question)} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm">{question}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* // Renderizar el flujo de pedido */}
            {orderFlow && (
                <div className="p-4">
                    <input
                        type="text"
                        value={orderInput}
                        onChange={(e) => setOrderInput(e.target.value)}
                        placeholder="Ingresa tu respuesta aquí..."
                        className="w-full p-2 border rounded"
                    />
                    <button onClick={() => handleOrderInput(orderInput)} className="w-full bg-green-500 text-white mt-2 py-2 rounded">
                        Enviar
                    </button>
                </div>
            )}
        </div>
    )
}

export default ChatBot;