import { isUuid } from '../../utils/isUuid';

export class ConfirmUseCase {

  async updateMesasure(): Promise<any> {
    try {
        return "measure updated";

    } catch (error) {
        throw error;
    }
  }

  validateRequest(body: any): { error_code: string, error_description: string } | null {
    const createError = (description: string) => ({
      error_code: "DOUBLE_REPORT",
      error_description: description
    });

    if (isUuid(body.measure_uuid) === false) {
      return createError(`Parametro inválido, 'customer_code' deve ser Uuid, recebido: ${typeof(body.customer_code)}`);
    }

    if (typeof(body.confirmed_value) !== 'number') {
      return createError(`Parametro inválido, 'customer_code' deve ser interger, recebido: ${typeof(body.confirmed_value)}`);
    }


    return null;
  }

}