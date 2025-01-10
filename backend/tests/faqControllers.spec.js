import { MongoMemoryServer } from 'mongodb-memory-server';
import jest from 'jest-mock'; // Solo para funciones de mock o espías
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import productModel from '../src/models/productModel.js'; // Asegúrate de tener la ruta correcta

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    // Limpia e inserta datos en la colección de productos
    await mongoose.connection.collection('products').deleteMany({});
    await mongoose.connection.collection('products').insertMany([
        { food: 1, name: 'Uramaki dragón', price: 1500 },
        { food: 2, name: 'Sashimi mixto', price: 2000 },
    ]);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('POST /faqs', () => {
    test('should respond with a 200 status code and return a list of products', async () => {
        const response = await request(app).post('/faq').send({ question: 'menu' });

        expect(response.status).toBe(200);

        // Eliminar el campo _id antes de comparar
        const sanitizedResponse = response.body.answer.map(({ _id, ...rest }) => rest);

        expect(sanitizedResponse).toEqual([
            { food: 1, name: 'Uramaki dragón', price: 1500 },
            { food: 2, name: 'Sashimi mixto', price: 2000 },
        ]);
    });

    test('should respond with a 200 status code and return an answer', async () => {
        const response = await request(app).post('/faq').send({ question: '¿Cuánto tarda en llegar mi pedido?' });

        expect(response.status).toBe(200);
        expect(response.body.answer).toBe('El tiempo promedio de entrega es de 30 a 45 minutos.');
    });

    test('should respond with a 404 status code and return an error message', async () => {
        const response = await request(app).post('/faq').send({ question: '¿Cuáles son sus horarios?' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No encontré una respuesta a tu pregunta.');
    });

    test('should respond with a 400 status code and return an error message', async () => {
        const response = await request(app).post('/faq').send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Debes enviar una pregunta.');
    });

    test('should respond with a 500 status code and return an error message', async () => {
        // Simula un error en el modelo
        jest.spyOn(productModel, 'find').mockRejectedValue(new Error('Error simulado'));

        const response = await request(app).post('/faq').send({ question: 'menu' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error al obtener las preguntas frecuentes.');

        productModel.find.mockRestore();
    });
});
