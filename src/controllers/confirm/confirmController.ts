import { Request, Response } from "express";
import { UploadUseCase } from "@useCase/customer.usecase";

export class ConfirmController {
  constructor() {
  }
  async updateMeasure(request: Request, response: Response): Promise<Response> {
    const { body } = request;
    // const confirmUseCase = container.resolve(ConfirmUseCase);
    return response.status(200).json({ success: "true" });
  }
}