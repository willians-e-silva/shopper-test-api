import { Request, Response } from "express";
import { container } from "tsyringe";
import { sendImage } from "./useCase/sendImage";
import { ValidateRequest } from "./useCase/validateRequest";
import { sendPrompt } from "./useCase/sendPrompt";

export class InvoiceController {
  constructor() {
  }

  async sendImage(request: Request, response: Response): Promise<Response> {
    const { body } = request;
    const sendGeminiImage = container.resolve(sendImage);
    const sendGeminiPrompt = container.resolve(sendPrompt);
    const validateBody = container.resolve(ValidateRequest);

    let imagePath: string;
    let isValid = validateBody.validateRequest(body);

    if (isValid) {
      return response.status(400).json(isValid);
    }

    try{
      imagePath = await sendGeminiImage.sendImage(body.image, body.customer_code, body.date);
    }catch(error){
      return response.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: `Um erro inesperado ocorreu: ${(error as Error).message}`
      });
    }

    try {
      const data = await sendGeminiPrompt.sendPrompt(imagePath, body.measure_type);
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
        error_description: `Um erro inesperado ocorreu: ${(error as Error).message}`
      });
    }
  }
}