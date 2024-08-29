import { isBase64 } from '../../../utils/isBase64';
import { injectable } from "tsyringe";

@injectable()
export class ValidateRequest {
  validateRequest(body: any): { error_code: string, error_description: string } | null {
    console.log(body);
    const createError = (description: string) => ({
      error_code: "DOUBLE_REPORT",
      error_description: description
    });

    if (!isBase64(body.image)) {
      return createError(`Parametro inválido, 'image' deve ser base64, recebido: ${typeof(body.image)}`);
    }
    
    if (typeof(body.customer_code) !== 'string') {
      return createError(`Parametro inválido, 'customer_code' deve ser string, recebido: ${typeof(body.customer_code)}`);
    }

    const measureDatetime = new Date(body.measure_datetime);
    if (isNaN(measureDatetime.getTime())) {
      return createError(`Parametro inválido, 'measure_datetime' deve ser datetime, recebido: ${typeof(body.measure_datetime)}`);
    }

    if (typeof(body.measure_type) !== 'string' || (body.measure_type !== "WATER" && body.measure_type !== "GAS")) {
      return createError(`Parametro inválido, 'measure_type' deve ser string ['WATER' ou 'GAS'] , recebido: ${typeof(body.customer_code)} ['${body.measure_type}']`);
    }
    
    return null;
  }

}