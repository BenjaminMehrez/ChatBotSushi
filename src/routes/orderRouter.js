import { Router } from 'express';
import { createOrder, getAllOrders } from '../controllers/orderController.js';


const orderRouter = Router();

orderRouter.get('/', getAllOrders);
orderRouter.post('/', createOrder);

export default orderRouter;