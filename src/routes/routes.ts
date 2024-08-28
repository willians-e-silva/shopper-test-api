// express
import { Router } from 'express';

// Routes Declarations
import { InvoiceRoutes } from './invoice/invoice.routes';

const router = Router();

router.use('/upload',  InvoiceRoutes);

export { router };