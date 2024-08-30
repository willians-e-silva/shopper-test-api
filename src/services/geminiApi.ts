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

        const prompt = `Is this a ${type} meter? Can you read the main numbers on it? Answer using only one of these options: meter not identified (if it's not a ${type} meter) measure not visible (if it is a water meter but the numbers can't be read) measured_number: {number} (if it is a ${type} meter and you can read the numbers - replace {number} with the reading)`;

        const parts = [
            { text: prompt }, imgPart
        ];

    try {
        const result = await model.generateContent({
        contents: [{ role: "user", parts }]
        });

        return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    } catch (error) {
        throw error;
    }
  }
}