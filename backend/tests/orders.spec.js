import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';

let mongoServer;

beforeAll(async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
});

beforeEach(async () => {
    await mongoose.connection.collection('products').deleteMany({});
    await mongoose.connection.collection('products').insertMany([
        { food: 1, price: 3.5 }, // Producto requerido para la prueba
    ]);
    await mongoose.connection.collection('orders').deleteMany({});
});


afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('GET /orders', () => {
    test('should respond with a 200 status code and return a list of orders', async () => {
        // Insertar un producto en la colección
        const order = { client: 'Client 1', items: [{ food: 1, quantity: 1 }], address: 'Address 1', total: 100 };
        await mongoose.connection.collection('orders').insertOne(order);

        
        // Realizar la petición GET
        const response = await request(app).get('/orders').send();

        // Verificar el estado y los datos
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});


describe('POST /orders', () => {
    test('should respond with a 201 status code and create a new order', async () => {
        // Datos del producto que vamos a enviar
        const newOrder = {
            client: 'Client Test',
            items: [{ food: 1, quantity: 3 }],
            address: 'Address 1',
            total: 10.5,
        };

        // Realizar la petición POST
        const response = await request(app)
            .post('/orders')
            .send(newOrder);

        // Verificar la respuesta
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Pedido creado exitosamente.');
        expect(response.body.order).toHaveProperty('_id');
        expect(response.body.order.client).toBe(newOrder.client);

        // Verificar que el producto fue guardado en la base de datos
        const savedOrder = await mongoose.connection.collection('orders').findOne({ client: newOrder.client });
        expect(savedOrder).not.toBeNull();
        expect(savedOrder.total).toBe(newOrder.total);
    })

    test('should respond with a 400 status code and return an error message', async () => {
        // Datos incompletos 
        const invalidOrder = {
            client: '',
            items: [{ food: 1, quantity: 1 }],
            address: 'Address 1',
            total: 100,
        };

        // Realizar la peticion POST
        const response = await request(app).post('/orders').send(invalidOrder);

        // Verificar el estado y los datos
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Datos inválidos. El cliente o los productos no fueron proporcionados.');
    })

})