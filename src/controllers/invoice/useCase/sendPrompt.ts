import { GoogleGenerativeAI }  from "@google/generative-ai";
import { injectable } from "tsyringe";
import dotenv from 'dotenv';
dotenv.config();
@injectable()
export class sendPrompt {

  constructor() {

  }

  async sendPrompt(imagePath: string, type: string): Promise<any> {
    const apiKey = process.env.GEMINI_API_KEY || ''

    let genAI = new GoogleGenerativeAI(apiKey);
    let model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    
    let mimeType = 'image/png';

    let imgPart = {
      fileData: {
        fileUri:imagePath,
        mimeType
      }
    }

    let promt = `Is this a ${type} meter? Can you read the main numbers on it? Answer using only one of these options: meter not identified (if it's not a ${type} meter)measure not visible (if it is a water meter but the numbers can't be read) measured_number: {number}  (if it is a ${type} meter and you can read the numbers - replace {number} with the reading)`

    const parts = [
      {text: promt}, imgPart
    ];

    try {
      const result = await model.generateContent({
        contents: [{role: "user", parts}]
      })
      ;
      return result
    } catch (error) {
        throw error;
    }
  }

}