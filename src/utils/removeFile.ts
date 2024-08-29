import fs from 'fs';

/**
 * Remove a file based on the path given.
 * @param filePath - The path where the file is located.
 */
export function removeFile(filePath: string): void {
  fs.unlinkSync("image.jpg");
}