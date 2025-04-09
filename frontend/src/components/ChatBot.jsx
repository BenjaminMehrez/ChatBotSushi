import React, { useState, useEffect, useRef } from "react";


const ChatBot = () => {

    const [messages, setMessages] = useState([{ sender: 'bot', text: '¡Hola! 👋 ¿En qué puedo ayudarte hoy? Selecciona una opción abajo para comenzar.' }]); // Estado para almacenar los mensajes
    const [showFAQButtons, setShowFAQButtons] = useState(false); // Estado para mostrar las preguntas frecuentes
    const [orderFlow, setOrderFlow] = useState(false); // Estado para mostrar el flujo de pedido
    const [orderStep, setOrderStep] = useState(0); // Estado para controlar el paso del pedido
    const [orderData, setOrderData] = useState({}); // Estado para almacenar los datos del pedido
    const [orderInput, setOrderInput] = useState(''); // Estado para almacenar el input del pedido

    // URL de la API
    const API = import.meta.env.VITE_API

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
        if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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
            // console.log('API:', API);
            
            try {
                setOrderFlow(false); // Desactivar flujo de pedido
                const response = await fetch(`${API}/products`); // Obtener los productos
                const products = await response.json(); // Convertir la respuesta a JSON

                // Mostrar el menú
                botMessage = {
                    sender: "bot",
                    text: (
                        <div>
                            <p>Menú:</p>
                            <ul>
                                {products.map((product) => (
                                    <li key={product._id}>
                                        <strong>{product.name}</strong> - ${product.price}
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
            if (date.getHours() >= 10 && date.getHours() < 20) {
                setOrderFlow(true); // Activar flujo de pedido
                setOrderStep(0); // Reiniciar el paso del flujo
                botMessage = { sender: "bot", text: "Por favor, dime tu nombre para comenzar con el pedido." };
            } else {
                botMessage = {
                    sender: "bot",
                    text: "Lo siento, estamos cerrados. Nuestro horario es de lunes a viernes de 10:00 a 20:00.",
                };
            }
        } else if (action === "preguntas") {
            setOrderFlow(false); // Desactivar flujo de pedido
            // Logica para preguntas frecuentes
            setShowFAQButtons(true);
            botMessage = {
                sender: "bot",
                text: "Aquí están algunas preguntas frecuentes. Selecciona una para obtener más información.",
            };
        } else if (action === "abiertos") {
            setOrderFlow(false); // Desactivar flujo de pedido
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

        setMessages((prevMessages) => [...prevMessages, botMessage]); // Agregar la respuesta al historial
    }

    // Funcion para manejar las preguntas frecuentes
    const handleFAQClick = async (question) => {
        setShowFAQButtons(false); // Cierra las preguntas frecuentes
        const userMessage = { sender: 'client', text: question} // Agregar el input al historial
        setMessages((prevMessages) => [...prevMessages, userMessage]) // Agregar el input al historial

        try {
            const response = await fetch(`${API}/faq`, { // Realizar la solicitud
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
        let newOrderData = { ...orderData }; // Copiar datos previos

        // Reiniciar datos si estamos en el primer paso
        if (orderStep === 0) {
            newOrderData = {
                client: "",
                items: [],
                address: ""
            };
        }

        // console.log(newOrderData);
        
        let botMessage;
    
        try {
            // Obtener los productos
            const productResponse = await fetch(`${API}/products`);
            if (!productResponse.ok) throw new Error("Error al obtener los productos");
            const products = await productResponse.json();
    
            switch (orderStep) {
                case 0: // Paso para mostrar menú
                    newOrderData.client = input;
                    botMessage = (
                        <div>
                            <span>Por favor, ingresa el número de plato.</span>
                            <p className="mt-2">Menú:</p>
                            <ul>
                                {products.map((product) => (
                                    <li key={product.food}>
                                        <strong>{product.food}</strong> - {product.name} - ${product.price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                    // console.log('case0', newOrderData);
                    
                    break;
    
                case 1: // Paso para mostrar menú y recibir ID del producto
                    const selectedProduct = products.find((p) => p.food === parseInt(input));
                    if (!selectedProduct) {
                        botMessage = "El plato ingresado no es válido. Por favor, ingrese un plato válido.";
                        setTimeout(() => setOrderStep(orderStep), 0); // Retornamos al paso actual
                        break;
                    }
                    
                    // Agregar el producto al pedido
                    newOrderData.items = newOrderData.items || []; 
                    newOrderData.items.push({ food: selectedProduct.food, quantity: 0 });
    
                    botMessage = `¿Cuántas unidades de ${selectedProduct.name} deseas?`;
                    // console.log('case1', newOrderData);

                    break;
    
                case 2: // Paso para pedir la cantidad de productos
                    const quantity = parseInt(input, 10);
                    if (isNaN(quantity) || quantity < 1) {
                        botMessage = "Por favor, ingresa una cantidad válida.";
                        break;
                    } else if (quantity > 10) {
                        botMessage = "Por favor, ingresa una cantidad menor a 10.";
                        setTimeout(() => setOrderStep(orderStep), 0); // Retornamos al paso actual
                        break;
                    }
                
                    // Actualizar la cantidad del producto
                    const lastItemIndex = newOrderData.items.length - 1;
                    newOrderData.items[lastItemIndex].quantity = quantity;
                
                    botMessage = '¿Quieres agregar otro producto? Ingresa el plato del producto. Si no, escribe "no".';
                
                    // Actualizamos los datos y avanzamos al paso 3
                    setOrderData(newOrderData);
                    setTimeout(() => setOrderStep(3), 0); // Aseguramos la transición al paso 3
                    // console.log('case2', newOrderData);

                    break;
                
    
                case 3: // Confirmar agregar más productos o pedir dirección
                    if (input.toLowerCase() === "no") {
                        botMessage = "Por favor, ingresa la dirección de entrega.";
                        setOrderStep(4); // Avanzar al paso 4
                    } else {
                        const selectedProduct = products.find((p) => p.food === parseInt(input)); // Buscar el producto seleccionado
                        if (!selectedProduct) {
                            botMessage = "El plato ingresado no es válido. Por favor, ingrese un plato válido.";
                        } else if (newOrderData.items.some((item) => item.food === selectedProduct.food)) {
                            botMessage = `Ya agregaste ${selectedProduct.name}. Por favor, ingresa otro plato.`;
                            setTimeout(() => setOrderStep(orderStep), 0); // Retornamos al paso actual
                        } else {
                            // Agregar el producto al pedido
                            newOrderData.items = newOrderData.items || [];
                            newOrderData.items.push({ food: selectedProduct.food, quantity: 0 });
                
                            // Actualizar estado y enviar mensaje
                            botMessage = `¿Cuántas unidades de ${selectedProduct.name} deseas?`;
                
                            // Forzar la actualización del paso 2 mediante una función o una cola
                            setOrderData(newOrderData); // Actualiza el pedido
                            setTimeout(() => setOrderStep(2), 0); // Garantiza que el cambio de paso ocurra después de renderizar
                        }
                    }
                    // console.log('case3', newOrderData);

                    break;
                    
    
                case 4: // Enviar pedido
                    newOrderData.address = input; // Actualizar la dirección
    
                    try {
                        const response = await fetch(`${API}/orders`, { // Realizar la solicitud
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(newOrderData),
                        });
    
                        const data = await response.json();

                        // Mostrar el resumen del pedido
                        if (response.ok) { 
                            botMessage = (
                                <div>
                                    <span>Pedido realizado con éxito. Resumen del pedido:</span>
                                    <p className="mt-2">Cliente: {data.order.client}</p>
                                    <ul>
                                        {data.order.items.map((item) => (
                                            <li key={item.food}>
                                                {item.quantity} x {products.find((p) => p.food === item.food).name} - $
                                                {item.quantity * products.find((p) => p.food === item.food).price}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-2">Total: ${data.order.total}</p>
                                    <p className="mt-2">Dirección de envío: {data.order.address}</p>
                                </div>
                            );
                        } else {
                            botMessage = `Hubo un problema al procesar tu pedido: ${data.message}`;
                        }
                    } catch (error) {
                        botMessage = "Error al procesar el pedido. Inténtalo más tarde.";
                    }
                    // console.log('case4', newOrderData);

    
                    setOrderFlow(false); // Finalizar flujo de pedido
                    break;
    
                default:
                    botMessage = "Algo salió mal. Por favor, intenta nuevamente.";
                    setOrderFlow(false); // Finalizar flujo de pedido
                    break;
            }
    
            // Actualizar datos del pedido y avanzar al siguiente paso
            setOrderData(newOrderData);
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botMessage }]);
            if (orderStep < 4) setOrderStep(orderStep + 1);
    
        } catch (error) {
            console.error("Error en el manejo del pedido:", error);
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Hubo un error inesperado. Inténtalo nuevamente." }]);
        }
    };
    
    const handleOrderInput = (input) => {
        if (input.trim()) {
            setMessages((prevMessages) => [...prevMessages, { sender: 'client', text: input }]) // Agregar el input al historial
            handleOrderStep(input); // Manejar el input
            setOrderInput('') // Limpiar el input
        }
    };
    

    return (
        <div className="flex flex-col mx-auto min-w-lg max-w-lg h-5/6 bg-zinc-900 text-white rounded-md shadow-lg">
            {/* Header */}
            <div className="shadow-md py-4 px-6 text-center ">
                <h1 className="text-lg font-semibold flex justify-center items-center gap-2 py-1"><img className="w-8 h-8" src="/sushi.svg" alt="sushi" /> ChatBot Sushi</h1>
                <span className="text-sm">{dateSpanish}</span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && ( <img src="/bot.png" alt="Bot" className="w-8 h-8 rounded-full mr-2   " />)}
                        <span className={`max-w-60 py-2 px-4 rounded-lg text-sm font-medium 
                            ${msg.sender === 'client' ? 'bg-gray-700' : 'bg-slate-200 text-gray-800 sm:mr-32'}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Action Buttons */}
            {!showFAQButtons && (
                <div className="p-4 space-y-2">
                    <h2 className="text-center font-semibold mb-2">¿En qué puedo ayudarte?</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleActionClick('menu')} className="bg-red-700 hover:bg-red-800 text-white font-medium rounded text-sm flex items-center justify-center pr-3 py-1"><img className="w-10" src="/menu.svg" alt="menu" /> Menu</button>
                        <button onClick={() => handleActionClick('pedido')} className="bg-green-700 hover:bg-green-800 text-white font-medium rounded text-sm flex items-center justify-center pr-3 py-1"><img className="w-6 ml-4 sm:ml-0" src="/order.svg" alt="order" /> Hacer Pedido</button>
                        <button onClick={() => handleActionClick('preguntas')} className="bg-yellow-700 hover:bg-yellow-800 text-white font-medium rounded text-sm flex items-center justify-center pr-4 py-1"><img className="w-6" src="/question.svg" alt="question" /> Preguntas</button>
                        <button onClick={() => handleActionClick('abiertos')} className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded text-sm flex items-center justify-center pr-3 py-1"><img className="w-8 ml-2 sm:ml-0" src="/open.svg" alt="open" /> ¿Están abiertos?</button>
                    </div>
                </div>
            )}

            {/* FAQ Buttons */}
            {showFAQButtons && (
                <div className="p-4 space-y-2">
                    <h2 className="text-center font-semibold mb-2">Preguntas Frecuentes</h2>
                    <div className="grid grid-cols-1 gap-2">
                        {faqs.map((question, index) => (
                            <button key={index} onClick={() => handleFAQClick(question)} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-8 rounded text-sm">{question}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* // Renderizar el flujo de pedido */}
            {orderFlow && (
                <div className="flex justify-between p-4 gap-2">
                    <input
                        type="text"
                        value={orderInput}
                        onChange={(e) => setOrderInput(e.target.value)}
                        placeholder="Ingresa tu respuesta aquí..."
                        className="w-full text-black p-2 border rounded outline-none font-medium bg-slate-200"
                    />
                    <button onClick={() => handleOrderInput(orderInput)} className="bg-zinc-900 border-white border p-2 rounded">
                        <img className="w-8" src="/paper.svg" alt="submit" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ChatBot;