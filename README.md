# Sushi Restaurant Chatbot

Este proyecto implementa un chatbot interactivo para un restaurante de sushi, que permite a los usuarios navegar por el menú, realizar pedidos, resolver preguntas frecuentes y consultar los horarios de atención.

---

## **Cómo instalar y correr el proyecto**

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/BenjaminMehrez/ChatBotSushi.git
   cd backend
   cd frontend
   ```
   Nota: Los comandos `cd backend` y `cd frontend` deben ejecutarse en terminales separadas si deseas iniciar ambos servicios simultáneamente.

2. **Instalar dependencias**:
   Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   # Para backend
   MONGO_URI=mongodb://localhost:27017/sushi-chatbot
   PORT=3000

   # Para frontend
   VITE_API=http://localhost:3000
   ```
   Nota: En `VITE_API`, proporciona la URL base del backend.


4. **Iniciar el servidor**:
   Desde el directorio `backend`:
   ```bash
   npm run server
   ```

4. **Iniciar el frontend**:
   Desde el directorio `frontend`:
   ```bash
   npm run dev
   ```

---

## **Ejemplos de mensajes que entiende el bot**

- **Explorar el menú**:
  - "Menu"

- **Realizar un pedido**:
  - "Hacer Pedido"

- **Preguntas frecuentes**:
  - "¿Cuánto tarda en llegar mi pedido?"
  - "¿Cuál es el costo de envío?"
  - "¿Aceptan diferentes métodos de pago?"
  - "¿Cuáles son sus platos más populares?"

---

## **Endpoints disponibles**

### **GET /products**
Obtiene el menú completo del restaurante.
- **Respuesta**:
  ```json
  [
    {
        "_id": "6771ad4be521be70854ce273",
        "name": "Nigiri de atún",
        "price": 3.5,
        "description": "Rodaja de atún fresco sobre arroz avinagrado.",
        "createdAt": "2024-12-29T20:12:59.497Z",
        "updatedAt": "2024-12-29T20:12:59.497Z",
        "food": 1,
        "__v": 0
    }...
  ]
  ```

### **POST /products**
Agrega un nuevo producto al menu.
- **Cuerpo de la solicitud**:
  ```json
  [
    {
        "name": "Salmon 2.0",
        "price": 5,
        "description": "Rodaja de atún fresco con salmon 2.0",
    }
  ]
  ```
- **Respuesta**:
  ```json
  {
    "message": "Producto creado exitosamente.",
    "product": {
        "name": "Salmon 2.0",
        "price": 5,
        "description": "Rodaja de atún fresco con salmon 2.0",
        "_id": "**",
        "createdAt": "**",
        "updatedAt": "**",
        "food": *,
        "__v": 0
    }
  }
  ```


### **GET /orders**
Obtiene las ordenes completas del restaurante.
- **Respuesta**:
  ```json
  [
    {
        "_id": "6771ad4be521be70854ce273",
        "name": "Nigiri de atún",
        "price": 3.5,
        "description": "Rodaja de atún fresco sobre arroz avinagrado.",
        "createdAt": "2024-12-29T20:12:59.497Z",
        "updatedAt": "2024-12-29T20:12:59.497Z",
        "food": 1,
        "__v": 0
    }...
  ]
  ```


### **POST /orders**
Crea un nuevo pedido.
- **Cuerpo de la solicitud**:
  ```json
  {
    "client": "Juancito",
    "items": [
      {
        "food": 2,
        "quantity": 3
      }
    ],
    "address": "Uruguay 231",
    "total": 12
  }
  ```
- **Respuesta**:
  ```json
  {
    "message": "Pedido creado exitosamente.",
    "order": {
        "client": "Juancito",
        "items": [
        {
            "food": 2,
            "quantity": 3,
            "_id": "**"
        }
        ],
        "address": "Uruguay 231",
        "total": 12,
        "_id": "**",
        "createdAt": "**",
        "updatedAt": "**",
        "__v": 0
    }
  }
  ```

### **GET /faq**
Obtiene las preguntas frecuentes.

- **Cuerpo de la solicitud** (opcional):
  ```json
  {
    "question": "¿Cuánto tarda en llegar mi pedido?"
  }
  ```

- **Respuesta**:
  ```json
  {
    "answer": "El tiempo promedio de entrega es de 30 a 45 minutos."
  }
  ```

---

## **Base de Datos**

### **Datos de ejemplo para MongoDB**

#### Colección: `products`
```json
[
  {
    "_id": "6771ad4be521be70854ce273",
    "name": "Nigiri de atún",
    "price": 3.5,
    "description": "Rodaja de atún fresco sobre arroz avinagrado.",
    "createdAt": "2024-12-29T20:12:59.497Z",
    "updatedAt": "2024-12-29T20:12:59.497Z",
    "food": 1,
    "__v": 0
  },
  {
    "_id": "6771ad5fe521be70854ce276",
    "name": "Maki California",
    "price": 4,
    "description": "Rulo de arroz con aguacate, pepino y cangrejo, envuelto en alga nori.",
    "createdAt": "2024-12-29T20:13:19.120Z",
    "updatedAt": "2024-12-29T20:13:19.120Z",
    "food": 2,
    "__v": 0
  }...
]
```

#### Colección: `orders`
```json
[
  {
    "_id": "677e8cc0fe6d9549fce41808",
    "client": "Benjamin",
    "items": [
      {
        "food": 2,
        "quantity": 3,
        "_id": "677e8cc0fe6d9549fce41809"
      }
    ],
    "address": "Barrion cano",
    "total": 12,
    "createdAt": "2025-01-08T14:33:36.276Z",
    "updatedAt": "2025-01-08T14:33:36.276Z",
    "__v": 0
  },
  {
    "_id": "677e8f79718fac73cf48c80c",
    "client": "Benjamin",
    "items": [
      {
        "food": 2,
        "quantity": 3,
        "_id": "677e8f79718fac73cf48c80d"
      }
    ],
    "address": "Barrion cano",
    "total": 12,
    "createdAt": "2025-01-08T14:45:13.212Z",
    "updatedAt": "2025-01-08T14:45:13.212Z",
    "__v": 0
  }...
]
```

### **Cómo cargar los datos iniciales**

1. Asegúrate de que MongoDB esté corriendo en tu máquina local.
2. Desde el directorio `backend`, ejecuta el siguiente comando:
   ```bash
   npm run server
   ```

---

## **Bonus Points**

### **Cómo ejecutar los tests**

1. Ejecuta los tests con:
   ```bash
   cd frontend
   npm test
   cd backend
   npm test
   ```
2. Verifica el resumen de pruebas y errores en la consola.

### **Errores manejados**

- **Errores del usuario**:
  - El plato ingresado no es válido. Por favor, ingrese un plato válido.
  - Por favor, ingresa una cantidad menor a 10.
  - Por favor, ingresa una cantidad válida.

- **Errores del sistema**:
  - No se pudo cargar el menú en este momento.
  - Lo siento, no entendí tu solicitud.
  - Lo siento, no encontré una respuesta.
  - Hubo un problema con la respuesta.
  - Lo siento, no puedo responder en este momento.
  - Error al procesar el pedido. Inténtalo más tarde.
  - Algo salió mal. Por favor, intenta nuevamente.
  - Hubo un error inesperado. Inténtalo nuevamente.

---

¡Gracias por usar el Sushi Restaurant Chatbot! Si tienes preguntas, contacta a [mehrezbenjamin@gmail.com](mailto:mehrezbenjamin@gmail.com).
