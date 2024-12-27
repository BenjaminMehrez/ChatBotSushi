import { Router } from 'express';
import { createOrder } from '../controllers/orderController.js';


const orderRouter = Router();

orderRouter.post('/', createOrder);

export default orderRouter;