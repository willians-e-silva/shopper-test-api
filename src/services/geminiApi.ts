import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { base64ToImage } from "@utils/convert64";
import { removeFile } from "@utils/removeFile";
import dotenv from 'dotenv';
import { injectable } from "tsyringe";

dotenv.config();

export class GeminiApiService {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
    }

    /**
     * Convert a base64 to file, then sends an image to the Gemini API, then destroys the file.
     * @param imageBase64 - The base64 string representing the image.
     * @param customerCode - The customer code of the measure.
     * @param date - The date of the measurement.
     */

    async sendImage(imageBase64: string, customerCode: string, date: string): Promise<any> {
        const displayName = `${customerCode}_${date}`;
        const imagePath = `${displayName}.jpg`;
        const fileManager = new GoogleAIFileManager(this.apiKey);

        try {
            base64ToImage(imageBase64, imagePath);
            const uploadResponse = await fileManager.uploadFile(imagePath, {
                mimeType: "image/jpeg",
                displayName: displayName,
            });
            removeFile(imagePath);
            return uploadResponse.file.uri;
        } catch (error) {
            
            removeFile(imagePath);
            throw error;
        }
    }

    /**
     * Send a prompt to the Gemini API with a image linked, then returns the main number of the measurement.
     * @param imagePath - The image Uri returned from the sendImage method.
     * @param type - The type of the measurement, GAS or WATER.
     */

    async sendPrompt(imagePath: string, type: string): Promise<any> {
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const mimeType = 'image/png';
        const imgPart = {
            fileData: {
                fileUri: imagePath,
                mimeType
            }
        };

        const prompt = `return the main number only, in this ${type} meter?, return in a plain text, withou markdown or decoration`;

        const parts = [
            { text: prompt }, imgPart
        ];

    try {
        const result = await model.generateContent({
        contents: [{ role: "user", parts }]
        });
        const measure = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        let measureFiltered = measure?.match(/\d+/g)?.join('') || '';

        return Number(measureFiltered);

    } catch (error) {
        throw error;
    }
  }
}