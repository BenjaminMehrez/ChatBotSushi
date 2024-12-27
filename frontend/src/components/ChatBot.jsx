import React, { useState, useEffect } from "react";


const ChatBot = () => {
    const [messages, setMessages] = useState([]); // Guardar mensajes del cliente y chatbot


    // Lista de preguntas predefinidas
    const faqs = [
        '¿Están abiertos?',
        '¿Cómo hago un pedido?',
        '¿Cuánto tarda en llegar mi pedido?',
        '¿Puedo cancelar mi pedido?',
        '¿Cuál es el costo de envío?',
    ];


    // Manejar el envio del mensaje
    const handleQuestionClick = async (question) => {

        // Agregar el mensaje del cliente
        const newMessage = [...messages, { sender: 'client', text: question }];
        setMessages(newMessage);

        try {
            // Enviar la pregunta al chatbot
            const response = await fetch('http://localhost:3000/faq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question }),
            })

            const data = await response.json();
            
            // Comprobar si la respuesta es exitosa
            if (response.ok) {
                setMessages([...newMessage, { sender: 'bot', text: data.answer || 'Lo siento, no encontré una respuesta.' }]);
            } else {
                setMessages([...newMessage, { sender: 'bot', text: 'Hubo un problema con la respuesta.' }]);
            }

        } catch (error) {
            console.error('Error al obtener respuesta del chatbot', error);
            setMessages([...newMessage, { sender: 'bot', text: 'Lo siento, no puedo responder en este momento' }]);

        }

        setInput(''); // Limpiar el input

        

    }

    return (
        <div className="overflow-auto max-w-lg h-3/4  mx-auto drop-shadow-xl bg-white rounded-md">
            <h1 className="font-bold underline text-2xl text-center bg-slate-200 p-5">ChatBot Sushi</h1>
            <span><Date className="year"></Date></span>
            <div className="space-y-5 p-5">
                {messages.map((msg, index) => (
                    <div key={index} className={`my-2 ${msg.sender === 'client' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block px-4 py-2 rounded ${msg.sender === 'client' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>

            <div>
                {/* Mostrar las preguntas predefinidas como botones */}
                {faqs.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {question}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ChatBot;