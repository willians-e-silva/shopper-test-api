import { GoogleGenerativeAI }  from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { base64ToImage } from "../../utils/convert64";
import { removeFile } from "../../utils/removeFile";
import dotenv from 'dotenv';

dotenv.config();
export class sendImage {

  constructor(
    private genAI: GoogleGenerativeAI,
    private model: any,
    private fileManager: GoogleAIFileManager
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY || "");
  }

  async sendImage(imageBase64: string, customer_code: number, date: string): Promise<any> {
    
    const displayName = `${customer_code}_${date}`;
    const imagePath = `${displayName}.jpg`;
    base64ToImage(imageBase64, imagePath);
    
    try {
      const uploadResponse = await this.fileManager.uploadFile("image.jpg",   {
        mimeType: "image/jpeg",
        displayName: displayName,
      },
    );
    removeFile(imagePath)
      return uploadResponse
    } catch (error) {
        throw error;
    }
  }
}