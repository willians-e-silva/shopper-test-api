/**
 * Checks if the given value is a valid base64.
 * @param {uuid} base64String - string to be checked if it is a valid base64.
 * @returns {boolean} - Returns true if the value is a valid base64, otherwise false.
 */

export function isBase64(str: string): boolean {
    const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
    return base64RegExp.test(str);
}