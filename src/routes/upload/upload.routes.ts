import {Router} from "express";
import { InvoiceController } from "@controllers/upload/uploadController";

const UploadRoutes = Router();

const invoiceController = new InvoiceController();

UploadRoutes.post("/", invoiceController.upload);

export {UploadRoutes};