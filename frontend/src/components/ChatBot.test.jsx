import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatBot from './ChatBot.jsx';

describe('ChatBot Component', () => {
    beforeAll(() => {
        // Mock del objeto `import.meta.env` si es necesario
        import.meta.env = { VITE_API: 'http://mock-api.com' };
    });

    test('renders the ChatBot header', () => {
        render(<ChatBot />);
        expect(screen.getByText(/ChatBot Sushi/i)).toBeDefined();
    });
    
    test('displays the initial message from the bot', () => {
        render(<ChatBot />);
        expect(screen.getByText('¡Hola! 👋 ¿En qué puedo ayudarte hoy? Selecciona una opción abajo para comenzar.')).toBeDefined();
    });

    test('shows action buttons', () => {
        render(<ChatBot />);
        const menuButton = screen.getByText(/Menu/i);
        const orderButton = screen.getByText(/Hacer Pedido/i);
        const questionsButton = screen.getByText(/Preguntas/i);
        const openButton = screen.getByText(/¿Están abiertos?/i);

        expect(menuButton).toBeDefined();
        expect(orderButton).toBeDefined();
        expect(questionsButton).toBeDefined();
        expect(openButton).toBeDefined();
    });

    test('handles "¿Están abiertos?" action', async () => {
        render(<ChatBot />);
        const openButton = screen.getByText(/¿Están abiertos?/i);

        fireEvent.click(openButton);

        // Espera a que aparezca el mensaje del bot
        await waitFor(() => {
            const responseMessage = screen.getByText(/Sí, estamos abiertos.|Lo siento, estamos cerrados./i);
            expect(responseMessage).toBeDefined();
        });
    });

    test('should show the menu when button is clicked', async () => {
        render(<ChatBot />);
        const button  = screen.getByText(/Menu/i)

        // Click the button
        fireEvent.click(button)
        
        // Espera a que aparezca el mensaje del bot
        await waitFor(() => {
            const responseMessage = screen.getByText(/Nigiri de atún|Sashimi mixto /i);
            expect(responseMessage).toBeDefined();
        });
    })

    test('handles FAQ actions', async () => {
        render(<ChatBot />);
        
        // Paso 1: Haz clic en el botón "Preguntas"
        const preguntasButton = screen.getByText(/Preguntas/i);
        fireEvent.click(preguntasButton);
    
        // Espera a que aparezca el mensaje del bot sobre las preguntas frecuentes
        await waitFor(() => {
            expect(screen.getByText(/Aquí están algunas preguntas frecuentes/i)).toBeDefined();
        });
    
        // Paso 2: Haz clic en la pregunta "¿Cuánto tarda en llegar mi pedido?"
        const faq1 = await screen.findByText(/¿Cuánto tarda en llegar mi pedido?/i);
        const faq2 = await screen.findByText(/¿Cuál es el costo de envío?/i);
        const faq3 = await screen.findByText(/¿Aceptan diferentes métodos de pago?/i);
        const faq4 = await screen.findByText(/¿Cuáles son sus platos más populares?/i);

        expect(faq1).toBeDefined();
        expect(faq2).toBeDefined();
        expect(faq3).toBeDefined();
        expect(faq4).toBeDefined();

        fireEvent.click(faq2);
        await waitFor(() => {
            expect(screen.getByText(/Lo siento, no puedo responder en este momento|El costo de envío/i)).toBeDefined();
        });

    });
    
    
});
