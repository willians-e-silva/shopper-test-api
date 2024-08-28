import {Router} from "express";
import { InvoiceController } from "../../controllers/invoice/invoiceController";

const InvoiceRoutes = Router();
const invoiceController = new InvoiceController();

InvoiceRoutes.post("/", invoiceController.sendImage);

export {InvoiceRoutes};