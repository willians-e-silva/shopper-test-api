import { Router } from "express";
import { UploadController } from "@controllers/upload/uploadController";

const UploadRoutes = Router();

const uploadController = new UploadController();

UploadRoutes.post("/", uploadController.upload);

export { UploadRoutes };