import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';

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


// describe('POST /products', () => {
//     test('should respond with a 201 status code and create a new product', async () => {
//         // Datos del producto que vamos a enviar
//         const newProduct = {
//             name: 'Product 1',
//             price: 100,
//             description: 'Test Product',
//         };

//         // Realizar la petición POST
//         const response = await request(app)
//             .post('/products')
//             .send(newProduct);

//         // Verificar la respuesta
//         expect(response.status).toBe(201);
//         expect(response.body.message).toBe('Producto creado exitosamente.');
//         expect(response.body.product).toHaveProperty('_id');
//         expect(response.body.product.name).toBe(newProduct.name);

//         // Verificar que el producto fue guardado en la base de datos
//         const savedProduct = await mongoose.connection.collection('products').findOne({ name: newProduct.name });
//         expect(savedProduct).not.toBeNull();
//         expect(savedProduct.price).toBe(newProduct.price);
//     });


//     test('should respond with a 400 status code and return an error message', async () => {
//         // Datos incompletos 
//         const invalidProduct = {
//             name: '',
//             price: 100,
//         }

//         // Realizar la peticion POST
//         const response = await request(app).post('/products').send(invalidProduct);

//         // Verificar el estado y los datos
//         expect(response.status).toBe(400);
//         expect(response.body.message).toBe('Error al crear el producto.');

//     })
// })