import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routers
import orderRouter from './routes/orderRouter.js';
import productRouter from './routes/productRouter.js';
import faqRouter from './routes/faqRouter.js';

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.use('/faq', faqRouter);

// Ruta estática para el frontend
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

export default app;