import { Router } from "express";
import { createProduct, getAllProducts } from "../controllers/productController.js";


const productRouter = Router();


productRouter.get('/', getAllProducts)
productRouter.post('/', createProduct)

export default productRouter;