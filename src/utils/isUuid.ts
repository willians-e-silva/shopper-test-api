import { validate as isUuidValidate } from 'uuid';

/**
 * Checks if the given value is a valid UUID.
 * @param {uuid} uuidString - string to be checked if it is a valid UUID.
 * @returns {boolean} - Returns true if the value is a valid UUID, otherwise false.
 */

export function isUuid(uuidString: string): boolean {
  return isUuidValidate(uuidString);
}