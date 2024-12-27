import { Router } from "express";
import { getAllProducts } from "../controllers/productController.js";


const productRouter = Router();


productRouter.get('/', getAllProducts)

export default productRouter;