import express from 'express';
import { convertCurrency, getCurrencies, getRates } from '../controllers/conversion-controller.js';

const router = express.Router();

router.post('/convert', convertCurrency);
router.get('/currencies', getCurrencies);
router.get('/rates/:base', getRates);

export default router;