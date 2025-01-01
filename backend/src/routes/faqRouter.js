import { Router } from 'express';
import { getFAQs } from '../controllers/faqController.js';


const faqRouter = Router();

faqRouter.post('/', getFAQs);


export default faqRouter;