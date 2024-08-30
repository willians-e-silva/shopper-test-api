import { Request, Response } from "express";
import { ValidateUseCase } from "@useCase/validateRequest.usecase";

import { CustomerUseCase } from "@useCase/customer.usecase";
import { MeasureUseCase } from "@useCase/measure.usecase";

export class ListController {
  constructor() {
  }


  /**
   * Handles the listing of measures for a customer.
   * @param {Request} request - The request containing the query details.
   * @param {string} request.params.customer - The customer_code.
   * @param {string} request.query.measure_type - The type of measure to filter by.
   * @returns {Promise<Response>} - Returns a response object with the customer and measures or an error.
   * @throws {Error} - If an error occurs during the process.
   */
  async list(request: Request, response: Response): Promise<Response> {
    const customer = request.params.customer;
    const type = request.query.measure_type;

    const validateRequest = new ValidateUseCase();
    const customerUseCase = new CustomerUseCase();
    const measureUseCase = new MeasureUseCase();

    if(type != undefined) {
      let isValid = validateRequest.validateListRequest(type.toString());
      if (isValid) {
        return response.status(400).json(isValid);
      }
    }

    let customerId = await customerUseCase.checkCustomerExists(customer);
    if (customerId == null) {
      return response.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada"
      });
    }

    let measures = await measureUseCase.getAllMeasuresByCustomer(customerId, type?.toString());
    if (measures.length == 0) {
      return response.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada"
      });
    }
    return response.status(200).json({ message: customer, measures: measures });
  }
}