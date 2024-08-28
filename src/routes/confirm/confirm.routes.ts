import { Router } from "express";
import { ConfirmController } from "../../controllers/confirm/confirmController";

const ConfirmRoutes = Router();

const confirmController = new ConfirmController();

ConfirmRoutes.patch("/", confirmController.updateMeasure);

export {ConfirmRoutes};