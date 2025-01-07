import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';

let mongoServer;

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://benjaminjofre:sushimehrez@clustersushi.cire9.mongodb.net/Sushi', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});


afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// describe('GET /products', () => {
//     test('should respond with a 200 status code and return a list of products', async () => {
//         // Insertar un producto en la colección
//         const product = { name: 'Product 1', price: 100, description: 'Test Product' };
//         await mongoose.connection.collection('products').insertOne(product);

        
//         // Realizar la petición GET
//         const response = await request(app).get('/products').send();

//         // Verificar el estado y los datos
//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//         expect(response.body.length).toBe(1);
//         expect(response.body[0].name).toBe('Product 1');
//     });
// });


describe('POST /products', () => {
    test('should respond with a 201 status code and create a new product', async () => {
        // Datos del producto que vamos a enviar
        const newProduct = {
            name: 'Product 1',
            price: 100,
            description: 'Test Product',
        };

        // Realizar la petición POST
        const response = await request(app)
            .post('/products')
            .send(newProduct);

        // Verificar la respuesta
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Producto creado exitosamente.');
        expect(response.body.product).toHaveProperty('_id');
        expect(response.body.product.name).toBe(newProduct.name);

        // Verificar que el producto fue guardado en la base de datos
        const savedProduct = await mongoose.connection.collection('products').findOne({ name: newProduct.name });
        expect(savedProduct).not.toBeNull();
        expect(savedProduct.price).toBe(newProduct.price);
    });


    test('should respond with a 400 status code and return an error message', async () => {
        // Datos incompletos 
        const invalidProduct = {
            name: '',
            price: 100,
        }

        // Realizar la peticion POST
        const response = await request(app).post('/products').send(invalidProduct);

        // Verificar el estado y los datos
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Error al crear el producto.');

    })
})