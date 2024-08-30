import { Request, Response } from "express";
import { container } from "tsyringe";
import { ValidateUseCase } from "@useCase/validateRequest.usecase";
import { GeminiApiService } from "../../services/geminiApi";
import { UploadUseCase } from "@useCase/upload.usecase";
export class InvoiceController {
  constructor() {
  }

  async upload(request: Request, response: Response): Promise<Response> {
    const { body } = request;
    const validateBody = container.resolve(ValidateUseCase);

    const geminiApi = new GeminiApiService();
    const uploadUseCase = new UploadUseCase();
    
    let imagePath: string;

    // VALIDATE REQUEST BODY
    let isValid = validateBody.validateUploadRequest(body);
    if (isValid) {
      return response.status(400).json(isValid);
    }

    // VERIFY IF REPORT ALREADY EXISTS IN THIS MONTH
    let isDoubleReport = await uploadUseCase.checkDoubleReport(body.customer_code, body.measure_datetime, body.measure_type);
    if (isDoubleReport) {
      return response.status(409).json({ 
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada" 
      });
    }

    // SEND IMAGE TO GEMINI API
    try{
      imagePath = await geminiApi.sendImage(body.image, body.customer_code, body.date);
    }catch(error){
      return response.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: `Um erro inesperado ocorreu: ${(error as Error).message}`
      });
    }

    // SEND PROMPT TO GEMINI API
    try {
      const measure = await geminiApi.sendPrompt(imagePath, body.measure_type);

      const data = {
        image_url: imagePath,
        measure_value: measure,
        measure_uuid: "550e8400-e29b-41d4-a716-446655440000"
      }
      return response.status(200).json(data);

    } catch (error) {
      
      // CATCH ANY UNEXPECTED ERROR
      return response.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: `Um erro inesperado ocorreu: ${(error as Error).message}`
      });
    }
  }
}