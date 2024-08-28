// express
import { Router } from 'express';

// Routes Declarations
import { UploadRoutes } from './upload/upload.routes';
import { ConfirmRoutes } from './confirm/confirm.routes';

const router = Router();

router.use('/upload',  UploadRoutes);
router.use('/confirm',  ConfirmRoutes);

export { router };