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

  /**
   * Checks body | Uploads a image to vision | Checks if customer or measure already exists in the database and save it.
   * @param {Request} request - The request containing the body with measure details.
   * @param {string} request.body.customer_code - The customer code of th measure.
   * @param {number} request.body.image - The image to be measured in base64.
   * @param {string} request.body.measure_datetime - The datetime of the measure.
   * @param {number} request.body.measure_type - The type of the measurement, GAS or WATER.
   * @returns {Promise<Response>} - Returns a response with the result of the prompt with the image linked.
   * @throws {Error} - Throws an error if the body does not match | Throws an error if already measured | Throws an error if anything goes wrong.
   */
  
  async upload(request: Request, response: Response): Promise<Response> {
    const { body } = request;
    const validateBody = container.resolve(ValidateUseCase);

    const geminiApi = new GeminiApiService();

    const customerUseCase = new CustomerUseCase();
    const measureUseCase = new MeasureUseCase();

    const measure = {
      customer: body.customer_code,
      image64: body.image,
      datetime: body.measure_datetime,
      type: body.measure_type
    }
    
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
      let isDoubleReport = await measureUseCase.checkDoubleMeasure(measure.customer, measure.datetime, measure.type);
      if (isDoubleReport) {
        return response.status(409).json({ 
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada" 
        });
      }

      // SEND IMAGE TO GEMINI API
      imageURI = await geminiApi.sendImage(measure.image64, measure.customer, measure.datetime);

      // SEND PROMPT TO GEMINI API
      measureNumber = await geminiApi.sendPrompt(imageURI, measure.type);
      let measureUuid = uuidv4();

      let customerId = await customerUseCase.checkCustomerExists(measure.customer);

      if (customerId == null) {
        customerId = await customerUseCase.saveCustomer(measure.customer);
        await measureUseCase.saveMeasure(customerId, measure.datetime, measureUuid, measure.type,  measureNumber, imageURI );
      } else {
        await measureUseCase.saveMeasure(customerId, measure.datetime, measureUuid, measure.type,  measureNumber, imageURI );
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