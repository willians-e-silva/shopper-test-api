import { Request, Response } from "express";
import { container } from "tsyringe";
import { ConfirmUseCase } from "./confirmUseCase";

export class ConfirmController {
  constructor() {
    // this.sendImage = this.sendImage.bind(this);
  }

  async updateMeasure(request: Request, response: Response): Promise<Response> {
    const { body } = request;
    const confirmUseCase = container.resolve(ConfirmUseCase);
    const validationError = confirmUseCase.validateRequest(body);

    if (validationError) {
      return response.status(400).json(validationError);
    }

    try {
      // const data = await confirmUseCase.sendGeminiImage();
      let data = "teste"
      if (data === "DOUBLE_REPORT") {
        return response.status(409).json({ 
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada" 
        });
      }
      
      return response.status(200).json(data);

    } catch (error) {
      return response.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "Um erro inesperado ocorreu"
      });
    }
  }
}