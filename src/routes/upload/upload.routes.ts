import {Router} from "express";
import { InvoiceController } from "../../controllers/invoice/invoiceController";

const UploadRoutes = Router();

const invoiceController = new InvoiceController();

UploadRoutes.post("/", invoiceController.sendImage);

export {UploadRoutes};