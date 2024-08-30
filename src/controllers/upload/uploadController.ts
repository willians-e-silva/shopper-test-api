import { Request, Response } from "express";
import { container } from "tsyringe";

import { ValidateUseCase } from "@useCase/validateRequest.usecase";
import { GeminiApiService } from "@services/geminiApi";

import { CustomerUseCase } from "@useCase/customer.usecase";
import { MeasureUseCase } from "@useCase/measure.usecase";

import { v4 as uuidv4 } from 'uuid';

export class UploadController {
  constructor() {
  }

  async upload(request: Request, response: Response): Promise<Response> {
    const { body } = request;
    const validateBody = container.resolve(ValidateUseCase);

    const geminiApi = new GeminiApiService();

    const customerUseCase = new CustomerUseCase();
    const measureUseCase = new MeasureUseCase();

    const customerCode = body.customer_code;
    
    let data: any;
    let imageURI: string;
    let measureNumber: number;

    try {
      // VALIDATE REQUEST BODY
      let isValid = validateBody.validateUploadRequest(body);
      if (isValid) {
        return response.status(400).json(isValid);
      }

      // VERIFY IF REPORT ALREADY EXISTS IN THIS MONTH
      let isDoubleReport = await measureUseCase.checkDoubleMeasure(customerCode, body.measure_datetime, body.measure_type);
      if (isDoubleReport) {
        return response.status(409).json({ 
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada" 
        });
      }

      // SEND IMAGE TO GEMINI API
      imageURI = await geminiApi.sendImage(body.image, customerCode, body.date);

      // SEND PROMPT TO GEMINI API
      measureNumber = await geminiApi.sendPrompt(imageURI, body.measure_type);
      let measureUuid = uuidv4();

      let customerId = await customerUseCase.checkCustomerExists(customerCode);

      if (customerId == null) {
        customerId = await customerUseCase.saveCustomer(customerCode);
        await measureUseCase.saveMeasure(customerId, body.measure_datetime, measureUuid, body.measure_type,  measureNumber, imageURI );
      } else {
        await measureUseCase.saveMeasure(customerId, body.measure_datetime, measureUuid, body.measure_type,  measureNumber, imageURI );
      }

      data = {
        image_url: imageURI,
        measure_value: measureNumber,
        measure_uuid: measureUuid
      }

      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: `Um erro inesperado ocorreu: ${(error as Error).message}`
    })
    }
  }
}