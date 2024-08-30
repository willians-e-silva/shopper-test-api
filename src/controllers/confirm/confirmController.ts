import { Request, Response } from "express";
import { MeasureUseCase } from "@useCase/measure.usecase";
import { ValidateUseCase } from "@useCase/validateRequest.usecase";

export class ConfirmController {
  constructor() {
  }

/**
   * Validates request body | Checks if measure already exists in database | Checks if measure is already confirmed | Confirm measure .
   * @param {Request} request - The request containing the body with measure details.
   * @param {string} request.body.measure_uuid - The UUID of the measure.
   * @param {number} request.body.measure_value - The reviewd value of the measure.
   * @throws {Error} - Throws an error if the body does not match | Throws an error if already confirme | Throws an error if it does not found | Throws an error if anything goes wrong.
   * @returns {Promise<Response>} - Returns a response object with the appropriate status and message.
   */

  async updateMeasure(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const measureUseCase = new MeasureUseCase();
    const validateBody = new ValidateUseCase();

    const measure = {
      uuid: body.measure_uuid,
      value: body.measure_value
    }

    let isValid = validateBody.validateConfirmRequest(body);
    if (isValid) {
      return response.status(400).json(isValid);
    }
    
    let measureExist = await measureUseCase.checkMeasureExist(measure.uuid);
    if (!measureExist) {
      return response.status(404).json({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura não encontrada"
      });
    }

    let confirmationDuplicate = await measureUseCase.checkMeasurementConfirmation(measure.uuid);
    if (confirmationDuplicate) {
      return response.status(404).json({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada"
      });
    }

    await measureUseCase.saveMeasureConfirmation(measure.uuid, measure.value);
    
    return response.status(200).json({ success: "true" });
  }
}