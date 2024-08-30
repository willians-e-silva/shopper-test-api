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

    // SEND IMAGE TO GEMINI API
    async sendImage(imageBase64: string, customerCode: string, date: string): Promise<any> {
        const displayName = `${customerCode}_${date}`;
        const imagePath = `${displayName}.jpg`;
        const fileManager = new GoogleAIFileManager(this.apiKey);

        base64ToImage(imageBase64, imagePath);

        try {
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

    // SEND PROMPT TO GEMINI API
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