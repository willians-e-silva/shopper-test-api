import { GoogleGenerativeAI }  from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { base64ToImage } from "../../../utils/convert64";
import { removeFile } from "../../../utils/removeFile";
import dotenv from 'dotenv';
import { injectable } from "tsyringe";

dotenv.config();
@injectable()
export class sendImage {

  constructor(
  ) {
  }
  async sendImage(imageBase64: string, customer_code: number, date: string): Promise<any> {
    const displayName = `${customer_code}_${date}`;
    const imagePath = `${displayName}.jpg`;
    const apiKey = process.env.GEMINI_API_KEY || '';
    const fileManager = new GoogleAIFileManager(apiKey);

    base64ToImage(imageBase64, imagePath);
      
    try {
      const uploadResponse = await fileManager.uploadFile(imagePath,   {
        mimeType: "image/jpeg",
        displayName: displayName,
      },
    );
    removeFile(imagePath)
    return uploadResponse.file.uri
    } catch (error) {
        throw error;
    }
  }
}