import fs from 'fs';

/**
 * Converts a base64 string to an image file and saves in the filePath.
 * @param base64String - The base64 string representing the image.
 * @param filePath - The path where the image file will be saved.
 */

export function base64ToImage(base64String: string, filePath: string): void {
  if (typeof base64String !== 'string') {
    throw new Error('Invalid input: base64String must be a string');
  }

  // Remove the base64 header if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const binaryData = Buffer.from(base64Data, 'base64');

  fs.writeFileSync(filePath, binaryData, 'binary');
}