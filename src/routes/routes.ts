// express
import { Router } from 'express';

// Routes Declarations
import { UploadRoutes } from './upload/upload.routes';
import { ConfirmRoutes } from './confirm/confirm.routes';
import { ListRoutes } from './list/list.routes';

const router = Router();

router.use('/upload',  UploadRoutes);
router.use('/confirm',  ConfirmRoutes);
router.use('/:customer/list',  ListRoutes);

export { router };