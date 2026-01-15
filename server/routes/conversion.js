import express from 'express';
import { convertCurrency, getHistory, getCurrencies, getRates } from '../controllers/conversion-controller.js';

const router = express.Router();

router.post('/convert', convertCurrency);
router.get('/history', getHistory);
router.get('/currencies', getCurrencies);
router.get('/rates/:base', getRates);

export default router;