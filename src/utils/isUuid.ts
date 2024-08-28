import { validate as isUuidValidate } from 'uuid';

export function isUuid(value: any): boolean {
  return isUuidValidate(value);
}