# ChatBotSushi

Chatbot que ayuda a los usuarios a pedir sushi de manera rápida y sencilla.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías Usadas](#tecnologías-usadas)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Testing](#testing)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Descripción

ChatBotSushi es una aplicación interactiva diseñada para facilitar la gestión de pedidos de sushi. A través de un chatbot intuitivo, los usuarios pueden explorar el menú, realizar pedidos, obtener respuestas rápidas a preguntas frecuentes y consultar la disponibilidad del restaurante.

### Funcionalidades principales:

- **Menú**: Muestra los productos disponibles.
- **Hacer pedido**: Toma los datos del cliente y registra la orden.
- **Preguntas frecuentes (FAQs)**: Responde preguntas comunes de manera inmediata.
- **Estado del restaurante**: Informa rápidamente si el restaurante está abierto.

---

## Tecnologías Usadas

- **Frontend**: [React.js](https://reactjs.org/), [Vite](https://vitejs.dev/)
- **Backend**: Node.js, Express.js
- **Base de datos**: MongoDB
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) / CSS puro
- **Pruebas**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/)
- **Estado Global**: [Redux Toolkit](https://redux-toolkit.js.org/) (opcional)
- **Herramientas**: ESLint, Prettier

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/BenjaminMehrez/ChatBotSushi.git

    <!-- BackEnd -->
    cd backend
    npm install


    npm run server

    <!-- FrontEnd -->
    cd frontend
    npm install

    npm run dev
