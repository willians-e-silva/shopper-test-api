import { Request, Response } from "express";
import { container } from "tsyringe";
import { InvoiceUseCase } from "./invoiceUseCase";

export class InvoiceController {
  constructor() {
    this.sendImage = this.sendImage.bind(this);
  }

  async sendImage(request: Request, response: Response): Promise<Response> {
    const { body } = request;
    const invoiceUseCase = container.resolve(InvoiceUseCase);
    const validationError = invoiceUseCase.validateRequest(body);

    if (validationError) {
      return response.status(400).json(validationError);
    }

    try {
      const data = await invoiceUseCase.sendGeminiImage();
      
      if (data === "DOUBLE_REPORTS") {
        return response.status(409).json({ 
          error_code: "DOUBLE_REPORTS",
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